import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar, SearchField, SectionTitle, StatusPill, SurfaceCard } from "../../../shared/components/ui";
import { AppApproval, AppExpense, formatCompactDate, formatCurrency, getInitials } from "../../../store/appStore";
import { tokens } from "../../../shared/theme/tokens";

type ApprovalInboxScreenProps = {
  approvals: AppApproval[];
  expenses: AppExpense[];
  onOpenExpense: (expenseId: string) => void;
};

export function ApprovalInboxScreen({ approvals, expenses, onOpenExpense }: ApprovalInboxScreenProps) {
  const [query, setQuery] = useState("");

  const pendingApprovals = approvals.filter((approval) => approval.status === "PENDING");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SectionTitle title="Approval Inbox" subtitle="รายการที่ approver ต้องตัดสินใจ" />
      <SearchField onChangeText={setQuery} placeholder="Search pending approvals" value={query} />
      <View style={styles.list}>
        {pendingApprovals
          .filter((approval) => {
            const expense = expenses.find((item) => item.id === approval.expenseNoteId);
            if (!expense) {
              return false;
            }

            return `${approval.approverName} ${expense.requesterName} ${expense.category}`.toLowerCase().includes(query.toLowerCase());
          })
          .map((approval) => {
            const expense = expenses.find((item) => item.id === approval.expenseNoteId);

            if (!expense) {
              return null;
            }

            return (
              <Pressable key={approval.id} onPress={() => onOpenExpense(expense.id)}>
                <SurfaceCard style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Avatar initials={getInitials(expense.requesterName)} size={50} />
                    <View style={styles.cardCopy}>
                      <Text style={styles.requesterName}>{expense.requesterName}</Text>
                      <Text style={styles.meta}>{expense.category}</Text>
                      <Text style={styles.meta}>{formatCompactDate(expense.createdAt)}</Text>
                    </View>
                    <View style={styles.cardRight}>
                      <Text style={styles.amount}>{formatCurrency(-expense.amount)}</Text>
                      <StatusPill label="Pending" tone="pending" />
                    </View>
                  </View>
                  <Text style={styles.approver}>Approver: {approval.approverName}</Text>
                </SurfaceCard>
              </Pressable>
            );
          })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  amount: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  approver: {
    color: tokens.colors.primaryDeep,
    fontSize: 14,
    fontWeight: "700",
  },
  card: {
    gap: tokens.spacing.sm,
  },
  cardCopy: {
    flex: 1,
    gap: tokens.spacing.xxs,
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: tokens.spacing.sm,
  },
  cardRight: {
    alignItems: "flex-end",
    gap: tokens.spacing.xxs,
  },
  container: {
    backgroundColor: tokens.colors.background,
    gap: tokens.spacing.lg,
    paddingBottom: 120,
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.lg,
  },
  list: {
    gap: tokens.spacing.sm,
  },
  meta: {
    color: tokens.colors.muted,
    fontSize: 14,
  },
  requesterName: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
});
