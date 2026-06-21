export interface FastingMilestone {
  hours: number;
  label: string;
  title: string;
  body: string;
  level: 'info' | 'good' | 'great' | 'warning' | 'danger';
}

export const FASTING_MILESTONES: FastingMilestone[] = [
  {
    hours: 12,
    label: '12h',
    title: 'Fat Burning Begins',
    body: "Glycogen stores are depleting. Your body is beginning to shift toward fat burning. Ketosis is starting.",
    level: 'good',
  },
  {
    hours: 14,
    label: '14h',
    title: 'Ketosis Rising',
    body: "Fat burning is increasing. Growth hormone levels are beginning to rise.",
    level: 'good',
  },
  {
    hours: 16,
    label: '16h',
    title: 'Active Ketosis',
    body: "You are in active ketosis. Growth hormone has spiked significantly. Mental clarity often improves here.",
    level: 'great',
  },
  {
    hours: 18,
    label: '18h',
    title: 'Deep Ketosis',
    body: "Deep ketosis. Fat is your primary fuel source. Cellular repair processes are activating.",
    level: 'great',
  },
  {
    hours: 24,
    label: '24h',
    title: 'Autophagy Begins',
    body: "Autophagy has begun. Your body is breaking down and recycling damaged cells. This is significant.",
    level: 'great',
  },
  {
    hours: 36,
    label: '36h',
    title: 'Deep Autophagy',
    body: "Deep autophagy. Ketone production is high. Many people report reduced hunger and increased focus at this stage.",
    level: 'great',
  },
  {
    hours: 48,
    label: '48h',
    title: 'Immune Reset',
    body: "Your immune system is beginning a reset process. Stem cell production is increasing.",
    level: 'great',
  },
  {
    hours: 72,
    label: '72h',
    title: 'Stem Cell Regeneration',
    body: "Stem cell regeneration is actively triggered. This is one of the deepest benefits of extended fasting.",
    level: 'great',
  },
  {
    hours: 120,
    label: 'Day 5',
    title: 'Extended Fasting',
    body: "You have reached extended fasting territory. Ensure you are staying hydrated with electrolytes.",
    level: 'info',
  },
  {
    hours: 192,
    label: 'Day 8',
    title: '⚠️ Peak Benefits Reached',
    body: "You have reached the point of peak fasting benefits. Autophagy, immune reset, and stem cell regeneration have all been triggered. Continuing beyond this point is primarily for weight loss only. Extended fasting beyond 8 days carries serious risks and should only be done under direct medical supervision. Please consult your doctor before continuing.",
    level: 'warning',
  },
];

export const BODY_STATES: { minHours: number; state: string; detail: string }[] = [
  { minHours: 0, state: 'Digesting', detail: 'Processing your last meal. Insulin is elevated.' },
  { minHours: 4, state: 'Post-Absorptive', detail: 'Nutrients absorbed. Insulin levels declining.' },
  { minHours: 8, state: 'Glycogen Burning', detail: 'Using stored glucose for energy.' },
  { minHours: 12, state: 'Fat Adaptation', detail: 'Shifting to fat burning. Ketosis approaching.' },
  { minHours: 16, state: 'Ketosis Active', detail: 'Burning fat for fuel. Growth hormone rising.' },
  { minHours: 24, state: 'Autophagy', detail: 'Cellular cleanup and repair underway.' },
  { minHours: 48, state: 'Immune Reset', detail: 'Stem cell production increasing.' },
  { minHours: 72, state: 'Deep Renewal', detail: 'Stem cell regeneration actively triggered.' },
];
