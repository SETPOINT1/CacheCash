import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar, BottomSheet, PrimaryButton, SearchField, SectionTitle, SegmentedControl, StatusPill, SurfaceCard } from "../../../shared/components/ui";
import { AppExpense, AppProject, CategoryKind, FlowKind, formatCompactDate, formatCurrency, getCategoryVisual, getInitials, getStatusTone } from "../../../store/appStore";
import { tokens } from "../../../shared/theme/tokens";

type BillsScreenProps = {
  expenses: AppExpense[];
  currentProject: AppProject;
  onCreateExpense: () => void;
  onOpenCategories: (kind: CategoryKind) => void;
  onOpenExpense: (expenseId: string) => void;
};

export function BillsScreen({ currentProject, expenses, onCreateExpense, onOpenCategories, onOpenExpense }: BillsScreenProps) {
  const [query, setQuery] = useState("");
  const [flow, setFlow] = useState<FlowKind>("withdraw");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"ALL" | AppExpense["status"]>("ALL");

  const filteredExpenses = expenses.filter((expense) => {
    if (expense.projectId !== currentProject.id) {
      return false;
    }

    if (expense.flow !== flow) {
      return false;
    }

    if (statusFilter !== "ALL" && expense.status !== statusFilter) {
      return false;
    }

    const searchable = `${expense.requesterName} ${expense.description} ${expense.category}`.toLowerCase();
    return searchable.includes(query.toLowerCase());
  });

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionTitle action={<PrimaryButton label="Add Bill" onPress={onCreateExpense} variant="secondary" />} title="Bills" />
        <SegmentedControl
          onSelect={setFlow}
          options={[
            { key: "withdraw", label: "Withdraw" },
            { key: "topup", label: "Topup" },
          ]}
          selected={flow}
        />
        <SearchField onChangeText={setQuery} onFilterPress={() => setFilterOpen(true)} placeholder="Search" value={query} />

        <SectionTitle title="Latest" />
        <View style={styles.grid}>
          {filteredExpenses.map((expense) => {
            const visual = getCategoryVisual(expense.category);

            return (
              <Pressable key={expense.id} onPress={() => onOpenExpense(expense.id)} style={styles.pressableCard}>
                <SurfaceCard style={styles.expenseCard}>
                  <View style={styles.expenseHeader}>
                    <Avatar initials={getInitials(expense.requesterName)} size={52} />
                    <View style={styles.expenseHeaderCopy}>
                      <Text style={[styles.expenseAmount, expense.flow === "topup" ? styles.incomeAmount : null]}>{formatCurrency(expense.flow === "topup" ? expense.amount : -expense.amount)}</Text>
                      <StatusPill label={expense.status === "PENDING_APPROVAL" ? "Pending" : expense.status === "APPROVED" ? "Approved" : expense.status === "REJECTED" ? "Rejected" : "Draft"} tone={getStatusTone(expense.status)} />
                    </View>
                  </View>

                  <Text style={styles.expenseName}>{expense.requesterName}</Text>
                  <View style={styles.categoryRow}>
                    <View style={[styles.categoryIcon, { backgroundColor: `${visual.tint}22` }]}>
                      <Text style={[styles.categoryGlyph, { color: visual.tint }]}>{visual.name[0]}</Text>
                    </View>
                    <Text style={styles.categoryName}>{expense.category}</Text>
                  </View>
                  <View style={styles.expenseFooter}>
                    <Text style={styles.footerText}>{formatCompactDate(expense.createdAt)}</Text>
                    <Text style={styles.footerText}>{expense.vendorName}</Text>
                  </View>
                </SurfaceCard>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <BottomSheet
        onClose={() => setFilterOpen(false)}
        rightAction={<PrimaryButton label="Reset" onPress={() => setStatusFilter("ALL")} variant="ghost" />}
        title="Filter your search"
        visible={filterOpen}
      >
        <SectionTitle title="Status" />
        <View style={styles.filterRow}>
          {(["ALL", "PENDING_APPROVAL", "APPROVED", "REJECTED"] as const).map((status) => (
            <Pressable key={status} onPress={() => setStatusFilter(status)} style={[styles.filterChip, statusFilter === status ? styles.filterChipActive : null]}>
              <Text style={[styles.filterChipText, statusFilter === status ? styles.filterChipTextActive : null]}>{status === "ALL" ? "Any" : status.replace("_", " ")}</Text>
            </Pressable>
          ))}
        </View>
        <PrimaryButton label="Browse Categories" onPress={() => {
          setFilterOpen(false);
          onOpenCategories(flow === "withdraw" ? "expense" : "income");
        }} />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  categoryGlyph: {
    fontSize: 22,
    fontWeight: "900",
  },
  categoryIcon: {
    alignItems: "center",
    borderRadius: tokens.radius.pill,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  categoryName: {
    color: tokens.colors.muted,
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
  },
  categoryRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: tokens.spacing.sm,
  },
  container: {
    backgroundColor: tokens.colors.background,
    gap: tokens.spacing.lg,
    paddingBottom: 120,
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.lg,
  },
  expenseAmount: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  expenseCard: {
    gap: tokens.spacing.md,
  },
  expenseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expenseHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expenseHeaderCopy: {
    alignItems: "flex-end",
    gap: tokens.spacing.xxs,
  },
  expenseName: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  filterChip: {
    backgroundColor: tokens.colors.surfaceMuted,
    borderRadius: tokens.radius.pill,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: tokens.colors.primarySoft,
  },
  filterChipText: {
    color: tokens.colors.muted,
    fontSize: 14,
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: tokens.colors.primaryDeep,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.spacing.sm,
  },
  footerText: {
    color: tokens.colors.subtle,
    fontSize: 12,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.spacing.md,
    justifyContent: "space-between",
  },
  incomeAmount: {
    color: tokens.colors.successText,
  },
  pressableCard: {
    width: "48%",
  },
});