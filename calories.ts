import type { FitnessLevel } from '../data/fitnessLevels';

// MET values from ACSM Compendium of Physical Activities
const WALKING_MET_TABLE: { mph: number; met: number }[] = [
  { mph: 2.0, met: 2.8 },
  { mph: 2.5, met: 3.0 },
  { mph: 3.0, met: 3.5 },
  { mph: 3.5, met: 4.3 },
  { mph: 4.0, met: 5.0 }, // border
];

const RUNNING_MET_TABLE: { mph: number; met: number }[] = [
  { mph: 4.0, met: 6.0 },
  { mph: 5.0, met: 8.3 },
  { mph: 6.0, met: 9.8 },
  { mph: 7.0, met: 11.0 },
  { mph: 8.0, met: 11.8 },
  { mph: 9.0, met: 12.8 },
  { mph: 10.0, met: 14.5 },
];

function interpolateMET(table: { mph: number; met: number }[], speed: number): number {
  if (speed <= table[0].mph) return table[0].met;
  if (speed >= table[table.length - 1].mph) return table[table.length - 1].met;
  for (let i = 0; i < table.length - 1; i++) {
    if (speed >= table[i].mph && speed < table[i + 1].mph) {
      const ratio = (speed - table[i].mph) / (table[i + 1].mph - table[i].mph);
      return table[i].met + ratio * (table[i + 1].met - table[i].met);
    }
  }
  return 4.0;
}

function getAgeMod(age: number): number {
  if (age <= 30) return 1.0;
  const decades = Math.floor((age - 30) / 10);
  return 1.0 - decades * 0.02;
}

function getFitnessLevelMod(level: FitnessLevel): number {
  switch (level) {
    case 'Beginner': return 1.15;
    case 'Novice': return 1.05;
    case 'Advanced': return 0.95;
    case 'Expert': return 0.88;
    default: return 1.0;
  }
}

/**
 * MET-based calorie calculation (calories per minute)
 * Grade: 1% incline ≈ +10% MET for walking
 */
export function calcCaloriesPerMinute(params: {
  speedMph: number;
  weightLbs: number;
  age: number;
  fitnessLevel: FitnessLevel;
  gradePercent?: number; // incline %
  heartRateBpm?: number; // optional HR for blended calc
  maxHeartRate?: number;
  restingHeartRate?: number;
}): number {
  const { speedMph, weightLbs, age, fitnessLevel, gradePercent = 0, heartRateBpm, maxHeartRate, restingHeartRate } = params;

  const weightKg = weightLbs * 0.453592;

  // Get base MET
  let baseMET: number;
  if (speedMph < 4.0) {
    baseMET = interpolateMET(WALKING_MET_TABLE, speedMph);
    // Grade adjustment: +10% per 1% incline for walking
    baseMET *= 1 + gradePercent * 0.1;
  } else {
    baseMET = interpolateMET(RUNNING_MET_TABLE, speedMph);
    baseMET *= 1 + gradePercent * 0.05;
  }

  // Apply modifiers
  const ageMod = getAgeMod(age);
  const fitnessMod = getFitnessLevelMod(fitnessLevel);

  const metCalories = (baseMET * weightKg * 3.5 / 200) * ageMod * fitnessMod;

  // Blend with HR-based Karvonen if HR available
  if (heartRateBpm && maxHeartRate && restingHeartRate) {
    const hrReserve = maxHeartRate - restingHeartRate;
    const hrIntensity = hrReserve > 0 ? (heartRateBpm - restingHeartRate) / hrReserve : 0.5;
    const hrCalories = (0.6309 * heartRateBpm + 0.1988 * weightKg + 0.2017 * age - 55.0969) / 4.184 / 60;
    // Blend: 60% HR-based, 40% MET-based
    return hrCalories * 0.6 + metCalories * 0.4;
  }

  return Math.max(0.1, metCalories);
}

/**
 * BMR using Mifflin-St Jeor
 */
export function calcBMR(weightLbs: number, heightInches: number, age: number, gender: string): number {
  const weightKg = weightLbs * 0.453592;
  const heightCm = heightInches * 2.54;
  if (gender === 'Female') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
}

/**
 * TDEE (Total Daily Energy Expenditure)
 */
export function calcTDEE(bmr: number, activityMultiplier: number): number {
  return Math.round(bmr * activityMultiplier);
}

/**
 * Daily calorie target based on goal
 */
export function calcCalorieTarget(tdee: number, goal: string): number {
  switch (goal) {
    case 'Lose Weight': return Math.round(tdee - 500);
    case 'Build Muscle': return Math.round(tdee + 300);
    default: return tdee;
  }
}

/**
 * Daily water target in oz
 */
export function calcWaterTarget(weightLbs: number, activityLevel: string): number {
  const base = weightLbs * 0.5;
  const activityAdd = activityLevel === 'very' || activityLevel === 'extra' ? 16 : 8;
  return Math.round(base + activityAdd);
}

export function mphToMinPerMile(mph: number): string {
  if (mph <= 0) return '--';
  const totalSeconds = 3600 / mph;
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.round(totalSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
