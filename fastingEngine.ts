import { FASTING_MILESTONES, BODY_STATES, type FastingMilestone } from '../data/milestones';

export interface FastState {
  isActive: boolean;
  startTime: number | null; // Unix timestamp ms
  milestonesSeen: number[]; // hours of seen milestones
  lastUpdated: number;
}

export function getElapsedHours(startTime: number): number {
  const nowMs = Date.now();
  const diffMs = nowMs - startTime;
  return diffMs / (1000 * 60 * 60);
}

export function getElapsedDisplay(startTime: number): { hours: number; minutes: number; seconds: number; totalHours: number } {
  const nowMs = Date.now();
  const diffMs = Math.max(0, nowMs - startTime);
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const totalHours = diffMs / (1000 * 60 * 60);
  return { hours, minutes, seconds, totalHours };
}

export function getNextMilestone(totalHours: number): FastingMilestone | null {
  const upcoming = FASTING_MILESTONES.filter(m => m.hours > totalHours);
  return upcoming.length > 0 ? upcoming[0] : null;
}

export function getLastMilestone(totalHours: number): FastingMilestone | null {
  const passed = FASTING_MILESTONES.filter(m => m.hours <= totalHours);
  return passed.length > 0 ? passed[passed.length - 1] : null;
}

export function checkNewMilestone(totalHours: number, milestonesSeen: number[]): FastingMilestone | null {
  for (const m of FASTING_MILESTONES) {
    if (totalHours >= m.hours && !milestonesSeen.includes(m.hours)) {
      return m;
    }
  }
  return null;
}

export function getBodyState(totalHours: number): { state: string; detail: string } {
  let current = BODY_STATES[0];
  for (const s of BODY_STATES) {
    if (totalHours >= s.minHours) current = s;
  }
  return { state: current.state, detail: current.detail };
}

export function getWarningLevel(totalHours: number): 'normal' | 'caution' | 'danger' {
  if (totalHours >= 960) return 'danger';  // 40 days
  if (totalHours >= 192) return 'caution'; // 8 days
  return 'normal';
}

export function getProgressToNextMilestone(totalHours: number): number {
  const next = getNextMilestone(totalHours);
  const last = getLastMilestone(totalHours);
  if (!next) return 1;
  const start = last ? last.hours : 0;
  const range = next.hours - start;
  const progress = (totalHours - start) / range;
  return Math.min(1, Math.max(0, progress));
}

export function formatFastDuration(totalHours: number): string {
  if (totalHours < 24) {
    const h = Math.floor(totalHours);
    const m = Math.floor((totalHours - h) * 60);
    return `${h}h ${m}m`;
  }
  const days = Math.floor(totalHours / 24);
  const hours = Math.floor(totalHours % 24);
  return `${days}d ${hours}h`;
}
