import { ApprovalStatus, ExpenseStatus, ProjectStatus, SignalStatus } from "../models/common";

export interface ProjectRow {
  id: string;
  organization_id: string;
  name: string;
  owner_id: string;
  owner_name: string;
  status: ProjectStatus;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetRow {
  id: string;
  project_id: string;
  total_amount: number | string;
  allocated_amount: number | string;
  committed_amount: number | string;
  currency: string;
  alerts: unknown;
  created_at: string;
  updated_at: string;
}

export interface ExpenseNoteRow {
  id: string;
  project_id: string;
  requester_id: string | null;
  requester_name: string;
  amount: number | string;
  currency: string;
  category: string;
  description: string;
  vendor_name: string | null;
  status: ExpenseStatus;
  price_signal: SignalStatus;
  policy_signal: SignalStatus;
  created_at: string;
  updated_at: string;
}

export interface ApprovalStepRow {
  id: string;
  expense_note_id: string;
  approver_id: string | null;
  approver_name: string;
  level: number;
  status: ApprovalStatus;
  comment: string | null;
  decided_at: string | null;
  created_at: string;
  updated_at: string;
}
