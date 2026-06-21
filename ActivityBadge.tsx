import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/theme';

type Activity = 'walking' | 'running' | 'still' | 'gym';

interface ActivityBadgeProps {
  activity: Activity;
  large?: boolean;
}

const ACTIVITY_CONFIG: Record<Activity, { label: string; color: string; icon: keyof typeof MaterialIcons.glyphMap }> = {
  walking: { label: 'WALKING', color: Colors.primary, icon: 'directions-walk' },
  running: { label: 'RUNNING', color: '#4A9FFF', icon: 'directions-run' },
  still: { label: 'REST', color: Colors.textSecondary, icon: 'pause-circle-filled' },
  gym: { label: 'GYM', color: Colors.warning, icon: 'fitness-center' },
};

export function ActivityBadge({ activity, large }: ActivityBadgeProps) {
  const config = ACTIVITY_CONFIG[activity] || ACTIVITY_CONFIG.still;

  return (
    <View style={[
      styles.badge,
      large && styles.large,
      { borderColor: config.color + '44', backgroundColor: config.color + '18' }
    ]}>
      <MaterialIcons
        name={config.icon}
        size={large ? 20 : 14}
        color={config.color}
      />
      <Text style={[styles.label, { color: config.color }, large && styles.largeLabel]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
  },
  large: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 1.5,
    includeFontPadding: false,
  },
  largeLabel: {
    fontSize: FontSize.md,
    letterSpacing: 2,
  },
});
