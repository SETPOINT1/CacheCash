import { AppError } from "../errors/AppError";
import { getSupabaseClient } from "../integrations/supabaseClient";
import { BudgetSummary, UpsertBudgetInput } from "../models/budget";
import { BudgetRow } from "../types/supabaseTables";

function normalizeAlerts(alerts: unknown): string[] {
  if (!Array.isArray(alerts)) {
    return [];
  }

  return alerts.filter((item): item is string => typeof item === "string");
}

function mapBudgetRow(row: BudgetRow): BudgetSummary {
  return {
    alerts: normalizeAlerts(row.alerts),
    allocatedAmount: Number(row.allocated_amount),
    committedAmount: Number(row.committed_amount),
    createdAt: row.created_at,
    currency: row.currency,
    id: row.id,
    projectId: row.project_id,
    totalAmount: Number(row.total_amount),
    updatedAt: row.updated_at,
  };
}

export async function findBudgetByProjectId(projectId: string): Promise<BudgetSummary | null> {
  const client = getSupabaseClient();
  const { data, error } = await client.from("budgets").select("*").eq("project_id", projectId).maybeSingle();

  if (error) {
    throw new AppError(`Failed to fetch budget: ${error.message}`, 500, error);
  }

  if (!data) {
    return null;
  }

  return mapBudgetRow(data as BudgetRow);
}

export async function upsertBudgetForProject(
  projectId: string,
  input: UpsertBudgetInput
): Promise<BudgetSummary> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("budgets")
    .upsert(
      {
        alerts: input.alerts ?? [],
        allocated_amount: input.allocatedAmount,
        committed_amount: input.committedAmount ?? 0,
        currency: input.currency,
        project_id: projectId,
        total_amount: input.totalAmount,
      },
      { onConflict: "project_id" }
    )
    .select("*")
    .single();

  if (error) {
    throw new AppError(`Failed to save budget: ${error.message}`, 500, error);
  }

  return mapBudgetRow(data as BudgetRow);
}
