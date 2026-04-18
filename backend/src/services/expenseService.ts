import { AppError } from "../errors/AppError";
import { CreateExpenseInput, ExpenseFilters, SubmitExpenseInput } from "../models/expenseNote";
import { createApprovalStep, listApprovalsByExpenseId } from "../repositories/approvalRepository";
import { findBudgetByProjectId } from "../repositories/budgetRepository";
import { createExpense, findExpenseById, listExpenses, updateExpense } from "../repositories/expenseRepository";
import { findProjectById } from "../repositories/projectRepository";
import { ensureNumber, ensureOptionalString, ensureRequiredString } from "../validators/requestValidators";
import { evaluateExpenseIntelligence } from "./intelligenceService";

function parseExpenseFilters(payload: unknown): ExpenseFilters {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }

  const query = payload as Record<string, unknown>;
  const projectId = typeof query.projectId === "string" ? query.projectId : undefined;
  const requesterName = typeof query.requesterName === "string" ? query.requesterName : undefined;
  const status = typeof query.status === "string" ? query.status : undefined;

  return {
    projectId,
    requesterName,
    status: status as ExpenseFilters["status"],
  };
}

function parseCreateExpenseInput(payload: unknown): CreateExpenseInput {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new AppError("Request body must be an object", 400);
  }

  const body = payload as Record<string, unknown>;
  const amount = ensureNumber(body.amount, "amount");

  if (amount <= 0) {
    throw new AppError("amount must be greater than zero", 400);
  }

  return {
    amount,
    category: ensureRequiredString(body.category, "category"),
    currency: ensureOptionalString(body.currency) ?? "THB",
    description: ensureRequiredString(body.description, "description"),
    projectId: ensureRequiredString(body.projectId, "projectId"),
    requesterId: ensureOptionalString(body.requesterId),
    requesterName: ensureRequiredString(body.requesterName, "requesterName"),
    vendorName: ensureOptionalString(body.vendorName),
  };
}

function parseSubmitExpenseInput(payload: unknown): SubmitExpenseInput {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new AppError("Request body must be an object", 400);
  }

  const body = payload as Record<string, unknown>;

  return {
    approverId: ensureOptionalString(body.approverId),
    approverName: ensureRequiredString(body.approverName, "approverName"),
    comment: ensureOptionalString(body.comment),
  };
}

export async function getExpenses(query: unknown) {
  return listExpenses(parseExpenseFilters(query));
}

export async function getExpense(expenseId: string) {
  const expense = await findExpenseById(expenseId);

  if (!expense) {
    throw new AppError("Expense note not found", 404);
  }

  return expense;
}

export async function createExpenseRecord(payload: unknown) {
  const expenseInput = parseCreateExpenseInput(payload);
  const project = await findProjectById(expenseInput.projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const budget = await findBudgetByProjectId(expenseInput.projectId);
  const signals = evaluateExpenseIntelligence(expenseInput, budget);

  return createExpense({
    ...expenseInput,
    policySignal: signals.policySignal,
    priceSignal: signals.priceSignal,
  });
}

export async function submitExpenseRecord(expenseId: string, payload: unknown) {
  const submitInput = parseSubmitExpenseInput(payload);
  const expense = await findExpenseById(expenseId);

  if (!expense) {
    throw new AppError("Expense note not found", 404);
  }

  if (!["DRAFT", "REJECTED"].includes(expense.status)) {
    throw new AppError("Expense note cannot be submitted from its current status", 409);
  }

  const approvalChain = await listApprovalsByExpenseId(expense.id);
  const hasPendingApproval = approvalChain.some((approval) => approval.status === "PENDING");

  if (hasPendingApproval) {
    throw new AppError("Expense note already has a pending approval step", 409);
  }

  const budget = await findBudgetByProjectId(expense.projectId);
  const signals = evaluateExpenseIntelligence(
    {
      amount: expense.amount,
      category: expense.category,
      vendorName: expense.vendorName,
    },
    budget
  );

  if (signals.policySignal === "BLOCK") {
    throw new AppError("Expense note is blocked by policy validation", 409, {
      budgetAlerts: signals.budgetAlerts,
      policySignal: signals.policySignal,
      priceSignal: signals.priceSignal,
    });
  }

  const updatedExpense = await updateExpense(expenseId, {
    policySignal: signals.policySignal,
    priceSignal: signals.priceSignal,
    status: "PENDING_APPROVAL",
  });

  const approval = await createApprovalStep({
    approverId: submitInput.approverId,
    approverName: submitInput.approverName,
    comment: submitInput.comment,
    expenseNoteId: expenseId,
    level: 1,
  });

  return {
    approval,
    expense: updatedExpense,
  };
}

