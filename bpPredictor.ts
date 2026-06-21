import type { FitnessLevel } from '../data/fitnessLevels';

export interface BPPrediction {
  peakSystolic: number;
  peakDiastolic: number;
  recoverySystolic: number;
  recoveryDiastolic: number;
  riskLevel: 'normal' | 'elevated' | 'high' | 'very_high';
  warnings: string[];
}

/**
 * Estimates peak BP during exercise and recovery BP.
 * NOT diagnostic — for informational purposes only.
 */
export function predictBP(params: {
  restingSystolic: number;
  restingDiastolic: number;
  restingHR: number;
  bodyTempF?: number;
  age: number;
  fitnessLevel: FitnessLevel;
  activityType: 'walking' | 'running' | 'strength' | 'gym';
}): BPPrediction {
  const { restingSystolic, restingDiastolic, restingHR, age, fitnessLevel, activityType } = params;

  // Activity multipliers
  const activityMult: Record<string, { sys: number; dia: number }> = {
    walking: { sys: 1.25, dia: 1.05 },
    running: { sys: 1.45, dia: 1.1 },
    strength: { sys: 1.55, dia: 1.15 },
    gym: { sys: 1.35, dia: 1.08 },
  };

  const mult = activityMult[activityType] || activityMult.walking;

  // Fitness reduces peak BP response
  const fitnessMod: Record<FitnessLevel, number> = {
    Beginner: 1.1,
    Novice: 1.05,
    Advanced: 0.97,
    Expert: 0.93,
  };

  const fm = fitnessMod[fitnessLevel] || 1.0;

  // Age modifier: BP response increases with age
  const ageMod = age > 50 ? 1.1 : age > 40 ? 1.05 : 1.0;

  const peakSystolic = Math.round(restingSystolic * mult.sys * fm * ageMod);
  const peakDiastolic = Math.round(restingDiastolic * mult.dia * fm);

  // Recovery: returns toward resting after 10 min
  const recoverySystolic = Math.round(restingSystolic + (peakSystolic - restingSystolic) * 0.2);
  const recoveryDiastolic = Math.round(restingDiastolic + (peakDiastolic - restingDiastolic) * 0.15);

  const warnings: string[] = [];
  let riskLevel: BPPrediction['riskLevel'] = 'normal';

  if (restingSystolic >= 180 || restingDiastolic >= 110) {
    riskLevel = 'very_high';
    warnings.push('Resting BP is critically elevated. Consult your doctor before exercising.');
  } else if (restingSystolic >= 140 || restingDiastolic >= 90) {
    riskLevel = 'high';
    warnings.push('Resting BP is high. Monitor closely and consider lower intensity exercise.');
  } else if (restingSystolic >= 130 || restingDiastolic >= 80) {
    riskLevel = 'elevated';
    warnings.push('BP is elevated. Stay well hydrated and avoid maximum effort.');
  }

  if (peakSystolic > 220) {
    warnings.push(`Estimated peak BP (${peakSystolic}/${peakDiastolic}) may be elevated. Keep intensity moderate.`);
  }

  return { peakSystolic, peakDiastolic, recoverySystolic, recoveryDiastolic, riskLevel, warnings };
}

export function bpCategory(systolic: number, diastolic: number): string {
  if (systolic < 120 && diastolic < 80) return 'Normal';
  if (systolic < 130 && diastolic < 80) return 'Elevated';
  if (systolic < 140 || diastolic < 90) return 'High (Stage 1)';
  if (systolic < 180 || diastolic < 110) return 'High (Stage 2)';
  return 'Hypertensive Crisis';
}
