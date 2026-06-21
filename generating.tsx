import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { generatePlan } from '../../ai/planGenerator';

const STEPS = [
  'Analyzing your health profile...',
  'Building your meal plan...',
  'Creating your walking progression...',
  'Setting up your exercise plan...',
  'Finalizing your fasting recommendations...',
  'Compiling your personalized plan...',
];

export default function GeneratingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, setPlan, completeOnboarding } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  useEffect(() => {
    if (!profile) return;

    const TOTAL = STEPS.length;

    generatePlan(profile, ({ step }) => {
      setCurrentStep(step - 1);
      Animated.timing(progressAnim, {
        toValue: step / TOTAL,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }).then(async (plan) => {
      await setPlan(plan);
      await completeOnboarding();
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setDone(true);
      // Maps load live from OpenStreetMap by default.
      // User can download offline tiles anytime from Me → Offline Maps.
      setTimeout(() => router.replace('/(tabs)'), 800);
    });
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + Spacing.xl }]}>
      <StatusBar style="light" />

      <View style={styles.centerContent}>
        <Animated.View style={[styles.iconRing, { transform: [{ scale: pulseAnim }] }]}>
          {done
            ? <MaterialIcons name="check-circle" size={52} color={Colors.primary} />
            : <MaterialIcons name="auto-awesome" size={52} color={Colors.primary} />
          }
        </Animated.View>

        <Text style={styles.title}>{done ? 'Your Plan is Ready!' : 'Building Your Plan'}</Text>
        <Text style={styles.sub}>
          {done ? 'Welcome to S.T.R.I.D.E.' : 'Personalizing everything for your goals...'}
        </Text>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>

        <Text style={styles.stepText}>
          {done ? 'Complete!' : STEPS[currentStep] || STEPS[0]}
        </Text>

        <View style={styles.stepsGrid}>
          {STEPS.map((s, i) => (
            <View key={i} style={styles.stepRow}>
              <MaterialIcons
                name={
                  i < currentStep
                    ? 'check-circle'
                    : i === currentStep
                    ? 'radio-button-checked'
                    : 'radio-button-unchecked'
                }
                size={16}
                color={i <= currentStep ? Colors.primary : Colors.textTertiary}
              />
              <Text style={[styles.stepItem, i <= currentStep && { color: Colors.textSecondary }]}>{s}</Text>
            </View>
          ))}
        </View>

        {done ? (
          <View style={styles.mapNote}>
            <MaterialIcons name="map" size={14} color={Colors.primary} />
            <Text style={styles.mapNoteText}>
              Maps stream live from OpenStreetMap. Download offline maps anytime from Me → Offline Maps.
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        <MaterialIcons name="lock" size={14} color={Colors.textTertiary} />
        <Text style={styles.footerText}>Your data is stored locally and never shared</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'space-between' },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl, gap: Spacing.lg },
  iconRing: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.primary + '18',
    borderWidth: 1.5, borderColor: Colors.primary + '44',
    justifyContent: 'center', alignItems: 'center',
  },
  title: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, textAlign: 'center', includeFontPadding: false },
  sub: { fontSize: FontSize.base, color: Colors.textSecondary, textAlign: 'center', includeFontPadding: false },
  progressTrack: {
    width: '100%', height: 6, backgroundColor: Colors.border,
    borderRadius: BorderRadius.full, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: BorderRadius.full },
  stepText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium, textAlign: 'center', includeFontPadding: false },
  stepsGrid: { width: '100%', gap: Spacing.sm },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  stepItem: { fontSize: FontSize.sm, color: Colors.textTertiary, includeFontPadding: false },
  mapNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: Colors.primaryMuted, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.primary + '33',
    padding: Spacing.sm, width: '100%',
  },
  mapNoteText: { flex: 1, fontSize: FontSize.xs, color: Colors.primary, lineHeight: 16, includeFontPadding: false },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: Spacing.md },
  footerText: { fontSize: FontSize.xs, color: Colors.textTertiary, includeFontPadding: false },
});
