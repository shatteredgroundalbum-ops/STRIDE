import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';

const OCCUPATION_TYPES = ['Desk job', 'On my feet all day', 'On the road', 'Mixed'];
const LIVING_SITUATIONS = ['Home', 'Truck', 'Frequent travel', 'Other'];
const COOKING_ACCESS = ['Full kitchen', 'Microwave only', 'No cooking available'];
const SLEEP_VALUES = Array.from({ length: 13 }, (_, i) => i + 4); // 4-16

export default function LifestyleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, setProfile } = useApp();

  const [occupation, setOccupation] = useState(profile?.occupationType || 'Desk job');
  const [livingSituation, setLivingSituation] = useState(profile?.livingSituation || 'Home');
  const [cooking, setCooking] = useState(profile?.cookingAccess || 'Full kitchen');
  const [sleep, setSleep] = useState(profile?.sleepHours || 7);

  const handleNext = async () => {
    if (!profile) return;
    await setProfile({
      ...profile,
      occupationType: occupation,
      livingSituation,
      cookingAccess: cooking,
      sleepHours: sleep,
      updatedAt: Date.now(),
    });
    router.push('/onboarding/diet');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.step}>Step 4 of 7</Text>
        <Text style={styles.title}>Your Lifestyle</Text>
        <Text style={styles.sub}>This shapes your meal and activity plan.</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section label="Occupation Type" icon="work">
          {OCCUPATION_TYPES.map(o => <OptionChip key={o} label={o} selected={occupation === o} onPress={() => setOccupation(o)} />)}
        </Section>

        <Section label="Living Situation" icon="home">
          {LIVING_SITUATIONS.map(l => <OptionChip key={l} label={l} selected={livingSituation === l} onPress={() => setLivingSituation(l)} />)}
        </Section>

        <Section label="Cooking Access" icon="kitchen">
          {COOKING_ACCESS.map(c => <OptionChip key={c} label={c} selected={cooking === c} onPress={() => setCooking(c)} />)}
        </Section>

        <Section label="Average Daily Sleep" icon="bedtime">
          <View style={styles.sleepGrid}>
            {SLEEP_VALUES.map(s => (
              <Pressable
                key={s}
                style={({ pressed }) => [styles.sleepBtn, sleep === s && styles.sleepBtnSelected, pressed && { opacity: 0.8 }]}
                onPress={() => setSleep(s)}
              >
                <Text style={[styles.sleepText, sleep === s && styles.sleepTextSelected]}>{s}h</Text>
              </Pressable>
            ))}
          </View>
        </Section>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Pressable
          style={({ pressed }) => [styles.nextBtn, pressed && { opacity: 0.85 }]}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>Continue</Text>
          <MaterialIcons name="arrow-forward" size={20} color={Colors.textInverse} />
        </Pressable>
      </View>
    </View>
  );
}

function Section({ label, icon, children }: { label: string; icon: keyof typeof MaterialIcons.glyphMap; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.wrap}>
      <View style={sectionStyles.labelRow}>
        <MaterialIcons name={icon} size={16} color={Colors.primary} />
        <Text style={sectionStyles.label}>{label}</Text>
      </View>
      <View style={sectionStyles.options}>{children}</View>
    </View>
  );
}

function OptionChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [optStyles.chip, selected && optStyles.chipSelected, pressed && { opacity: 0.8 }]}
      onPress={onPress}
    >
      <Text style={[optStyles.text, selected && optStyles.textSelected]}>{label}</Text>
    </Pressable>
  );
}

const sectionStyles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
});

const optStyles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    borderRadius: BorderRadius.full, borderWidth: 1.5,
    borderColor: Colors.border, backgroundColor: Colors.cardBg,
  },
  chipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  text: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  textSelected: { color: Colors.primary, fontWeight: FontWeight.bold },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.lg, gap: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.border },
  step: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.bold, letterSpacing: 1, textTransform: 'uppercase', includeFontPadding: false },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, includeFontPadding: false },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  scroll: { flex: 1 },
  content: { padding: Spacing.lg, gap: Spacing.xl },
  sleepGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  sleepBtn: {
    width: 52, height: 44, borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.cardBg,
    justifyContent: 'center', alignItems: 'center',
  },
  sleepBtnSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  sleepText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  sleepTextSelected: { color: Colors.primary, fontWeight: FontWeight.bold },
  footer: { padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  nextBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingVertical: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
  },
  nextText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
});
