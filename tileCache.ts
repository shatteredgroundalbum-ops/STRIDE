/**
 * tileCache.ts
 * Offline OSM raster tile downloader and cache manager.
 *
 * Strategy:
 *  - Tiles are PNG images served by openstreetmap.org CDN at:
 *      https://tile.openstreetmap.org/{z}/{x}/{y}.png
 *  - Downloaded tiles are written to:
 *      <documentDirectory>/osm_tiles/{z}/{x}/{y}.png
 *  - UrlTile in react-native-maps is pointed at the LOCAL file:// path.
 *    If a tile isn't cached yet, the component falls back to the live URL.
 *
 * Tile math:
 *  lon/lat → tile XY at zoom Z uses the standard Web Mercator tile schema.
 */

import * as FileSystem from 'expo-file-system';

// ─── Constants ────────────────────────────────────────────────────────────────

const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_BASE_DIR = `${FileSystem.documentDirectory}osm_tiles/`;

// Zoom levels to cache.  12–15 gives street-level detail without huge storage.
const CACHE_MIN_ZOOM = 12;
const CACHE_MAX_ZOOM = 15;

// Bounding-box padding in degrees around the user's location.
// ~0.2° ≈ 12 miles radius.
const DEFAULT_PADDING_DEG = 0.2;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TileCacheProgress {
  total: number;
  downloaded: number;
  failed: number;
  isDone: boolean;
  percentComplete: number;
}

export type ProgressCallback = (p: TileCacheProgress) => void;

// ─── Tile Math ────────────────────────────────────────────────────────────────

/** Convert lat/lon + zoom to OSM tile X coordinate */
function lonToTileX(lon: number, zoom: number): number {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

/** Convert lat/lon + zoom to OSM tile Y coordinate */
function latToTileY(lat: number, zoom: number): number {
  const latRad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  );
}

/** Build the list of all tile (z,x,y) tuples for a bounding box */
function getTilesForBounds(
  minLat: number,
  maxLat: number,
  minLon: number,
  maxLon: number,
  zoom: number
): Array<{ z: number; x: number; y: number }> {
  const xMin = lonToTileX(minLon, zoom);
  const xMax = lonToTileX(maxLon, zoom);
  // Note: Y increases downward, so maxLat → smaller Y
  const yMin = latToTileY(maxLat, zoom);
  const yMax = latToTileY(minLat, zoom);

  const tiles: Array<{ z: number; x: number; y: number }> = [];
  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      tiles.push({ z: zoom, x, y });
    }
  }
  return tiles;
}

// ─── File Helpers ─────────────────────────────────────────────────────────────

/** Local path for a tile */
export function localTilePath(z: number, x: number, y: number): string {
  return `${TILE_BASE_DIR}${z}/${x}/${y}.png`;
}

/** URI to pass to react-native-maps UrlTile — local if cached, live if not */
export function tileUrlTemplate(): string {
  // react-native-maps UrlTile accepts file:// paths on iOS/Android.
  // We serve local tiles directly; the component fetches live for any miss.
  return `file://${TILE_BASE_DIR}{z}/{x}/{y}.png`;
}

/** Live OSM URL for a tile (used as download source) */
function liveTileUrl(z: number, x: number, y: number): string {
  // Distribute across a/b/c subdomains to respect CDN etiquette
  const sub = ['a', 'b', 'c'][(x + y) % 3];
  return `https://${sub}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
}

/** Ensure the directory tree exists for a tile */
async function ensureDir(z: number, x: number): Promise<void> {
  const dir = `${TILE_BASE_DIR}${z}/${x}/`;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

// ─── Cache Status ─────────────────────────────────────────────────────────────

/** Returns true if a specific tile already exists on disk */
export async function isTileCached(z: number, x: number, y: number): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(localTilePath(z, x, y));
  return info.exists;
}

/** Count how many tiles from a tile list are already cached */
export async function countCachedTiles(
  tiles: Array<{ z: number; x: number; y: number }>
): Promise<number> {
  const checks = await Promise.all(tiles.map(t => isTileCached(t.z, t.x, t.y)));
  return checks.filter(Boolean).length;
}

// ─── Download Engine ──────────────────────────────────────────────────────────

const MAX_CONCURRENT = 4; // parallel downloads to avoid rate-limit

/** Download a single tile. Returns true on success, false on failure. */
async function downloadTile(z: number, x: number, y: number): Promise<boolean> {
  const dest = localTilePath(z, x, y);
  const exists = await isTileCached(z, x, y);
  if (exists) return true;

  try {
    await ensureDir(z, x);
    const url = liveTileUrl(z, x, y);
    const result = await FileSystem.downloadAsync(url, dest, {
      headers: {
        'User-Agent': 'STRIDE-App/1.0 (health fitness tracker; contact@stride.app)',
      },
    });
    return result.status === 200;
  } catch {
    return false;
  }
}

/** Download tiles in batches with concurrency limit */
async function downloadBatch(
  tiles: Array<{ z: number; x: number; y: number }>,
  onProgress: ProgressCallback,
  abortSignal: { aborted: boolean }
): Promise<{ downloaded: number; failed: number }> {
  let downloaded = 0;
  let failed = 0;
  const total = tiles.length;

  // Process in chunks of MAX_CONCURRENT
  for (let i = 0; i < tiles.length; i += MAX_CONCURRENT) {
    if (abortSignal.aborted) break;

    const chunk = tiles.slice(i, i + MAX_CONCURRENT);
    const results = await Promise.all(chunk.map(t => downloadTile(t.z, t.x, t.y)));

    results.forEach(ok => {
      if (ok) downloaded++;
      else failed++;
    });

    onProgress({
      total,
      downloaded,
      failed,
      isDone: false,
      percentComplete: Math.round(((downloaded + failed) / total) * 100),
    });

    // Small delay between batches to be respectful to the tile CDN
    if (i + MAX_CONCURRENT < tiles.length) {
      await new Promise(r => setTimeout(r, 50));
    }
  }

  return { downloaded, failed };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface CacheByBoundsOptions {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
  minZoom?: number;
  maxZoom?: number;
  onProgress?: ProgressCallback;
}

/**
 * Download tiles for an explicit lat/lon bounding box (e.g. a US state).
 * Already-cached tiles are skipped automatically.
 */
export async function cacheByBounds(options: CacheByBoundsOptions): Promise<TileCacheProgress> {
  const {
    minLat,
    maxLat,
    minLon,
    maxLon,
    minZoom = CACHE_MIN_ZOOM,
    maxZoom = CACHE_MAX_ZOOM,
    onProgress,
  } = options;

  if (activeAbortSignal) activeAbortSignal.aborted = true;
  const abortSignal = { aborted: false };
  activeAbortSignal = abortSignal;

  let allTiles: Array<{ z: number; x: number; y: number }> = [];
  for (let z = minZoom; z <= maxZoom; z++) {
    allTiles = allTiles.concat(getTilesForBounds(minLat, maxLat, minLon, maxLon, z));
  }

  const noop: ProgressCallback = () => {};
  const progressCb = onProgress || noop;

  progressCb({ total: allTiles.length, downloaded: 0, failed: 0, isDone: false, percentComplete: 0 });

  const { downloaded, failed } = await downloadBatch(allTiles, progressCb, abortSignal);

  const final: TileCacheProgress = {
    total: allTiles.length,
    downloaded,
    failed,
    isDone: true,
    percentComplete: 100,
  };

  progressCb(final);
  activeAbortSignal = null;
  return final;
}

export interface CacheRegionOptions {
  centerLat: number;
  centerLon: number;
  paddingDeg?: number;
  minZoom?: number;
  maxZoom?: number;
  onProgress?: ProgressCallback;
}

let activeAbortSignal: { aborted: boolean } | null = null;

/**
 * Download all OSM raster tiles for a region around the given coordinate.
 * Safe to call multiple times — already-cached tiles are skipped.
 */
export async function cacheRegion(options: CacheRegionOptions): Promise<TileCacheProgress> {
  const {
    centerLat,
    centerLon,
    paddingDeg = DEFAULT_PADDING_DEG,
    minZoom = CACHE_MIN_ZOOM,
    maxZoom = CACHE_MAX_ZOOM,
    onProgress,
  } = options;

  // Cancel any in-progress download
  if (activeAbortSignal) activeAbortSignal.aborted = true;
  const abortSignal = { aborted: false };
  activeAbortSignal = abortSignal;

  const minLat = centerLat - paddingDeg;
  const maxLat = centerLat + paddingDeg;
  const minLon = centerLon - paddingDeg;
  const maxLon = centerLon + paddingDeg;

  // Collect all tiles across all zoom levels
  let allTiles: Array<{ z: number; x: number; y: number }> = [];
  for (let z = minZoom; z <= maxZoom; z++) {
    allTiles = allTiles.concat(getTilesForBounds(minLat, maxLat, minLon, maxLon, z));
  }

  const noop: ProgressCallback = () => {};
  const progressCb = onProgress || noop;

  progressCb({ total: allTiles.length, downloaded: 0, failed: 0, isDone: false, percentComplete: 0 });

  const { downloaded, failed } = await downloadBatch(allTiles, progressCb, abortSignal);

  const final: TileCacheProgress = {
    total: allTiles.length,
    downloaded,
    failed,
    isDone: true,
    percentComplete: 100,
  };

  progressCb(final);
  activeAbortSignal = null;
  return final;
}

/** Cancel any active tile download */
export function cancelCacheDownload(): void {
  if (activeAbortSignal) {
    activeAbortSignal.aborted = true;
    activeAbortSignal = null;
  }
}

/** Wipe all cached tiles from disk */
export async function clearTileCache(): Promise<void> {
  const info = await FileSystem.getInfoAsync(TILE_BASE_DIR);
  if (info.exists) {
    await FileSystem.deleteAsync(TILE_BASE_DIR, { idempotent: true });
  }
}

/** Get estimated cache size in MB */
export async function getCacheSizeMB(): Promise<number> {
  try {
    const info = await FileSystem.getInfoAsync(TILE_BASE_DIR, { size: true });
    if (!info.exists) return 0;
    // expo-file-system size is in bytes
    return Math.round(((info as any).size || 0) / (1024 * 1024) * 10) / 10;
  } catch {
    return 0;
  }
}

/** Estimate how many tiles will be downloaded for a region (without downloading) */
export function estimateTileCount(
  paddingDeg = DEFAULT_PADDING_DEG,
  minZoom = CACHE_MIN_ZOOM,
  maxZoom = CACHE_MAX_ZOOM
): number {
  // Use (0,0) as dummy center — tile counts are symmetric
  let total = 0;
  for (let z = minZoom; z <= maxZoom; z++) {
    total += getTilesForBounds(
      -paddingDeg, paddingDeg, -paddingDeg, paddingDeg, z
    ).length;
  }
  return total;
}
