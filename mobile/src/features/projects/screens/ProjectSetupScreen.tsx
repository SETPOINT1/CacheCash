import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { AppScreen, PrimaryButton } from "../../../shared/components/ui";
import { tokens } from "../../../shared/theme/tokens";

export type ProjectSetupInput = {
  budgetTotal: number;
  businessModel: string;
  description: string;
  memberCount: number;
  name: string;
};

type ProjectSetupScreenProps = {
  busy?: boolean;
  onBack: () => void;
  onSubmit: (input: ProjectSetupInput) => void;
};

export function ProjectSetupScreen({ busy, onBack, onSubmit }: ProjectSetupScreenProps) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("50000");
  const [businessModel, setBusinessModel] = useState("Business");
  const [memberCount, setMemberCount] = useState("5");
  const [description, setDescription] = useState("Cross-team workspace for budget control and approvals.");

  return (
    <AppScreen
      footer={<PrimaryButton disabled={busy || !name} label={busy ? "Saving..." : "Confirm Project"} onPress={() => onSubmit({ budgetTotal: Number(budget), businessModel, description, memberCount: Number(memberCount), name })} />}
      onBack={onBack}
      subtitle="Choose your plan and configure the core workspace"
      title="Create Project"
    >
      <View style={styles.form}>
        <Text style={styles.label}>Project name</Text>
        <TextInput onChangeText={setName} placeholder="Project name" placeholderTextColor={tokens.colors.subtle} style={styles.input} value={name} />

        <Text style={styles.label}>Budget</Text>
        <TextInput keyboardType="numeric" onChangeText={setBudget} placeholder="Budget" placeholderTextColor={tokens.colors.subtle} style={styles.input} value={budget} />

        <Text style={styles.label}>Business Model</Text>
        <TextInput onChangeText={setBusinessModel} placeholder="Business model" placeholderTextColor={tokens.colors.subtle} style={styles.input} value={businessModel} />

        <Text style={styles.label}>Number of members</Text>
        <TextInput keyboardType="numeric" onChangeText={setMemberCount} placeholder="5" placeholderTextColor={tokens.colors.subtle} style={styles.input} value={memberCount} />

        <Text style={styles.label}>Describe your project</Text>
        <TextInput multiline numberOfLines={6} onChangeText={setDescription} placeholder="Describe your project" placeholderTextColor={tokens.colors.subtle} style={[styles.input, styles.textArea]} value={description} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: tokens.spacing.sm,
  },
  input: {
    backgroundColor: "#dfdfdf",
    borderRadius: tokens.radius.lg,
    color: tokens.colors.text,
    fontSize: 16,
    minHeight: 54,
    paddingHorizontal: tokens.spacing.md,
  },
  label: {
    color: tokens.colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginTop: tokens.spacing.sm,
  },
  textArea: {
    minHeight: 150,
    paddingTop: tokens.spacing.md,
    textAlignVertical: "top",
  },
});