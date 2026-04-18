import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen, Avatar, PrimaryButton, SegmentedControl, SurfaceCard } from "../../../shared/components/ui";
import { AppExpense, AppProject, AppTeamMember, formatCurrency, getInitials, getProjectBalance, getProjectHealth } from "../../../store/appStore";
import { tokens } from "../../../shared/theme/tokens";

type ProjectWorkspaceScreenProps = {
  expenses: AppExpense[];
  members: AppTeamMember[];
  onBack: () => void;
  onCreateExpense: () => void;
  onOpenDashboard: () => void;
  project: AppProject;
};

export function ProjectWorkspaceScreen({ expenses, members, onBack, onCreateExpense, onOpenDashboard, project }: ProjectWorkspaceScreenProps) {
  const [tab, setTab] = useState<"notes" | "members" | "activity">("notes");
  const projectExpenses = expenses.filter((expense) => expense.projectId === project.id);

  return (
    <AppScreen
      footer={
        <View style={styles.footerRow}>
          <PrimaryButton label="Create Expense" onPress={onCreateExpense} variant="secondary" />
          <PrimaryButton label="Open Dashboard" onPress={onOpenDashboard} />
        </View>
      }
      onBack={onBack}
      subtitle={`${project.memberCount} members`}
      title={project.name}
    >
      <SurfaceCard style={styles.summaryCard}>
        <Text style={styles.summaryValue}>{getProjectHealth(project)}%</Text>
        <Text style={styles.summaryLabel}>All spending from this project budget</Text>
        <View style={styles.metricRow}>
          <View>
            <Text style={styles.metricTitle}>Budget</Text>
            <Text style={styles.metricValue}>{formatCurrency(project.budgetTotal).replace("+", "")}</Text>
          </View>
          <View>
            <Text style={styles.metricTitle}>Balance</Text>
            <Text style={styles.metricValue}>{formatCurrency(getProjectBalance(project)).replace("+", "")}</Text>
          </View>
        </View>
      </SurfaceCard>

      <SegmentedControl
        onSelect={setTab}
        options={[
          { key: "notes", label: "Notes" },
          { key: "members", label: "Members" },
          { key: "activity", label: "Activity" },
        ]}
        selected={tab}
      />

      {tab === "notes" ? (
        <View style={styles.stack}>
          {projectExpenses.slice(0, 4).map((expense) => (
            <SurfaceCard key={expense.id} style={styles.rowCard}>
              <View>
                <Text style={styles.rowTitle}>{expense.description}</Text>
                <Text style={styles.rowMeta}>{expense.category}</Text>
              </View>
              <Text style={styles.rowAmount}>{formatCurrency(-expense.amount)}</Text>
            </SurfaceCard>
          ))}
        </View>
      ) : null}

      {tab === "members" ? (
        <View style={styles.stack}>
          {members.map((member) => (
            <SurfaceCard key={member.id} style={styles.memberRow}>
              <Avatar initials={member.initials || getInitials(member.name)} size={48} />
              <View>
                <Text style={styles.rowTitle}>{member.name}</Text>
                <Text style={styles.rowMeta}>{member.role}</Text>
              </View>
            </SurfaceCard>
          ))}
        </View>
      ) : null}

      {tab === "activity" ? (
        <View style={styles.stack}>
          {projectExpenses.slice(0, 4).map((expense) => (
            <Pressable key={expense.id}>
              <SurfaceCard>
                <Text style={styles.rowTitle}>{expense.requesterName}</Text>
                <Text style={styles.rowMeta}>{expense.status} • {expense.vendorName}</Text>
              </SurfaceCard>
            </Pressable>
          ))}
        </View>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: "row",
    gap: tokens.spacing.md,
  },
  memberRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: tokens.spacing.sm,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricTitle: {
    color: tokens.colors.muted,
    fontSize: 14,
  },
  metricValue: {
    color: tokens.colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  rowAmount: {
    color: tokens.colors.dangerText,
    fontSize: 18,
    fontWeight: "900",
  },
  rowCard: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowMeta: {
    color: tokens.colors.muted,
    fontSize: 14,
  },
  rowTitle: {
    color: tokens.colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  stack: {
    gap: tokens.spacing.sm,
  },
  summaryCard: {
    gap: tokens.spacing.md,
  },
  summaryLabel: {
    color: tokens.colors.muted,
    fontSize: 16,
    fontWeight: "700",
  },
  summaryValue: {
    color: tokens.colors.text,
    fontSize: 48,
    fontWeight: "900",
  },
});
