export type AppTab = "home" | "projects" | "bills" | "approvals" | "settings";

export type FlowKind = "withdraw" | "topup";

export type AppExpenseStatus = "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";

export type AppSignalStatus = "PASS" | "WARNING" | "BLOCK";

export type NotificationKind = "all" | "income" | "expenses" | "bills";

export type CategoryKind = "expense" | "income";

export interface AppUser {
  id: string;
  name: string;
  role: string;
  initials: string;
  bio: string;
}

export interface AppProject {
  id: string;
  name: string;
  ownerName: string;
  memberCount: number;
  budgetTotal: number;
  budgetCommitted: number;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  description: string;
  businessModel: string;
  updatedAt: string;
  invitationCode: string;
}

export interface AppExpense {
  id: string;
  projectId: string;
  requesterName: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  vendorName: string;
  status: AppExpenseStatus;
  flow: FlowKind;
  createdAt: string;
  attachments: string[];
  approverName: string;
  priceSignal: AppSignalStatus;
  policySignal: AppSignalStatus;
}

export interface AppApproval {
  id: string;
  expenseNoteId: string;
  approverName: string;
  level: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ESCALATED";
  comment: string | null;
  createdAt: string;
  decidedAt: string | null;
}

export interface AppCategory {
  id: string;
  name: string;
  kind: CategoryKind;
  icon: string;
  tint: string;
  count: number;
}

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  name: string;
  body: string;
  amountLabel?: string;
  createdAt: string;
}

export interface AppStatementEntry {
  id: string;
  name: string;
  description: string;
  amount: number;
  createdAt: string;
  direction: "IN" | "OUT";
}

export interface AppTeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export interface AppTip {
  id: string;
  quote: string;
  footnote: string;
}

export interface DashboardSeries {
  month: string;
  income: number;
  expenses: number;
  profit: number;
}

const monthFormatter = new Intl.DateTimeFormat(undefined, { month: "short" });

export interface WelcomeSlide {
  id: string;
  title: string;
  description: string;
  accent: string;
}

export const demoUser: AppUser = {
  bio: "Budget owner for student procurement and approval workflow",
  id: "user-konlawath",
  initials: "KP",
  name: "Konlawath Pinijpong",
  role: "Project Lead",
};

export const demoProjects: AppProject[] = [
  {
    budgetCommitted: 20000,
    budgetTotal: 100000,
    businessModel: "Business",
    description: "Central budget for project spending, approvals, and post-payment verification.",
    id: "project-first",
    invitationCode: "FIRST1",
    memberCount: 6,
    name: "FirstProject",
    ownerName: demoUser.name,
    status: "ACTIVE",
    updatedAt: "2026-04-18T03:20:00.000Z",
  },
  {
    budgetCommitted: 7800,
    budgetTotal: 45000,
    businessModel: "Casual Group",
    description: "Marketing team budget for promotion and activation expenses.",
    id: "project-marketing",
    invitationCode: "MARK26",
    memberCount: 4,
    name: "Marketing",
    ownerName: "Amaraporn L.",
    status: "ACTIVE",
    updatedAt: "2026-04-12T11:30:00.000Z",
  },
  {
    budgetCommitted: 12000,
    budgetTotal: 60000,
    businessModel: "Business",
    description: "Technology procurement and operating cost monitoring.",
    id: "project-tech",
    invitationCode: "TECH88",
    memberCount: 7,
    name: "Technology",
    ownerName: "Chonchanan J.",
    status: "ACTIVE",
    updatedAt: "2026-04-05T08:45:00.000Z",
  },
];

export const demoExpenses: AppExpense[] = [
  {
    amount: 8500,
    approverName: "Sirapop P.",
    attachments: ["receipt-001.jpg", "receipt-002.jpg"],
    category: "Food & Drinks",
    createdAt: "2026-04-15T11:23:00.000Z",
    currency: "THB",
    description: "Team building dinner at Thai restaurant",
    flow: "withdraw",
    id: "expense-food-001",
    policySignal: "PASS",
    priceSignal: "WARNING",
    projectId: "project-first",
    requesterName: "Konlawath P.",
    status: "PENDING_APPROVAL",
    vendorName: "Thai Garden",
  },
  {
    amount: 8500,
    approverName: "Konlawath P.",
    attachments: ["loan-slip-001.jpg"],
    category: "Lent/Advanced Payment",
    createdAt: "2026-03-01T11:23:00.000Z",
    currency: "THB",
    description: "Advance reimbursement draft",
    flow: "withdraw",
    id: "expense-loan-001",
    policySignal: "BLOCK",
    priceSignal: "PASS",
    projectId: "project-first",
    requesterName: "Sirapop P.",
    status: "REJECTED",
    vendorName: "Cash Transfer",
  },
  {
    amount: 700,
    approverName: "Konlawath P.",
    attachments: ["shopping-001.jpg"],
    category: "Shopping",
    createdAt: "2026-05-14T11:23:00.000Z",
    currency: "THB",
    description: "Shared supplies for print station",
    flow: "withdraw",
    id: "expense-shopping-001",
    policySignal: "PASS",
    priceSignal: "PASS",
    projectId: "project-first",
    requesterName: "Kongphop L.",
    status: "APPROVED",
    vendorName: "Stationery Hub",
  },
  {
    amount: 1500,
    approverName: "Amaraporn L.",
    attachments: ["stay-001.jpg"],
    category: "Accommodation",
    createdAt: "2026-05-05T11:23:00.000Z",
    currency: "THB",
    description: "Accommodation for event vendor",
    flow: "withdraw",
    id: "expense-home-001",
    policySignal: "WARNING",
    priceSignal: "WARNING",
    projectId: "project-marketing",
    requesterName: "Chonchanan J.",
    status: "PENDING_APPROVAL",
    vendorName: "Sleep Well Hostel",
  },
  {
    amount: 200,
    approverName: "Konlawath P.",
    attachments: ["entertainment-001.jpg"],
    category: "Entertainment",
    createdAt: "2026-05-25T09:35:00.000Z",
    currency: "THB",
    description: "Community streaming subscription",
    flow: "withdraw",
    id: "expense-ent-001",
    policySignal: "PASS",
    priceSignal: "PASS",
    projectId: "project-marketing",
    requesterName: "Amaraporn L.",
    status: "APPROVED",
    vendorName: "Stream Plus",
  },
  {
    amount: 8000,
    approverName: "Konlawath P.",
    attachments: ["sponsor-001.jpg"],
    category: "Donation / Sponsorship",
    createdAt: "2026-05-23T02:21:00.000Z",
    currency: "THB",
    description: "Sponsor transfer received",
    flow: "topup",
    id: "expense-topup-001",
    policySignal: "PASS",
    priceSignal: "PASS",
    projectId: "project-first",
    requesterName: "Amaraporn L.",
    status: "APPROVED",
    vendorName: "Sponsor Transfer",
  },
  {
    amount: 4200,
    approverName: "Konlawath P.",
    attachments: ["fund-001.jpg"],
    category: "Fund Contribution",
    createdAt: "2026-04-02T10:23:00.000Z",
    currency: "THB",
    description: "Member contribution posted",
    flow: "topup",
    id: "expense-topup-002",
    policySignal: "PASS",
    priceSignal: "PASS",
    projectId: "project-first",
    requesterName: "Kongphop L.",
    status: "APPROVED",
    vendorName: "Manual Transfer",
  },
];

export const demoApprovals: AppApproval[] = [
  {
    approverName: "Sirapop P.",
    comment: null,
    createdAt: "2026-04-15T11:24:00.000Z",
    decidedAt: null,
    expenseNoteId: "expense-food-001",
    id: "approval-food-001",
    level: 1,
    status: "PENDING",
  },
  {
    approverName: "Amaraporn L.",
    comment: null,
    createdAt: "2026-05-05T11:24:00.000Z",
    decidedAt: null,
    expenseNoteId: "expense-home-001",
    id: "approval-home-001",
    level: 1,
    status: "PENDING",
  },
];

export const demoCategories: AppCategory[] = [
  { count: 30, icon: "fast-food-outline", id: "category-food", kind: "expense", name: "Food & Drinks", tint: "#ef7c7c" },
  { count: 23, icon: "film-outline", id: "category-entertainment", kind: "expense", name: "Entertainment", tint: "#9bded3" },
  { count: 18, icon: "car-outline", id: "category-transport", kind: "expense", name: "Transport", tint: "#89b7f7" },
  { count: 12, icon: "home-outline", id: "category-accommodation", kind: "expense", name: "Accommodation", tint: "#ffb053" },
  { count: 9, icon: "cash-outline", id: "category-loan", kind: "expense", name: "Lent/Advanced Payment", tint: "#d9866b" },
  { count: 5, icon: "cart-outline", id: "category-shopping", kind: "expense", name: "Shopping", tint: "#b69af0" },
  { count: 25, icon: "ellipsis-horizontal", id: "category-other-expense", kind: "expense", name: "Other", tint: "#6a6a6a" },
  { count: 18, icon: "briefcase-outline", id: "category-salary", kind: "income", name: "Salary / Wages", tint: "#ff5d70" },
  { count: 6, icon: "gift-outline", id: "category-donation", kind: "income", name: "Donation / Sponsorship", tint: "#9fc6f3" },
  { count: 8, icon: "wallet-outline", id: "category-fund", kind: "income", name: "Fund Contribution", tint: "#b6e2da" },
  { count: 50, icon: "business-outline", id: "category-loan-received", kind: "income", name: "Loan Received", tint: "#ff795f" },
  { count: 14, icon: "refresh-circle-outline", id: "category-reimburse", kind: "income", name: "Reimbursement", tint: "#d1ad85" },
  { count: 6, icon: "school-outline", id: "category-grant", kind: "income", name: "Allowance / Budget Grant", tint: "#ae93ee" },
  { count: 4, icon: "receipt-outline", id: "category-revenue", kind: "income", name: "Business Revenue", tint: "#ea9d84" },
  { count: 20, icon: "ellipsis-horizontal", id: "category-other-income", kind: "income", name: "Other", tint: "#6a6a6a" },
];

export const demoNotifications: AppNotification[] = [
  {
    amountLabel: "XX.XX",
    body: "Food bill has been approved",
    createdAt: "2h ago",
    id: "notice-1",
    kind: "bills",
    name: "Mr.xxxxx xxxx",
  },
  {
    amountLabel: "+ xx.xx",
    body: "DD/MM/YYYY",
    createdAt: "xx.xx am.",
    id: "notice-2",
    kind: "income",
    name: "Ms.xxxxx xxxx",
  },
  {
    amountLabel: "- xx.xx",
    body: "DD/MM/YYYY",
    createdAt: "xx.xx am.",
    id: "notice-3",
    kind: "expenses",
    name: "Mr.xxxxx xxxx",
  },
  {
    body: "has spent 30 % right now!!!",
    createdAt: "01.15 am",
    id: "notice-4",
    kind: "all",
    name: "FirstProject",
  },
];

export const demoStatement: AppStatementEntry[] = [
  {
    amount: 8500,
    createdAt: "DD/MM/YYYY",
    description: "Transferred by ( K plus )",
    direction: "IN",
    id: "statement-1",
    name: "Mr.xxxxx xxxx",
  },
  {
    amount: -8500,
    createdAt: "DD/MM/YYYY",
    description: "Category ( food ) / Transferred by ( Truemoney wallet )",
    direction: "OUT",
    id: "statement-2",
    name: "Ms.xxxxx xxxx",
  },
  {
    amount: 2000,
    createdAt: "DD/MM/YYYY",
    description: "Manual transfer",
    direction: "IN",
    id: "statement-3",
    name: "Mr.xxxxx xxxx",
  },
];

export const demoTeamMembers: AppTeamMember[] = [
  { id: "member-1", initials: "KP", name: "Konlawath Pinijpong", role: "Lead Owner" },
  { id: "member-2", initials: "AL", name: "Amaraporn L.", role: "Finance" },
  { id: "member-3", initials: "KL", name: "Kongphop L.", role: "Coordinator" },
  { id: "member-4", initials: "CJ", name: "Chonchanan J.", role: "Procurement" },
];

export const demoTips: AppTip[] = [
  {
    footnote: "Note every transaction",
    id: "tip-1",
    quote: "Share the payment, don't let the need be the representative of the receipt.",
  },
  {
    footnote: "Keep approval context visible",
    id: "tip-2",
    quote: "Short explanations help teams approve faster and with fewer policy disputes.",
  },
];

export const demoDashboardSeries: DashboardSeries[] = [
  { expenses: 0, income: 0, month: "Jan", profit: 0 },
  { expenses: 6200, income: 2400, month: "Feb", profit: -3800 },
  { expenses: 7800, income: 7600, month: "Mar", profit: -200 },
  { expenses: 4300, income: 8200, month: "Apr", profit: 3900 },
  { expenses: 7100, income: 9800, month: "May", profit: 2700 },
  { expenses: 2100, income: 8200, month: "Jun", profit: 6100 },
];

export const welcomeSlides: WelcomeSlide[] = [
  {
    accent: "#6ab5ff",
    description: "Manage money with transparent approval steps and receipts that stay with the project.",
    id: "slide-1",
    title: "Money management system",
  },
  {
    accent: "#8bc2ff",
    description: "Visualize transactions, team spending, and price or policy alerts in one place.",
    id: "slide-2",
    title: "Visualize your transaction",
  },
  {
    accent: "#7aa5ff",
    description: "Create a project or join one instantly with invitation codes and shared responsibility.",
    id: "slide-3",
    title: "Do you have a project?",
  },
];

export function formatCurrency(amount: number, currency = "THB") {
  const absolute = Math.abs(amount);
  const prefix = amount < 0 ? "-" : amount > 0 ? "+" : "";
  const symbol = currency === "THB" ? "฿" : `${currency} `;

  return `${prefix}${symbol}${absolute.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}

export function formatCompactDate(isoDate: string) {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getCategoryVisual(categoryName: string) {
  const found = demoCategories.find((category) => category.name === categoryName);

  return found ?? { count: 0, icon: "ellipse-outline", id: "misc", kind: "expense" as const, name: categoryName, tint: "#9ba0aa" };
}

export function getStatusTone(status: string) {
  if (status === "APPROVED") {
    return "approved" as const;
  }

  if (status === "REJECTED") {
    return "rejected" as const;
  }

  if (status === "PENDING" || status === "PENDING_APPROVAL") {
    return "pending" as const;
  }

  return "neutral" as const;
}

export function getProjectHealth(project: AppProject) {
  if (project.budgetTotal <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((project.budgetCommitted / project.budgetTotal) * 100));
}

export function getProjectBalance(project: AppProject) {
  return project.budgetTotal - project.budgetCommitted;
}

function getMonthAnchor(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function getCategoryKindForFlow(flow: FlowKind): CategoryKind {
  return flow === "topup" ? "income" : "expense";
}

export function deriveCategories(expenses: AppExpense[]) {
  const categoryMap = new Map<string, AppCategory>();

  for (const template of demoCategories) {
    categoryMap.set(`${template.kind}:${template.name}`, { ...template, count: 0 });
  }

  for (const expense of expenses) {
    const kind = getCategoryKindForFlow(expense.flow);
    const key = `${kind}:${expense.category}`;
    const existing = categoryMap.get(key);

    if (existing) {
      existing.count += 1;
      continue;
    }

    categoryMap.set(key, {
      count: 1,
      icon: "ellipse-outline",
      id: `derived-${key}`,
      kind,
      name: expense.category,
      tint: "#9ba0aa",
    });
  }

  return Array.from(categoryMap.values()).sort((left, right) => {
    if (left.kind !== right.kind) {
      return left.kind.localeCompare(right.kind);
    }

    return right.count - left.count || left.name.localeCompare(right.name);
  });
}

export function deriveDashboardSeries(expenses: AppExpense[], projectId: string): DashboardSeries[] {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const anchor = getMonthAnchor(new Date(now.getFullYear(), now.getMonth() - (5 - index), 1));
    return {
      anchor,
      key: monthKey(anchor),
      label: monthFormatter.format(anchor),
    };
  });

  const totals = new Map(months.map((month) => [month.key, { expenses: 0, income: 0 }]));

  expenses
    .filter((expense) => expense.projectId === projectId)
    .forEach((expense) => {
      const date = new Date(expense.createdAt);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const bucket = totals.get(monthKey(getMonthAnchor(date)));

      if (!bucket) {
        return;
      }

      if (expense.flow === "topup") {
        bucket.income += expense.amount;
      } else {
        bucket.expenses += expense.amount;
      }
    });

  return months.map((month) => {
    const bucket = totals.get(month.key) ?? { expenses: 0, income: 0 };

    return {
      expenses: bucket.expenses,
      income: bucket.income,
      month: month.label,
      profit: bucket.income - bucket.expenses,
    };
  });
}

export function deriveNotifications(expenses: AppExpense[], approvals: AppApproval[], projects: AppProject[]): AppNotification[] {
  const approvalNotifications = approvals.slice(0, 4).flatMap((approval) => {
    const expense = expenses.find((item) => item.id === approval.expenseNoteId);

    if (!expense) {
      return [];
    }

    const body =
      approval.status === "APPROVED"
        ? `${expense.category} bill was approved`
        : approval.status === "REJECTED"
          ? `${expense.category} bill was rejected`
          : `${expense.category} bill is awaiting decision`;

    return [{
      amountLabel: formatCurrency(expense.flow === "topup" ? expense.amount : -expense.amount),
      body,
      createdAt: formatCompactDate(approval.createdAt),
      id: `approval-${approval.id}`,
      kind: expense.flow === "topup" ? "income" : "bills",
      name: expense.requesterName,
    } satisfies AppNotification];
  });

  const projectAlerts = projects
    .filter((project) => getProjectHealth(project) >= 70)
    .slice(0, 3)
    .map((project) => ({
      body: `has spent ${getProjectHealth(project)}% of budget right now`,
      createdAt: formatCompactDate(project.updatedAt),
      id: `project-${project.id}`,
      kind: "all" as const,
      name: project.name,
    }));

  const expenseNotifications = expenses.slice(0, 4).map((expense) => ({
    amountLabel: formatCurrency(expense.flow === "topup" ? expense.amount : -expense.amount),
    body: expense.description,
    createdAt: formatCompactDate(expense.createdAt),
    id: `expense-${expense.id}`,
    kind: (expense.flow === "topup" ? "income" : "expenses") as NotificationKind,
    name: expense.requesterName,
  }));

  return [...approvalNotifications, ...projectAlerts, ...expenseNotifications].slice(0, 8);
}

export function deriveStatementEntries(expenses: AppExpense[], projectId: string): AppStatementEntry[] {
  return expenses
    .filter((expense) => expense.projectId === projectId && expense.status !== "DRAFT")
    .map((expense) => ({
      amount: expense.flow === "topup" ? expense.amount : -expense.amount,
      createdAt: formatCompactDate(expense.createdAt),
      description: `${expense.category} / ${expense.vendorName}`,
      direction: (expense.flow === "topup" ? "IN" : "OUT") as AppStatementEntry["direction"],
      id: expense.id,
      name: expense.requesterName,
    }))
    .slice(0, 12);
}

export function deriveTeamMembers(user: AppUser, project: AppProject | undefined, expenses: AppExpense[], approvals: AppApproval[]): AppTeamMember[] {
  const teamMap = new Map<string, AppTeamMember>();

  teamMap.set(user.name, {
    id: user.id,
    initials: user.initials,
    name: user.name,
    role: user.role,
  });

  if (project) {
    teamMap.set(project.ownerName, {
      id: `owner-${project.id}`,
      initials: getInitials(project.ownerName),
      name: project.ownerName,
      role: "Project Owner",
    });
  }

  for (const expense of expenses) {
    if (project && expense.projectId !== project.id) {
      continue;
    }

    teamMap.set(expense.requesterName, {
      id: `requester-${expense.requesterName}`,
      initials: getInitials(expense.requesterName),
      name: expense.requesterName,
      role: expense.flow === "topup" ? "Contributor" : "Requester",
    });
  }

  for (const approval of approvals) {
    teamMap.set(approval.approverName, {
      id: `approver-${approval.approverName}`,
      initials: getInitials(approval.approverName),
      name: approval.approverName,
      role: "Approver",
    });
  }

  return Array.from(teamMap.values()).slice(0, Math.max(project?.memberCount ?? 0, teamMap.size));
}
