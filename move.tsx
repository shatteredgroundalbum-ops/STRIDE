import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { useSession } from '../../hooks/useSession';
import { useGPS } from '../../hooks/useGPS';
import { useTileCache } from '../../hooks/useTileCache';
import { TopBar } from '../../components/layout/TopBar';
import { MetricCard } from '../../components/ui/MetricCard';
import { ActivityBadge } from '../../components/ui/ActivityBadge';
import { StrideMap } from '../../components/feature/StrideMap';

export default function MoveScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useApp();
  const [mode, setMode] = useState<'outdoor' | 'gym'>('outdoor');
  const [sessionComplete, setSessionComplete] = useState<any>(null);

  const tileCache = useTileCache();

  const session = useSession({
    weightLbs: profile?.weightLbs || 175,
    age: profile?.age || 30,
    fitnessLevel: profile?.fitnessLevel || 'Novice',
  });
  const gps = useGPS();

  useEffect(() => {
    if (session.isActive && mode === 'outdoor') {
      gps.startTracking((point) => session.updateLocation(point));
    }
  }, [session.isActive, mode]);

  const handleStart = () => {
    session.startSession(mode);
  };

  const handleEnd = async () => {
    gps.stopTracking();
    const result = await session.endSession();
    setSessionComplete(result);
  };

  // ── Session summary ──────────────────────────────────────────────────────────
  if (sessionComplete) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="light" />
        <TopBar userName={profile?.firstName} />
        <ScrollView contentContainerStyle={styles.summaryContent}>
          <View style={styles.summaryHeader}>
            <MaterialIcons name="check-circle" size={52} color={Colors.primary} />
            <Text style={styles.summaryTitle}>Session Complete</Text>
          </View>
          <View style={styles.summaryGrid}>
            <MetricCard
              label="Distance"
              value={sessionComplete.distanceMiles?.toFixed(2) || '0.00'}
              unit="mi"
              accentColor={Colors.primary}
              style={{ flex: 1 }}
              icon={<MaterialIcons name="straighten" size={18} color={Colors.primary} />}
            />
            <MetricCard
              label="Duration"
              value={`${Math.floor(sessionComplete.durationSeconds / 60)}m`}
              icon={<MaterialIcons name="timer" size={18} color={Colors.warning} />}
              accentColor={Colors.warning}
              style={{ flex: 1 }}
            />
          </View>
          <View style={styles.summaryGrid}>
            <MetricCard
              label="Calories"
              value={sessionComplete.caloriesBurned}
              unit="kcal"
              icon={<MaterialIcons name="local-fire-department" size={18} color={Colors.danger} />}
              accentColor={Colors.danger}
              style={{ flex: 1 }}
            />
            <MetricCard
              label="Avg Speed"
              value={(sessionComplete.avgSpeedMph || 0).toFixed(1)}
              unit="mph"
              accentColor="#4A9FFF"
              icon={<MaterialIcons name="speed" size={18} color="#4A9FFF" />}
              style={{ flex: 1 }}
            />
          </View>
          <Pressable style={styles.doneBtn} onPress={() => setSessionComplete(null)}>
            <Text style={styles.doneBtnText}>Done</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // ── Tile cache status bar ────────────────────────────────────────────────────
  const renderTileCacheBar = () => {
    const { status, progress, cacheSizeMB } = tileCache;

    if (status === 'downloading' && progress) {
      return (
        <View style={styles.tileCacheBar}>
          <MaterialIcons name="download" size={13} color={Colors.primary} />
          <Text style={styles.tileCacheText} numberOfLines={1}>
            Downloading offline tiles — {progress.percentComplete}% ({progress.downloaded}/{progress.total})
          </Text>
          <Pressable onPress={tileCache.cancelCaching} hitSlop={8}>
            <MaterialIcons name="close" size={14} color={Colors.textTertiary} />
          </Pressable>
        </View>
      );
    }

    if (status === 'ready' && cacheSizeMB > 0) {
      return (
        <View style={styles.tileCacheBar}>
          <View style={styles.tileStatusGroup}>
            <View style={styles.tileChip}>
              <MaterialIcons name="public" size={11} color={Colors.primary} />
              <Text style={styles.tileChipText}>Live OSM</Text>
            </View>
            <View style={[styles.tileChip, styles.tileChipOffline]}>
              <MaterialIcons name="offline-pin" size={11} color={Colors.primary} />
              <Text style={styles.tileChipText}>Offline {cacheSizeMB} MB</Text>
            </View>
          </View>
          <Pressable onPress={() => tileCache.startCaching({ forceRefresh: true })} hitSlop={8}>
            <MaterialIcons name="refresh" size={14} color={Colors.textTertiary} />
          </Pressable>
        </View>
      );
    }

    if (status === 'error') {
      return (
        <Pressable style={[styles.tileCacheBar, styles.tileCacheWarning]} onPress={() => tileCache.startCaching()}>
          <MaterialIcons name="wifi-off" size={13} color={Colors.warning} />
          <Text style={[styles.tileCacheText, { color: Colors.warning }]} numberOfLines={1}>
            Offline tile download failed — tap to retry
          </Text>
        </Pressable>
      );
    }

    if (mode === 'outdoor') {
      return (
        <View style={styles.tileCacheBar}>
          <View style={styles.tileStatusGroup}>
            <View style={styles.tileChip}>
              <MaterialIcons name="public" size={11} color={Colors.primary} />
              <Text style={styles.tileChipText}>OpenStreetMap · Live</Text>
            </View>
          </View>
          {!session.isActive ? (
            <Pressable onPress={() => tileCache.startCaching()} hitSlop={8} style={styles.offlineBtn}>
              <MaterialIcons name="cloud-download" size={11} color={Colors.textTertiary} />
              <Text style={styles.offlineBtnText}>Download offline</Text>
            </Pressable>
          ) : null}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <TopBar userName={profile?.firstName} />

      {/* Mode Toggle */}
      {!session.isActive ? (
        <View style={styles.modeToggle}>
          {(['outdoor', 'gym'] as const).map(m => (
            <Pressable
              key={m}
              style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
              onPress={() => setMode(m)}
            >
              <MaterialIcons
                name={m === 'outdoor' ? 'map' : 'fitness-center'}
                size={16}
                color={mode === m ? Colors.textInverse : Colors.textSecondary}
              />
              <Text style={[styles.modeBtnText, mode === m && styles.modeBtnTextActive]}>
                {m === 'outdoor' ? 'Outdoor' : 'Gym'}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* Map (Outdoor) / Gym placeholder */}
      {mode === 'outdoor' ? (
        <View style={styles.mapContainer}>
          {/* Tile status bar */}
          <View style={styles.tileCacheBarWrapper}>
            {renderTileCacheBar()}
          </View>

          {/* Platform-aware map: react-leaflet on web, react-native-maps on native */}
          <StrideMap
            style={styles.map}
            route={session.route}
            isActive={session.isActive}
            activityType={session.activityType}
            showOfflineBadge={tileCache.status === 'ready' && tileCache.cacheSizeMB > 0}
            offlineMB={tileCache.cacheSizeMB}
          />

          {/* Activity badge overlay */}
          {session.isActive ? (
            <View style={styles.mapOverlay}>
              <ActivityBadge activity={session.activityType} large />
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.gymPlaceholder}>
          <MaterialIcons name="fitness-center" size={48} color={Colors.textTertiary} />
          <Text style={styles.gymText}>Gym Mode — Timer Only</Text>
          <Text style={styles.gymSub}>Heart rate monitor optional</Text>
        </View>
      )}

      {/* Live Metrics */}
      {session.isActive ? (
        <View style={styles.metrics}>
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{session.distanceDisplay}</Text>
              <Text style={styles.metricLabel}>Distance</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{session.elapsedDisplay}</Text>
              <Text style={styles.metricLabel}>Time</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: Colors.danger }]}>{session.calories}</Text>
              <Text style={styles.metricLabel}>Cal</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: Colors.warning }]}>{session.pace}</Text>
              <Text style={styles.metricLabel}>Pace</Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* Controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + Spacing.sm }]}>
        {!session.isActive ? (
          <Pressable
            style={({ pressed }) => [styles.startBtn, pressed && { opacity: 0.85 }]}
            onPress={handleStart}
          >
            <MaterialIcons name="play-arrow" size={28} color={Colors.textInverse} />
            <Text style={styles.startBtnText}>
              Start {mode === 'outdoor' ? 'Outdoor' : 'Gym'} Session
            </Text>
          </Pressable>
        ) : (
          <View style={styles.activeControls}>
            <Pressable
              style={({ pressed }) => [styles.pauseBtn, pressed && { opacity: 0.8 }]}
              onPress={session.pauseSession}
            >
              <MaterialIcons
                name={session.isPaused ? 'play-arrow' : 'pause'}
                size={24}
                color={Colors.textPrimary}
              />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.stopBtn, pressed && { opacity: 0.85 }]}
              onPress={handleEnd}
            >
              <MaterialIcons name="stop" size={24} color={Colors.textInverse} />
              <Text style={styles.stopBtnText}>End Session</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  modeToggle: {
    flexDirection: 'row', margin: Spacing.md, gap: Spacing.sm,
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border, padding: 4,
  },
  modeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: BorderRadius.sm,
  },
  modeBtnActive: { backgroundColor: Colors.primary },
  modeBtnText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.semibold, includeFontPadding: false },
  modeBtnTextActive: { color: Colors.textInverse },

  mapContainer: { flex: 1, position: 'relative', overflow: 'hidden' },
  map: { flex: 1 },
  tileCacheBarWrapper: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  tileCacheBar: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.cardBg + 'EE',
    paddingHorizontal: Spacing.md, paddingVertical: 7,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  tileCacheWarning: { backgroundColor: Colors.warningMuted + 'EE' },
  tileCacheText: { flex: 1, fontSize: 11, color: Colors.textSecondary, fontWeight: FontWeight.medium, includeFontPadding: false },
  tileStatusGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  tileChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.primaryMuted, borderRadius: BorderRadius.full,
    paddingHorizontal: 7, paddingVertical: 2,
    borderWidth: 1, borderColor: Colors.primary + '33',
  },
  tileChipOffline: { backgroundColor: Colors.cardBgAlt, borderColor: Colors.border },
  tileChipText: { fontSize: 10, color: Colors.primary, fontWeight: FontWeight.semibold, includeFontPadding: false },
  offlineBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  offlineBtnText: { fontSize: 10, color: Colors.textTertiary, fontWeight: FontWeight.medium, includeFontPadding: false },
  mapOverlay: { position: 'absolute', top: 44, left: Spacing.md, zIndex: 5 },

  gymPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.sm },
  gymText: { fontSize: FontSize.lg, color: Colors.textSecondary, fontWeight: FontWeight.semibold, includeFontPadding: false },
  gymSub: { fontSize: FontSize.sm, color: Colors.textTertiary, includeFontPadding: false },

  metrics: {
    backgroundColor: Colors.cardBg, borderTopWidth: 1, borderTopColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  metricItem: { alignItems: 'center', gap: 2 },
  metricValue: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.primary, includeFontPadding: false },
  metricLabel: { fontSize: FontSize.xs, color: Colors.textTertiary, includeFontPadding: false },

  controls: { padding: Spacing.md, backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.border },
  startBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingVertical: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
  },
  startBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
  activeControls: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  pauseBtn: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.cardBg,
    borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center',
  },
  stopBtn: {
    flex: 1, backgroundColor: Colors.danger, borderRadius: BorderRadius.full, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
  },
  stopBtnText: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, includeFontPadding: false },

  summaryContent: { padding: Spacing.lg, gap: Spacing.md },
  summaryHeader: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xl },
  summaryTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, includeFontPadding: false },
  summaryGrid: { flexDirection: 'row', gap: Spacing.sm },
  doneBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingVertical: 15,
    alignItems: 'center', marginTop: Spacing.lg,
  },
  doneBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textInverse, includeFontPadding: false },
});
