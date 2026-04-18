import { AppError } from "../errors/AppError";
import { getSupabaseClient } from "../integrations/supabaseClient";
import { ApprovalFilters, ApprovalStep, CreateApprovalInput } from "../models/approval";
import { ApprovalStatus } from "../models/common";
import { ApprovalStepRow } from "../types/supabaseTables";

interface UpdateApprovalInput {
  comment?: string;
  decidedAt?: string;
  status: ApprovalStatus;
}

function mapApprovalRow(row: ApprovalStepRow): ApprovalStep {
  return {
    approverId: row.approver_id,
    approverName: row.approver_name,
    comment: row.comment,
    createdAt: row.created_at,
    decidedAt: row.decided_at,
    expenseNoteId: row.expense_note_id,
    id: row.id,
    level: row.level,
    status: row.status,
    updatedAt: row.updated_at,
  };
}

export async function listApprovals(filters: ApprovalFilters = {}): Promise<ApprovalStep[]> {
  const client = getSupabaseClient();
  let query = client.from("approval_steps").select("*").order("created_at", { ascending: false });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.approverName) {
    query = query.ilike("approver_name", `%${filters.approverName}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new AppError(`Failed to fetch approvals: ${error.message}`, 500, error);
  }

  return ((data as ApprovalStepRow[] | null) ?? []).map(mapApprovalRow);
}

export async function listApprovalsByExpenseId(expenseNoteId: string): Promise<ApprovalStep[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("approval_steps")
    .select("*")
    .eq("expense_note_id", expenseNoteId)
    .order("level", { ascending: true });

  if (error) {
    throw new AppError(`Failed to fetch approval chain: ${error.message}`, 500, error);
  }

  return ((data as ApprovalStepRow[] | null) ?? []).map(mapApprovalRow);
}

export async function findApprovalById(approvalId: string): Promise<ApprovalStep | null> {
  const client = getSupabaseClient();
  const { data, error } = await client.from("approval_steps").select("*").eq("id", approvalId).maybeSingle();

  if (error) {
    throw new AppError(`Failed to fetch approval: ${error.message}`, 500, error);
  }

  if (!data) {
    return null;
  }

  return mapApprovalRow(data as ApprovalStepRow);
}

export async function createApprovalStep(input: CreateApprovalInput): Promise<ApprovalStep> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("approval_steps")
    .insert({
      approver_id: input.approverId ?? null,
      approver_name: input.approverName,
      comment: input.comment ?? null,
      expense_note_id: input.expenseNoteId,
      level: input.level,
      status: "PENDING",
    })
    .select("*")
    .single();

  if (error) {
    throw new AppError(`Failed to create approval step: ${error.message}`, 500, error);
  }

  return mapApprovalRow(data as ApprovalStepRow);
}

export async function updateApproval(approvalId: string, input: UpdateApprovalInput): Promise<ApprovalStep> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("approval_steps")
    .update({
      comment: input.comment ?? null,
      decided_at: input.decidedAt ?? null,
      status: input.status,
    })
    .eq("id", approvalId)
    .select("*")
    .single();

  if (error) {
    throw new AppError(`Failed to update approval step: ${error.message}`, 500, error);
  }

  return mapApprovalRow(data as ApprovalStepRow);
}