import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../constants/theme';

export default function SessionModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + Spacing.xl }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Start a Session</Text>
        <Pressable style={styles.closeBtn} onPress={() => router.back()}>
          <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.options}>
        <Pressable
          style={({ pressed }) => [styles.optionCard, pressed && { opacity: 0.85 }]}
          onPress={() => { router.back(); router.push('/(tabs)/move'); }}
        >
          <View style={[styles.optionIcon, { backgroundColor: Colors.primary + '18' }]}>
            <MaterialIcons name="map" size={36} color={Colors.primary} />
          </View>
          <Text style={styles.optionTitle}>Outdoor Session</Text>
          <Text style={styles.optionDesc}>GPS tracking, live route, walking/running detection, calorie burn with OpenStreetMap</Text>
          <View style={styles.optionBadge}>
            <MaterialIcons name="gps-fixed" size={12} color={Colors.primary} />
            <Text style={styles.optionBadgeText}>GPS Active</Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.optionCard, { borderColor: Colors.warning + '44' }, pressed && { opacity: 0.85 }]}
          onPress={() => { router.back(); router.push('/(tabs)/move'); }}
        >
          <View style={[styles.optionIcon, { backgroundColor: Colors.warning + '18' }]}>
            <MaterialIcons name="fitness-center" size={36} color={Colors.warning} />
          </View>
          <Text style={[styles.optionTitle, { color: Colors.warning }]}>Gym Session</Text>
          <Text style={styles.optionDesc}>Timer-based, intensity selector, estimated calorie burn, optional HR monitor</Text>
          <View style={[styles.optionBadge, { backgroundColor: Colors.warningMuted, borderColor: Colors.warning + '33' }]}>
            <MaterialIcons name="fitness-center" size={12} color={Colors.warning} />
            <Text style={[styles.optionBadgeText, { color: Colors.warning }]}>Indoor Mode</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.disclaimer}>
        <MaterialIcons name="health-and-safety" size={14} color={Colors.textTertiary} />
        <Text style={styles.disclaimerText}>
          If you have any health conditions, consult your doctor before starting exercise. This app does not provide medical advice.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, includeFontPadding: false },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.cardBg, justifyContent: 'center', alignItems: 'center' },
  options: { flex: 1, padding: Spacing.lg, gap: Spacing.md, justifyContent: 'center' },
  optionCard: {
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.xl,
    borderWidth: 1.5, borderColor: Colors.primary + '44', padding: Spacing.xl,
    alignItems: 'center', gap: Spacing.md,
  },
  optionIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  optionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.primary, includeFontPadding: false },
  optionDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  optionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primaryMuted, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.primary + '33',
  },
  optionBadgeText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.bold, includeFontPadding: false },
  disclaimer: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    margin: Spacing.lg, padding: Spacing.md,
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  disclaimerText: { flex: 1, fontSize: FontSize.xs, color: Colors.textTertiary, lineHeight: 17, includeFontPadding: false },
});
