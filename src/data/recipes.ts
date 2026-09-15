import mealPlanJson from '../../assets/data/meal_plan.json';
import recipesJson from '../../assets/data/recipes.json';

export interface Recipe {
  id: string;
  title: string;
  content: string;
}

export interface MealPlanDay {
  day: number;
  breakfast: string;
  lunch: string;
  dinner: string;
}

const recipes = recipesJson as Recipe[];
const mealPlan = mealPlanJson as Record<string, MealPlanDay[]>;
const byId = new Map(recipes.map((r) => [r.id, r]));

export const recipeById = (id: string | undefined) => (id ? byId.get(id) : undefined);

/** Same rule as Fragment_Nutrition: month's plan, entry (day - 1) % length. */
export function planFor(date: Date): MealPlanDay | undefined {
  const days = mealPlan[String(date.getMonth() + 1)];
  if (!days?.length) return undefined;
  return days[(date.getDate() - 1) % days.length];
}
