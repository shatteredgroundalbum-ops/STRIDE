export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portabilityRating: 1 | 2 | 3 | 4 | 5; // 5 = fully portable
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  tags: string[];
}

export interface DayPlan {
  day: number;
  dayName: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  waterGlasses: number;
}

// Mock meal plan generator (AI call returns this in production)
export function generateMockMealPlan(params: {
  calories: number;
  protein: number;
  dietStyle: string;
  livingSituation: string;
  cookingAccess: string;
  daysCount?: number;
}): DayPlan[] {
  const { calories, protein, livingSituation, cookingAccess, daysCount = 7 } = params;
  const isPortable = livingSituation === 'Truck' || cookingAccess === 'No cooking available' || cookingAccess === 'Microwave only';

  const mealTemplates: Meal[] = [
    {
      id: 'm1', name: 'Greek Yogurt & Banana', description: 'High-protein yogurt with fresh banana and a handful of almonds.',
      calories: 350, protein: 25, carbs: 42, fat: 8, portabilityRating: 5,
      category: 'Breakfast', tags: ['portable', 'no-cook', 'quick'],
    },
    {
      id: 'm2', name: 'Canned Tuna Wrap', description: 'Tuna in a whole-wheat tortilla with mustard, pickles, and lettuce.',
      calories: 420, protein: 38, carbs: 35, fat: 9, portabilityRating: 5,
      category: 'Lunch', tags: ['portable', 'high-protein', 'no-cook'],
    },
    {
      id: 'm3', name: 'Rotisserie Chicken + Apple', description: 'Grab-and-go rotisserie chicken breast with fresh apple.',
      calories: 380, protein: 40, carbs: 25, fat: 8, portabilityRating: 5,
      category: 'Lunch', tags: ['portable', 'gas-station-friendly'],
    },
    {
      id: 'm4', name: 'Beef Jerky & Trail Mix', description: 'Protein-rich jerky with mixed nuts and dried fruit.',
      calories: 290, protein: 22, carbs: 24, fat: 12, portabilityRating: 5,
      category: 'Snack', tags: ['portable', 'shelf-stable'],
    },
    {
      id: 'm5', name: 'Protein Bar + String Cheese', description: 'A 20g protein bar with 2 string cheese sticks.',
      calories: 360, protein: 32, carbs: 28, fat: 14, portabilityRating: 5,
      category: 'Snack', tags: ['portable', 'no-cook'],
    },
    {
      id: 'm6', name: 'Hard Boiled Eggs + Rice Cakes', description: '3 hard boiled eggs with lightly salted rice cakes.',
      calories: 310, protein: 21, carbs: 28, fat: 12, portabilityRating: 5,
      category: 'Breakfast', tags: ['portable', 'prep-ahead'],
    },
    {
      id: 'm7', name: 'Grilled Salmon & Vegetables', description: 'Baked salmon fillet with steamed broccoli and quinoa.',
      calories: 520, protein: 45, carbs: 35, fat: 18, portabilityRating: 2,
      category: 'Dinner', tags: ['kitchen-needed', 'omega-3', 'high-protein'],
    },
    {
      id: 'm8', name: 'Turkey Sandwich', description: 'Deli turkey on whole wheat with avocado and spinach.',
      calories: 440, protein: 36, carbs: 42, fat: 14, portabilityRating: 4,
      category: 'Lunch', tags: ['portable', 'deli'],
    },
    {
      id: 'm9', name: 'Overnight Oats', description: 'Rolled oats with almond milk, chia seeds, and blueberries.',
      calories: 380, protein: 18, carbs: 55, fat: 10, portabilityRating: 4,
      category: 'Breakfast', tags: ['prep-ahead', 'no-cook'],
    },
    {
      id: 'm10', name: 'Peanut Butter Banana Shake', description: 'Protein shake with banana, peanut butter, and oats.',
      calories: 420, protein: 30, carbs: 48, fat: 14, portabilityRating: 3,
      category: 'Breakfast', tags: ['shake', 'quick'],
    },
    {
      id: 'm11', name: 'Chipotle Bowl (Portable)', description: 'Rice, beans, grilled chicken, salsa, and guacamole.',
      calories: 650, protein: 48, carbs: 68, fat: 18, portabilityRating: 4,
      category: 'Dinner', tags: ['restaurant', 'portable'],
    },
    {
      id: 'm12', name: 'Cottage Cheese & Pineapple', description: 'Low-fat cottage cheese with pineapple chunks.',
      calories: 220, protein: 28, carbs: 22, fat: 2, portabilityRating: 3,
      category: 'Snack', tags: ['high-protein', 'low-fat'],
    },
  ];

  const portableMeals = isPortable ? mealTemplates.filter(m => m.portabilityRating >= 4) : mealTemplates;

  const days: DayPlan[] = [];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  for (let i = 0; i < daysCount; i++) {
    const breakfasts = portableMeals.filter(m => m.category === 'Breakfast');
    const lunches = portableMeals.filter(m => m.category === 'Lunch');
    const dinners = portableMeals.filter(m => m.category === 'Dinner');
    const snacks = portableMeals.filter(m => m.category === 'Snack');

    const breakfast = breakfasts[i % breakfasts.length];
    const lunch = lunches[i % lunches.length];
    const dinner = isPortable ? lunches[(i + 1) % lunches.length] : dinners[i % dinners.length];
    const snack = snacks[i % snacks.length];

    const meals = [breakfast, lunch, dinner, snack].filter(Boolean);
    const totalCalories = meals.reduce((s, m) => s + m.calories, 0);
    const totalProtein = meals.reduce((s, m) => s + m.protein, 0);
    const totalCarbs = meals.reduce((s, m) => s + m.carbs, 0);
    const totalFat = meals.reduce((s, m) => s + m.fat, 0);

    days.push({
      day: i + 1,
      dayName: dayNames[i % 7],
      meals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      waterGlasses: 8,
    });
  }

  return days;
}
