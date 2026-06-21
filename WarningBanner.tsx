import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/theme';

interface WarningBannerProps {
  level: 'caution' | 'danger';
  message: string;
}

export function WarningBanner({ level, message }: WarningBannerProps) {
  const color = level === 'danger' ? Colors.danger : Colors.warning;
  const bg = level === 'danger' ? Colors.dangerMuted : Colors.warningMuted;
  const icon: keyof typeof MaterialIcons.glyphMap = level === 'danger' ? 'report' : 'warning';

  return (
    <View style={[styles.banner, { backgroundColor: bg, borderColor: color + '55' }]}>
      <MaterialIcons name={icon} size={18} color={color} />
      <Text style={[styles.text, { color }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  text: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    lineHeight: 18,
    includeFontPadding: false,
  },
});
