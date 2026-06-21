import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { FITNESS_LEVELS, type FitnessLevel } from '../../data/fitnessLevels';

type Gender = 'Male' | 'Female' | 'Prefer not to say';

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, setProfile } = useApp();

  const [firstName, setFirstName] = useState(profile?.firstName || '');
  const [age, setAge] = useState(profile?.age?.toString() || '');
  const [gender, setGender] = useState<Gender>(profile?.gender || 'Male');
  const [heightFt, setHeightFt] = useState(profile?.heightFeet?.toString() || '5');
  const [heightIn, setHeightIn] = useState(profile?.heightInches?.toString() || '10');
  const [weight, setWeight] = useState(profile?.weightLbs?.toString() || '');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(profile?.fitnessLevel || 'Novice');

  const isValid = age.trim() !== '' && weight.trim() !== '' && !isNaN(Number(age)) && !isNaN(Number(weight));

  const handleNext = async () => {
    if (!isValid || !profile) return;
    await setProfile({
      ...profile,
      firstName: firstName.trim() || undefined,
      age: parseInt(age),
      gender,
      heightFeet: parseInt(heightFt) || 5,
      heightInches: parseInt(heightIn) || 10,
      weightLbs: parseFloat(weight),
      fitnessLevel,
      proteinTarget: parseFloat(weight),
      updatedAt: Date.now(),
    });
    router.push('/onboarding/health');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.step}>Step 2 of 7</Text>
        <Text style={styles.title}>About You</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Field label="First Name (optional)">
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Your name"
            placeholderTextColor={Colors.textTertiary}
          />
        </Field>

        <Field label="Age *">
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            placeholder="e.g. 35"
            placeholderTextColor={Colors.textTertiary}
            maxLength={3}
          />
        </Field>

        <Field label="Gender">
          <View style={styles.segmented}>
            {(['Male', 'Female', 'Prefer not to say'] as Gender[]).map(g => (
              <Pressable
                key={g}
                style={({ pressed }) => [
                  styles.segment,
                  gender === g && styles.segmentSelected,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => setGender(g)}
              >
                <Text style={[styles.segmentText, gender === g && styles.segmentTextSelected]}>
                  {g === 'Prefer not to say' ? 'Not saying' : g}
                </Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <Field label="Height">
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <TextInput style={styles.inputSmall} value={heightFt} onChangeText={setHeightFt} keyboardType="number-pad" maxLength={1} />
              <Text style={styles.inputUnit}>ft</Text>
            </View>
            <View style={styles.inputGroup}>
              <TextInput style={styles.inputSmall} value={heightIn} onChangeText={setHeightIn} keyboardType="number-pad" maxLength={2} />
              <Text style={styles.inputUnit}>in</Text>
            </View>
          </View>
        </Field>

        <Field label="Weight (lbs) *">
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            placeholder="e.g. 185"
            placeholderTextColor={Colors.textTertiary}
            maxLength={6}
          />
        </Field>

        <Field label="Fitness Level">
          {FITNESS_LEVELS.map(fl => (
            <Pressable
              key={fl.id}
              style={({ pressed }) => [
                styles.levelCard,
                fitnessLevel === fl.id && styles.levelCardSelected,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setFitnessLevel(fl.id)}
            >
              {fitnessLevel === fl.id
                ? <MaterialIcons name="radio-button-checked" size={18} color={Colors.primary} />
                : <MaterialIcons name="radio-button-unchecked" size={18} color={Colors.textTertiary} />
              }
              <View style={{ flex: 1 }}>
                <Text style={[styles.levelName, fitnessLevel === fl.id && { color: Colors.primary }]}>{fl.id}</Text>
                <Text style={styles.levelDesc}>{fl.description}</Text>
              </View>
            </Pressable>
          ))}
        </Field>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Pressable
          style={({ pressed }) => [styles.nextBtn, !isValid && styles.nextBtnDisabled, pressed && { opacity: 0.85 }]}
          onPress={handleNext}
          disabled={!isValid}
        >
          <Text style={styles.nextText}>Continue</Text>
          <MaterialIcons name="arrow-forward" size={20} color={isValid ? Colors.textInverse : Colors.textTertiary} />
        </Pressable>
      </View>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>{label}</Text>
      {children}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: { gap: Spacing.xs },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, includeFontPadding: false },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.lg, gap: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.border },
  step: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.bold, letterSpacing: 1, textTransform: 'uppercase', includeFontPadding: false },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, includeFontPadding: false },
  scroll: { flex: 1 },
  content: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xl },
  input: {
    backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: 13,
    fontSize: FontSize.base, color: Colors.textPrimary,
  },
  row: { flexDirection: 'row', gap: Spacing.md },
  inputGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  inputSmall: {
    flex: 1, backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: 13,
    fontSize: FontSize.base, color: Colors.textPrimary, textAlign: 'center',
  },
  inputUnit: { fontSize: FontSize.base, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  segmented: { flexDirection: 'row', borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  segment: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: Colors.cardBg },
  segmentSelected: { backgroundColor: Colors.primary },
  segmentText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  segmentTextSelected: { color: Colors.textInverse, fontWeight: FontWeight.bold },
  levelCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.border, padding: Spacing.md,
  },
  levelCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  levelName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  levelDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2, includeFontPadding: false },
  footer: { padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  nextBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingVertical: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
  },
  nextBtnDisabled: { backgroundColor: Colors.border },
  nextText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
});
