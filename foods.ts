export interface FoodItem {
  id: string;
  name: string;
  calories: number; // per serving
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  serving: string;
  portable: boolean; // truck-driver friendly
  category: 'Protein' | 'Carb' | 'Fat' | 'Vegetable' | 'Fruit' | 'Dairy' | 'Snack';
}

export const FOODS: FoodItem[] = [
  // Portable proteins
  { id: 'hard_egg', name: 'Hard Boiled Egg', calories: 78, protein: 6, carbs: 1, fat: 5, serving: '1 large', portable: true, category: 'Protein' },
  { id: 'canned_tuna', name: 'Canned Tuna', calories: 100, protein: 22, carbs: 0, fat: 1, serving: '3 oz', portable: true, category: 'Protein' },
  { id: 'beef_jerky', name: 'Beef Jerky', calories: 116, protein: 10, carbs: 7, fat: 5, serving: '1 oz', portable: true, category: 'Protein' },
  { id: 'string_cheese', name: 'String Cheese', calories: 80, protein: 6, carbs: 1, fat: 6, serving: '1 stick', portable: true, category: 'Dairy' },
  { id: 'greek_yogurt', name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0, serving: '6 oz', portable: true, category: 'Dairy' },
  { id: 'protein_bar', name: 'Protein Bar', calories: 200, protein: 20, carbs: 20, fat: 6, serving: '1 bar', portable: true, category: 'Snack' },
  { id: 'rotisserie', name: 'Rotisserie Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 4, serving: '3 oz', portable: true, category: 'Protein' },

  // Portable carbs
  { id: 'banana', name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, serving: '1 medium', portable: true, category: 'Fruit' },
  { id: 'apple', name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0, serving: '1 medium', portable: true, category: 'Fruit' },
  { id: 'almonds', name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '1 oz', portable: true, category: 'Snack' },
  { id: 'peanut_butter', name: 'Peanut Butter Pack', calories: 188, protein: 8, carbs: 6, fat: 16, serving: '2 tbsp', portable: true, category: 'Fat' },
  { id: 'oatmeal_cup', name: 'Instant Oatmeal Cup', calories: 150, protein: 5, carbs: 27, fat: 3, serving: '1 cup', portable: true, category: 'Carb' },
  { id: 'rice_cakes', name: 'Rice Cakes', calories: 35, protein: 1, carbs: 7, fat: 0, serving: '1 cake', portable: true, category: 'Carb' },
  { id: 'trail_mix', name: 'Trail Mix', calories: 173, protein: 5, carbs: 17, fat: 11, serving: '1 oz', portable: true, category: 'Snack' },
  { id: 'whole_milk', name: 'Whole Milk', calories: 150, protein: 8, carbs: 12, fat: 8, serving: '8 oz', portable: false, category: 'Dairy' },
];
