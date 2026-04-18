import { ApprovalStatus } from "./common";

export interface ApprovalStep {
  id: string;
  expenseNoteId: string;
  approverId: string | null;
  approverName: string;
  level: number;
  status: ApprovalStatus;
  comment: string | null;
  decidedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalFilters {
  approverName?: string;
  status?: ApprovalStatus;
}

export interface CreateApprovalInput {
  expenseNoteId: string;
  approverId?: string;
  approverName: string;
  level: number;
  comment?: string;
}

export interface ApprovalActionInput {
  action: "APPROVE" | "REJECT" | "ESCALATE";
  comment?: string;
  nextApproverId?: string;
  nextApproverName?: string;
}
