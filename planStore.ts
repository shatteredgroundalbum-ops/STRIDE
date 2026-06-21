import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../constants/config';
import type { DayPlan } from '../utils/mealPlanner';
import type { WeekPlan } from '../utils/exercisePlanner';

export interface GeneratedPlan {
  mealPlan: DayPlan[];
  walkRunProgression: WeekPlan[];
  fastingWindowHours?: number;
  fastingProtocol?: string;
  currentWeek: number;
  generatedAt: number;
  version: number;
}

export async function savePlan(plan: GeneratedPlan): Promise<void> {
  await AsyncStorage.setItem(Config.STORAGE_KEYS.PLAN, JSON.stringify(plan));
}

export async function loadPlan(): Promise<GeneratedPlan | null> {
  const raw = await AsyncStorage.getItem(Config.STORAGE_KEYS.PLAN);
  if (!raw) return null;
  return JSON.parse(raw) as GeneratedPlan;
}

export async function saveWaterLog(date: string, glasses: number): Promise<void> {
  const raw = await AsyncStorage.getItem(Config.STORAGE_KEYS.WATER_LOG);
  const log: Record<string, number> = raw ? JSON.parse(raw) : {};
  log[date] = glasses;
  await AsyncStorage.setItem(Config.STORAGE_KEYS.WATER_LOG, JSON.stringify(log));
}

export async function loadWaterLog(): Promise<Record<string, number>> {
  const raw = await AsyncStorage.getItem(Config.STORAGE_KEYS.WATER_LOG);
  if (!raw) return {};
  return JSON.parse(raw);
}
