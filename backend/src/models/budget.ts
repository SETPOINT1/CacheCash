export interface BudgetSummary {
  id: string;
  projectId: string;
  totalAmount: number;
  allocatedAmount: number;
  committedAmount: number;
  currency: string;
  alerts: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpsertBudgetInput {
  totalAmount: number;
  allocatedAmount: number;
  committedAmount?: number;
  currency: string;
  alerts?: string[];
}
