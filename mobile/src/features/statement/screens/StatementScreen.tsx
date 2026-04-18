import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppScreen, StatusPill, SurfaceCard } from "../../../shared/components/ui";
import { AppStatementEntry, formatCurrency } from "../../../store/appStore";
import { tokens } from "../../../shared/theme/tokens";

type StatementScreenProps = {
  entries: AppStatementEntry[];
  onBack: () => void;
};

export function StatementScreen({ entries, onBack }: StatementScreenProps) {
  return (
    <AppScreen onBack={onBack} title="Statement">
      <SurfaceCard>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceValue}>80,000.00</Text>
      </SurfaceCard>
      <ScrollView contentContainerStyle={styles.list}>
        {entries.map((entry) => (
          <SurfaceCard key={entry.id} style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <View>
                <Text style={styles.name}>{entry.name}</Text>
                <Text style={styles.meta}>{entry.createdAt}</Text>
              </View>
              <StatusPill label={entry.direction === "IN" ? "Income" : "Expense"} tone={entry.direction === "IN" ? "approved" : "rejected"} />
            </View>
            <Text style={styles.description}>{entry.description}</Text>
            <Text style={[styles.amount, entry.direction === "IN" ? styles.amountIncome : styles.amountExpense]}>{formatCurrency(entry.amount)}</Text>
          </SurfaceCard>
        ))}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  amount: {
    fontSize: 20,
    fontWeight: "900",
  },
  amountExpense: {
    color: tokens.colors.dangerText,
  },
  amountIncome: {
    color: tokens.colors.successText,
  },
  balanceLabel: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  balanceValue: {
    color: tokens.colors.text,
    fontSize: 42,
    fontWeight: "900",
  },
  description: {
    color: tokens.colors.muted,
    fontSize: 15,
    fontWeight: "600",
  },
  entryCard: {
    gap: tokens.spacing.sm,
  },
  entryHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  list: {
    gap: tokens.spacing.sm,
  },
  meta: {
    color: tokens.colors.muted,
    fontSize: 13,
  },
  name: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
});