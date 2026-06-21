import { calcBMR, calcTDEE, calcCalorieTarget, calcWaterTarget } from './calories';

export interface NutritionTargets {
  calories: number;
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
  water: number;   // oz
  mealFrequency: number;
}

export function calculateNutritionTargets(profile: {
  weightLbs: number;
  heightInches: number;
  age: number;
  gender: string;
  goal: string;
  activityLevel: string;
  dietStyle?: string;
}): NutritionTargets {
  const { weightLbs, heightInches, age, gender, goal, activityLevel, dietStyle } = profile;

  const activityMultMap: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extra: 1.9,
  };

  const bmr = calcBMR(weightLbs, heightInches, age, gender);
  const multiplier = activityMultMap[activityLevel] || 1.375;
  const tdee = calcTDEE(bmr, multiplier);
  const calories = calcCalorieTarget(tdee, goal);

  // Protein: 1g per lb of bodyweight
  const protein = Math.round(weightLbs);

  // Fat & Carbs by diet style
  let fat = 0;
  let carbs = 0;

  if (dietStyle === 'Keto') {
    fat = Math.round((calories * 0.70) / 9);
    carbs = Math.round((calories * 0.05) / 4);
  } else if (dietStyle === 'Paleo') {
    fat = Math.round((calories * 0.40) / 9);
    carbs = Math.round((calories * 0.25) / 4);
  } else if (dietStyle === 'Mediterranean') {
    fat = Math.round((calories * 0.35) / 9);
    carbs = Math.round((calories * 0.45) / 4);
  } else {
    // Standard / IF / No preference
    fat = Math.round((calories * 0.30) / 9);
    carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  }

  carbs = Math.max(20, carbs);

  const water = calcWaterTarget(weightLbs, activityLevel);

  // Meal frequency
  let mealFrequency = 3;
  if (dietStyle === 'Intermittent Fasting') mealFrequency = 2;
  if (goal === 'Build Muscle') mealFrequency = 4;

  return { calories, protein, carbs, fat, water, mealFrequency };
}
