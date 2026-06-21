import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';
import type { FastingMilestone } from '../../data/milestones';

interface MilestoneModalProps {
  milestone: FastingMilestone | null;
  onDismiss: () => void;
}

const LEVEL_COLORS: Record<FastingMilestone['level'], string> = {
  info: Colors.info,
  good: Colors.primary,
  great: Colors.primary,
  warning: Colors.warning,
  danger: Colors.danger,
};

const LEVEL_ICONS: Record<FastingMilestone['level'], keyof typeof MaterialIcons.glyphMap> = {
  info: 'info',
  good: 'local-fire-department',
  great: 'stars',
  warning: 'warning',
  danger: 'report',
};

export function MilestoneModal({ milestone, onDismiss }: MilestoneModalProps) {
  if (!milestone) return null;

  const color = LEVEL_COLORS[milestone.level];
  const icon = LEVEL_ICONS[milestone.level];

  return (
    <Modal visible={true} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={[styles.iconCircle, { backgroundColor: color + '22', borderColor: color + '44' }]}>
            <MaterialIcons name={icon} size={36} color={color} />
          </View>
          <Text style={[styles.label, { color }]}>{milestone.label}</Text>
          <Text style={styles.title}>{milestone.title}</Text>
          <Text style={styles.body}>{milestone.body}</Text>
          <Pressable
            style={({ pressed }) => [styles.btn, { backgroundColor: color }, pressed && { opacity: 0.8 }]}
            onPress={onDismiss}
          >
            <Text style={[styles.btnText, { color: milestone.level === 'warning' || milestone.level === 'danger' ? '#000' : Colors.textInverse }]}>
              Got It
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  sheet: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    width: '100%',
    maxWidth: 380,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    includeFontPadding: false,
  },
  body: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  btn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  btnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    includeFontPadding: false,
  },
});
