import type { FitnessLevel } from '../data/fitnessLevels';

export interface WeekPlan {
  week: number;
  walkDistanceMiles: number;
  walkPaceMinPerMile: string;
  runIntervals?: string;
  notes: string;
}

export function generateWalkRunProgression(
  fitnessLevel: FitnessLevel,
  goal: string,
  weeksCount: number = 8
): WeekPlan[] {
  const plans: WeekPlan[] = [];

  const basesByLevel: Record<FitnessLevel, { dist: number; pace: number }> = {
    Beginner: { dist: 0.5, pace: 22 },
    Novice: { dist: 1.0, pace: 18 },
    Advanced: { dist: 2.0, pace: 14 },
    Expert: { dist: 3.0, pace: 11 },
  };

  const base = basesByLevel[fitnessLevel];
  const weeklyDistIncrease = fitnessLevel === 'Beginner' ? 0.25 : fitnessLevel === 'Novice' ? 0.4 : 0.6;
  const weeklyPaceImprovement = 0.3;

  for (let w = 1; w <= weeksCount; w++) {
    const dist = parseFloat((base.dist + weeklyDistIncrease * (w - 1)).toFixed(2));
    const paceSeconds = Math.max(540, Math.round((base.pace - weeklyPaceImprovement * (w - 1)) * 60));
    const paceMin = Math.floor(paceSeconds / 60);
    const paceSec = paceSeconds % 60;
    const paceStr = `${paceMin}:${paceSec.toString().padStart(2, '0')}`;

    let notes = '';
    let runIntervals: string | undefined;

    if (goal === 'Be More Athletic' && w >= 3) {
      if (fitnessLevel === 'Beginner' || fitnessLevel === 'Novice') {
        runIntervals = `${Math.min(w, 5)} x 1 min run / 2 min walk`;
        notes = `Add ${Math.min(w, 5)} running intervals. Focus on form.`;
      } else {
        runIntervals = `${Math.min(w * 2, 20)} min continuous run`;
        notes = `Continuous run included. Push pace in final 5 min.`;
      }
    } else if (goal === 'Lose Weight') {
      notes = w <= 2 ? 'Focus on consistent daily walks. Distance over speed.' : 'Increase pace gradually. Heart rate zone 2-3.';
    } else {
      notes = w <= 2 ? 'Build walking base. Consistent effort.' : 'Progress naturally. Listen to your body.';
    }

    plans.push({ week: w, walkDistanceMiles: dist, walkPaceMinPerMile: paceStr, runIntervals, notes });
  }

  return plans;
}
