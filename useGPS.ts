import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import type { GPSPoint } from '../utils/gpsHelpers';

export function useGPS() {
  const [hasPermission, setHasPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GPSPoint | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        setError('Location permission denied. GPS tracking unavailable.');
      }
    })();
    return () => { watchId?.remove(); };
  }, []);

  const startTracking = useCallback(async (onUpdate: (point: GPSPoint) => void) => {
    if (!hasPermission) {
      setError('Location permission required');
      return;
    }
    setIsTracking(true);
    try {
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        loc => {
          const point: GPSPoint = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            altitude: loc.coords.altitude ?? undefined,
            speed: loc.coords.speed ?? undefined,
            timestamp: loc.timestamp,
          };
          setCurrentLocation(point);
          onUpdate(point);
        }
      );
      setWatchId(sub);
    } catch (e) {
      setError('Failed to start GPS tracking');
      setIsTracking(false);
    }
  }, [hasPermission]);

  const stopTracking = useCallback(() => {
    watchId?.remove();
    setWatchId(null);
    setIsTracking(false);
  }, [watchId]);

  return { hasPermission, currentLocation, isTracking, error, startTracking, stopTracking };
}
