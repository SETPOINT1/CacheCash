import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { AppScreen, PrimaryButton } from "../../../shared/components/ui";
import { tokens } from "../../../shared/theme/tokens";

type WelcomeScreenProps = {
  onBeginTour: () => void;
  onLogin: () => void;
};

export function WelcomeScreen({ onBeginTour, onLogin }: WelcomeScreenProps) {
  return (
    <AppScreen scroll={false}>
      <View style={styles.wrap}>
        <View style={styles.topCopy}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>solution for financial management and administration</Text>
        </View>

        <LinearGradient colors={[tokens.colors.primary, tokens.colors.heroAccent]} style={styles.logoCircle}>
          <Text style={styles.logoText}>C</Text>
        </LinearGradient>

        <View style={styles.bottomArea}>
          <PrimaryButton label="Log in" onPress={onLogin} />
          <PrimaryButton label="Explore Flow" onPress={onBeginTour} variant="secondary" />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  bottomArea: {
    gap: tokens.spacing.md,
    width: "100%",
  },
  logoCircle: {
    alignItems: "center",
    borderRadius: 120,
    height: 180,
    justifyContent: "center",
    width: 180,
  },
  logoText: {
    color: tokens.colors.white,
    fontSize: 110,
    fontWeight: "900",
  },
  subtitle: {
    color: tokens.colors.text,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 28,
    maxWidth: 260,
    textAlign: "center",
  },
  title: {
    color: tokens.colors.text,
    fontSize: tokens.typography.display,
    fontWeight: "900",
  },
  topCopy: {
    alignItems: "center",
    gap: tokens.spacing.sm,
  },
  wrap: {
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: tokens.spacing.xl,
    paddingTop: tokens.spacing.xl,
  },
});