import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppScreen, SearchField, SegmentedControl, SurfaceCard } from "../../../shared/components/ui";
import { AppCategory, CategoryKind } from "../../../store/appStore";
import { tokens } from "../../../shared/theme/tokens";

type CategoriesScreenProps = {
  categories: AppCategory[];
  initialKind: CategoryKind;
  onBack: () => void;
};

export function CategoriesScreen({ categories, initialKind, onBack }: CategoriesScreenProps) {
  const [kind, setKind] = useState<CategoryKind>(initialKind);
  const [query, setQuery] = useState("");

  const filtered = categories.filter((category) => category.kind === kind && category.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <AppScreen onBack={onBack} subtitle="Latest" title="Categories">
      <SegmentedControl
        onSelect={setKind}
        options={[
          { key: "expense", label: "Expenses" },
          { key: "income", label: "Income" },
        ]}
        selected={kind}
      />
      <SearchField onChangeText={setQuery} placeholder="Search" value={query} />
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((category) => (
          <SurfaceCard key={category.id} style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: `${category.tint}22` }]}>
              <Ionicons color={category.tint} name={category.icon as keyof typeof Ionicons.glyphMap} size={24} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>{category.name}</Text>
              <Text style={styles.meta}>{category.count} items</Text>
            </View>
            <Ionicons color={tokens.colors.text} name="chevron-forward" size={22} />
          </SurfaceCard>
        ))}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  copy: {
    flex: 1,
    gap: tokens.spacing.xxs,
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: tokens.radius.pill,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  list: {
    gap: tokens.spacing.sm,
  },
  meta: {
    color: tokens.colors.muted,
    fontSize: 14,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: tokens.spacing.md,
  },
  title: {
    color: tokens.colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
});