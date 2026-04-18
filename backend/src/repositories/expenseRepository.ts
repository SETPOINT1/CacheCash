import { AppError } from "../errors/AppError";
import { getSupabaseClient } from "../integrations/supabaseClient";
import { CreateExpenseInput, ExpenseFilters, ExpenseNote } from "../models/expenseNote";
import { ExpenseStatus, SignalStatus } from "../models/common";
import { Database } from "../types/supabaseDatabase";
import { ExpenseNoteRow } from "../types/supabaseTables";

interface UpdateExpenseInput {
  policySignal?: SignalStatus;
  priceSignal?: SignalStatus;
  status?: ExpenseStatus;
}

function mapExpenseRow(row: ExpenseNoteRow): ExpenseNote {
  return {
    amount: Number(row.amount),
    category: row.category,
    createdAt: row.created_at,
    currency: row.currency,
    description: row.description,
    id: row.id,
    policySignal: row.policy_signal,
    priceSignal: row.price_signal,
    projectId: row.project_id,
    requesterId: row.requester_id,
    requesterName: row.requester_name,
    status: row.status,
    updatedAt: row.updated_at,
    vendorName: row.vendor_name,
  };
}

export async function listExpenses(filters: ExpenseFilters = {}): Promise<ExpenseNote[]> {
  const client = getSupabaseClient();
  let query = client.from("expense_notes").select("*").order("created_at", { ascending: false });

  if (filters.projectId) {
    query = query.eq("project_id", filters.projectId);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.requesterName) {
    query = query.ilike("requester_name", `%${filters.requesterName}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new AppError(`Failed to fetch expenses: ${error.message}`, 500, error);
  }

  return ((data as ExpenseNoteRow[] | null) ?? []).map(mapExpenseRow);
}

export async function findExpenseById(expenseId: string): Promise<ExpenseNote | null> {
  const client = getSupabaseClient();
  const { data, error } = await client.from("expense_notes").select("*").eq("id", expenseId).maybeSingle();

  if (error) {
    throw new AppError(`Failed to fetch expense: ${error.message}`, 500, error);
  }

  if (!data) {
    return null;
  }

  return mapExpenseRow(data as ExpenseNoteRow);
}

export async function createExpense(input: CreateExpenseInput & { priceSignal: SignalStatus; policySignal: SignalStatus }): Promise<ExpenseNote> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("expense_notes")
    .insert({
      amount: input.amount,
      category: input.category,
      currency: input.currency,
      description: input.description,
      policy_signal: input.policySignal,
      price_signal: input.priceSignal,
      project_id: input.projectId,
      requester_id: input.requesterId ?? null,
      requester_name: input.requesterName,
      status: "DRAFT",
      vendor_name: input.vendorName ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw new AppError(`Failed to create expense note: ${error.message}`, 500, error);
  }

  return mapExpenseRow(data as ExpenseNoteRow);
}

export async function updateExpense(expenseId: string, changes: UpdateExpenseInput): Promise<ExpenseNote> {
  const client = getSupabaseClient();
  const payload: Database["public"]["Tables"]["expense_notes"]["Update"] = {};

  if (changes.status) {
    payload.status = changes.status;
  }

  if (changes.priceSignal) {
    payload.price_signal = changes.priceSignal;
  }

  if (changes.policySignal) {
    payload.policy_signal = changes.policySignal;
  }

  const { data, error } = await client.from("expense_notes").update(payload).eq("id", expenseId).select("*").single();

  if (error) {
    throw new AppError(`Failed to update expense note: ${error.message}`, 500, error);
  }

  return mapExpenseRow(data as ExpenseNoteRow);
}

