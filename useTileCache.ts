import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  cacheRegion,
  cacheByBounds,
  cancelCacheDownload,
  getCacheSizeMB,
  estimateTileCount,
  type TileCacheProgress,
} from '../utils/tileCache';
import type { StateBounds } from '../data/stateBounds';

const CACHE_KEY = '@stride/tile_cache_meta';
const RE_CACHE_DISTANCE_DEG = 0.15;

export interface CacheMeta {
  centerLat: number;
  centerLon: number;
  cachedAt: number;
  tileCount: number;
  label?: string; // e.g. "Texas" or "My Location"
}

export type TileCacheStatus = 'idle' | 'checking' | 'downloading' | 'ready' | 'error';

export function useTileCache() {
  const [status, setStatus] = useState<TileCacheStatus>('idle');
  const [progress, setProgress] = useState<TileCacheProgress | null>(null);
  const [cacheSizeMB, setCacheSizeMB] = useState(0);
  const [lastCacheMeta, setLastCacheMeta] = useState<CacheMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    loadCacheMeta();
    return () => {
      isMounted.current = false;
      cancelCacheDownload();
    };
  }, []);

  const loadCacheMeta = async () => {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (raw) {
        const meta: CacheMeta = JSON.parse(raw);
        if (isMounted.current) {
          setLastCacheMeta(meta);
          const sizeMB = await getCacheSizeMB();
          setCacheSizeMB(sizeMB);
          if (sizeMB > 0) setStatus('ready');
        }
      }
    } catch {
      // no prior cache
    }
  };

  const saveCacheMeta = async (meta: CacheMeta) => {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(meta));
    if (isMounted.current) setLastCacheMeta(meta);
  };

  const needsNewCache = useCallback(
    (lat: number, lon: number): boolean => {
      if (!lastCacheMeta) return true;
      const dLat = Math.abs(lat - lastCacheMeta.centerLat);
      const dLon = Math.abs(lon - lastCacheMeta.centerLon);
      return dLat > RE_CACHE_DISTANCE_DEG || dLon > RE_CACHE_DISTANCE_DEG;
    },
    [lastCacheMeta]
  );

  /** Cache tiles around the user's current GPS location */
  const startCaching = useCallback(
    async (options?: { lat?: number; lon?: number; forceRefresh?: boolean }) => {
      if (status === 'downloading') return;
      if (isMounted.current) { setStatus('checking'); setError(null); }

      let lat = options?.lat;
      let lon = options?.lon;

      if (lat === undefined || lon === undefined) {
        try {
          const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
          if (permStatus !== 'granted') {
            lat = 39.8283; lon = -98.5795;
          } else {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            lat = loc.coords.latitude;
            lon = loc.coords.longitude;
          }
        } catch {
          lat = 39.8283; lon = -98.5795;
        }
      }

      if (!options?.forceRefresh && !needsNewCache(lat, lon)) {
        if (isMounted.current) {
          setStatus('ready');
          const sizeMB = await getCacheSizeMB();
          setCacheSizeMB(sizeMB);
        }
        return;
      }

      if (isMounted.current) setStatus('downloading');

      try {
        const estimatedCount = estimateTileCount();
        if (isMounted.current) {
          setProgress({ total: estimatedCount, downloaded: 0, failed: 0, isDone: false, percentComplete: 0 });
        }

        const result = await cacheRegion({
          centerLat: lat,
          centerLon: lon,
          onProgress: (p) => { if (isMounted.current) setProgress(p); },
        });

        if (isMounted.current) {
          setProgress(result);
          const meta: CacheMeta = {
            centerLat: lat, centerLon: lon,
            cachedAt: Date.now(), tileCount: result.downloaded, label: 'My Location',
          };
          await saveCacheMeta(meta);
          const sizeMB = await getCacheSizeMB();
          setCacheSizeMB(sizeMB);
          setStatus('ready');
        }
      } catch (e: any) {
        if (isMounted.current) { setError(e?.message || 'Tile download failed'); setStatus('error'); }
      }
    },
    [status, needsNewCache]
  );

  /** Cache tiles for a specific US state bounding box */
  const startCachingState = useCallback(
    async (state: StateBounds) => {
      if (status === 'downloading') return;
      if (isMounted.current) { setStatus('downloading'); setError(null); setProgress(null); }

      try {
        const result = await cacheByBounds({
          minLat: state.minLat, maxLat: state.maxLat,
          minLon: state.minLon, maxLon: state.maxLon,
          onProgress: (p) => { if (isMounted.current) setProgress(p); },
        });

        if (isMounted.current) {
          setProgress(result);
          const meta: CacheMeta = {
            centerLat: state.centerLat, centerLon: state.centerLon,
            cachedAt: Date.now(), tileCount: result.downloaded, label: state.name,
          };
          await saveCacheMeta(meta);
          const sizeMB = await getCacheSizeMB();
          setCacheSizeMB(sizeMB);
          setStatus('ready');
        }
      } catch (e: any) {
        if (isMounted.current) { setError(e?.message || 'State tile download failed'); setStatus('error'); }
      }
    },
    [status]
  );

  const cancelCaching = useCallback(() => {
    cancelCacheDownload();
    if (isMounted.current) setStatus('idle');
  }, []);

  return {
    status,
    progress,
    cacheSizeMB,
    lastCacheMeta,
    error,
    startCaching,
    startCachingState,
    cancelCaching,
    needsNewCache,
  };
}
