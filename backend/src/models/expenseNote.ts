import { ExpenseStatus, SignalStatus } from "./common";

export interface ExpenseNote {
  id: string;
  projectId: string;
  requesterId: string | null;
  requesterName: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  vendorName: string | null;
  status: ExpenseStatus;
  priceSignal: SignalStatus;
  policySignal: SignalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFilters {
  projectId?: string;
  requesterName?: string;
  status?: ExpenseStatus;
}

export interface CreateExpenseInput {
  projectId: string;
  requesterId?: string;
  requesterName: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  vendorName?: string;
}

export interface SubmitExpenseInput {
  approverId?: string;
  approverName: string;
  comment?: string;
}

