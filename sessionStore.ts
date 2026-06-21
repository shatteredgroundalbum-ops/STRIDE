import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GPSPoint } from '../utils/gpsHelpers';

export interface WorkoutSession {
  id: string;
  startTime: number;
  endTime?: number;
  type: 'outdoor' | 'gym';
  activityType?: 'walking' | 'running' | 'mixed';
  durationSeconds: number;
  distanceMiles?: number;
  caloriesBurned: number;
  avgSpeedMph?: number;
  maxSpeedMph?: number;
  steps?: number;
  route?: GPSPoint[];
  walkPercent?: number;
  runPercent?: number;
  preVitals?: {
    systolic?: number;
    diastolic?: number;
    heartRate?: number;
    temp?: number;
  };
  notes?: string;
}

export async function saveSession(session: WorkoutSession): Promise<void> {
  const raw = await AsyncStorage.getItem('@stride_sessions');
  const sessions: WorkoutSession[] = raw ? JSON.parse(raw) : [];
  const idx = sessions.findIndex(s => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    sessions.unshift(session);
  }
  await AsyncStorage.setItem('@stride_sessions', JSON.stringify(sessions.slice(0, 200)));
}

export async function loadSessions(): Promise<WorkoutSession[]> {
  const raw = await AsyncStorage.getItem('@stride_sessions');
  if (!raw) return [];
  return JSON.parse(raw) as WorkoutSession[];
}

export async function deleteSession(id: string): Promise<void> {
  const sessions = await loadSessions();
  const filtered = sessions.filter(s => s.id !== id);
  await AsyncStorage.setItem('@stride_sessions', JSON.stringify(filtered));
}

export function createSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
