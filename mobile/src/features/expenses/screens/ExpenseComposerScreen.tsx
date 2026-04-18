import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { AppScreen, PrimaryButton, SegmentedControl } from "../../../shared/components/ui";
import { AppProject } from "../../../store/appStore";
import { tokens } from "../../../shared/theme/tokens";

export type ExpenseComposerInput = {
  amount: number;
  approverName: string;
  category: string;
  description: string;
  projectId: string;
  requesterName: string;
  vendorName: string;
};

type ExpenseComposerScreenProps = {
  busy?: boolean;
  defaultProjectId: string;
  onBack: () => void;
  onSaveDraft: (input: ExpenseComposerInput) => void;
  onSubmitApproval: (input: ExpenseComposerInput) => void;
  projects: AppProject[];
};

export function ExpenseComposerScreen({ busy, defaultProjectId, onBack, onSaveDraft, onSubmitApproval, projects }: ExpenseComposerScreenProps) {
  const [projectId, setProjectId] = useState(defaultProjectId);
  const [amount, setAmount] = useState("3850");
  const [vendorName, setVendorName] = useState("Print House Studio");
  const [category, setCategory] = useState("Food & Drinks");
  const [description, setDescription] = useState("Team dinner and receipt verification package");
  const [requesterName, setRequesterName] = useState("Konlawath P.");
  const [approverName, setApproverName] = useState("Sirapop P.");

  const payload = {
    amount: Number(amount),
    approverName,
    category,
    description,
    projectId,
    requesterName,
    vendorName,
  };

  return (
    <AppScreen
      footer={
        <View style={styles.footerRow}>
          <PrimaryButton disabled={busy} label={busy ? "Saving..." : "Save Draft"} onPress={() => onSaveDraft(payload)} variant="secondary" />
          <PrimaryButton disabled={busy} label={busy ? "Saving..." : "Save & Submit"} onPress={() => onSubmitApproval(payload)} />
        </View>
      }
      onBack={onBack}
      subtitle="Create a bill quickly with enough context for price and policy review"
      title="Create Expense Note"
    >
      <View style={styles.container}>
        <Text style={styles.label}>Project</Text>
        <SegmentedControl
          onSelect={setProjectId}
          options={projects.slice(0, 3).map((project) => ({ key: project.id, label: project.name }))}
          selected={projectId}
        />
        <Text style={styles.label}>Amount</Text>
        <TextInput keyboardType="numeric" onChangeText={setAmount} placeholder="Amount" placeholderTextColor={tokens.colors.subtle} style={styles.input} value={amount} />
        <Text style={styles.label}>Vendor</Text>
        <TextInput onChangeText={setVendorName} placeholder="Vendor" placeholderTextColor={tokens.colors.subtle} style={styles.input} value={vendorName} />
        <Text style={styles.label}>Category</Text>
        <TextInput onChangeText={setCategory} placeholder="Category" placeholderTextColor={tokens.colors.subtle} style={styles.input} value={category} />
        <Text style={styles.label}>Requester</Text>
        <TextInput onChangeText={setRequesterName} placeholder="Requester" placeholderTextColor={tokens.colors.subtle} style={styles.input} value={requesterName} />
        <Text style={styles.label}>Approver</Text>
        <TextInput onChangeText={setApproverName} placeholder="Approver" placeholderTextColor={tokens.colors.subtle} style={styles.input} value={approverName} />
        <Text style={styles.label}>Description</Text>
        <TextInput multiline numberOfLines={5} onChangeText={setDescription} placeholder="Description" placeholderTextColor={tokens.colors.subtle} style={[styles.input, styles.textArea]} value={description} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.sm,
  },
  footerRow: {
    flexDirection: "row",
    gap: tokens.spacing.md,
  },
  input: {
    backgroundColor: "#dfdfdf",
    borderRadius: tokens.radius.lg,
    color: tokens.colors.text,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: tokens.spacing.md,
  },
  label: {
    color: tokens.colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: tokens.spacing.sm,
  },
  textArea: {
    minHeight: 140,
    paddingTop: tokens.spacing.md,
    textAlignVertical: "top",
  },
});
