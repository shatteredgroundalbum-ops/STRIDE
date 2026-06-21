import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';

const CONDITIONS = [
  { id: 'High Blood Pressure', icon: 'favorite' as const, warning: true },
  { id: 'Type 2 Diabetes', icon: 'water-drop' as const, warning: true },
  { id: 'Joint Pain / Arthritis', icon: 'accessibility' as const, warning: false },
  { id: 'Heart Condition', icon: 'monitor-heart' as const, warning: true },
  { id: 'High Cholesterol', icon: 'trending-up' as const, warning: true },
  { id: 'Asthma', icon: 'air' as const, warning: false },
  { id: 'None of the above', icon: 'check-circle' as const, warning: false },
];

export default function HealthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, setProfile } = useApp();

  const [selected, setSelected] = useState<string[]>(profile?.healthConditions || []);
  const [otherText, setOtherText] = useState('');
  const [showOther, setShowOther] = useState(false);

  const toggle = (id: string) => {
    if (id === 'None of the above') {
      setSelected(['None of the above']);
      setShowOther(false);
      return;
    }
    if (id === 'Other') {
      setShowOther(s => !s);
      return;
    }
    setSelected(prev => {
      const without = prev.filter(s => s !== 'None of the above');
      return prev.includes(id) ? without.filter(s => s !== id) : [...without, id];
    });
  };

  const isSelected = (id: string) => selected.includes(id);

  const handleNext = async () => {
    if (!profile) return;
    const conditions = [...selected];
    if (showOther && otherText.trim()) conditions.push(`Other: ${otherText.trim()}`);
    await setProfile({ ...profile, healthConditions: conditions, updatedAt: Date.now() });
    router.push('/onboarding/lifestyle');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.step}>Step 3 of 7</Text>
        <Text style={styles.title}>Health Conditions</Text>
        <Text style={styles.sub}>Select any that apply. Self-reported only.</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {CONDITIONS.map(c => (
          <Pressable
            key={c.id}
            style={({ pressed }) => [
              styles.checkCard,
              isSelected(c.id) && styles.checkCardSelected,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => toggle(c.id)}
          >
            <MaterialIcons
              name={isSelected(c.id) ? 'check-box' : 'check-box-outline-blank'}
              size={22}
              color={isSelected(c.id) ? Colors.primary : Colors.textTertiary}
            />
            <MaterialIcons
              name={c.icon}
              size={18}
              color={c.warning ? Colors.warning : Colors.textSecondary}
            />
            <Text style={[styles.conditionText, isSelected(c.id) && { color: Colors.textPrimary }]}>{c.id}</Text>
          </Pressable>
        ))}

        {/* Other option */}
        <Pressable
          style={({ pressed }) => [styles.checkCard, showOther && styles.checkCardSelected, pressed && { opacity: 0.8 }]}
          onPress={() => toggle('Other')}
        >
          <MaterialIcons name={showOther ? 'check-box' : 'check-box-outline-blank'} size={22} color={showOther ? Colors.primary : Colors.textTertiary} />
          <MaterialIcons name="edit" size={18} color={Colors.textSecondary} />
          <Text style={[styles.conditionText, showOther && { color: Colors.textPrimary }]}>Other</Text>
        </Pressable>

        {showOther ? (
          <TextInput
            style={styles.otherInput}
            value={otherText}
            onChangeText={setOtherText}
            placeholder="Describe your condition..."
            placeholderTextColor={Colors.textTertiary}
            multiline
          />
        ) : null}

        <View style={styles.disclaimer}>
          <MaterialIcons name="info" size={14} color={Colors.info} />
          <Text style={styles.disclaimerText}>
            This information is used only to personalize your plan. This is not medical advice.
          </Text>
        </View>
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
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, includeFontPadding: false },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.sm },
  checkCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.border, padding: Spacing.md,
  },
  checkCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  conditionText: { fontSize: FontSize.base, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  otherInput: {
    backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.primary,
    borderRadius: BorderRadius.md, padding: Spacing.md,
    fontSize: FontSize.base, color: Colors.textPrimary, minHeight: 80, textAlignVertical: 'top',
  },
  disclaimer: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  disclaimerText: { flex: 1, fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 17, includeFontPadding: false },
  footer: { padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  nextBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingVertical: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
  },
  nextText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
});
