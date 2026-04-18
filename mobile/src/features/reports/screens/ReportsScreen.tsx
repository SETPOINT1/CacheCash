import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppScreen, PrimaryButton, SegmentedControl, SurfaceCard } from "../../../shared/components/ui";
import { AppCategory, AppExpense, AppProject, CategoryKind, DashboardSeries, formatCurrency, getCategoryVisual, getProjectHealth } from "../../../store/appStore";
import { tokens } from "../../../shared/theme/tokens";

type ReportsScreenProps = {
  categories: AppCategory[];
  expenses: AppExpense[];
  onBack: () => void;
  onOpenCategories: (kind: CategoryKind) => void;
  project: AppProject;
  series: DashboardSeries[];
};

export function ReportsScreen({ categories, expenses, onBack, onOpenCategories, project, series }: ReportsScreenProps) {
  const [mode, setMode] = useState<"overview" | "categories">("overview");
  const [categoryKind, setCategoryKind] = useState<CategoryKind>("expense");

  const categoryRows = categories.filter((category) => category.kind === categoryKind).slice(0, 7);
  const projectExpenses = expenses.filter((expense) => expense.projectId === project.id && expense.flow === "withdraw");

  return (
    <AppScreen
      onBack={onBack}
      rightSlot={<PrimaryButton label="Export" onPress={() => undefined} variant="secondary" />}
      subtitle="Information as of June 5, 2025"
      title="Dashboard"
    >
      <SurfaceCard style={styles.donutCard}>
        <View style={styles.donutOuter}>
          <View style={styles.donutInner}>
            <Text style={styles.donutValue}>{getProjectHealth(project)}%</Text>
          </View>
        </View>
        <Text style={styles.item}>All spending {100 - getProjectHealth(project)}% from this Project budget</Text>
      </SurfaceCard>

      <SegmentedControl
        onSelect={setMode}
        options={[
          { key: "overview", label: "Overview" },
          { key: "categories", label: "Categories" },
        ]}
        selected={mode}
      />

      {mode === "overview" ? (
        <SurfaceCard style={styles.chartCard}>
          <View style={styles.chartGrid}>
            {series.map((point) => (
              <View key={point.month} style={styles.barWrap}>
                <View style={[styles.bar, { height: Math.max(18, point.profit / 150), backgroundColor: point.profit >= 0 ? "#4cb866" : "#ea7f7f" }]} />
                <Text style={styles.axisText}>{point.month}</Text>
              </View>
            ))}
          </View>
          <View style={styles.metricGrid}>
            <SurfaceCard style={styles.metricTile}>
              <Text style={styles.metricTitle}>Budget</Text>
              <Text style={styles.metricValue}>{formatCurrency(project.budgetTotal).replace("+", "")}</Text>
            </SurfaceCard>
            <SurfaceCard style={styles.metricTile}>
              <Text style={styles.metricTitle}>Expense Notes</Text>
              <Text style={styles.metricValue}>{projectExpenses.length}</Text>
            </SurfaceCard>
          </View>
        </SurfaceCard>
      ) : null}

      {mode === "categories" ? (
        <View style={styles.stack}>
          <SegmentedControl
            onSelect={setCategoryKind}
            options={[
              { key: "expense", label: "Expenses" },
              { key: "income", label: "Income" },
            ]}
            selected={categoryKind}
          />
          {categoryRows.map((category) => {
            const visual = getCategoryVisual(category.name);

            return (
              <SurfaceCard key={category.id} style={styles.categoryRow}>
                <View style={[styles.legendDot, { backgroundColor: visual.tint }]} />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.item}>{category.count} items</Text>
              </SurfaceCard>
            );
          })}
          <PrimaryButton label="Open Category Library" onPress={() => onOpenCategories(categoryKind)} />
        </View>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  axisText: {
    color: tokens.colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  bar: {
    borderRadius: tokens.radius.sm,
    width: 22,
  },
  barWrap: {
    alignItems: "center",
    gap: tokens.spacing.xs,
  },
  categoryName: {
    color: tokens.colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
  },
  categoryRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: tokens.spacing.sm,
  },
  chartCard: {
    gap: tokens.spacing.lg,
  },
  chartGrid: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 210,
    paddingBottom: tokens.spacing.sm,
  },
  donutCard: {
    alignItems: "center",
    gap: tokens.spacing.md,
  },
  donutInner: {
    alignItems: "center",
    backgroundColor: tokens.colors.background,
    borderRadius: 90,
    height: 110,
    justifyContent: "center",
    width: 110,
  },
  donutOuter: {
    alignItems: "center",
    backgroundColor: "#ff8d98",
    borderRadius: 130,
    height: 220,
    justifyContent: "center",
    width: 220,
  },
  donutValue: {
    color: tokens.colors.text,
    fontSize: 34,
    fontWeight: "900",
  },
  container: {
    gap: tokens.spacing.md,
  },
  item: {
    color: tokens.colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  legendDot: {
    borderRadius: tokens.radius.pill,
    height: 14,
    width: 14,
  },
  metricGrid: {
    flexDirection: "row",
    gap: tokens.spacing.md,
  },
  metricTile: {
    flex: 1,
  },
  metricTitle: {
    color: tokens.colors.muted,
    fontSize: 14,
    fontWeight: "700",
  },
  metricValue: {
    color: tokens.colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  stack: {
    gap: tokens.spacing.md,
  },
});
