import { AppError } from "../errors/AppError";
import { BudgetSummary, UpsertBudgetInput } from "../models/budget";
import { findBudgetByProjectId, upsertBudgetForProject } from "../repositories/budgetRepository";
import { findProjectById } from "../repositories/projectRepository";
import { buildBudgetAlerts } from "./intelligenceService";
import { ensureNumber, ensureOptionalString, ensureStringArray } from "../validators/requestValidators";

function parseBudgetInput(payload: unknown): UpsertBudgetInput {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new AppError("Request body must be an object", 400);
  }

  const body = payload as Record<string, unknown>;
  const totalAmount = ensureNumber(body.totalAmount, "totalAmount");
  const allocatedAmount = body.allocatedAmount === undefined ? totalAmount : ensureNumber(body.allocatedAmount, "allocatedAmount");
  const committedAmount = body.committedAmount === undefined ? 0 : ensureNumber(body.committedAmount, "committedAmount");

  if (totalAmount <= 0) {
    throw new AppError("totalAmount must be greater than zero", 400);
  }

  if (allocatedAmount > totalAmount) {
    throw new AppError("allocatedAmount cannot exceed totalAmount", 400);
  }

  return {
    alerts: ensureStringArray(body.alerts, "alerts"),
    allocatedAmount,
    committedAmount,
    currency: ensureOptionalString(body.currency) ?? "THB",
    totalAmount,
  };
}

export async function getBudget(projectId: string) {
  const budget = await findBudgetByProjectId(projectId);

  if (!budget) {
    throw new AppError("Budget not found", 404);
  }

  return budget;
}

export async function saveBudget(projectId: string, payload: unknown) {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const budgetInput = parseBudgetInput(payload);
  const alerts = budgetInput.alerts && budgetInput.alerts.length > 0
    ? budgetInput.alerts
    : buildBudgetAlerts(budgetInput.totalAmount, budgetInput.committedAmount ?? 0);

  return upsertBudgetForProject(projectId, {
    ...budgetInput,
    alerts,
  });
}

export async function applyApprovedExpense(projectId: string, amount: number): Promise<BudgetSummary> {
  const budget = await findBudgetByProjectId(projectId);

  if (!budget) {
    throw new AppError("Budget must be configured before approving expenses", 409);
  }

  const nextCommittedAmount = Number((budget.committedAmount + amount).toFixed(2));
  const alerts = buildBudgetAlerts(budget.totalAmount, nextCommittedAmount);

  return upsertBudgetForProject(projectId, {
    alerts,
    allocatedAmount: budget.allocatedAmount,
    committedAmount: nextCommittedAmount,
    currency: budget.currency,
    totalAmount: budget.totalAmount,
  });
}
