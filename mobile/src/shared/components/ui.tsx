import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PropsWithChildren, ReactNode } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { tokens } from "../theme/tokens";

type AppScreenProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}>;

type SurfaceCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
};

type StatusPillProps = {
  label: string;
  tone: "neutral" | "pending" | "approved" | "rejected" | "warning" | "blocked";
};

type SearchFieldProps = {
  value: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
  onFilterPress?: () => void;
};

type SegmentedControlProps<T extends string> = {
  options: Array<{ key: T; label: string }>;
  selected: T;
  onSelect: (key: T) => void;
};

type BottomSheetProps = PropsWithChildren<{
  visible: boolean;
  title: string;
  onClose: () => void;
  rightAction?: ReactNode;
}>;

type AvatarProps = {
  initials: string;
  size?: number;
  accent?: string;
};

type IconBubbleProps = {
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  backgroundColor?: string;
  size?: number;
};

type InfoBannerProps = {
  tone?: "info" | "success" | "warning";
  text: string;
};

export function AppScreen({
  children,
  contentStyle,
  footer,
  onBack,
  rightSlot,
  scroll = true,
  subtitle,
  title,
}: AppScreenProps) {
  const content = (
    <View style={[styles.content, contentStyle]}>
      {title || onBack || rightSlot ? (
        <View style={styles.headerRow}>
          <View style={styles.headerLeading}>
            {onBack ? (
              <Pressable onPress={onBack} style={styles.iconButton}>
                <Ionicons color={tokens.colors.text} name="chevron-back" size={22} />
              </Pressable>
            ) : null}
            <View style={styles.headerCopy}>
              {title ? <Text style={styles.screenTitle}>{title}</Text> : null}
              {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
            </View>
          </View>
          {rightSlot ? <View>{rightSlot}</View> : null}
        </View>
      ) : null}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

export function SurfaceCard({ children, style }: SurfaceCardProps) {
  return <View style={[styles.surfaceCard, style]}>{children}</View>;
}

export function PrimaryButton({ disabled, icon, label, onPress, variant = "primary" }: PrimaryButtonProps) {
  if (variant === "ghost") {
    return (
      <Pressable disabled={disabled} onPress={onPress} style={[styles.ghostButton, disabled ? styles.disabled : null]}>
        <Text style={styles.ghostButtonText}>{label}</Text>
      </Pressable>
    );
  }

  if (variant === "secondary") {
    return (
      <Pressable disabled={disabled} onPress={onPress} style={[styles.secondaryButton, disabled ? styles.disabled : null]}>
        {icon ? <Ionicons color={tokens.colors.primaryDeep} name={icon} size={18} /> : null}
        <Text style={styles.secondaryButtonText}>{label}</Text>
      </Pressable>
    );
  }

  const colors: readonly [string, string] =
    variant === "danger"
      ? ["#d95858", "#a81f1f"]
      : [tokens.colors.primary, tokens.colors.primaryDeep];

  return (
    <Pressable disabled={disabled} onPress={onPress} style={disabled ? styles.disabled : null}>
      <LinearGradient colors={colors} end={{ x: 1, y: 0.5 }} start={{ x: 0, y: 0.5 }} style={styles.primaryButton}>
        {icon ? <Ionicons color={tokens.colors.white} name={icon} size={18} /> : null}
        <Text style={styles.primaryButtonText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function StatusPill({ label, tone }: StatusPillProps) {
  const toneStyle = statusToneStyles[tone];

  return (
    <View style={[styles.statusPill, toneStyle.container]}>
      <Text style={[styles.statusText, toneStyle.text]}>{label}</Text>
    </View>
  );
}

export function SearchField({ onChangeText, onFilterPress, placeholder = "Search", value }: SearchFieldProps) {
  return (
    <View style={styles.searchRow}>
      <View style={styles.searchInputWrap}>
        <Ionicons color={tokens.colors.subtle} name="search" size={18} />
        <TextInput
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={tokens.colors.subtle}
          style={styles.searchInput}
          value={value}
        />
      </View>
      {onFilterPress ? (
        <Pressable onPress={onFilterPress} style={styles.filterButton}>
          <Ionicons color={tokens.colors.muted} name="options-outline" size={20} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function SegmentedControl<T extends string>({ onSelect, options, selected }: SegmentedControlProps<T>) {
  return (
    <View style={styles.segmentedWrap}>
      {options.map((option) => {
        const active = option.key === selected;

        return (
          <Pressable key={option.key} onPress={() => onSelect(option.key)} style={[styles.segmentItem, active ? styles.segmentItemActive : null]}>
            <Text style={[styles.segmentText, active ? styles.segmentTextActive : null]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function BottomSheet({ children, onClose, rightAction, title, visible }: BottomSheetProps) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <Pressable onPress={onClose} style={styles.sheetOverlay}>
        <Pressable onPress={() => undefined} style={styles.sheetCard}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            {rightAction ? rightAction : null}
          </View>
          <View style={styles.sheetBody}>{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function Avatar({ accent = tokens.colors.primarySoft, initials, size = 52 }: AvatarProps) {
  return (
    <View style={[styles.avatar, { backgroundColor: accent, height: size, width: size }]}> 
      <Text style={[styles.avatarText, { fontSize: Math.max(14, size / 2.6) }]}>{initials}</Text>
    </View>
  );
}

export function IconBubble({ backgroundColor = tokens.colors.surfaceMuted, color = tokens.colors.primaryDeep, icon, size = 48 }: IconBubbleProps) {
  return (
    <View style={[styles.iconBubble, { backgroundColor, height: size, width: size }]}> 
      <Ionicons color={color} name={icon} size={size / 2.1} />
    </View>
  );
}

export function SectionTitle({ action, subtitle, title }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionTitleCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {action ? <View>{action}</View> : null}
    </View>
  );
}

export function InfoBanner({ text, tone = "info" }: InfoBannerProps) {
  const bannerStyle = infoToneStyles[tone];

  return (
    <View style={[styles.infoBanner, bannerStyle.container]}>
      <Ionicons color={bannerStyle.color} name="information-circle" size={18} />
      <Text style={[styles.infoBannerText, { color: bannerStyle.color }]}>{text}</Text>
    </View>
  );
}

const statusToneStyles = {
  approved: {
    container: { backgroundColor: "#d9f6da" },
    text: { color: tokens.colors.successText },
  },
  blocked: {
    container: { backgroundColor: "#ffdfe0" },
    text: { color: tokens.colors.dangerText },
  },
  neutral: {
    container: { backgroundColor: tokens.colors.surfaceMuted },
    text: { color: tokens.colors.text },
  },
  pending: {
    container: { backgroundColor: "#ffe39b" },
    text: { color: tokens.colors.warningText },
  },
  rejected: {
    container: { backgroundColor: "#ffd0d0" },
    text: { color: tokens.colors.dangerText },
  },
  warning: {
    container: { backgroundColor: "#fff0bf" },
    text: { color: tokens.colors.warningText },
  },
};

const infoToneStyles = {
  info: {
    color: tokens.colors.primaryDeep,
    container: { backgroundColor: tokens.colors.primarySoft },
  },
  success: {
    color: tokens.colors.successText,
    container: { backgroundColor: "#e6f8e8" },
  },
  warning: {
    color: tokens.colors.warningText,
    container: { backgroundColor: "#fff7d8" },
  },
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    borderRadius: tokens.radius.pill,
    justifyContent: "center",
  },
  avatarText: {
    color: tokens.colors.primaryDeep,
    fontWeight: "800",
  },
  content: {
    flex: 1,
    gap: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.sm,
  },
  disabled: {
    opacity: 0.55,
  },
  filterButton: {
    alignItems: "center",
    backgroundColor: "#d7d7d7",
    borderRadius: tokens.radius.md,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  footer: {
    backgroundColor: tokens.colors.background,
    gap: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.lg,
  },
  ghostButton: {
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: tokens.spacing.md,
  },
  ghostButtonText: {
    color: tokens.colors.primaryDeep,
    fontSize: 16,
    fontWeight: "700",
  },
  headerCopy: {
    gap: tokens.spacing.xxs,
  },
  headerLeading: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 1,
    gap: tokens.spacing.sm,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconBubble: {
    alignItems: "center",
    borderRadius: tokens.radius.pill,
    justifyContent: "center",
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: tokens.colors.surfaceMuted,
    borderRadius: tokens.radius.pill,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  infoBanner: {
    alignItems: "center",
    borderRadius: tokens.radius.md,
    flexDirection: "row",
    gap: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
  },
  primaryButton: {
    alignItems: "center",
    borderRadius: tokens.radius.pill,
    flexDirection: "row",
    gap: tokens.spacing.xs,
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: tokens.spacing.lg,
  },
  primaryButtonText: {
    color: tokens.colors.white,
    fontSize: 18,
    fontWeight: "800",
  },
  safeArea: {
    backgroundColor: tokens.colors.background,
    flex: 1,
  },
  screenSubtitle: {
    color: tokens.colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  screenTitle: {
    color: tokens.colors.text,
    fontSize: tokens.typography.h1,
    fontWeight: "900",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: tokens.spacing.lg,
  },
  searchInput: {
    color: tokens.colors.text,
    flex: 1,
    fontSize: 15,
  },
  searchInputWrap: {
    alignItems: "center",
    backgroundColor: "#e4e4e4",
    borderRadius: tokens.radius.md,
    flex: 1,
    flexDirection: "row",
    gap: tokens.spacing.xs,
    minHeight: 44,
    paddingHorizontal: tokens.spacing.md,
  },
  searchRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: tokens.spacing.sm,
  },
  sectionSubtitle: {
    color: tokens.colors.muted,
    fontSize: 13,
  },
  sectionTitle: {
    color: tokens.colors.text,
    fontSize: tokens.typography.h3,
    fontWeight: "800",
  },
  sectionTitleCopy: {
    gap: tokens.spacing.xxs,
  },
  sectionTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: tokens.colors.primarySoft,
    borderRadius: tokens.radius.pill,
    flexDirection: "row",
    gap: tokens.spacing.xs,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: tokens.spacing.lg,
  },
  secondaryButtonText: {
    color: tokens.colors.primaryDeep,
    fontSize: 16,
    fontWeight: "800",
  },
  segmentItem: {
    alignItems: "center",
    borderRadius: tokens.radius.pill,
    flex: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: tokens.spacing.md,
  },
  segmentItemActive: {
    backgroundColor: tokens.colors.white,
    ...tokens.shadow.card,
  },
  segmentText: {
    color: tokens.colors.muted,
    fontSize: 16,
    fontWeight: "700",
  },
  segmentTextActive: {
    color: tokens.colors.text,
  },
  segmentedWrap: {
    alignItems: "center",
    backgroundColor: "#ededed",
    borderRadius: tokens.radius.pill,
    flexDirection: "row",
    gap: tokens.spacing.xxs,
    padding: tokens.spacing.xxs,
  },
  sheetBody: {
    gap: tokens.spacing.md,
  },
  sheetCard: {
    backgroundColor: tokens.colors.card,
    borderTopLeftRadius: tokens.radius.xl,
    borderTopRightRadius: tokens.radius.xl,
    gap: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
    paddingTop: tokens.spacing.sm,
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: tokens.colors.muted,
    borderRadius: tokens.radius.pill,
    height: 4,
    opacity: 0.8,
    width: 44,
  },
  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sheetOverlay: {
    backgroundColor: tokens.colors.overlay,
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetTitle: {
    color: tokens.colors.text,
    fontSize: tokens.typography.h3,
    fontWeight: "900",
  },
  statusPill: {
    alignItems: "center",
    borderRadius: tokens.radius.pill,
    justifyContent: "center",
    minHeight: 30,
    minWidth: 86,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xxs,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "800",
  },
  surfaceCard: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    ...tokens.shadow.card,
  },
});