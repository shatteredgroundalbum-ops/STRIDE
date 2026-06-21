import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  style?: ViewStyle;
  compact?: boolean;
}

export function MetricCard({ label, value, unit, icon, accentColor = Colors.primary, style, compact }: MetricCardProps) {
  return (
    <View style={[styles.card, compact && styles.compact, style]}>
      {icon && (
        <View style={[styles.iconWrap, { backgroundColor: accentColor + '22' }]}>
          {icon}
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
          {unit ? <Text style={styles.unit}>{unit}</Text> : null}
        </View>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  compact: {
    padding: Spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    includeFontPadding: false,
  },
  unit: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    includeFontPadding: false,
  },
});
