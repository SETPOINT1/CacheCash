import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen, PrimaryButton } from "../../../shared/components/ui";
import { tokens } from "../../../shared/theme/tokens";

type LoginScreenProps = {
  busy?: boolean;
  mode: "login" | "signup";
  onSubmit: (payload: { email: string; name?: string; password: string }) => void;
  onToggleMode: () => void;
};

export function LoginScreen({ busy, mode, onSubmit, onToggleMode }: LoginScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("member@cachecash.app");
  const [password, setPassword] = useState("cachecash-demo");
  const [confirmPassword, setConfirmPassword] = useState("cachecash-demo");
  const [accepted, setAccepted] = useState(mode === "login");

  const isSignup = mode === "signup";
  const disabled = busy || !email || !password || (isSignup && (!name || password !== confirmPassword || !accepted));

  return (
    <AppScreen scroll={false} subtitle="Collaborative finance workspace for small teams" title={isSignup ? "Begin" : "Welcome"}>
      <View style={styles.logoWrap}>
        <Text style={styles.logoText}>C</Text>
      </View>

      <View style={styles.formCard}>
        {isSignup ? (
          <TextInput
            onChangeText={setName}
            placeholder="User name"
            placeholderTextColor={tokens.colors.subtle}
            style={styles.input}
            value={name}
          />
        ) : null}
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder={isSignup ? "Email or Phone number" : "User name"}
          placeholderTextColor={tokens.colors.subtle}
          style={styles.input}
          value={email}
        />
        <TextInput
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={tokens.colors.subtle}
          secureTextEntry
          style={styles.input}
          value={password}
        />
        {isSignup ? (
          <TextInput
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            placeholderTextColor={tokens.colors.subtle}
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
          />
        ) : null}

        <View style={styles.inlineRow}>
          <Pressable onPress={() => setAccepted((current) => !current)} style={styles.checkRow}>
            <Ionicons
              color={accepted ? tokens.colors.primary : tokens.colors.border}
              name={accepted ? "checkmark-circle" : "ellipse-outline"}
              size={20}
            />
            <Text style={styles.metaText}>{isSignup ? "I accept the Agreement." : "remember"}</Text>
          </Pressable>
          <Text style={styles.linkText}>{isSignup ? "Personal data" : "forget password?"}</Text>
        </View>

        <PrimaryButton
          disabled={disabled}
          label={isSignup ? "Sign up" : "Login"}
          onPress={() => onSubmit({ email, name: isSignup ? name : undefined, password })}
        />

        <View style={styles.separatorRow}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>{isSignup ? "Sign up option" : "Log in option"}</Text>
          <View style={styles.separatorLine} />
        </View>

        <View style={styles.socialRow}>
          <View style={styles.socialDot}><Text style={styles.socialText}>f</Text></View>
          <View style={styles.socialDot}><Text style={styles.socialText}>G</Text></View>
          <View style={styles.socialDot}><Text style={styles.socialText}>A</Text></View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.metaText}>{isSignup ? "Already have an account?" : "Don't have an account yet?"}</Text>
          <Pressable onPress={onToggleMode}>
            <Text style={styles.linkText}>{isSignup ? "Log in" : "Sign up"}</Text>
          </Pressable>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  checkRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: tokens.spacing.xs,
  },
  footerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: tokens.spacing.xs,
    justifyContent: "center",
  },
  formCard: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.xl,
    gap: tokens.spacing.md,
    marginTop: "auto",
    padding: tokens.spacing.lg,
    ...tokens.shadow.floating,
  },
  inlineRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "#dedede",
    borderRadius: tokens.radius.pill,
    color: tokens.colors.text,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: tokens.spacing.md,
  },
  linkText: {
    color: tokens.colors.primaryDeep,
    fontSize: 15,
    fontWeight: "700",
  },
  logoText: {
    color: tokens.colors.primary,
    fontSize: 90,
    fontWeight: "900",
  },
  logoWrap: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  metaText: {
    color: tokens.colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  separatorLine: {
    backgroundColor: tokens.colors.border,
    flex: 1,
    height: 1,
  },
  separatorRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: tokens.spacing.sm,
  },
  separatorText: {
    color: tokens.colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  socialDot: {
    alignItems: "center",
    backgroundColor: tokens.colors.card,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  socialRow: {
    flexDirection: "row",
    gap: tokens.spacing.md,
    justifyContent: "center",
  },
  socialText: {
    color: tokens.colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
});
