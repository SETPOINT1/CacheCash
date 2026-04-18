import { StyleSheet, Text, View } from "react-native";
import { AppScreen, PrimaryButton, StatusPill, SurfaceCard } from "../../../shared/components/ui";
import { AppApproval, AppExpense, AppProject, formatCompactDate, formatCurrency, getCategoryVisual, getStatusTone } from "../../../store/appStore";
import { tokens } from "../../../shared/theme/tokens";

type BillDetailScreenProps = {
  approval?: AppApproval;
  busy?: boolean;
  expense: AppExpense;
  onApprove: () => void;
  onBack: () => void;
  onReject: () => void;
  project?: AppProject;
};

export function BillDetailScreen({ approval, busy, expense, onApprove, onBack, onReject, project }: BillDetailScreenProps) {
  const visual = getCategoryVisual(expense.category);
  const canDecide = expense.status === "PENDING_APPROVAL" && approval?.status === "PENDING";

  return (
    <AppScreen
      footer={canDecide ? (
        <View style={styles.footerRow}>
          <PrimaryButton disabled={busy} label={busy ? "Working..." : "Reject"} onPress={onReject} variant="danger" />
          <PrimaryButton disabled={busy} label={busy ? "Working..." : "Approve"} onPress={onApprove} />
        </View>
      ) : undefined}
      onBack={onBack}
      subtitle={project ? project.name : "Expense detail"}
      title="Bills Approval"
    >
      <SurfaceCard style={styles.topCard}>
        <View style={styles.rowSpread}>
          <View>
            <Text style={styles.name}>{expense.requesterName}</Text>
            <Text style={styles.meta}>{expense.vendorName}</Text>
          </View>
          <View style={styles.rightWrap}>
            <Text style={styles.amount}>{formatCurrency(expense.flow === "topup" ? expense.amount : -expense.amount)}</Text>
            <StatusPill label={expense.status === "PENDING_APPROVAL" ? "Pending" : expense.status} tone={getStatusTone(expense.status)} />
          </View>
        </View>

        <View style={styles.inlineRow}>
          <View style={[styles.categoryIcon, { backgroundColor: `${visual.tint}20` }]}>
            <Text style={[styles.categoryGlyph, { color: visual.tint }]}>{visual.name[0]}</Text>
          </View>
          <View>
            <Text style={styles.categoryTitle}>{expense.category}</Text>
            <Text style={styles.meta}>{formatCompactDate(expense.createdAt)}</Text>
          </View>
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>{expense.description}</Text>
      </SurfaceCard>

      <SurfaceCard>
        <Text style={styles.sectionLabel}>Receipts ({expense.attachments.length})</Text>
        <View style={styles.receiptsRow}>
          {expense.attachments.map((attachment) => (
            <View key={attachment} style={styles.receiptCard}>
              <Text style={styles.receiptIcon}>▣</Text>
              <Text style={styles.receiptName}>{attachment}</Text>
            </View>
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <Text style={styles.sectionLabel}>Intelligence</Text>
        <View style={styles.signalRow}>
          <StatusPill label={`Price ${expense.priceSignal}`} tone={expense.priceSignal === "BLOCK" ? "blocked" : expense.priceSignal === "WARNING" ? "warning" : "approved"} />
          <StatusPill label={`Policy ${expense.policySignal}`} tone={expense.policySignal === "BLOCK" ? "blocked" : expense.policySignal === "WARNING" ? "warning" : "approved"} />
        </View>
        {approval ? <Text style={styles.meta}>Current approver: {approval.approverName}</Text> : null}
      </SurfaceCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  amount: {
    color: tokens.colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  categoryGlyph: {
    fontSize: 26,
    fontWeight: "900",
  },
  categoryIcon: {
    alignItems: "center",
    borderRadius: tokens.radius.pill,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  categoryTitle: {
    color: tokens.colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  description: {
    color: tokens.colors.muted,
    fontSize: 20,
    fontWeight: "500",
    lineHeight: 28,
  },
  footerRow: {
    flexDirection: "row",
    gap: tokens.spacing.md,
  },
  inlineRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: tokens.spacing.md,
  },
  meta: {
    color: tokens.colors.muted,
    fontSize: 15,
    fontWeight: "600",
  },
  name: {
    color: tokens.colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  receiptCard: {
    alignItems: "center",
    backgroundColor: tokens.colors.surfaceMuted,
    borderRadius: tokens.radius.lg,
    flex: 1,
    gap: tokens.spacing.sm,
    minHeight: 140,
    justifyContent: "center",
    padding: tokens.spacing.md,
  },
  receiptIcon: {
    color: tokens.colors.subtle,
    fontSize: 42,
    fontWeight: "900",
  },
  receiptName: {
    color: tokens.colors.text,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  receiptsRow: {
    flexDirection: "row",
    gap: tokens.spacing.md,
  },
  rightWrap: {
    alignItems: "flex-end",
    gap: tokens.spacing.xs,
  },
  rowSpread: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionLabel: {
    color: tokens.colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: tokens.spacing.sm,
  },
  signalRow: {
    flexDirection: "row",
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
  },
  topCard: {
    gap: tokens.spacing.lg,
  },
});