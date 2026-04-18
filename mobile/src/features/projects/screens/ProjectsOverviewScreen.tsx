import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, PrimaryButton, SearchField, SectionTitle, SurfaceCard } from "../../../shared/components/ui";
import { AppProject, formatCurrency, getInitials, getProjectHealth } from "../../../store/appStore";
import { tokens } from "../../../shared/theme/tokens";

type ProjectsOverviewScreenProps = {
  projects: AppProject[];
  selectedProjectId: string;
  onCreateProject: () => void;
  onOpenProject: (projectId: string) => void;
  onSelectProject: (projectId: string) => void;
};

export function ProjectsOverviewScreen({ onCreateProject, onOpenProject, onSelectProject, projects, selectedProjectId }: ProjectsOverviewScreenProps) {
  const [query, setQuery] = useState("");

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SectionTitle action={<PrimaryButton label="Create Project" onPress={onCreateProject} variant="secondary" />} title="My Projects" />
      <SearchField onChangeText={setQuery} placeholder="Search project" value={query} />

      <View style={styles.grid}>
        {filteredProjects.map((project) => {
          const active = project.id === selectedProjectId;

          return (
            <Pressable key={project.id} onPress={() => {
              onSelectProject(project.id);
              onOpenProject(project.id);
            }} style={styles.cardPressable}>
              <SurfaceCard style={[styles.projectCard, active ? styles.projectCardActive : null]}>
                <View style={styles.projectHeader}>
                  <Avatar initials={getInitials(project.name)} size={42} />
                  {active ? <Ionicons color={tokens.colors.primary} name="checkmark-circle" size={22} /> : null}
                </View>
                <Text style={styles.projectTitle}>{project.name}</Text>
                <Text style={styles.projectAmount}>{formatCurrency(project.budgetTotal).replace("+", "")}</Text>
                <View style={styles.projectMetaRow}>
                  <Text style={styles.projectMeta}>{getProjectHealth(project)}%</Text>
                  <Text style={styles.projectMeta}>{project.updatedAt.slice(0, 10)}</Text>
                </View>
                <Text style={styles.projectCaption}>{project.businessModel}</Text>
              </SurfaceCard>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardPressable: {
    width: "48%",
  },
  container: {
    backgroundColor: tokens.colors.background,
    gap: tokens.spacing.lg,
    paddingBottom: 120,
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.spacing.md,
    justifyContent: "space-between",
  },
  projectAmount: {
    color: tokens.colors.text,
    fontSize: 26,
    fontWeight: "900",
  },
  projectCaption: {
    color: tokens.colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  projectCard: {
    gap: tokens.spacing.sm,
    minHeight: 190,
  },
  projectCardActive: {
    borderColor: tokens.colors.primary,
    borderWidth: 2,
  },
  projectHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  projectMeta: {
    color: tokens.colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  projectMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  projectTitle: {
    color: tokens.colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
});