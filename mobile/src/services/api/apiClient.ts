import { env } from "../../config/env";

export interface BackendProject {
  id: string;
  organizationId: string;
  name: string;
  ownerId: string;
  ownerName: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackendBudget {
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

export interface BackendExpense {
  id: string;
  projectId: string;
  requesterId: string | null;
  requesterName: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  vendorName: string | null;
  status: "DRAFT" | "SUBMITTED" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
  priceSignal: "PASS" | "WARNING" | "BLOCK";
  policySignal: "PASS" | "WARNING" | "BLOCK";
  createdAt: string;
  updatedAt: string;
}

export interface BackendApproval {
  id: string;
  expenseNoteId: string;
  approverId: string | null;
  approverName: string;
  level: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ESCALATED";
  comment: string | null;
  decidedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BackendOcrAnalysis {
  confidence: number;
  fileUrl: string;
  merchantName: string;
  receiptDate: string;
  totalAmount: number;
}

type ApiEnvelope<T> = {
  data: T;
};

async function request<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const text = await response.text();
  const parsed = text ? (JSON.parse(text) as ApiEnvelope<T> | { message?: string }) : null;

  if (!response.ok) {
    const errorMessage = parsed && "message" in parsed && parsed.message ? parsed.message : `Request failed with ${response.status}`;
    throw new Error(errorMessage);
  }

  return ((parsed as ApiEnvelope<T>)?.data ?? null) as T;
}

function buildQuery(query?: Record<string, string | undefined>) {
  if (!query) {
    return "";
  }

  const queryString = Object.entries(query)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

  return queryString ? `?${queryString}` : "";
}

export function apiGet<T>(path: string) {
  return request<T>(path);
}

export function apiPost<T>(path: string, body: unknown) {
  return request<T>(path, {
    body: JSON.stringify(body),
    method: "POST",
  });
}

export function apiPut<T>(path: string, body: unknown) {
  return request<T>(path, {
    body: JSON.stringify(body),
    method: "PUT",
  });
}

export function apiPatch<T>(path: string, body: unknown) {
  return request<T>(path, {
    body: JSON.stringify(body),
    method: "PATCH",
  });
}

export function listProjects() {
  return apiGet<BackendProject[]>("/projects");
}

export function createProject(input: {
  name: string;
  ownerName: string;
  ownerId: string;
  organizationId: string;
  memberCount: number;
}) {
  return apiPost<BackendProject>("/projects", input);
}

export function getProjectBudget(projectId: string) {
  return apiGet<BackendBudget>(`/projects/${projectId}/budget`);
}

export function upsertProjectBudget(projectId: string, input: {
  totalAmount: number;
  allocatedAmount: number;
  committedAmount?: number;
  currency: string;
  alerts?: string[];
}) {
  return apiPut<BackendBudget>(`/projects/${projectId}/budget`, input);
}

export function listExpenses(query?: Record<string, string | undefined>) {
  return apiGet<BackendExpense[]>(`/expenses${buildQuery(query)}`);
}

export function createExpense(input: {
  projectId: string;
  requesterId?: string;
  requesterName: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  vendorName?: string;
}) {
  return apiPost<BackendExpense>("/expenses", input);
}

export function submitExpense(expenseId: string, input: {
  approverId?: string;
  approverName: string;
  comment?: string;
}) {
  return apiPost<{ approval: BackendApproval; expense: BackendExpense }>(`/expenses/${expenseId}/submit`, input);
}

export function listApprovals(query?: Record<string, string | undefined>) {
  return apiGet<BackendApproval[]>(`/approvals${buildQuery(query)}`);
}

export function decideApproval(approvalId: string, input: {
  action: "APPROVE" | "REJECT" | "ESCALATE";
  comment?: string;
  nextApproverId?: string;
  nextApproverName?: string;
}) {
  return apiPatch<unknown>(`/approvals/${approvalId}`, input);
}

export function analyzeReceipt(fileUrl: string) {
  return apiPost<BackendOcrAnalysis>("/ocr/analyze", { fileUrl });
}
