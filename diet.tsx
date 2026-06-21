import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';

const DIET_STYLES = [
  { id: 'Mediterranean', icon: 'spa', desc: 'Olive oil, fish, whole grains, vegetables' },
  { id: 'Keto', icon: 'local-fire-department', desc: 'Very low carb, high fat, moderate protein' },
  { id: 'Paleo', icon: 'eco', desc: 'Whole foods, no grains or dairy' },
  { id: 'Standard', icon: 'restaurant', desc: 'Balanced macros, no restrictions' },
  { id: 'Intermittent Fasting', icon: 'schedule', desc: 'Time-restricted eating windows' },
  { id: 'No preference', icon: 'tune', desc: 'App will optimize for your goal' },
] as const;

const AVOID_OPTIONS = ['Pork', 'Shellfish', 'Gluten', 'Dairy', 'Nuts', 'Spicy food'];

export default function DietScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, setProfile } = useApp();

  const [dietStyle, setDietStyle] = useState(profile?.dietStyle || 'No preference');
  const [avoid, setAvoid] = useState<string[]>(profile?.avoidFoods || []);
  const [customAvoid, setCustomAvoid] = useState('');
  const [allergies, setAllergies] = useState(profile?.allergies || '');

  const toggleAvoid = (item: string) => {
    setAvoid(prev => prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]);
  };

  const handleNext = async () => {
    if (!profile) return;
    await setProfile({
      ...profile,
      dietStyle,
      avoidFoods: customAvoid.trim() ? [...avoid, customAvoid.trim()] : avoid,
      allergies,
      updatedAt: Date.now(),
    });
    router.push('/onboarding/supplements');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.step}>Step 5 of 7</Text>
        <Text style={styles.title}>Diet Preferences</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionLabel}>Diet Style</Text>
        {DIET_STYLES.map(d => (
          <Pressable
            key={d.id}
            style={({ pressed }) => [styles.dietCard, dietStyle === d.id && styles.dietCardSelected, pressed && { opacity: 0.85 }]}
            onPress={() => setDietStyle(d.id)}
          >
            <MaterialIcons name={d.icon as any} size={22} color={dietStyle === d.id ? Colors.primary : Colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.dietName, dietStyle === d.id && { color: Colors.primary }]}>{d.id}</Text>
              <Text style={styles.dietDesc}>{d.desc}</Text>
            </View>
            {dietStyle === d.id ? <MaterialIcons name="check-circle" size={20} color={Colors.primary} /> : null}
          </Pressable>
        ))}

        <Text style={[styles.sectionLabel, { marginTop: Spacing.sm }]}>Foods I won't eat</Text>
        <View style={styles.chipGrid}>
          {AVOID_OPTIONS.map(a => (
            <Pressable
              key={a}
              style={({ pressed }) => [styles.avoidChip, avoid.includes(a) && styles.avoidChipSelected, pressed && { opacity: 0.8 }]}
              onPress={() => toggleAvoid(a)}
            >
              <Text style={[styles.avoidText, avoid.includes(a) && styles.avoidTextSelected]}>{a}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          style={styles.input}
          value={customAvoid}
          onChangeText={setCustomAvoid}
          placeholder="Other foods to avoid..."
          placeholderTextColor={Colors.textTertiary}
        />

        <Text style={[styles.sectionLabel, { marginTop: Spacing.sm }]}>Allergies</Text>
        <TextInput
          style={styles.input}
          value={allergies}
          onChangeText={setAllergies}
          placeholder="Any food allergies..."
          placeholderTextColor={Colors.textTertiary}
          multiline
        />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.lg, gap: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.border },
  step: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.bold, letterSpacing: 1, textTransform: 'uppercase', includeFontPadding: false },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, includeFontPadding: false },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: Spacing.xl },
  sectionLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, includeFontPadding: false },
  dietCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.border, padding: Spacing.md,
  },
  dietCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  dietName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  dietDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2, includeFontPadding: false },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  avoidChip: {
    paddingHorizontal: Spacing.md, paddingVertical: 9,
    borderRadius: BorderRadius.full, borderWidth: 1.5,
    borderColor: Colors.border, backgroundColor: Colors.cardBg,
  },
  avoidChipSelected: { borderColor: Colors.danger, backgroundColor: Colors.dangerMuted },
  avoidText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  avoidTextSelected: { color: Colors.danger, fontWeight: FontWeight.bold },
  input: {
    backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: 13,
    fontSize: FontSize.base, color: Colors.textPrimary,
  },
  footer: { padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  nextBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingVertical: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
  },
  nextText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
});
