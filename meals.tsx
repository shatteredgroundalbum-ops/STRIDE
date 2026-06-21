import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { TopBar } from '../../components/layout/TopBar';
import { MealCard } from '../../components/ui/MealCard';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealsScreen() {
  const insets = useSafeAreaInsets();
  const { profile, plan } = useApp();
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [waterGlasses, setWaterGlasses] = useState(0);

  const today = selectedDay;
  const todayPlan = plan?.mealPlan?.[today];
  const waterGoal = Math.ceil((profile?.waterTargetOz || 88) / 8); // cups

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <TopBar userName={profile?.firstName} />

      {/* Day selector */}
      <View style={styles.daySelectorOuter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daySelector}>
          {DAY_NAMES.map((d, i) => (
            <Pressable
              key={d}
              style={[styles.dayBtn, selectedDay === i && styles.dayBtnActive]}
              onPress={() => setSelectedDay(i)}
            >
              <Text style={[styles.dayBtnText, selectedDay === i && styles.dayBtnTextActive]}>
                {d.substring(0, 3)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Day Summary */}
        {todayPlan ? (
          <>
            <View style={styles.macroRow}>
              {[
                { label: 'Cal', value: todayPlan.totalCalories, unit: 'kcal', color: Colors.primary },
                { label: 'Pro', value: `${todayPlan.totalProtein}g`, unit: '', color: '#4A9FFF' },
                { label: 'Carb', value: `${todayPlan.totalCarbs}g`, unit: '', color: Colors.warning },
                { label: 'Fat', value: `${todayPlan.totalFat}g`, unit: '', color: '#AA88FF' },
              ].map(m => (
                <View key={m.label} style={[styles.macroCard, { borderTopColor: m.color }]}>
                  <Text style={[styles.macroValue, { color: m.color }]}>{m.value}</Text>
                  <Text style={styles.macroLabel}>{m.label}</Text>
                </View>
              ))}
            </View>

            {todayPlan.meals.map(meal => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </>
        ) : (
          <View style={styles.emptyCard}>
            <MaterialIcons name="restaurant-menu" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>No plan generated</Text>
            <Text style={styles.emptyText}>Complete onboarding to generate your personalized meal plan.</Text>
          </View>
        )}

        {/* Water Tracker */}
        <View style={styles.waterCard}>
          <View style={styles.waterHeader}>
            <MaterialIcons name="water-drop" size={18} color={Colors.info} />
            <Text style={styles.waterTitle}>Water Today</Text>
            <Text style={styles.waterCount}>{waterGlasses}/{waterGoal} glasses</Text>
          </View>
          <View style={styles.waterGlasses}>
            {Array.from({ length: waterGoal }).map((_, i) => (
              <Pressable
                key={i}
                style={({ pressed }) => [
                  styles.glass,
                  i < waterGlasses && styles.glassFilled,
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => setWaterGlasses(i < waterGlasses ? i : i + 1)}
              >
                <MaterialIcons
                  name="water-drop"
                  size={20}
                  color={i < waterGlasses ? Colors.info : Colors.border}
                />
              </Pressable>
            ))}
          </View>
          <View style={styles.waterProgress}>
            <View style={[styles.waterFill, { width: `${Math.min(100, (waterGlasses / waterGoal) * 100)}%` }]} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  daySelectorOuter: { height: 52, borderBottomWidth: 1, borderBottomColor: Colors.border },
  daySelector: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, gap: Spacing.sm },
  dayBtn: {
    paddingHorizontal: Spacing.md, height: 36, justifyContent: 'center',
    borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.cardBg,
  },
  dayBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayBtnText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  dayBtnTextActive: { color: Colors.textInverse, fontWeight: FontWeight.bold },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxl },
  macroRow: { flexDirection: 'row', gap: Spacing.sm },
  macroCard: {
    flex: 1, backgroundColor: Colors.cardBg, borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: Colors.border, borderTopWidth: 3,
    padding: Spacing.sm, alignItems: 'center',
  },
  macroValue: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, includeFontPadding: false },
  macroLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, includeFontPadding: false },
  emptyCard: {
    alignItems: 'center', gap: Spacing.sm, padding: Spacing.xxl,
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textSecondary, includeFontPadding: false },
  emptyText: { fontSize: FontSize.sm, color: Colors.textTertiary, textAlign: 'center', lineHeight: 18 },
  waterCard: {
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, gap: Spacing.sm,
  },
  waterHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  waterTitle: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  waterCount: { fontSize: FontSize.sm, color: Colors.info, fontWeight: FontWeight.bold, includeFontPadding: false },
  waterGlasses: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  glass: {
    width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.cardBgAlt, borderWidth: 1, borderColor: Colors.border,
  },
  glassFilled: { backgroundColor: Colors.info + '22', borderColor: Colors.info + '66' },
  waterProgress: {
    height: 4, backgroundColor: Colors.border, borderRadius: BorderRadius.full, overflow: 'hidden',
  },
  waterFill: { height: '100%', backgroundColor: Colors.info, borderRadius: BorderRadius.full },
});
