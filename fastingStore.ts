import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../constants/config';
import type { FastState } from '../utils/fastingEngine';

export interface FastRecord {
  startTime: number;
  endTime: number;
  durationHours: number;
  milestones: number[];
  notes?: string;
}

export async function saveFastState(state: FastState): Promise<void> {
  await AsyncStorage.setItem(Config.STORAGE_KEYS.FAST_STATE, JSON.stringify(state));
}

export async function loadFastState(): Promise<FastState> {
  const raw = await AsyncStorage.getItem(Config.STORAGE_KEYS.FAST_STATE);
  if (!raw) {
    return { isActive: false, startTime: null, milestonesSeen: [], lastUpdated: Date.now() };
  }
  return JSON.parse(raw) as FastState;
}

export async function startFast(): Promise<FastState> {
  const state: FastState = {
    isActive: true,
    startTime: Date.now(),
    milestonesSeen: [],
    lastUpdated: Date.now(),
  };
  await saveFastState(state);
  return state;
}

export async function endFast(state: FastState): Promise<void> {
  if (!state.startTime) return;
  const durationHours = (Date.now() - state.startTime) / (1000 * 60 * 60);

  // Save to history
  const historyRaw = await AsyncStorage.getItem('@stride_fast_history');
  const history: FastRecord[] = historyRaw ? JSON.parse(historyRaw) : [];
  history.unshift({
    startTime: state.startTime,
    endTime: Date.now(),
    durationHours,
    milestones: state.milestonesSeen,
  });
  await AsyncStorage.setItem('@stride_fast_history', JSON.stringify(history.slice(0, 50)));

  // Clear active fast
  const cleared: FastState = { isActive: false, startTime: null, milestonesSeen: [], lastUpdated: Date.now() };
  await saveFastState(cleared);
}

export async function loadFastHistory(): Promise<FastRecord[]> {
  const raw = await AsyncStorage.getItem('@stride_fast_history');
  if (!raw) return [];
  return JSON.parse(raw) as FastRecord[];
}

export async function markMilestoneSeen(state: FastState, hours: number): Promise<FastState> {
  const updated = {
    ...state,
    milestonesSeen: [...state.milestonesSeen, hours],
    lastUpdated: Date.now(),
  };
  await saveFastState(updated);
  return updated;
}
