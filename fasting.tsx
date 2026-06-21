import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { useFasting } from '../../hooks/useFasting';
import { TopBar } from '../../components/layout/TopBar';
import { FastingRing } from '../../components/ui/FastingRing';
import { MilestoneModal } from '../../components/ui/MilestoneModal';
import { WarningBanner } from '../../components/ui/WarningBanner';
import { FASTING_MILESTONES } from '../../data/milestones';
import { getProgressToNextMilestone, formatFastDuration } from '../../utils/fastingEngine';
import { useAlert } from '@/template';

export default function FastingScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useApp();
  const { showAlert } = useAlert();
  const {
    fastState, elapsed, bodyState, warningLevel, nextMilestone, lastMilestone,
    pendingMilestone, isLoading, startFast, endFast, dismissMilestone,
  } = useFasting();

  const handleEndFast = () => {
    showAlert('End Fast?', 'Are you sure you want to end your current fast?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End Fast', style: 'destructive', onPress: endFast },
    ]);
  };

  const progress = elapsed.totalHours > 0
    ? getProgressToNextMilestone(elapsed.totalHours)
    : 0;

  const ringColor = warningLevel === 'danger' ? Colors.danger
    : warningLevel === 'caution' ? Colors.warning
    : Colors.primary;

  const elapsedStr = elapsed.totalHours > 0
    ? `${elapsed.hours.toString().padStart(2, '0')}:${elapsed.minutes.toString().padStart(2, '0')}:${elapsed.seconds.toString().padStart(2, '0')}`
    : '00:00:00';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <TopBar userName={profile?.firstName} />

      {warningLevel !== 'normal' ? (
        <WarningBanner
          level={warningLevel}
          message={warningLevel === 'danger'
            ? 'You have been fasting for an extended period. Immediate medical supervision required.'
            : 'You have reached the 8-day mark. All major fasting benefits have been triggered. Please consult your doctor before continuing.'
          }
        />
      ) : null}

      <MilestoneModal milestone={pendingMilestone} onDismiss={dismissMilestone} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ring */}
        <View style={styles.ringSection}>
          <FastingRing
            progress={progress}
            size={220}
            elapsedLabel={fastState.isActive ? elapsedStr : 'Fasting'}
            subLabel={fastState.isActive ? bodyState.state : 'Tap below to start'}
            color={ringColor}
          />
        </View>

        {/* Body State */}
        {fastState.isActive ? (
          <View style={styles.bodyStateCard}>
            <Text style={styles.bodyStateLabel}>Current State</Text>
            <Text style={[styles.bodyStateName, { color: ringColor }]}>{bodyState.state}</Text>
            <Text style={styles.bodyStateDetail}>{bodyState.detail}</Text>
          </View>
        ) : null}

        {/* Next Milestone */}
        {fastState.isActive && nextMilestone ? (
          <View style={styles.milestoneCard}>
            <MaterialIcons name="flag" size={16} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.milestoneLabel}>Next milestone in</Text>
              <Text style={styles.milestoneTarget}>
                {formatFastDuration(nextMilestone.hours - elapsed.totalHours)} — {nextMilestone.title}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Controls */}
        <View style={styles.ctrlSection}>
          {!fastState.isActive ? (
            <Pressable
              style={({ pressed }) => [styles.startFastBtn, pressed && { opacity: 0.85 }]}
              onPress={startFast}
            >
              <MaterialIcons name="play-arrow" size={28} color={Colors.textInverse} />
              <Text style={styles.startFastText}>START FAST</Text>
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [styles.endFastBtn, pressed && { opacity: 0.85 }]}
              onPress={handleEndFast}
            >
              <MaterialIcons name="stop" size={22} color={Colors.danger} />
              <Text style={styles.endFastText}>END FAST</Text>
            </Pressable>
          )}
        </View>

        {/* Milestone Timeline */}
        <Text style={styles.sectionTitle}>Milestone Timeline</Text>
        {FASTING_MILESTONES.map(m => {
          const passed = elapsed.totalHours >= m.hours;
          const current = lastMilestone?.hours === m.hours;
          return (
            <View key={m.hours} style={[styles.timelineRow, current && styles.timelineRowCurrent]}>
              <View style={[styles.timelineDot, passed && styles.timelineDotFilled, { borderColor: ringColor }]}>
                {passed ? <MaterialIcons name="check" size={10} color={Colors.textInverse} /> : null}
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.timelineHeader}>
                  <Text style={[styles.timelineLabel, passed && { color: Colors.primary }]}>{m.label}</Text>
                  <Text style={[styles.timelineTitle, passed && { color: Colors.textPrimary }]}>{m.title}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxl, alignItems: 'stretch' },
  ringSection: { alignItems: 'center', paddingVertical: Spacing.lg },
  bodyStateCard: {
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, gap: 4, alignItems: 'center',
  },
  bodyStateLabel: { fontSize: FontSize.xs, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.8, includeFontPadding: false },
  bodyStateName: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, includeFontPadding: false },
  bodyStateDetail: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 18 },
  milestoneCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primaryMuted, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.primary + '33', padding: Spacing.md,
  },
  milestoneLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, includeFontPadding: false },
  milestoneTarget: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold, includeFontPadding: false },
  ctrlSection: { alignItems: 'center' },
  startFastBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full,
    paddingVertical: 18, paddingHorizontal: 60,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  startFastText: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.textInverse, letterSpacing: 2, includeFontPadding: false },
  endFastBtn: {
    borderWidth: 2, borderColor: Colors.danger, borderRadius: BorderRadius.full,
    paddingVertical: 14, paddingHorizontal: 40,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.dangerMuted,
  },
  endFastText: { fontSize: FontSize.base, fontWeight: FontWeight.extrabold, color: Colors.danger, letterSpacing: 1.5, includeFontPadding: false },
  sectionTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, includeFontPadding: false },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
  timelineRowCurrent: { backgroundColor: Colors.primaryMuted, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.sm },
  timelineDot: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background,
  },
  timelineDotFilled: { backgroundColor: Colors.primary },
  timelineHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  timelineLabel: { fontSize: FontSize.xs, color: Colors.textTertiary, fontWeight: FontWeight.bold, width: 38, includeFontPadding: false },
  timelineTitle: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
});
