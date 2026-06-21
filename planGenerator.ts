import { Config } from '../constants/config';
import { generateMockMealPlan } from '../utils/mealPlanner';
import { generateWalkRunProgression } from '../utils/exercisePlanner';
import { calculateNutritionTargets } from '../utils/nutritionCalc';
import type { UserProfile } from '../store/profileStore';
import type { GeneratedPlan } from '../store/planStore';

export type PlanProgress = {
  step: number;
  total: number;
  message: string;
};

const PROGRESS_MESSAGES = [
  'Analyzing your health profile...',
  'Building your meal plan...',
  'Creating your walking progression...',
  'Setting up your exercise plan...',
  'Finalizing your fasting recommendations...',
  'Compiling your personalized plan...',
];

export async function generatePlan(
  profile: UserProfile,
  onProgress?: (progress: PlanProgress) => void
): Promise<GeneratedPlan> {
  const total = PROGRESS_MESSAGES.length;

  for (let i = 0; i < total; i++) {
    onProgress?.({ step: i + 1, total, message: PROGRESS_MESSAGES[i] });
    await new Promise(r => setTimeout(r, Config.MOCK_AI_DELAY_MS / total));
  }

  const heightInches = profile.heightFeet * 12 + profile.heightInches;
  const nutrition = calculateNutritionTargets({
    weightLbs: profile.weightLbs,
    heightInches,
    age: profile.age,
    gender: profile.gender,
    goal: profile.goal,
    activityLevel: 'light',
    dietStyle: profile.dietStyle,
  });

  const mealPlan = generateMockMealPlan({
    calories: nutrition.calories,
    protein: nutrition.protein,
    dietStyle: profile.dietStyle,
    livingSituation: profile.livingSituation,
    cookingAccess: profile.cookingAccess,
  });

  const walkRunProgression = generateWalkRunProgression(
    profile.fitnessLevel,
    profile.goal,
    8
  );

  let fastingWindowHours: number | undefined;
  let fastingProtocol: string | undefined;

  if (profile.dietStyle === 'Intermittent Fasting') {
    fastingWindowHours = 16;
    fastingProtocol = '16:8 — Eat within an 8-hour window, fast for 16 hours.';
  } else if (profile.goal === 'Lose Weight') {
    fastingWindowHours = 14;
    fastingProtocol = '14:10 — A gentle introduction to time-restricted eating.';
  }

  return {
    mealPlan,
    walkRunProgression,
    fastingWindowHours,
    fastingProtocol,
    currentWeek: 1,
    generatedAt: Date.now(),
    version: 1,
  };
}
