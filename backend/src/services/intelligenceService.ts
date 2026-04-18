import { BudgetSummary } from "../models/budget";
import { SignalStatus } from "../models/common";

interface ExpenseSignalInput {
  amount: number;
  category: string;
  vendorName?: string | null;
}

interface ExpenseSignalResult {
  budgetAlerts: string[];
  policySignal: SignalStatus;
  priceSignal: SignalStatus;
}

const signalRank: Record<SignalStatus, number> = {
  BLOCK: 2,
  PASS: 0,
  WARNING: 1,
};

function mergeSignal(current: SignalStatus, next: SignalStatus): SignalStatus {
  return signalRank[next] > signalRank[current] ? next : current;
}

export function buildBudgetAlerts(totalAmount: number, committedAmount: number): string[] {
  if (totalAmount <= 0) {
    return ["Budget total amount is invalid"];
  }

  const utilization = committedAmount / totalAmount;

  if (utilization >= 1) {
    return ["Project budget is exhausted"];
  }

  if (utilization >= 0.95) {
    return ["Project budget is above 95 percent utilization"];
  }

  if (utilization >= 0.8) {
    return ["Project budget is above 80 percent utilization"];
  }

  return [];
}

export function evaluateExpenseIntelligence(
  expense: ExpenseSignalInput,
  budget: BudgetSummary | null
): ExpenseSignalResult {
  let priceSignal: SignalStatus = "PASS";
  let policySignal: SignalStatus = "PASS";
  let budgetAlerts: string[] = [];
  const normalizedCategory = expense.category.trim().toUpperCase();

  if (expense.amount >= 25000) {
    priceSignal = mergeSignal(priceSignal, "BLOCK");
  } else if (expense.amount >= 10000) {
    priceSignal = mergeSignal(priceSignal, "WARNING");
  }

  if (normalizedCategory === "TRAVEL" && expense.amount >= 8000) {
    priceSignal = mergeSignal(priceSignal, "WARNING");
  }

  if (!budget) {
    policySignal = mergeSignal(policySignal, "BLOCK");
    budgetAlerts = ["Budget is not configured for this project"];
  } else {
    const nextCommittedAmount = budget.committedAmount + expense.amount;
    budgetAlerts = buildBudgetAlerts(budget.totalAmount, nextCommittedAmount);

    if (nextCommittedAmount > budget.totalAmount) {
      policySignal = mergeSignal(policySignal, "BLOCK");
    } else if (budgetAlerts.length > 0) {
      policySignal = mergeSignal(policySignal, "WARNING");
    }
  }

  if (normalizedCategory === "TRAVEL" && !expense.vendorName) {
    policySignal = mergeSignal(policySignal, "WARNING");
  }

  return {
    budgetAlerts,
    policySignal,
    priceSignal,
  };
}
