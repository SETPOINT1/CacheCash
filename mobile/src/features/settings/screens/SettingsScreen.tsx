import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar, SearchField, SurfaceCard } from "../../../shared/components/ui";
import { AppUser } from "../../../store/appStore";
import { tokens } from "../../../shared/theme/tokens";

type SettingsScreenProps = {
  onOpenCategories: () => void;
  onOpenNotifications: () => void;
  onOpenStatement: () => void;
  user: AppUser;
};

function ActionRow({ label, icon, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.actionRow}>
      <Ionicons color={tokens.colors.primary} name={icon} size={20} />
      <Text style={styles.actionLabel}>{label}</Text>
      <Ionicons color={tokens.colors.muted} name="chevron-forward" size={20} />
    </Pressable>
  );
}

export function SettingsScreen({ onOpenCategories, onOpenNotifications, onOpenStatement, user }: SettingsScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Setting</Text>
      <SearchField onChangeText={() => undefined} placeholder="Search" value="" />
      <View style={styles.profileRow}>
        <Avatar accent="#ffc1a8" initials={user.initials} size={72} />
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role}</Text>
        </View>
      </View>

      <SurfaceCard style={styles.group}>
        <ActionRow icon="person-outline" label="Personal Info" onPress={() => undefined} />
        <ActionRow icon="notifications-outline" label="Notifications" onPress={onOpenNotifications} />
        <ActionRow icon="document-text-outline" label="Statement" onPress={onOpenStatement} />
        <ActionRow icon="grid-outline" label="Categories" onPress={onOpenCategories} />
      </SurfaceCard>

      <SurfaceCard style={styles.group}>
        <ActionRow icon="log-out-outline" label="Log Out" onPress={() => undefined} />
      </SurfaceCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actionLabel: {
    color: tokens.colors.text,
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
  },
  actionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: tokens.spacing.sm,
    minHeight: 46,
  },
  container: {
    backgroundColor: tokens.colors.background,
    gap: tokens.spacing.lg,
    paddingBottom: 120,
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.lg,
  },
  group: {
    gap: tokens.spacing.sm,
  },
  name: {
    color: tokens.colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  profileRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: tokens.spacing.md,
  },
  role: {
    color: tokens.colors.muted,
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    color: tokens.colors.text,
    fontSize: tokens.typography.h1,
    fontWeight: "900",
    textAlign: "center",
  },
});