export interface GPSPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
  speed?: number; // m/s
  timestamp: number;
}

export function metersToMiles(meters: number): number {
  return meters * 0.000621371;
}

export function mpsToMph(mps: number): number {
  return mps * 2.23694;
}

export function haversineDistance(p1: GPSPoint, p2: GPSPoint): number {
  const R = 6371000; // Earth radius in meters
  const lat1 = (p1.latitude * Math.PI) / 180;
  const lat2 = (p2.latitude * Math.PI) / 180;
  const dLat = ((p2.latitude - p1.latitude) * Math.PI) / 180;
  const dLon = ((p2.longitude - p1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // meters
}

export function totalRouteDistance(points: GPSPoint[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineDistance(points[i - 1], points[i]);
  }
  return total; // meters
}

export function calculateGrade(p1: GPSPoint, p2: GPSPoint): number {
  const horizontalDist = haversineDistance(p1, p2);
  if (horizontalDist < 1) return 0;
  const verticalDist = (p2.altitude || 0) - (p1.altitude || 0);
  return (verticalDist / horizontalDist) * 100; // %
}

export function detectActivityType(speedMph: number): 'walking' | 'running' | 'still' {
  if (speedMph < 0.3) return 'still';
  if (speedMph < 4.0) return 'walking';
  return 'running';
}

export function formatDistance(distanceMiles: number): string {
  if (distanceMiles < 0.1) {
    return `${Math.round(distanceMiles * 5280)} ft`;
  }
  return `${distanceMiles.toFixed(2)} mi`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
