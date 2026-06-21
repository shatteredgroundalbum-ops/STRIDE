import { useState, useEffect, useRef, useCallback } from 'react';
import { saveSession, createSessionId, type WorkoutSession } from '../store/sessionStore';
import { calcCaloriesPerMinute, mphToMinPerMile } from '../utils/calories';
import { formatDuration, formatDistance, metersToMiles } from '../utils/gpsHelpers';
import type { GPSPoint } from '../utils/gpsHelpers';
import type { FitnessLevel } from '../data/fitnessLevels';

interface SessionParams {
  weightLbs: number;
  age: number;
  fitnessLevel: FitnessLevel;
}

export function useSession(params: SessionParams) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionType, setSessionType] = useState<'outdoor' | 'gym'>('outdoor');
  const [elapsed, setElapsed] = useState(0); // seconds
  const [distanceMiles, setDistanceMiles] = useState(0);
  const [calories, setCalories] = useState(0);
  const [currentSpeedMph, setCurrentSpeedMph] = useState(0);
  const [activityType, setActivityType] = useState<'walking' | 'running' | 'still'>('still');
  const [route, setRoute] = useState<GPSPoint[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionIdRef = useRef<string>('');
  const startTimeRef = useRef<number>(0);

  const startSession = useCallback((type: 'outdoor' | 'gym') => {
    sessionIdRef.current = createSessionId();
    startTimeRef.current = Date.now();
    setSessionType(type);
    setIsActive(true);
    setIsPaused(false);
    setElapsed(0);
    setDistanceMiles(0);
    setCalories(0);
    setCurrentSpeedMph(0);
    setRoute([]);
    setActivityType('still');

    timerRef.current = setInterval(() => {
      if (!isPaused) setElapsed(e => e + 1);
    }, 1000);
  }, [isPaused]);

  const pauseSession = useCallback(() => setIsPaused(p => !p), []);

  const endSession = useCallback(async (): Promise<WorkoutSession> => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);

    const session: WorkoutSession = {
      id: sessionIdRef.current,
      startTime: startTimeRef.current,
      endTime: Date.now(),
      type: sessionType,
      activityType: activityType === 'still' ? 'walking' : activityType,
      durationSeconds: elapsed,
      distanceMiles: distanceMiles > 0 ? distanceMiles : undefined,
      caloriesBurned: Math.round(calories),
      avgSpeedMph: elapsed > 0 ? (distanceMiles / elapsed) * 3600 : 0,
      route,
    };

    await saveSession(session);
    return session;
  }, [sessionType, activityType, elapsed, distanceMiles, calories, route]);

  // Simulate GPS update for mock
  const updateLocation = useCallback((point: GPSPoint) => {
    setRoute(prev => {
      const next = [...prev, point];
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        const R = 6371000;
        const dLat = (point.latitude - last.latitude) * Math.PI / 180;
        const dLon = (point.longitude - last.longitude) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(last.latitude*Math.PI/180) * Math.cos(point.latitude*Math.PI/180) * Math.sin(dLon/2)**2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const dist = R * c * 0.000621371;
        setDistanceMiles(d => d + dist);
      }
      return next;
    });

    if (point.speed !== undefined) {
      const mph = point.speed * 2.23694;
      setCurrentSpeedMph(mph);
      setActivityType(mph < 0.3 ? 'still' : mph < 4.0 ? 'walking' : 'running');

      const calPerMin = calcCaloriesPerMinute({
        speedMph: mph,
        weightLbs: params.weightLbs,
        age: params.age,
        fitnessLevel: params.fitnessLevel,
      });
      setCalories(c => c + calPerMin / 60);
    }
  }, [params]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return {
    isActive,
    isPaused,
    sessionType,
    elapsed,
    elapsedDisplay: formatDuration(elapsed),
    distanceMiles,
    distanceDisplay: formatDistance(distanceMiles),
    calories: Math.round(calories),
    currentSpeedMph,
    pace: mphToMinPerMile(currentSpeedMph),
    activityType,
    route,
    startSession,
    pauseSession,
    endSession,
    updateLocation,
  };
}
