import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar, BottomSheet, IconBubble, InfoBanner, PrimaryButton, SectionTitle, SurfaceCard } from "../../../shared/components/ui";
import { tokens } from "../../../shared/theme/tokens";
import { AppExpense, AppProject, AppTip, AppUser, formatCompactDate, formatCurrency, getInitials, getProjectBalance, getProjectHealth } from "../../../store/appStore";

type HomeDashboardScreenProps = {
  currentProject: AppProject;
  expenses: AppExpense[];
  projects: AppProject[];
  syncMessage: string | null;
  syncTone: "info" | "success" | "warning";
  tips: AppTip[];
  user: AppUser;
  onCreateBill: () => void;
  onOpenApprovals: () => void;
  onOpenBills: () => void;
  onOpenDashboard: () => void;
  onOpenNotifications: () => void;
  onOpenProjects: () => void;
  onOpenStatement: () => void;
  onOpenProject: (projectId: string) => void;
};

const quickActions = [
  { icon: "receipt-outline", key: "bills", label: "Bills" },
  { icon: "stats-chart-outline", key: "dashboard", label: "Dashboard" },
  { icon: "document-text-outline", key: "statement", label: "Statement" },
  { icon: "checkmark-done-outline", key: "approvals", label: "Approvals" },
] as const;

export function HomeDashboardScreen({
  currentProject,
  expenses,
  onCreateBill,
  onOpenApprovals,
  onOpenBills,
  onOpenDashboard,
  onOpenNotifications,
  onOpenProject,
  onOpenProjects,
  onOpenStatement,
  projects,
  syncMessage,
  syncTone,
  tips,
  user,
}: HomeDashboardScreenProps) {
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const health = getProjectHealth(currentProject);
  const projectExpenses = expenses.filter((expense) => expense.projectId === currentProject.id && expense.flow === "withdraw");
  const pendingCount = projectExpenses.filter((expense) => expense.status === "PENDING_APPROVAL").length;

  function handleQuickAction(key: (typeof quickActions)[number]["key"]) {
    if (key === "approvals") {
      onOpenApprovals();
      return;
    }

    if (key === "dashboard") {
      onOpenDashboard();
      return;
    }

    if (key === "statement") {
      onOpenStatement();
      return;
    }

    onOpenBills();
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => setSwitcherOpen(true)} style={styles.identityRow}>
            <Avatar initials={user.initials} size={54} />
            <View>
              <Text style={styles.projectName}>{currentProject.name}</Text>
              <Text style={styles.welcomeText}>welcome back to CacheCash</Text>
            </View>
            <Ionicons color={tokens.colors.white} name="chevron-down" size={16} />
          </Pressable>
          <Pressable onPress={onOpenNotifications} style={styles.notificationButton}>
            <Ionicons color={tokens.colors.white} name="notifications" size={22} />
            <View style={styles.badgeDot} />
          </Pressable>
        </View>

        {syncMessage ? <InfoBanner text={syncMessage} tone={syncTone} /> : null}

        <SurfaceCard style={styles.heroShell}>
          <LinearGradient colors={[tokens.colors.hero, "#276ef6", tokens.colors.heroAccent]} style={styles.heroCard}>
            <Text style={styles.heroLabel}>Available Balance</Text>
            <Text style={styles.heroAmount}>{formatCurrency(getProjectBalance(currentProject)).replace("+", "")}</Text>
            <View style={styles.heroMetaRow}>
              <View style={styles.metaCard}>
                <Text style={styles.metaTitle}>Budget</Text>
                <Text style={styles.metaValue}>{formatCurrency(currentProject.budgetTotal).replace("+", "")}</Text>
              </View>
              <View style={styles.metaCard}>
                <Text style={styles.metaTitle}>Total used</Text>
                <Text style={[styles.metaValue, { color: "#ff7f7f" }]}>{formatCurrency(-currentProject.budgetCommitted)}</Text>
              </View>
            </View>
            <Text style={styles.heroFooter}>{formatCompactDate(currentProject.updatedAt)}</Text>
          </LinearGradient>
        </SurfaceCard>

        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <Pressable key={action.key} onPress={() => handleQuickAction(action.key)} style={styles.quickCard}>
              <IconBubble backgroundColor={tokens.colors.surfaceMuted} color={tokens.colors.primary} icon={action.icon} />
              <Text style={styles.quickLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <SectionTitle action={<Pressable onPress={onOpenProjects}><Text style={styles.linkText}>See all</Text></Pressable>} title="Project snapshot" />
        <SurfaceCard>
          <View style={styles.metricRow}>
            <View>
              <Text style={styles.metricValue}>{health}%</Text>
              <Text style={styles.metricLabel}>budget utilized</Text>
            </View>
            <View>
              <Text style={styles.metricValue}>{pendingCount}</Text>
              <Text style={styles.metricLabel}>pending approvals</Text>
            </View>
            <View>
              <Text style={styles.metricValue}>{projectExpenses.length}</Text>
              <Text style={styles.metricLabel}>expense notes</Text>
            </View>
          </View>
        </SurfaceCard>

        <SectionTitle action={<PrimaryButton label="Create Bill" onPress={onCreateBill} variant="secondary" />} title="Recent bills" />
        <View style={styles.stack}>
          {projectExpenses.slice(0, 3).map((expense) => (
            <Pressable key={expense.id} onPress={onOpenBills}>
              <SurfaceCard style={styles.expenseRowCard}>
                <View style={styles.expenseRowLeading}>
                  <Avatar initials={getInitials(expense.requesterName)} size={44} />
                  <View style={styles.expenseCopy}>
                    <Text style={styles.expenseName}>{expense.requesterName}</Text>
                    <Text style={styles.expenseMeta}>{expense.category}</Text>
                  </View>
                </View>
                <View style={styles.expenseAmountWrap}>
                  <Text style={styles.expenseAmount}>{formatCurrency(-expense.amount)}</Text>
                  <Text style={styles.expenseMeta}>{formatCompactDate(expense.createdAt)}</Text>
                </View>
              </SurfaceCard>
            </Pressable>
          ))}
        </View>

        <SectionTitle title="Tips" />
        {tips.map((tip) => (
          <LinearGradient key={tip.id} colors={["#85bff1", "#c7e5ff"]} style={styles.tipCard}>
            <Text style={styles.tipQuote}>{tip.quote}</Text>
            <Text style={styles.tipFootnote}>{tip.footnote}</Text>
          </LinearGradient>
        ))}
      </ScrollView>

      <BottomSheet
        onClose={() => setSwitcherOpen(false)}
        rightAction={<PrimaryButton label="Projects" onPress={onOpenProjects} variant="ghost" />}
        title="Recent Projects"
        visible={switcherOpen}
      >
        {projects.map((project) => (
          <Pressable key={project.id} onPress={() => {
            setSwitcherOpen(false);
            onOpenProject(project.id);
          }} style={styles.projectSwitchRow}>
            <Avatar initials={getInitials(project.name)} size={44} />
            <View style={styles.switchCopy}>
              <Text style={styles.switchTitle}>{project.name}</Text>
              <Text style={styles.switchSubtitle}>{project.memberCount} members</Text>
            </View>
            {project.id === currentProject.id ? <Ionicons color={tokens.colors.primary} name="checkmark-circle" size={22} /> : null}
          </Pressable>
        ))}
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  badgeDot: {
    backgroundColor: "#ff4560",
    borderRadius: tokens.radius.pill,
    height: 12,
    position: "absolute",
    right: 8,
    top: 8,
    width: 12,
  },
  container: {
    backgroundColor: tokens.colors.background,
    gap: tokens.spacing.lg,
    paddingBottom: 120,
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.lg,
  },
  expenseAmount: {
    color: tokens.colors.dangerText,
    fontSize: 17,
    fontWeight: "900",
  },
  expenseAmountWrap: {
    alignItems: "flex-end",
  },
  expenseCopy: {
    gap: tokens.spacing.xxs,
  },
  expenseMeta: {
    color: tokens.colors.muted,
    fontSize: 13,
  },
  expenseName: {
    color: tokens.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  expenseRowCard: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expenseRowLeading: {
    alignItems: "center",
    flexDirection: "row",
    gap: tokens.spacing.sm,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroAmount: {
    color: tokens.colors.white,
    fontSize: 52,
    fontWeight: "900",
  },
  heroCard: {
    borderRadius: tokens.radius.xl,
    gap: tokens.spacing.md,
    padding: tokens.spacing.lg,
  },
  heroFooter: {
    alignSelf: "flex-end",
    color: tokens.colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  heroLabel: {
    color: tokens.colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  heroMetaRow: {
    flexDirection: "row",
    gap: tokens.spacing.md,
  },
  heroShell: {
    backgroundColor: tokens.colors.card,
    padding: tokens.spacing.sm,
  },
  identityRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: tokens.spacing.sm,
  },
  linkText: {
    color: tokens.colors.primaryDeep,
    fontSize: 14,
    fontWeight: "800",
  },
  metaCard: {
    backgroundColor: tokens.colors.white,
    borderRadius: tokens.radius.lg,
    flex: 1,
    gap: tokens.spacing.xxs,
    padding: tokens.spacing.md,
  },
  metaTitle: {
    color: tokens.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  metaValue: {
    color: tokens.colors.successText,
    fontSize: 18,
    fontWeight: "900",
  },
  metricLabel: {
    color: tokens.colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricValue: {
    color: tokens.colors.primary,
    fontSize: 28,
    fontWeight: "900",
  },
  notificationButton: {
    alignItems: "center",
    backgroundColor: tokens.colors.primaryDeep,
    borderRadius: tokens.radius.pill,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  projectName: {
    color: tokens.colors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  projectSwitchRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
  },
  quickCard: {
    alignItems: "center",
    backgroundColor: "#edf4fb",
    borderRadius: tokens.radius.lg,
    gap: tokens.spacing.sm,
    minHeight: 118,
    justifyContent: "center",
    padding: tokens.spacing.md,
    width: "48%",
    ...tokens.shadow.card,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.spacing.md,
    justifyContent: "space-between",
  },
  quickLabel: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  stack: {
    gap: tokens.spacing.sm,
  },
  switchCopy: {
    flex: 1,
    gap: tokens.spacing.xxs,
  },
  switchSubtitle: {
    color: tokens.colors.muted,
    fontSize: 13,
  },
  switchTitle: {
    color: tokens.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  tipCard: {
    borderRadius: tokens.radius.xl,
    gap: tokens.spacing.md,
    padding: tokens.spacing.lg,
  },
  tipFootnote: {
    color: tokens.colors.hero,
    fontSize: 18,
    fontWeight: "800",
  },
  tipQuote: {
    color: tokens.colors.hero,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 38,
  },
  welcomeText: {
    color: tokens.colors.muted,
    fontSize: 15,
    fontWeight: "700",
  },
});
