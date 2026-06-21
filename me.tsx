import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Modal, TextInput, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { TopBar } from '../../components/layout/TopBar';
import { useAlert } from '@/template';
import { clearTileCache } from '../../utils/tileCache';
import { useTileCache } from '../../hooks/useTileCache';
import { US_STATES, estimateStateMB, type StateBounds } from '../../data/stateBounds';

export default function MeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, plan, signOut } = useApp();
  const { showAlert } = useAlert();
  const tileCache = useTileCache();
  const [clearing, setClearing] = useState(false);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [pendingState, setPendingState] = useState<StateBounds | null>(null);

  const filteredStates = useMemo(() => {
    const q = stateSearch.trim().toLowerCase();
    if (!q) return US_STATES;
    return US_STATES.filter(s => s.name.toLowerCase().includes(q) || s.abbr.toLowerCase().includes(q));
  }, [stateSearch]);

  const handleCacheState = useCallback((state: StateBounds) => {
    setStateModalVisible(false);
    showAlert(
      `Cache ${state.name}?`,
      `This will download ~${estimateStateMB(state)} MB of map tiles for ${state.name}. Already-cached tiles are skipped.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          style: 'default',
          onPress: async () => {
            setPendingState(state);
            await tileCache.startCachingState(state);
            setPendingState(null);
          },
        },
      ]
    );
  }, [showAlert, tileCache]);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleRecache = useCallback(() => {
    tileCache.startCaching({ forceRefresh: true });
  }, [tileCache]);

  const handleClearCache = useCallback(() => {
    showAlert(
      'Clear Offline Maps?',
      'All downloaded map tiles will be deleted. You can re-download them at any time. Live tiles will still work while online.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: async () => {
            setClearing(true);
            try {
              await clearTileCache();
            } finally {
              setClearing(false);
            }
            tileCache.startCaching({ forceRefresh: false });
          },
        },
      ]
    );
  }, [showAlert, tileCache]);

  const handleSignOut = () => {
    showAlert('Sign Out?', 'This will clear all your data from this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await signOut();
        router.replace('/onboarding/disclaimer');
      }},
    ]);
  };

  const heightDisplay = profile
    ? `${profile.heightFeet}'${profile.heightInches}"`
    : '--';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <TopBar userName={profile?.firstName} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile?.firstName?.charAt(0) || profile?.displayName?.charAt(0) || 'A'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile?.firstName || profile?.displayName || 'Athlete'}</Text>
            <Text style={styles.email}>{profile?.email || ''}</Text>
            <View style={styles.goalBadge}>
              <MaterialIcons name="flag" size={12} color={Colors.primary} />
              <Text style={styles.goalText}>{profile?.goal || 'No goal set'}</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Age', value: profile?.age?.toString() || '--', unit: 'yrs' },
            { label: 'Weight', value: profile?.weightLbs?.toString() || '--', unit: 'lbs' },
            { label: 'Height', value: heightDisplay, unit: '' },
            { label: 'Level', value: profile?.fitnessLevel || '--', unit: '' },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}{s.unit ? ` ${s.unit}` : ''}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Nutrition Targets */}
        <Text style={styles.sectionTitle}>Nutrition Targets</Text>
        <View style={styles.card}>
          {[
            { label: 'Calories', value: `${profile?.calorieTarget || '--'} kcal`, color: Colors.primary },
            { label: 'Protein', value: `${profile?.proteinTarget || '--'}g`, color: '#4A9FFF' },
            { label: 'Carbohydrates', value: `${profile?.carbTarget || '--'}g`, color: Colors.warning },
            { label: 'Fat', value: `${profile?.fatTarget || '--'}g`, color: '#AA88FF' },
            { label: 'Water', value: `${profile?.waterTargetOz || '--'} oz`, color: Colors.info },
          ].map((t, i) => (
            <View key={t.label} style={[styles.targetRow, i < 4 && { borderBottomWidth: 1, borderBottomColor: Colors.border }]}>
              <Text style={styles.targetLabel}>{t.label}</Text>
              <Text style={[styles.targetValue, { color: t.color }]}>{t.value}</Text>
            </View>
          ))}
        </View>

        {/* Plan Info */}
        {plan ? (
          <>
            <Text style={styles.sectionTitle}>Current Plan</Text>
            <View style={styles.card}>
              <View style={styles.targetRow}>
                <Text style={styles.targetLabel}>Week</Text>
                <Text style={[styles.targetValue, { color: Colors.primary }]}>{plan.currentWeek} of 8</Text>
              </View>
              <View style={[styles.targetRow, { borderTopWidth: 1, borderTopColor: Colors.border }]}>
                <Text style={styles.targetLabel}>Fasting Protocol</Text>
                <Text style={[styles.targetValue, { color: Colors.warning }]}>
                  {plan.fastingProtocol ? `${plan.fastingWindowHours}:${24 - (plan.fastingWindowHours || 0)}` : 'None'}
                </Text>
              </View>
              {plan.fastingProtocol ? (
                <Text style={styles.fastingDetail}>{plan.fastingProtocol}</Text>
              ) : null}
            </View>
          </>
        ) : null}

        {/* Supplements */}
        {profile?.selectedSupplements && profile.selectedSupplements.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Your Supplements ({profile.selectedSupplements.length})</Text>
            <View style={styles.card}>
              <Text style={styles.suppCount}>
                {profile.takeMultivitamin ? 'Daily multivitamin + ' : ''}
                {profile.selectedSupplements.length} supplement{profile.selectedSupplements.length !== 1 ? 's' : ''} tracked
              </Text>
            </View>
          </>
        ) : null}

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          {[
            { label: 'Edit Profile', icon: 'edit', route: '/onboarding/about' },
            { label: 'Edit Diet Preferences', icon: 'restaurant', route: '/onboarding/diet' },
            { label: 'Edit Supplements', icon: 'medication', route: '/onboarding/supplements' },
            { label: 'Edit Nutrition Targets', icon: 'tune', route: '/onboarding/nutrition' },
          ].map((item, i) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.settingRow,
                i < 3 && { borderBottomWidth: 1, borderBottomColor: Colors.border },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => router.push(item.route as any)}
            >
              <MaterialIcons name={item.icon as any} size={18} color={Colors.textSecondary} />
              <Text style={styles.settingLabel}>{item.label}</Text>
              <MaterialIcons name="chevron-right" size={18} color={Colors.textTertiary} />
            </Pressable>
          ))}
        </View>

        {/* ─── Offline Maps ─────────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Offline Maps</Text>
        <View style={styles.card}>

          {/* Cache stats */}
          <View style={[styles.targetRow, { borderBottomWidth: 1, borderBottomColor: Colors.border }]}>
            <View style={styles.mapStatLabel}>
              <MaterialIcons name="storage" size={15} color={Colors.textSecondary} />
              <Text style={styles.targetLabel}>Cache Size</Text>
            </View>
            <Text style={[styles.targetValue, { color: Colors.primary }]}>
              {tileCache.cacheSizeMB > 0 ? `${tileCache.cacheSizeMB} MB` : '—'}
            </Text>
          </View>

          <View style={[styles.targetRow, { borderBottomWidth: 1, borderBottomColor: Colors.border }]}>
            <View style={styles.mapStatLabel}>
              <MaterialIcons name="grid-on" size={15} color={Colors.textSecondary} />
              <Text style={styles.targetLabel}>Tiles Cached</Text>
            </View>
            <Text style={[styles.targetValue, { color: Colors.primary }]}>
              {tileCache.lastCacheMeta ? tileCache.lastCacheMeta.tileCount.toLocaleString() : '—'}
            </Text>
          </View>

          <View style={[styles.targetRow, { borderBottomWidth: 1, borderBottomColor: Colors.border }]}>
            <View style={styles.mapStatLabel}>
              <MaterialIcons name="my-location" size={15} color={Colors.textSecondary} />
              <Text style={styles.targetLabel}>
                {tileCache.lastCacheMeta?.label ? tileCache.lastCacheMeta.label : 'Last Location'}
              </Text>
            </View>
            <Text style={[styles.targetValue, { color: Colors.textSecondary, fontSize: FontSize.sm }]} numberOfLines={1}>
              {tileCache.lastCacheMeta
                ? `${tileCache.lastCacheMeta.centerLat.toFixed(3)}°, ${tileCache.lastCacheMeta.centerLon.toFixed(3)}°`
                : '—'}
            </Text>
          </View>

          <View style={[styles.targetRow, { borderBottomWidth: 1, borderBottomColor: Colors.border }]}>
            <View style={styles.mapStatLabel}>
              <MaterialIcons name="event" size={15} color={Colors.textSecondary} />
              <Text style={styles.targetLabel}>Cached On</Text>
            </View>
            <Text style={[styles.targetValue, { color: Colors.textSecondary, fontSize: FontSize.sm }]}>
              {tileCache.lastCacheMeta ? formatDate(tileCache.lastCacheMeta.cachedAt) : '—'}
            </Text>
          </View>

          {/* Download progress bar */}
          {tileCache.status === 'downloading' && tileCache.progress ? (
            <View style={styles.cacheProgressWrap}>
              <View style={styles.cacheProgressRow}>
                <MaterialIcons name="download" size={13} color={Colors.primary} />
                <Text style={styles.cacheProgressText} numberOfLines={1}>
                  {pendingState ? `Caching ${pendingState.name}` : 'Caching...'} — {tileCache.progress.percentComplete}%
                  {'  '}({tileCache.progress.downloaded.toLocaleString()}/{tileCache.progress.total.toLocaleString()} tiles)
                </Text>
              </View>
              <View style={styles.cacheProgressTrack}>
                <View style={[styles.cacheProgressFill, { width: `${tileCache.progress.percentComplete}%` as any }]} />
              </View>
              <Pressable onPress={tileCache.cancelCaching} style={styles.cancelCacheBtn} hitSlop={8}>
                <MaterialIcons name="close" size={13} color={Colors.textTertiary} />
                <Text style={styles.cancelCacheText}>Cancel download</Text>
              </Pressable>
            </View>
          ) : null}

          {/* Action buttons: Re-cache location + Clear */}
          <View style={styles.mapActions}>
            <Pressable
              style={({ pressed }) => [
                styles.mapActionBtn,
                tileCache.status === 'downloading' && styles.mapActionBtnDisabled,
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleRecache}
              disabled={tileCache.status === 'downloading'}
            >
              <MaterialIcons
                name={tileCache.status === 'downloading' ? 'hourglass-empty' : 'refresh'}
                size={16}
                color={tileCache.status === 'downloading' ? Colors.textTertiary : Colors.primary}
              />
              <Text style={[styles.mapActionText, tileCache.status === 'downloading' && { color: Colors.textTertiary }]}>
                {tileCache.status === 'downloading' ? 'Caching...' : 'Re-cache My Location'}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.mapActionBtn,
                styles.mapActionBtnDanger,
                (clearing || tileCache.cacheSizeMB === 0) && styles.mapActionBtnDisabled,
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleClearCache}
              disabled={clearing || tileCache.cacheSizeMB === 0}
            >
              <MaterialIcons
                name={clearing ? 'hourglass-empty' : 'delete-outline'}
                size={16}
                color={tileCache.cacheSizeMB === 0 ? Colors.textTertiary : Colors.danger}
              />
              <Text style={[
                styles.mapActionText, styles.mapActionTextDanger,
                tileCache.cacheSizeMB === 0 && { color: Colors.textTertiary },
              ]}>
                {clearing ? 'Clearing...' : 'Clear Cache'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.mapHint}>
            Location cache: ~12 mi radius · Zooms 12–15 · Live OSM used as fallback
          </Text>
        </View>

        {/* ─── Cache a State ────────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Cache a State</Text>
        <View style={styles.card}>
          <View style={[styles.targetRow, { borderBottomWidth: 1, borderBottomColor: Colors.border }]}>
            <View style={styles.mapStatLabel}>
              <MaterialIcons name="public" size={15} color={Colors.textSecondary} />
              <Text style={styles.targetLabel}>Pre-download a full US state</Text>
            </View>
          </View>
          <Text style={styles.stateHint}>
            Select any state to cache its offline map tiles for travel. Tiles are shared with your location cache — already-downloaded tiles are always skipped.
          </Text>
          <View style={[styles.mapActions, { borderTopWidth: 1, borderTopColor: Colors.border }]}>
            <Pressable
              style={({ pressed }) => [
                styles.mapActionBtn,
                { flex: 1 },
                tileCache.status === 'downloading' && styles.mapActionBtnDisabled,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => { setStateSearch(''); setStateModalVisible(true); }}
              disabled={tileCache.status === 'downloading'}
            >
              <MaterialIcons
                name="place"
                size={16}
                color={tileCache.status === 'downloading' ? Colors.textTertiary : Colors.primary}
              />
              <Text style={[styles.mapActionText, tileCache.status === 'downloading' && { color: Colors.textTertiary }]}>
                Select a State to Cache
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Sign Out */}
        <Pressable
          style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.8 }]}
          onPress={handleSignOut}
        >
          <MaterialIcons name="logout" size={18} color={Colors.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.version}>S.T.R.I.D.E. v1.0 · Data stored locally</Text>
      </ScrollView>

      {/* ─── State Selector Modal ─────────────────────────────────────────── */}
      <Modal
        visible={stateModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setStateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={{ flex: 1 }} onPress={() => setStateModalVisible(false)} />
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + Spacing.md }]}>

            {/* Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Cache a State</Text>
                <Text style={styles.modalSub}>Select a state to pre-download offline maps</Text>
              </View>
              <Pressable onPress={() => setStateModalVisible(false)} hitSlop={12}>
                <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
              </Pressable>
            </View>

            {/* Search */}
            <View style={styles.searchRow}>
              <MaterialIcons name="search" size={18} color={Colors.textTertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search states..."
                placeholderTextColor={Colors.textTertiary}
                value={stateSearch}
                onChangeText={setStateSearch}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
              />
              {stateSearch.length > 0 ? (
                <Pressable onPress={() => setStateSearch('')} hitSlop={8}>
                  <MaterialIcons name="close" size={16} color={Colors.textTertiary} />
                </Pressable>
              ) : null}
            </View>

            {/* State List */}
            <FlatList
              data={filteredStates}
              keyExtractor={item => item.abbr}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={styles.stateList}
              ItemSeparatorComponent={() => <View style={styles.stateDivider} />}
              renderItem={({ item }) => {
                const mb = estimateStateMB(item);
                return (
                  <Pressable
                    style={({ pressed }) => [styles.stateRow, pressed && { backgroundColor: Colors.cardBgAlt }]}
                    onPress={() => handleCacheState(item)}
                  >
                    <View style={styles.stateAbbr}>
                      <Text style={styles.stateAbbrText}>{item.abbr}</Text>
                    </View>
                    <View style={styles.stateInfo}>
                      <Text style={styles.stateName}>{item.name}</Text>
                      <Text style={styles.stateMeta}>~{mb} MB · zooms 12–15</Text>
                    </View>
                    <MaterialIcons name="cloud-download" size={18} color={Colors.textTertiary} />
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxl },

  // Profile
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.primary + '22', borderWidth: 2, borderColor: Colors.primary + '44',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.primary, includeFontPadding: false },
  profileInfo: { flex: 1, gap: 4 },
  name: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, includeFontPadding: false },
  email: { fontSize: FontSize.sm, color: Colors.textTertiary, includeFontPadding: false },
  goalBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
    backgroundColor: Colors.primaryMuted, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.primary + '33',
  },
  goalText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.bold, includeFontPadding: false },

  // Stats
  statsGrid: { flexDirection: 'row', gap: Spacing.sm },
  statCard: {
    flex: 1, backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.sm, alignItems: 'center', gap: 2,
  },
  statValue: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold, color: Colors.primary, includeFontPadding: false },
  statLabel: { fontSize: FontSize.xs, color: Colors.textTertiary, includeFontPadding: false },

  // Shared
  sectionTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, includeFontPadding: false },
  card: { backgroundColor: Colors.cardBg, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border },
  targetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md },
  targetLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  targetValue: { fontSize: FontSize.base, fontWeight: FontWeight.bold, includeFontPadding: false },
  fastingDetail: { fontSize: FontSize.xs, color: Colors.textTertiary, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, lineHeight: 16 },
  suppCount: { fontSize: FontSize.sm, color: Colors.textSecondary, padding: Spacing.md, lineHeight: 18 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md },
  settingLabel: { flex: 1, fontSize: FontSize.base, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },

  // Map section
  mapStatLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cacheProgressWrap: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: 6, borderTopWidth: 1, borderTopColor: Colors.border },
  cacheProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cacheProgressText: { flex: 1, fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.medium, includeFontPadding: false },
  cacheProgressTrack: { height: 4, backgroundColor: Colors.border, borderRadius: BorderRadius.full, overflow: 'hidden' },
  cacheProgressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: BorderRadius.full },
  cancelCacheBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end' },
  cancelCacheText: { fontSize: FontSize.xs, color: Colors.textTertiary, includeFontPadding: false },
  mapActions: { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.md },
  mapActionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 11, borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: Colors.primary + '33',
  },
  mapActionBtnDanger: { backgroundColor: Colors.dangerMuted, borderColor: Colors.danger + '33' },
  mapActionBtnDisabled: { backgroundColor: Colors.cardBgAlt, borderColor: Colors.border },
  mapActionText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.primary, includeFontPadding: false },
  mapActionTextDanger: { color: Colors.danger },
  mapHint: {
    fontSize: FontSize.xs, color: Colors.textTertiary, textAlign: 'center',
    paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, lineHeight: 16,
  },
  stateHint: {
    fontSize: FontSize.xs, color: Colors.textTertiary, lineHeight: 17,
    paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm,
  },

  // Sign out
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.dangerMuted, borderRadius: BorderRadius.full, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.danger + '33',
  },
  signOutText: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.danger, includeFontPadding: false },
  version: { fontSize: FontSize.xs, color: Colors.textTertiary, textAlign: 'center', includeFontPadding: false },

  // State Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: Colors.cardBg,
    borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border,
    maxHeight: '78%',
    paddingTop: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm,
  },
  modalTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, includeFontPadding: false },
  modalSub: { fontSize: FontSize.sm, color: Colors.textTertiary, marginTop: 2, includeFontPadding: false },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    marginHorizontal: Spacing.lg, marginBottom: Spacing.sm,
    backgroundColor: Colors.background, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: FontSize.base, color: Colors.textPrimary, includeFontPadding: false },
  stateList: { flex: 1 },
  stateDivider: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.lg + 40 + Spacing.md },
  stateRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
  },
  stateAbbr: {
    width: 42, height: 42, borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: Colors.primary + '44',
    justifyContent: 'center', alignItems: 'center',
  },
  stateAbbrText: { fontSize: FontSize.sm, fontWeight: FontWeight.extrabold, color: Colors.primary, includeFontPadding: false },
  stateInfo: { flex: 1, gap: 2 },
  stateName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary, includeFontPadding: false },
  stateMeta: { fontSize: FontSize.xs, color: Colors.textTertiary, includeFontPadding: false },
});
