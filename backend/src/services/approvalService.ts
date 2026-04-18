import { AppError } from "../errors/AppError";
import { ApprovalActionInput, ApprovalFilters } from "../models/approval";
import { createApprovalStep, findApprovalById, listApprovals, listApprovalsByExpenseId, updateApproval } from "../repositories/approvalRepository";
import { findExpenseById, updateExpense } from "../repositories/expenseRepository";
import { ensureOptionalString, ensureRequiredString } from "../validators/requestValidators";
import { applyApprovedExpense } from "./budgetService";

function parseApprovalFilters(payload: unknown): ApprovalFilters {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }

  const query = payload as Record<string, unknown>;
  const approverName = typeof query.approverName === "string" ? query.approverName : undefined;
  const status = typeof query.status === "string" ? query.status : undefined;

  return {
    approverName,
    status: status as ApprovalFilters["status"],
  };
}

function parseApprovalAction(payload: unknown): ApprovalActionInput {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new AppError("Request body must be an object", 400);
  }

  const body = payload as Record<string, unknown>;
  const action = ensureRequiredString(body.action, "action").toUpperCase();

  if (!["APPROVE", "REJECT", "ESCALATE"].includes(action)) {
    throw new AppError("action must be APPROVE, REJECT, or ESCALATE", 400);
  }

  return {
    action: action as ApprovalActionInput["action"],
    comment: ensureOptionalString(body.comment),
    nextApproverId: ensureOptionalString(body.nextApproverId),
    nextApproverName: ensureOptionalString(body.nextApproverName),
  };
}

export async function getApprovals(query: unknown) {
  return listApprovals(parseApprovalFilters(query));
}

export async function decideApproval(approvalId: string, payload: unknown) {
  const actionInput = parseApprovalAction(payload);
  const approval = await findApprovalById(approvalId);

  if (!approval) {
    throw new AppError("Approval step not found", 404);
  }

  if (approval.status !== "PENDING") {
    throw new AppError("Approval step has already been processed", 409);
  }

  const expense = await findExpenseById(approval.expenseNoteId);

  if (!expense) {
    throw new AppError("Related expense note not found", 404);
  }

  if (actionInput.action === "REJECT" && !actionInput.comment) {
    throw new AppError("comment is required when rejecting an approval", 400);
  }

  if (actionInput.action === "ESCALATE" && !actionInput.nextApproverName) {
    throw new AppError("nextApproverName is required when escalating an approval", 400);
  }

  const decidedAt = new Date().toISOString();

  if (actionInput.action === "APPROVE") {
    const updatedApproval = await updateApproval(approvalId, {
      comment: actionInput.comment,
      decidedAt,
      status: "APPROVED",
    });

    const approvalChain = await listApprovalsByExpenseId(expense.id);
    const stillPending = approvalChain.some((item) => item.id !== approvalId && item.status === "PENDING");

    let budget = null;

    if (!stillPending) {
      await updateExpense(expense.id, { status: "APPROVED" });
      budget = await applyApprovedExpense(expense.projectId, expense.amount);
    }

    return {
      approval: updatedApproval,
      budget,
      expenseStatus: stillPending ? "PENDING_APPROVAL" : "APPROVED",
    };
  }

  if (actionInput.action === "REJECT") {
    const updatedApproval = await updateApproval(approvalId, {
      comment: actionInput.comment,
      decidedAt,
      status: "REJECTED",
    });

    const updatedExpense = await updateExpense(expense.id, { status: "REJECTED" });

    return {
      approval: updatedApproval,
      expense: updatedExpense,
    };
  }

  const escalatedApproval = await updateApproval(approvalId, {
    comment: actionInput.comment,
    decidedAt,
    status: "ESCALATED",
  });

  const nextApproval = await createApprovalStep({
    approverId: actionInput.nextApproverId,
    approverName: actionInput.nextApproverName!,
    comment: actionInput.comment,
    expenseNoteId: expense.id,
    level: approval.level + 1,
  });

  await updateExpense(expense.id, { status: "PENDING_APPROVAL" });

  return {
    escalatedFrom: escalatedApproval,
    nextApproval,
  };
}