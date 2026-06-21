import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { TopBar } from '../../components/layout/TopBar';
import { MetricCard } from '../../components/ui/MetricCard';
import { loadFastState } from '../../store/fastingStore';
import { getElapsedDisplay, formatFastDuration } from '../../utils/fastingEngine';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, plan } = useApp();
  const [fastActive, setFastActive] = useState(false);
  const [fastHours, setFastHours] = useState(0);

  useEffect(() => {
    loadFastState().then(s => {
      setFastActive(s.isActive);
      if (s.isActive && s.startTime) {
        setFastHours(getElapsedDisplay(s.startTime).totalHours);
      }
    });
  }, []);

  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = dayNames[today.getDay()];
  const todayPlan = plan?.mealPlan?.[today.getDay() % 7];
  const weekPlan = plan?.walkRunProgression?.[0];
  const greeting = (() => {
    const h = today.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <TopBar userName={profile?.firstName || profile?.displayName} onAvatarPress={() => router.push('/(tabs)/me')} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greetSection}>
          <Text style={styles.greeting}>{greeting}{profile?.firstName ? `, ${profile.firstName}` : ''}.</Text>
          <Text style={styles.greetSub}>{dayOfWeek} — Let's keep the stride going.</Text>
        </View>

        {/* Quick stats */}
        <View style={styles.statsGrid}>
          <MetricCard
            label="Calorie Goal"
            value={profile?.calorieTarget || 1800}
            unit="kcal"
            icon={<MaterialIcons name="local-fire-department" size={18} color={Colors.primary} />}
            style={{ flex: 1 }}
          />
          <MetricCard
            label="Protein Goal"
            value={`${profile?.proteinTarget || 150}g`}
            icon={<MaterialIcons name="fitness-center" size={18} color="#4A9FFF" />}
            accentColor="#4A9FFF"
            style={{ flex: 1 }}
          />
        </View>
        <View style={styles.statsGrid}>
          <MetricCard
            label="Water Goal"
            value={profile?.waterTargetOz || 88}
            unit="oz"
            icon={<MaterialIcons name="water-drop" size={18} color={Colors.info} />}
            accentColor={Colors.info}
            style={{ flex: 1 }}
          />
          <MetricCard
            label="Fasting"
            value={fastActive ? formatFastDuration(fastHours) : 'Inactive'}
            icon={<MaterialIcons name="schedule" size={18} color={fastActive ? Colors.primary : Colors.textSecondary} />}
            accentColor={fastActive ? Colors.primary : Colors.textSecondary}
            style={{ flex: 1 }}
          />
        </View>

        {/* Today's Plan */}
        <Text style={styles.sectionTitle}>Today's Plan</Text>
        {todayPlan ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="today" size={18} color={Colors.primary} />
              <Text style={styles.cardTitle}>{dayOfWeek}'s Meals</Text>
              <Pressable onPress={() => router.push('/(tabs)/meals')}>
                <Text style={styles.viewAll}>View all</Text>
              </Pressable>
            </View>
            {todayPlan.meals.slice(0, 3).map((meal, i) => (
              <View key={meal.id} style={[styles.mealRow, i < 2 && { borderBottomWidth: 1, borderBottomColor: Colors.border }]}>
                <Text style={styles.mealCat}>{meal.category}</Text>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealCals}>{meal.calories} kcal</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.card, styles.emptyCard]}>
            <MaterialIcons name="restaurant" size={32} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>No meal plan yet. Complete onboarding to generate your plan.</Text>
          </View>
        )}

        {/* Walk Target */}
        {weekPlan ? (
          <>
            <Text style={styles.sectionTitle}>This Week's Target</Text>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="directions-walk" size={18} color={Colors.primary} />
                <Text style={styles.cardTitle}>Week {plan?.currentWeek || 1} Walking Goal</Text>
              </View>
              <View style={styles.statsGrid}>
                <View style={styles.statBlock}>
                  <Text style={[styles.statValue, { color: Colors.primary }]}>{weekPlan.walkDistanceMiles} mi</Text>
                  <Text style={styles.statLabel}>Daily Distance</Text>
                </View>
                <View style={styles.statBlock}>
                  <Text style={[styles.statValue, { color: Colors.warning }]}>{weekPlan.walkPaceMinPerMile}</Text>
                  <Text style={styles.statLabel}>Target Pace</Text>
                </View>
              </View>
              <Text style={styles.weekNote}>{weekPlan.notes}</Text>
            </View>
          </>
        ) : null}

        {/* Quick Nav Cards */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.navGrid}>
          {[
            { label: 'Move', icon: 'directions-walk', route: '/(tabs)/move', color: Colors.primary },
            { label: 'Meals', icon: 'restaurant', route: '/(tabs)/meals', color: '#4A9FFF' },
            { label: 'Fast', icon: 'schedule', route: '/(tabs)/fasting', color: Colors.warning },
            { label: 'Profile', icon: 'person', route: '/(tabs)/me', color: '#AA88FF' },
          ].map(nav => (
            <Pressable
              key={nav.label}
              style={({ pressed }) => [styles.navCard, { borderColor: nav.color + '44' }, pressed && { opacity: 0.8 }]}
              onPress={() => router.push(nav.route as any)}
            >
              <View style={[styles.navIcon, { backgroundColor: nav.color + '18' }]}>
                <MaterialIcons name={nav.icon as any} size={24} color={nav.color} />
              </View>
              <Text style={[styles.navLabel, { color: nav.color }]}>{nav.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxl },
  greetSection: { gap: 4, paddingVertical: Spacing.sm },
  greeting: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, includeFontPadding: false },
  greetSub: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  statsGrid: { flexDirection: 'row', gap: Spacing.sm },
  sectionTitle: {
    fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8, includeFontPadding: false,
  },
  card: {
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, gap: Spacing.sm,
  },
  emptyCard: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  emptyText: { fontSize: FontSize.sm, color: Colors.textTertiary, textAlign: 'center', lineHeight: 18 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  cardTitle: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  viewAll: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium, includeFontPadding: false },
  mealRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  mealCat: { fontSize: FontSize.xs, color: Colors.textTertiary, width: 72, fontWeight: FontWeight.medium, includeFontPadding: false },
  mealName: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  mealCals: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold, includeFontPadding: false },
  statBlock: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, includeFontPadding: false },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, includeFontPadding: false },
  weekNote: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18 },
  navGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  navCard: {
    width: '47%', backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg,
    borderWidth: 1.5, padding: Spacing.md, alignItems: 'center', gap: Spacing.sm,
  },
  navIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  navLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, includeFontPadding: false },
});
