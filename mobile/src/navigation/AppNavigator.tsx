import { Ionicons } from "@expo/vector-icons";
import { startTransition, useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ApprovalInboxScreen } from "../features/approvals/screens/ApprovalInboxScreen";
import { LoginScreen } from "../features/auth/screens/LoginScreen";
import { OnboardingScreen } from "../features/auth/screens/OnboardingScreen";
import { WelcomeScreen } from "../features/auth/screens/WelcomeScreen";
import { HomeDashboardScreen } from "../features/dashboard/screens/HomeDashboardScreen";
import { BillDetailScreen } from "../features/expenses/screens/BillDetailScreen";
import { BillsScreen } from "../features/expenses/screens/BillsScreen";
import { CategoriesScreen } from "../features/expenses/screens/CategoriesScreen";
import { ExpenseComposerScreen } from "../features/expenses/screens/ExpenseComposerScreen";
import { NotificationCenterScreen } from "../features/notifications/screens/NotificationCenterScreen";
import { ProjectSetupScreen, ProjectSetupInput } from "../features/projects/screens/ProjectSetupScreen";
import { ProjectsOverviewScreen } from "../features/projects/screens/ProjectsOverviewScreen";
import { ProjectWorkspaceScreen } from "../features/projects/screens/ProjectWorkspaceScreen";
import { ReportsScreen } from "../features/reports/screens/ReportsScreen";
import { SettingsScreen } from "../features/settings/screens/SettingsScreen";
import { StatementScreen } from "../features/statement/screens/StatementScreen";
import {
  BackendApproval,
  BackendBudget,
  BackendExpense,
  BackendProject,
  createExpense,
  createProject,
  decideApproval,
  getProjectBudget,
  listApprovals,
  listExpenses,
  listProjects,
  submitExpense,
  upsertProjectBudget,
} from "../services/api/apiClient";
import { InfoBanner } from "../shared/components/ui";
import { tokens } from "../shared/theme/tokens";
import {
  AppApproval,
  AppCategory,
  AppExpense,
  AppProject,
  AppTab,
  CategoryKind,
  demoApprovals,
  demoExpenses,
  demoProjects,
  demoTips,
  demoUser,
  deriveCategories,
  deriveDashboardSeries,
  deriveNotifications,
  deriveStatementEntries,
  deriveTeamMembers,
  getInitials,
  welcomeSlides,
} from "../store/appStore";

type OverlayRoute =
  | null
  | { key: "project-create" }
  | { key: "project-workspace"; projectId: string }
  | { key: "expense-compose"; projectId: string }
  | { key: "expense-detail"; expenseId: string }
  | { key: "dashboard"; projectId: string }
  | { key: "notifications" }
  | { key: "statement" }
  | { key: "categories"; kind: CategoryKind };

const tabConfig: Array<{ key: AppTab; icon: keyof typeof Ionicons.glyphMap; label: string }> = [
  { icon: "home", key: "home", label: "Home" },
  { icon: "briefcase", key: "projects", label: "Projects" },
  { icon: "receipt", key: "bills", label: "Bills" },
  { icon: "checkmark-done", key: "approvals", label: "Approvals" },
  { icon: "settings", key: "settings", label: "Setting" },
];

function sortByDateDesc<T extends { createdAt: string }>(items: T[]) {
  return [...items].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

function buildInvitationCode(name: string) {
  const sanitized = name.replace(/[^a-z0-9]/gi, "").toUpperCase();
  return (sanitized || "CACHEC").slice(0, 6).padEnd(6, "X");
}

function mapBackendProjects(rawProjects: BackendProject[], budgets: Array<BackendBudget | null>, existingProjects: AppProject[]) {
  if (rawProjects.length === 0) {
    return existingProjects;
  }

  return rawProjects.map((project) => {
    const existing = existingProjects.find((item) => item.id === project.id);
    const budget = budgets.find((item) => item && item.projectId === project.id) ?? null;

    return {
      budgetCommitted: budget?.committedAmount ?? existing?.budgetCommitted ?? 0,
      budgetTotal: budget?.totalAmount ?? existing?.budgetTotal ?? 0,
      businessModel: existing?.businessModel ?? "Business",
      description: existing?.description ?? "Shared finance workspace with approvals, receipts, and alerts.",
      id: project.id,
      invitationCode: existing?.invitationCode ?? buildInvitationCode(project.name),
      memberCount: project.memberCount,
      name: project.name,
      ownerName: project.ownerName,
      status: project.status,
      updatedAt: project.updatedAt,
    } satisfies AppProject;
  });
}

function mapBackendApprovals(rawApprovals: BackendApproval[]) {
  return sortByDateDesc(
    rawApprovals.map((approval) => ({
      approverName: approval.approverName,
      comment: approval.comment,
      createdAt: approval.createdAt,
      decidedAt: approval.decidedAt,
      expenseNoteId: approval.expenseNoteId,
      id: approval.id,
      level: approval.level,
      status: approval.status,
    }))
  );
}

function mapBackendExpenses(rawExpenses: BackendExpense[], rawApprovals: BackendApproval[], existingExpenses: AppExpense[]) {
  const mapped = rawExpenses.map((expense) => {
    const existing = existingExpenses.find((item) => item.id === expense.id);
    const currentApproval = rawApprovals.find((approval) => approval.expenseNoteId === expense.id && approval.status === "PENDING");

    return {
      amount: expense.amount,
      approverName: currentApproval?.approverName ?? existing?.approverName ?? "Finance Reviewer",
      attachments: existing?.attachments ?? ["receipt-auto.jpg"],
      category: expense.category,
      createdAt: expense.createdAt,
      currency: expense.currency,
      description: expense.description,
      flow: existing?.flow ?? "withdraw",
      id: expense.id,
      policySignal: expense.policySignal,
      priceSignal: expense.priceSignal,
      projectId: expense.projectId,
      requesterName: expense.requesterName,
      status: expense.status === "SUBMITTED" ? "PENDING_APPROVAL" : expense.status,
      vendorName: expense.vendorName ?? existing?.vendorName ?? "Unknown vendor",
    } satisfies AppExpense;
  });

  const topups = existingExpenses.filter((expense) => expense.flow === "topup" && !mapped.some((item) => item.id === expense.id));

  return sortByDateDesc([...mapped, ...topups]);
}

export function AppNavigator() {
  const [authStage, setAuthStage] = useState<"welcome" | "tour" | "auth" | "app">("welcome");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [overlay, setOverlay] = useState<OverlayRoute>(null);
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [busyState, setBusyState] = useState<"auth" | "sync" | "project" | "expense" | "approval" | null>(null);
  const [tourIndex, setTourIndex] = useState(0);
  const [syncTone, setSyncTone] = useState<"info" | "success" | "warning">("info");
  const [syncMessage, setSyncMessage] = useState<string | null>("Syncing live backend if available");
  const [appData, setAppData] = useState({
    approvals: demoApprovals,
    expenses: demoExpenses,
    projects: demoProjects,
    tips: demoTips,
    user: demoUser,
    currentProjectId: demoProjects[0].id,
  });

  useEffect(() => {
    void refreshFromBackend();
  }, []);

  const currentProject = appData.projects.find((project) => project.id === appData.currentProjectId) ?? appData.projects[0];
  const selectedOverlayProjectId = overlay && "projectId" in overlay ? overlay.projectId : currentProject?.id;
  const selectedProject = appData.projects.find((project) => project.id === selectedOverlayProjectId) ?? currentProject;
  const selectedExpense = overlay && overlay.key === "expense-detail" ? appData.expenses.find((expense) => expense.id === overlay.expenseId) : undefined;
  const selectedApproval = selectedExpense
    ? appData.approvals.find((approval) => approval.expenseNoteId === selectedExpense.id && approval.status === "PENDING") ??
      appData.approvals.find((approval) => approval.expenseNoteId === selectedExpense.id)
    : undefined;
  const derivedCategories = deriveCategories(appData.expenses);
  const derivedDashboardSeries = currentProject ? deriveDashboardSeries(appData.expenses, currentProject.id) : [];
  const derivedNotifications = deriveNotifications(appData.expenses, appData.approvals, appData.projects);
  const derivedStatement = currentProject ? deriveStatementEntries(appData.expenses, currentProject.id) : [];
  const derivedTeam = deriveTeamMembers(appData.user, selectedProject, appData.expenses, appData.approvals);

  async function refreshFromBackend() {
    setBusyState("sync");

    try {
      const rawProjects = await listProjects();
      const [rawExpenses, rawApprovals] = await Promise.all([listExpenses(), listApprovals()]);
      const budgets = await Promise.all(rawProjects.map((project) => getProjectBudget(project.id).catch(() => null)));

      startTransition(() => {
        setAppData((current) => {
          const projects = mapBackendProjects(rawProjects, budgets, current.projects);
          const expenses = mapBackendExpenses(rawExpenses, rawApprovals, current.expenses);
          const approvals = mapBackendApprovals(rawApprovals);
          const nextProjectId = projects.find((project) => project.id === current.currentProjectId)?.id ?? projects[0]?.id ?? current.currentProjectId;

          return {
            ...current,
            approvals,
            expenses,
            projects,
            currentProjectId: nextProjectId,
          };
        });
        setSyncMessage("Live data synced from backend");
        setSyncTone("success");
      });
    } catch {
      setSyncMessage("Using demo dataset while backend is unavailable from this device");
      setSyncTone("warning");
    } finally {
      setBusyState(null);
    }
  }

  function selectProject(projectId: string) {
    startTransition(() => {
      setAppData((current) => ({
        ...current,
        currentProjectId: projectId,
      }));
    });
  }

  function openProject(projectId: string) {
    selectProject(projectId);
    setOverlay({ key: "project-workspace", projectId });
  }

  async function handleCreateProject(input: ProjectSetupInput) {
    setBusyState("project");

    try {
      const createdProject = await createProject({
        memberCount: input.memberCount,
        name: input.name,
        organizationId: "cachecash-org",
        ownerId: appData.user.id,
        ownerName: appData.user.name,
      });

      await upsertProjectBudget(createdProject.id, {
        allocatedAmount: input.budgetTotal,
        committedAmount: 0,
        currency: "THB",
        totalAmount: input.budgetTotal,
      });

      const projectRecord: AppProject = {
        budgetCommitted: 0,
        budgetTotal: input.budgetTotal,
        businessModel: input.businessModel,
        description: input.description,
        id: createdProject.id,
        invitationCode: buildInvitationCode(input.name),
        memberCount: input.memberCount,
        name: createdProject.name,
        ownerName: createdProject.ownerName,
        status: createdProject.status,
        updatedAt: createdProject.updatedAt,
      };

      startTransition(() => {
        setAppData((current) => ({
          ...current,
          currentProjectId: projectRecord.id,
          projects: [projectRecord, ...current.projects.filter((project) => project.id !== projectRecord.id)],
        }));
      });

      setSyncMessage("Project created in backend and added to workspace");
      setSyncTone("success");
      setOverlay({ key: "project-workspace", projectId: projectRecord.id });
      void refreshFromBackend();
    } catch {
      const localProject: AppProject = {
        budgetCommitted: 0,
        budgetTotal: input.budgetTotal,
        businessModel: input.businessModel,
        description: input.description,
        id: `local-project-${Date.now()}`,
        invitationCode: buildInvitationCode(input.name),
        memberCount: input.memberCount,
        name: input.name,
        ownerName: appData.user.name,
        status: "ACTIVE",
        updatedAt: new Date().toISOString(),
      };

      startTransition(() => {
        setAppData((current) => ({
          ...current,
          currentProjectId: localProject.id,
          projects: [localProject, ...current.projects],
        }));
      });

      setSyncMessage("Project saved locally because backend was unreachable");
      setSyncTone("warning");
      setOverlay({ key: "project-workspace", projectId: localProject.id });
    } finally {
      setBusyState(null);
    }
  }

  async function handleSaveExpense(input: {
    amount: number;
    approverName: string;
    category: string;
    description: string;
    projectId: string;
    requesterName: string;
    vendorName: string;
  }, submitNow: boolean) {
    setBusyState("expense");

    try {
      const createdExpense = await createExpense({
        amount: input.amount,
        category: input.category,
        currency: "THB",
        description: input.description,
        projectId: input.projectId,
        requesterId: appData.user.id,
        requesterName: input.requesterName,
        vendorName: input.vendorName,
      });

      let approvalRecord: AppApproval | undefined;
      let expenseStatus: AppExpense["status"] = createdExpense.status === "SUBMITTED" ? "PENDING_APPROVAL" : createdExpense.status;

      if (submitNow) {
        const submitted = await submitExpense(createdExpense.id, {
          approverName: input.approverName,
        });

        approvalRecord = {
          approverName: submitted.approval.approverName,
          comment: submitted.approval.comment,
          createdAt: submitted.approval.createdAt,
          decidedAt: submitted.approval.decidedAt,
          expenseNoteId: createdExpense.id,
          id: submitted.approval.id,
          level: submitted.approval.level,
          status: submitted.approval.status,
        };
        expenseStatus = "PENDING_APPROVAL";
      }

      const expenseRecord: AppExpense = {
        amount: createdExpense.amount,
        approverName: input.approverName,
        attachments: ["receipt-uploaded.jpg"],
        category: createdExpense.category,
        createdAt: createdExpense.createdAt,
        currency: createdExpense.currency,
        description: createdExpense.description,
        flow: "withdraw",
        id: createdExpense.id,
        policySignal: createdExpense.policySignal,
        priceSignal: createdExpense.priceSignal,
        projectId: createdExpense.projectId,
        requesterName: createdExpense.requesterName,
        status: expenseStatus,
        vendorName: createdExpense.vendorName ?? input.vendorName,
      };

      startTransition(() => {
        setAppData((current) => ({
          ...current,
          approvals: approvalRecord ? [approvalRecord, ...current.approvals] : current.approvals,
          currentProjectId: input.projectId,
          expenses: [expenseRecord, ...current.expenses.filter((expense) => expense.id !== expenseRecord.id)],
        }));
      });

      setActiveTab("bills");
      setOverlay({ key: "expense-detail", expenseId: expenseRecord.id });
      setSyncMessage(submitNow ? "Expense created and submitted for approval" : "Expense draft created in backend");
      setSyncTone("success");
      void refreshFromBackend();
    } catch {
      const localExpenseId = `local-expense-${Date.now()}`;
      const createdAt = new Date().toISOString();
      const localExpense: AppExpense = {
        amount: input.amount,
        approverName: input.approverName,
        attachments: ["receipt-uploaded.jpg"],
        category: input.category,
        createdAt,
        currency: "THB",
        description: input.description,
        flow: "withdraw",
        id: localExpenseId,
        policySignal: "WARNING",
        priceSignal: "PASS",
        projectId: input.projectId,
        requesterName: input.requesterName,
        status: submitNow ? "PENDING_APPROVAL" : "DRAFT",
        vendorName: input.vendorName,
      };

      const localApproval: AppApproval | undefined = submitNow
        ? {
            approverName: input.approverName,
            comment: null,
            createdAt,
            decidedAt: null,
            expenseNoteId: localExpenseId,
            id: `local-approval-${Date.now()}`,
            level: 1,
            status: "PENDING",
          }
        : undefined;

      startTransition(() => {
        setAppData((current) => ({
          ...current,
          approvals: localApproval ? [localApproval, ...current.approvals] : current.approvals,
          currentProjectId: input.projectId,
          expenses: [localExpense, ...current.expenses],
        }));
      });

      setActiveTab("bills");
      setOverlay({ key: "expense-detail", expenseId: localExpense.id });
      setSyncMessage(submitNow ? "Expense stored locally in demo mode" : "Draft stored locally in demo mode");
      setSyncTone("warning");
    } finally {
      setBusyState(null);
    }
  }

  async function handleDecision(action: "APPROVE" | "REJECT") {
    if (!selectedExpense || !selectedApproval) {
      return;
    }

    setBusyState("approval");

    const decidedAt = new Date().toISOString();

    const applyLocalDecision = () => {
      startTransition(() => {
        setAppData((current) => ({
          ...current,
          approvals: current.approvals.map((approval) =>
            approval.id === selectedApproval.id
              ? {
                  ...approval,
                  comment: action === "REJECT" ? "Rejected from mobile" : "Approved from mobile",
                  decidedAt,
                  status: action === "APPROVE" ? "APPROVED" : "REJECTED",
                }
              : approval
          ),
          expenses: current.expenses.map((expense) =>
            expense.id === selectedExpense.id
              ? { ...expense, status: action === "APPROVE" ? "APPROVED" : "REJECTED" }
              : expense
          ),
          projects: current.projects.map((project) =>
            action === "APPROVE" && project.id === selectedExpense.projectId
              ? { ...project, budgetCommitted: project.budgetCommitted + selectedExpense.amount }
              : project
          ),
        }));
      });
    };

    try {
      await decideApproval(selectedApproval.id, {
        action,
        comment: action === "REJECT" ? "Rejected from mobile" : "Approved from mobile",
      });

      applyLocalDecision();
      setSyncMessage(action === "APPROVE" ? "Approval completed in backend" : "Expense rejected in backend");
      setSyncTone("success");
      setOverlay(null);
      setActiveTab("approvals");
      void refreshFromBackend();
    } catch {
      applyLocalDecision();
      setSyncMessage("Decision saved locally because backend was unreachable");
      setSyncTone("warning");
      setOverlay(null);
      setActiveTab("approvals");
    } finally {
      setBusyState(null);
    }
  }

  function renderAuth() {
    if (authStage === "welcome") {
      return <WelcomeScreen onBeginTour={() => setAuthStage("tour")} onLogin={() => setAuthStage("auth")} />;
    }

    if (authStage === "tour") {
      const slide = welcomeSlides[tourIndex];
      const isLast = tourIndex === welcomeSlides.length - 1;

      return (
        <OnboardingScreen
          index={tourIndex}
          isLast={isLast}
          onNext={() => {
            if (isLast) {
              setAuthStage("auth");
              return;
            }

            setTourIndex((current) => current + 1);
          }}
          onSkip={() => setAuthStage("auth")}
          slide={slide}
          total={welcomeSlides.length}
        />
      );
    }

    return (
      <LoginScreen
        busy={busyState === "auth"}
        mode={authMode}
        onSubmit={() => {
          setBusyState("auth");
          startTransition(() => {
            setAuthStage("app");
            setBusyState(null);
            setSyncMessage("Signed in with mobile demo identity");
            setSyncTone("info");
          });
        }}
        onToggleMode={() => setAuthMode((current) => (current === "login" ? "signup" : "login"))}
      />
    );
  }

  function renderOverlay() {
    if (!overlay) {
      return null;
    }

    if (overlay.key === "project-create") {
      return <ProjectSetupScreen busy={busyState === "project"} onBack={() => setOverlay(null)} onSubmit={handleCreateProject} />;
    }

    if (overlay.key === "project-workspace" && selectedProject) {
      return (
        <ProjectWorkspaceScreen
          expenses={appData.expenses}
          members={derivedTeam}
          onBack={() => setOverlay(null)}
          onCreateExpense={() => setOverlay({ key: "expense-compose", projectId: selectedProject.id })}
          onOpenDashboard={() => setOverlay({ key: "dashboard", projectId: selectedProject.id })}
          project={selectedProject}
        />
      );
    }

    if (overlay.key === "expense-compose") {
      return (
        <ExpenseComposerScreen
          busy={busyState === "expense"}
          defaultProjectId={overlay.projectId}
          onBack={() => setOverlay(null)}
          onSaveDraft={(payload) => void handleSaveExpense(payload, false)}
          onSubmitApproval={(payload) => void handleSaveExpense(payload, true)}
          projects={appData.projects}
        />
      );
    }

    if (overlay.key === "expense-detail" && selectedExpense) {
      return (
        <BillDetailScreen
          approval={selectedApproval}
          busy={busyState === "approval"}
          expense={selectedExpense}
          onApprove={() => void handleDecision("APPROVE")}
          onBack={() => setOverlay(null)}
          onReject={() => void handleDecision("REJECT")}
          project={appData.projects.find((project) => project.id === selectedExpense.projectId)}
        />
      );
    }

    if (overlay.key === "dashboard" && selectedProject) {
      return (
        <ReportsScreen
          categories={derivedCategories}
          expenses={appData.expenses}
          onBack={() => setOverlay(null)}
          onOpenCategories={(kind) => setOverlay({ key: "categories", kind })}
          project={selectedProject}
          series={derivedDashboardSeries}
        />
      );
    }

    if (overlay.key === "notifications") {
      return <NotificationCenterScreen notifications={derivedNotifications} onBack={() => setOverlay(null)} />;
    }

    if (overlay.key === "statement") {
      return <StatementScreen entries={derivedStatement} onBack={() => setOverlay(null)} />;
    }

    if (overlay.key === "categories") {
      return <CategoriesScreen categories={derivedCategories as AppCategory[]} initialKind={overlay.kind} onBack={() => setOverlay(null)} />;
    }

    return null;
  }

  function renderTabContent() {
    if (!currentProject) {
      return null;
    }

    if (activeTab === "home") {
      return (
        <HomeDashboardScreen
          currentProject={currentProject}
          expenses={appData.expenses}
          onCreateBill={() => setOverlay({ key: "expense-compose", projectId: currentProject.id })}
          onOpenApprovals={() => setActiveTab("approvals")}
          onOpenBills={() => setActiveTab("bills")}
          onOpenDashboard={() => setOverlay({ key: "dashboard", projectId: currentProject.id })}
          onOpenNotifications={() => setOverlay({ key: "notifications" })}
          onOpenProject={openProject}
          onOpenProjects={() => setActiveTab("projects")}
          onOpenStatement={() => setOverlay({ key: "statement" })}
          projects={appData.projects}
          syncMessage={syncMessage}
          syncTone={syncTone}
          tips={appData.tips}
          user={appData.user}
        />
      );
    }

    if (activeTab === "projects") {
      return (
        <ProjectsOverviewScreen
          onCreateProject={() => setOverlay({ key: "project-create" })}
          onOpenProject={openProject}
          onSelectProject={selectProject}
          projects={appData.projects}
          selectedProjectId={currentProject.id}
        />
      );
    }

    if (activeTab === "bills") {
      return (
        <BillsScreen
          currentProject={currentProject}
          expenses={appData.expenses}
          onCreateExpense={() => setOverlay({ key: "expense-compose", projectId: currentProject.id })}
          onOpenCategories={(kind) => setOverlay({ key: "categories", kind })}
          onOpenExpense={(expenseId) => setOverlay({ key: "expense-detail", expenseId })}
        />
      );
    }

    if (activeTab === "approvals") {
      return <ApprovalInboxScreen approvals={appData.approvals} expenses={appData.expenses} onOpenExpense={(expenseId) => setOverlay({ key: "expense-detail", expenseId })} />;
    }

    return (
      <SettingsScreen
        onOpenCategories={() => setOverlay({ key: "categories", kind: "expense" })}
        onOpenNotifications={() => setOverlay({ key: "notifications" })}
        onOpenStatement={() => setOverlay({ key: "statement" })}
        user={appData.user}
      />
    );
  }

  if (authStage !== "app") {
    return renderAuth();
  }

  if (overlay) {
    return renderOverlay();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {activeTab !== "home" && syncMessage ? (
          <View style={styles.bannerWrap}>
            <InfoBanner text={syncMessage} tone={syncTone} />
          </View>
        ) : null}
        <View style={styles.tabContent}>{renderTabContent()}</View>
      </View>

      <View style={styles.tabBar}>
        {tabConfig.map((tab) => {
          const active = tab.key === activeTab;

          return (
            <Pressable key={tab.key} onPress={() => setActiveTab(tab.key)} style={styles.tabButton}>
              <Ionicons color={active ? tokens.colors.primary : tokens.colors.text} name={tab.icon} size={26} />
              <Text style={[styles.tabLabel, active ? styles.tabLabelActive : null]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bannerWrap: {
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
  },
  container: {
    backgroundColor: tokens.colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    alignItems: "center",
    backgroundColor: tokens.colors.card,
    borderTopColor: tokens.colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: tokens.spacing.sm,
    paddingTop: tokens.spacing.sm,
    ...tokens.shadow.card,
  },
  tabButton: {
    alignItems: "center",
    gap: tokens.spacing.xxs,
    minWidth: 62,
  },
  tabContent: {
    flex: 1,
  },
  tabLabel: {
    color: tokens.colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  tabLabelActive: {
    color: tokens.colors.primary,
  },
});
