import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../constants/config';

export interface UserProfile {
  // Auth
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;

  // Personal
  firstName?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Prefer not to say';
  heightFeet: number;
  heightInches: number;
  weightLbs: number;
  fitnessLevel: 'Beginner' | 'Novice' | 'Advanced' | 'Expert';

  // Goals & Health
  goal: 'Lose Weight' | 'Build Muscle' | 'Be More Athletic';
  healthConditions: string[];

  // Lifestyle
  occupationType: string;
  livingSituation: string;
  cookingAccess: string;
  sleepHours: number;

  // Diet
  dietStyle: string;
  avoidFoods: string[];
  allergies: string;

  // Supplements
  selectedSupplements: string[]; // supplement IDs
  takeMultivitamin: boolean;
  multivitaminBrand?: string;
  customSupplement?: string;

  // Nutrition targets
  calorieTarget: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
  waterTargetOz: number;
  mealFrequency: number;

  // Meta
  createdAt: number;
  updatedAt: number;
}

export const DEFAULT_PROFILE: Partial<UserProfile> = {
  age: 30,
  gender: 'Male',
  heightFeet: 5,
  heightInches: 10,
  weightLbs: 175,
  fitnessLevel: 'Novice',
  goal: 'Lose Weight',
  healthConditions: [],
  occupationType: 'Desk job',
  livingSituation: 'Home',
  cookingAccess: 'Full kitchen',
  sleepHours: 7,
  dietStyle: 'No preference',
  avoidFoods: [],
  allergies: '',
  selectedSupplements: [],
  takeMultivitamin: false,
  calorieTarget: 1800,
  proteinTarget: 175,
  carbTarget: 150,
  fatTarget: 60,
  waterTargetOz: 88,
  mealFrequency: 3,
};

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(Config.STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export async function loadProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(Config.STORAGE_KEYS.PROFILE);
  if (!raw) return null;
  return JSON.parse(raw) as UserProfile;
}

export async function updateProfile(updates: Partial<UserProfile>): Promise<void> {
  const existing = await loadProfile();
  if (!existing) return;
  const updated = { ...existing, ...updates, updatedAt: Date.now() };
  await saveProfile(updated);
}

export async function isOnboardingComplete(): Promise<boolean> {
  const val = await AsyncStorage.getItem(Config.STORAGE_KEYS.ONBOARDING_COMPLETE);
  return val === 'true';
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(Config.STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(Config.STORAGE_KEYS));
}
