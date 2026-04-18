import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { AppScreen, PrimaryButton } from "../../../shared/components/ui";
import { WelcomeSlide } from "../../../store/appStore";
import { tokens } from "../../../shared/theme/tokens";

type OnboardingScreenProps = {
  index: number;
  isLast: boolean;
  onNext: () => void;
  onSkip: () => void;
  slide: WelcomeSlide;
  total: number;
};

export function OnboardingScreen({ index, isLast, onNext, onSkip, slide, total }: OnboardingScreenProps) {
  return (
    <AppScreen scroll={false}>
      <View style={styles.wrap}>
        <View style={[styles.illustration, { backgroundColor: slide.accent }]}> 
          <Ionicons color={tokens.colors.white} name="wallet-outline" size={72} />
        </View>

        <View style={styles.copyBlock}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>

        <View style={styles.progressRow}>
          {Array.from({ length: total }).map((_, progressIndex) => (
            <View key={`${slide.id}-${progressIndex}`} style={[styles.progressDot, progressIndex === index ? styles.progressDotActive : null]} />
          ))}
        </View>

        <View style={styles.actions}>
          <PrimaryButton label={isLast ? "Get Started" : "Next"} onPress={onNext} />
          <PrimaryButton label="Skip" onPress={onSkip} variant="ghost" />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: tokens.spacing.sm,
    width: "100%",
  },
  copyBlock: {
    alignItems: "center",
    gap: tokens.spacing.md,
  },
  description: {
    color: tokens.colors.muted,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 28,
    textAlign: "center",
  },
  illustration: {
    alignItems: "center",
    borderRadius: tokens.radius.xl,
    height: 220,
    justifyContent: "center",
    width: "100%",
  },
  progressDot: {
    backgroundColor: "#c7c7c7",
    borderRadius: tokens.radius.pill,
    height: 6,
    width: 24,
  },
  progressDotActive: {
    backgroundColor: tokens.colors.primary,
  },
  progressRow: {
    flexDirection: "row",
    gap: tokens.spacing.sm,
  },
  title: {
    color: tokens.colors.text,
    fontSize: tokens.typography.h1,
    fontWeight: "900",
    textAlign: "center",
  },
  wrap: {
    alignItems: "center",
    flex: 1,
    gap: tokens.spacing.xl,
    justifyContent: "center",
    paddingBottom: tokens.spacing.xl,
  },
});