import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { calculateNutritionTargets } from '../../utils/nutritionCalc';

export default function NutritionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, setProfile } = useApp();

  const [calories, setCalories] = useState(profile?.calorieTarget || 1800);
  const [protein, setProtein] = useState(profile?.proteinTarget || 150);
  const [carbs, setCarbs] = useState(profile?.carbTarget || 150);
  const [fat, setFat] = useState(profile?.fatTarget || 60);
  const [water, setWater] = useState(profile?.waterTargetOz || 88);
  const [meals, setMeals] = useState(profile?.mealFrequency || 3);

  useEffect(() => {
    if (!profile) return;
    const hIn = profile.heightFeet * 12 + profile.heightInches;
    const targets = calculateNutritionTargets({
      weightLbs: profile.weightLbs || 175,
      heightInches: hIn || 70,
      age: profile.age || 30,
      gender: profile.gender || 'Male',
      goal: profile.goal || 'Lose Weight',
      activityLevel: profile.occupationType === 'On my feet all day' ? 'very' : 'light',
      dietStyle: profile.dietStyle,
    });
    setCalories(targets.calories);
    setProtein(targets.protein);
    setCarbs(targets.carbs);
    setFat(targets.fat);
    setWater(targets.water);
    setMeals(targets.mealFrequency);
  }, []);

  const handleNext = async () => {
    if (!profile) return;
    await setProfile({
      ...profile,
      calorieTarget: calories,
      proteinTarget: protein,
      carbTarget: carbs,
      fatTarget: fat,
      waterTargetOz: water,
      mealFrequency: meals,
      updatedAt: Date.now(),
    });
    router.push('/onboarding/generating');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.step}>Step 7 of 7</Text>
        <Text style={styles.title}>Nutrition Targets</Text>
        <Text style={styles.sub}>Calculated for your goal. Adjust if needed.</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <NutritionRow
          label="Daily Calories"
          value={calories}
          unit="kcal"
          step={50}
          min={1000}
          max={5000}
          color={Colors.primary}
          icon="local-fire-department"
          onChange={setCalories}
        />
        <NutritionRow
          label="Daily Protein"
          value={protein}
          unit="g"
          step={5}
          min={50}
          max={400}
          color="#4A9FFF"
          icon="fitness-center"
          onChange={setProtein}
        />
        <NutritionRow
          label="Daily Carbohydrates"
          value={carbs}
          unit="g"
          step={5}
          min={20}
          max={500}
          color={Colors.warning}
          icon="grain"
          onChange={setCarbs}
        />
        <NutritionRow
          label="Daily Fat"
          value={fat}
          unit="g"
          step={5}
          min={20}
          max={250}
          color="#AA88FF"
          icon="opacity"
          onChange={setFat}
        />
        <NutritionRow
          label="Daily Water"
          value={water}
          unit="oz"
          step={8}
          min={32}
          max={256}
          color={Colors.info}
          icon="water-drop"
          onChange={setWater}
        />
        <NutritionRow
          label="Meals Per Day"
          value={meals}
          unit="meals"
          step={1}
          min={1}
          max={8}
          color={Colors.primary}
          icon="restaurant"
          onChange={setMeals}
        />

        <View style={styles.note}>
          <MaterialIcons name="info" size={14} color={Colors.info} />
          <Text style={styles.noteText}>
            These targets are calculated using the Mifflin-St Jeor equation. 1g protein per lb of bodyweight is the gold standard for muscle preservation during any goal.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Pressable
          style={({ pressed }) => [styles.nextBtn, pressed && { opacity: 0.85 }]}
          onPress={handleNext}
        >
          <MaterialIcons name="auto-awesome" size={20} color={Colors.textInverse} />
          <Text style={styles.nextText}>Generate My Plan</Text>
        </Pressable>
      </View>
    </View>
  );
}

function NutritionRow({
  label, value, unit, step, min, max, color, icon, onChange,
}: {
  label: string; value: number; unit: string; step: number;
  min: number; max: number; color: string; icon: keyof typeof MaterialIcons.glyphMap;
  onChange: (v: number) => void;
}) {
  return (
    <View style={[rowStyles.card, { borderLeftColor: color, borderLeftWidth: 3 }]}>
      <View style={rowStyles.labelRow}>
        <MaterialIcons name={icon} size={16} color={color} />
        <Text style={rowStyles.label}>{label}</Text>
      </View>
      <View style={rowStyles.controls}>
        <Pressable
          style={({ pressed }) => [rowStyles.btn, pressed && { opacity: 0.7 }]}
          onPress={() => onChange(Math.max(min, value - step))}
          hitSlop={8}
        >
          <MaterialIcons name="remove" size={18} color={Colors.textPrimary} />
        </Pressable>
        <View style={rowStyles.valueWrap}>
          <Text style={[rowStyles.value, { color }]}>{value}</Text>
          <Text style={rowStyles.unit}>{unit}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [rowStyles.btn, pressed && { opacity: 0.7 }]}
          onPress={() => onChange(Math.min(max, value + step))}
          hitSlop={8}
        >
          <MaterialIcons name="add" size={18} color={Colors.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  label: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  controls: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  btn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.border, justifyContent: 'center', alignItems: 'center',
  },
  valueWrap: { alignItems: 'center', minWidth: 70 },
  value: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, includeFontPadding: false },
  unit: { fontSize: FontSize.xs, color: Colors.textSecondary, includeFontPadding: false },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.lg, gap: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.border },
  step: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.bold, letterSpacing: 1, textTransform: 'uppercase', includeFontPadding: false },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, includeFontPadding: false },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: Spacing.xl },
  note: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, marginTop: Spacing.sm,
  },
  noteText: { flex: 1, fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 17, includeFontPadding: false },
  footer: { padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  nextBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingVertical: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
  },
  nextText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
});
