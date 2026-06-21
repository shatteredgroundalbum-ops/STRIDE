import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import {
  SUPPLEMENT_CATEGORIES, VITAMINS, MINERALS, AMINO_ACIDS, HERBAL_NATURAL, BRANDS,
  type SupplementCategory, type Supplement,
} from '../../data/supplements';

export default function SupplementsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, setProfile } = useApp();

  const [activeCategory, setActiveCategory] = useState<SupplementCategory>('Vitamins');
  const [selected, setSelected] = useState<string[]>(profile?.selectedSupplements || []);
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
  const [takeMulti, setTakeMulti] = useState(profile?.takeMultivitamin || false);

  const toggleSupp = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const getSuppsForCategory = (): Supplement[] => {
    switch (activeCategory) {
      case 'Vitamins': return VITAMINS;
      case 'Minerals': return MINERALS;
      case 'Amino Acids': return AMINO_ACIDS;
      case 'Herbal / Natural': return HERBAL_NATURAL;
      default: return [];
    }
  };

  const handleNext = async () => {
    if (!profile) return;
    await setProfile({ ...profile, selectedSupplements: selected, takeMultivitamin: takeMulti, updatedAt: Date.now() });
    router.push('/onboarding/nutrition');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.step}>Step 6 of 7</Text>
        <Text style={styles.title}>Supplements</Text>
        <Text style={styles.sub}>Select what you currently take or plan to take.</Text>
      </View>

      {/* Multivitamin toggle */}
      <Pressable
        style={[styles.multiToggle, takeMulti && styles.multiToggleActive]}
        onPress={() => setTakeMulti(m => !m)}
      >
        <MaterialIcons name={takeMulti ? 'check-box' : 'check-box-outline-blank'} size={20} color={takeMulti ? Colors.primary : Colors.textTertiary} />
        <Text style={[styles.multiText, takeMulti && { color: Colors.primary }]}>I take a daily multivitamin</Text>
      </Pressable>

      {/* Category tabs */}
      <View style={styles.tabsOuter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {SUPPLEMENT_CATEGORIES.map(cat => (
            <Pressable
              key={cat}
              style={({ pressed }) => [styles.tab, activeCategory === cat && styles.tabActive, pressed && { opacity: 0.8 }]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.tabText, activeCategory === cat && styles.tabTextActive]}>
                {cat === 'Herbal / Natural' ? 'Herbal' : cat === 'Branded Products' ? 'Branded' : cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {activeCategory !== 'Branded Products' ? (
          getSuppsForCategory().map(s => (
            <Pressable
              key={s.id}
              style={({ pressed }) => [styles.suppRow, selected.includes(s.id) && styles.suppRowSelected, pressed && { opacity: 0.8 }]}
              onPress={() => toggleSupp(s.id)}
            >
              <MaterialIcons
                name={selected.includes(s.id) ? 'check-circle' : 'radio-button-unchecked'}
                size={20}
                color={selected.includes(s.id) ? Colors.primary : Colors.textTertiary}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.suppName, selected.includes(s.id) && { color: Colors.textPrimary }]}>{s.name}</Text>
                {s.description ? <Text style={styles.suppDesc}>{s.description}</Text> : null}
              </View>
            </Pressable>
          ))
        ) : (
          BRANDS.map(brand => (
            <View key={brand.id}>
              <Pressable
                style={({ pressed }) => [styles.brandRow, expandedBrand === brand.id && styles.brandRowExpanded, pressed && { opacity: 0.8 }]}
                onPress={() => setExpandedBrand(expandedBrand === brand.id ? null : brand.id)}
              >
                <Text style={styles.brandName}>{brand.name}</Text>
                <MaterialIcons
                  name={expandedBrand === brand.id ? 'expand-less' : 'expand-more'}
                  size={22}
                  color={Colors.textSecondary}
                />
              </Pressable>
              {expandedBrand === brand.id && brand.products.map(p => (
                <Pressable
                  key={p.id}
                  style={({ pressed }) => [styles.productRow, selected.includes(p.id) && styles.productRowSelected, pressed && { opacity: 0.8 }]}
                  onPress={() => toggleSupp(p.id)}
                >
                  <MaterialIcons
                    name={selected.includes(p.id) ? 'check-circle' : 'radio-button-unchecked'}
                    size={18}
                    color={selected.includes(p.id) ? Colors.primary : Colors.textTertiary}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.productName, selected.includes(p.id) && { color: Colors.textPrimary }]}>{p.name}</Text>
                    {p.description ? <Text style={styles.suppDesc}>{p.description}</Text> : null}
                  </View>
                </Pressable>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {selected.length > 0 ? (
        <View style={styles.selectedBadge}>
          <MaterialIcons name="check-circle" size={14} color={Colors.primary} />
          <Text style={styles.selectedBadgeText}>{selected.length} selected</Text>
        </View>
      ) : null}

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
  multiToggle: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    margin: Spacing.md, padding: Spacing.md,
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  multiToggleActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  multiText: { fontSize: FontSize.base, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  tabsOuter: { height: 48, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabs: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, gap: Spacing.sm },
  tab: {
    paddingHorizontal: Spacing.md, height: 36, justifyContent: 'center',
    borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  tabTextActive: { color: Colors.textInverse, fontWeight: FontWeight.bold },
  scroll: { flex: 1 },
  listContent: { padding: Spacing.sm, gap: 2 },
  suppRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    padding: Spacing.md, borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: 'transparent',
  },
  suppRowSelected: { backgroundColor: Colors.primaryMuted, borderColor: Colors.primary + '44' },
  suppName: { fontSize: FontSize.base, fontWeight: FontWeight.medium, color: Colors.textSecondary, includeFontPadding: false },
  suppDesc: { fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 1, includeFontPadding: false },
  brandRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.md, backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 2,
  },
  brandRowExpanded: { borderColor: Colors.primary, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  brandName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  productRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    padding: Spacing.md, paddingLeft: Spacing.xl,
    backgroundColor: Colors.cardBgAlt, borderWidth: 1,
    borderColor: Colors.border, borderTopWidth: 0, marginBottom: 2,
  },
  productRowSelected: { backgroundColor: Colors.primaryMuted },
  productName: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary, includeFontPadding: false },
  selectedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'center', marginBottom: Spacing.sm,
    backgroundColor: Colors.primaryMuted, paddingHorizontal: Spacing.md,
    paddingVertical: 6, borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: Colors.primary + '44',
  },
  selectedBadgeText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.bold, includeFontPadding: false },
  footer: { padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  nextBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingVertical: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
  },
  nextText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
});
