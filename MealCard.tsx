import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';
import type { Meal } from '../../utils/mealPlanner';

interface MealCardProps {
  meal: Meal;
  onRegenerate?: () => void;
}

const CATEGORY_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  Breakfast: 'wb-sunny',
  Lunch: 'restaurant',
  Dinner: 'dinner-dining',
  Snack: 'local-cafe',
};

export function MealCard({ meal, onRegenerate }: MealCardProps) {
  const icon = CATEGORY_ICONS[meal.category] || 'restaurant';
  const isPortable = meal.portabilityRating >= 4;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <MaterialIcons name={icon} size={14} color={Colors.primary} />
          <Text style={styles.category}>{meal.category}</Text>
        </View>
        {isPortable ? (
          <View style={styles.portableBadge}>
            <MaterialIcons name="directions-car" size={12} color={Colors.warning} />
            <Text style={styles.portableText}>Portable</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.name}>{meal.name}</Text>
      <Text style={styles.description}>{meal.description}</Text>

      <View style={styles.macros}>
        <MacroChip label="Cal" value={meal.calories.toString()} color={Colors.primary} />
        <MacroChip label="Pro" value={`${meal.protein}g`} color="#4A9FFF" />
        <MacroChip label="Carb" value={`${meal.carbs}g`} color={Colors.warning} />
        <MacroChip label="Fat" value={`${meal.fat}g`} color="#AA88FF" />
      </View>

      {onRegenerate ? (
        <Pressable
          style={({ pressed }) => [styles.regenBtn, pressed && { opacity: 0.7 }]}
          onPress={onRegenerate}
          hitSlop={8}
        >
          <MaterialIcons name="refresh" size={14} color={Colors.textSecondary} />
          <Text style={styles.regenText}>Swap meal</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function MacroChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.chip, { borderColor: color + '33', backgroundColor: color + '11' }]}>
      <Text style={[styles.chipLabel, { color }]}>{label}</Text>
      <Text style={[styles.chipValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  category: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  portableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.warningMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  portableText: {
    fontSize: FontSize.xs,
    color: Colors.warning,
    fontWeight: FontWeight.medium,
    includeFontPadding: false,
  },
  name: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    includeFontPadding: false,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  macros: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: 1,
  },
  chipLabel: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    includeFontPadding: false,
  },
  chipValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    includeFontPadding: false,
  },
  regenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  regenText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    includeFontPadding: false,
  },
});
