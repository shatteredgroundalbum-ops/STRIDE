export type FitnessLevel = 'Beginner' | 'Novice' | 'Advanced' | 'Expert';

export interface FitnessLevelDef {
  id: FitnessLevel;
  description: string;
  metModifier: number; // Calorie multiplier
  weeklyVolumeMultiplier: number;
}

export const FITNESS_LEVELS: FitnessLevelDef[] = [
  {
    id: 'Beginner',
    description: 'Little to no exercise history. Just getting started.',
    metModifier: 1.15, // Beginners work harder at same pace
    weeklyVolumeMultiplier: 0.6,
  },
  {
    id: 'Novice',
    description: 'Some exercise experience. Active a few times per week.',
    metModifier: 1.05,
    weeklyVolumeMultiplier: 0.8,
  },
  {
    id: 'Advanced',
    description: 'Consistent training history. Works out regularly.',
    metModifier: 0.95,
    weeklyVolumeMultiplier: 1.0,
  },
  {
    id: 'Expert',
    description: 'High-performance athlete or long-term dedicated trainer.',
    metModifier: 0.88, // More efficient at same pace
    weeklyVolumeMultiplier: 1.3,
  },
];

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', description: 'Desk job, minimal movement', tdeeMultiplier: 1.2 },
  { id: 'light', label: 'Lightly Active', description: '1-3 days/week exercise', tdeeMultiplier: 1.375 },
  { id: 'moderate', label: 'Moderately Active', description: '3-5 days/week exercise', tdeeMultiplier: 1.55 },
  { id: 'very', label: 'Very Active', description: '6-7 days/week hard exercise', tdeeMultiplier: 1.725 },
  { id: 'extra', label: 'Extremely Active', description: 'Physical job + daily training', tdeeMultiplier: 1.9 },
];
