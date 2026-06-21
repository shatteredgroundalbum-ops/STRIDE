import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';

type Goal = 'Lose Weight' | 'Build Muscle' | 'Be More Athletic';

const GOALS: { id: Goal; icon: keyof typeof MaterialIcons.glyphMap; description: string; benefits: string[] }[] = [
  {
    id: 'Lose Weight',
    icon: 'trending-down',
    description: 'Burn fat, reduce body weight, improve metabolic health',
    benefits: [
      'Reduced cardiovascular disease risk',
      'Better blood pressure and cholesterol',
      'Improved sleep quality',
      'Higher energy levels throughout the day',
      'Reduced joint pain and inflammation',
      'Improved insulin sensitivity',
    ],
  },
  {
    id: 'Build Muscle',
    icon: 'fitness-center',
    description: 'Increase lean mass, improve strength and physique',
    benefits: [
      'Higher resting metabolic rate',
      'Improved bone density',
      'Better posture and reduced injury risk',
      'Enhanced physical performance',
      'Increased testosterone and growth hormone',
      'Greater functional strength for daily life',
    ],
  },
  {
    id: 'Be More Athletic',
    icon: 'directions-run',
    description: 'Improve endurance, agility, speed, and performance',
    benefits: [
      'Significantly improved cardiovascular health',
      'Enhanced VO2 max and lung capacity',
      'Better coordination and balance',
      'Faster recovery between sessions',
      'Reduced resting heart rate',
      'Improved mental resilience and focus',
    ],
  },
];

export default function GoalsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, setProfile } = useApp();
  const [selected, setSelected] = useState<Goal | null>(profile?.goal || null);
  const [expanded, setExpanded] = useState<Goal | null>(null);

  const handleSelect = (goal: Goal) => {
    setSelected(goal);
    setExpanded(expanded === goal ? null : goal);
  };

  const handleNext = async () => {
    if (!selected || !profile) return;
    await setProfile({ ...profile, goal: selected });
    router.push('/onboarding/about');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.step}>Step 1 of 7</Text>
        <Text style={styles.title}>What is your primary goal?</Text>
        <Text style={styles.sub}>Choose one. You can always update this later.</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {GOALS.map(g => {
          const isSelected = selected === g.id;
          const isExpanded = expanded === g.id;
          return (
            <Pressable
              key={g.id}
              style={({ pressed }) => [
                styles.card,
                isSelected && styles.cardSelected,
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => handleSelect(g.id)}
            >
              <View style={styles.cardRow}>
                <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
                  <MaterialIcons name={g.icon} size={28} color={isSelected ? Colors.textInverse : Colors.primary} />
                </View>
                <View style={styles.cardText}>
                  <Text style={[styles.goalName, isSelected && styles.goalNameSelected]}>{g.id}</Text>
                  <Text style={styles.goalDesc}>{g.description}</Text>
                </View>
                <MaterialIcons
                  name={isExpanded ? 'expand-less' : 'expand-more'}
                  size={22}
                  color={isSelected ? Colors.primary : Colors.textSecondary}
                />
              </View>

              {isExpanded ? (
                <View style={styles.benefits}>
                  <Text style={styles.benefitsTitle}>Benefits</Text>
                  {g.benefits.map((b, i) => (
                    <View key={i} style={styles.benefitRow}>
                      <MaterialIcons name="check" size={14} color={Colors.primary} />
                      <Text style={styles.benefitText}>{b}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Pressable
          style={({ pressed }) => [styles.nextBtn, !selected && styles.nextBtnDisabled, pressed && { opacity: 0.85 }]}
          onPress={handleNext}
          disabled={!selected}
        >
          <Text style={styles.nextText}>Continue</Text>
          <MaterialIcons name="arrow-forward" size={20} color={selected ? Colors.textInverse : Colors.textTertiary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    padding: Spacing.lg,
    gap: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  step: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.bold, letterSpacing: 1, textTransform: 'uppercase', includeFontPadding: false },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, includeFontPadding: false },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  cardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.primary + '18',
    justifyContent: 'center', alignItems: 'center',
  },
  iconWrapSelected: { backgroundColor: Colors.primary },
  cardText: { flex: 1, gap: 2 },
  goalName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },
  goalNameSelected: { color: Colors.primary },
  goalDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18 },
  benefits: { gap: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
  benefitsTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.8, includeFontPadding: false },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  benefitText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18 },
  footer: { padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  nextBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  nextBtnDisabled: { backgroundColor: Colors.border },
  nextText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
});
