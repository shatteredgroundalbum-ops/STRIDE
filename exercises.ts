export interface Exercise {
  id: string;
  name: string;
  category: 'Strength' | 'Cardio' | 'Flexibility' | 'HIIT';
  muscleGroup?: string;
  metValue: number; // MET value for calorie calculation
  description: string;
  beginner?: boolean;
}

export const EXERCISES: Exercise[] = [
  // Strength
  { id: 'pushup', name: 'Push-Up', category: 'Strength', muscleGroup: 'Chest/Triceps', metValue: 3.8, description: 'Classic upper body movement', beginner: true },
  { id: 'squat', name: 'Bodyweight Squat', category: 'Strength', muscleGroup: 'Legs/Glutes', metValue: 5.0, description: 'Fundamental lower body exercise', beginner: true },
  { id: 'lunge', name: 'Lunge', category: 'Strength', muscleGroup: 'Legs/Glutes', metValue: 4.0, description: 'Unilateral leg strength', beginner: true },
  { id: 'plank', name: 'Plank Hold', category: 'Strength', muscleGroup: 'Core', metValue: 3.5, description: 'Core stability and endurance', beginner: true },
  { id: 'deadlift', name: 'Deadlift', category: 'Strength', muscleGroup: 'Full Body', metValue: 6.0, description: 'Posterior chain compound lift' },
  { id: 'bench', name: 'Bench Press', category: 'Strength', muscleGroup: 'Chest', metValue: 5.0, description: 'Horizontal pushing strength' },
  { id: 'row', name: 'Dumbbell Row', category: 'Strength', muscleGroup: 'Back', metValue: 5.0, description: 'Upper back pulling strength' },
  { id: 'ohp', name: 'Overhead Press', category: 'Strength', muscleGroup: 'Shoulders', metValue: 5.0, description: 'Vertical pushing strength' },

  // Cardio
  { id: 'walk', name: 'Brisk Walk', category: 'Cardio', metValue: 4.3, description: '3.5+ mph pace', beginner: true },
  { id: 'jog', name: 'Jogging', category: 'Cardio', metValue: 7.0, description: 'Easy conversational pace run' },
  { id: 'run', name: 'Running', category: 'Cardio', metValue: 9.8, description: 'Sustained running effort' },
  { id: 'bike', name: 'Cycling', category: 'Cardio', metValue: 8.0, description: 'Moderate cycling effort' },
  { id: 'jump_rope', name: 'Jump Rope', category: 'Cardio', metValue: 11.8, description: 'High intensity cardio' },

  // Flexibility
  { id: 'stretch', name: 'Full Body Stretch', category: 'Flexibility', metValue: 2.3, description: 'Mobility and flexibility routine', beginner: true },
  { id: 'yoga', name: 'Yoga Flow', category: 'Flexibility', metValue: 3.0, description: 'Movement and breath work', beginner: true },

  // HIIT
  { id: 'burpee', name: 'Burpees', category: 'HIIT', metValue: 10.0, description: 'Full body explosive movement' },
  { id: 'mountain', name: 'Mountain Climbers', category: 'HIIT', metValue: 8.0, description: 'Core and cardio combo' },
  { id: 'jumping_jack', name: 'Jumping Jacks', category: 'HIIT', metValue: 7.7, description: 'Classic full body warmup', beginner: true },
];
