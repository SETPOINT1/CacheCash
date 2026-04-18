import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppScreen, SegmentedControl, SurfaceCard } from "../../../shared/components/ui";
import { AppNotification, NotificationKind } from "../../../store/appStore";
import { tokens } from "../../../shared/theme/tokens";

type NotificationCenterScreenProps = {
  notifications: AppNotification[];
  onBack: () => void;
};

export function NotificationCenterScreen({ notifications, onBack }: NotificationCenterScreenProps) {
  const [kind, setKind] = useState<NotificationKind>("all");

  const filtered = notifications.filter((notification) => kind === "all" || notification.kind === kind);

  return (
    <AppScreen onBack={onBack} title="Notifications">
      <SegmentedControl
        onSelect={setKind}
        options={[
          { key: "all", label: "All" },
          { key: "income", label: "Income" },
          { key: "expenses", label: "Expenses" },
          { key: "bills", label: "Bills" },
        ]}
        selected={kind}
      />
      <View style={styles.list}>
        {filtered.map((notification) => (
          <SurfaceCard key={notification.id}>
            <Text style={styles.name}>{notification.name}</Text>
            <Text style={styles.body}>{notification.body}</Text>
            <View style={styles.footerRow}>
              <Text style={styles.amount}>{notification.amountLabel ?? ""}</Text>
              <Text style={styles.meta}>{notification.createdAt}</Text>
            </View>
          </SurfaceCard>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  amount: {
    color: tokens.colors.dangerText,
    fontSize: 16,
    fontWeight: "900",
  },
  body: {
    color: tokens.colors.muted,
    fontSize: 16,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: tokens.spacing.sm,
  },
  list: {
    gap: tokens.spacing.sm,
  },
  meta: {
    color: tokens.colors.subtle,
    fontSize: 14,
  },
  name: {
    color: tokens.colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
});