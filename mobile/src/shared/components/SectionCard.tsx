import { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import { tokens } from "../theme/tokens";

type SectionCardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function SectionCard({ children, subtitle, title }: SectionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: tokens.spacing.xs,
  },
  card: {
    backgroundColor: tokens.colors.card,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    gap: tokens.spacing.sm,
    padding: tokens.spacing.md,
  },
  subtitle: {
    color: tokens.colors.muted,
    fontSize: 13,
  },
  title: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
});
