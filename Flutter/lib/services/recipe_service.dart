import 'dart:convert';

import 'package:flutter/services.dart' show rootBundle;

import '../models/meal_plan_day.dart';
import '../models/recipe.dart';

/// Holds the recipe library and the day-of-month meal plan ported from
/// `DatabaseHelper.java` / `MealConstants.java` / `Fragment_Nutrition.java`
/// (assets/data/recipes.json, assets/data/meal_plan.json). Loaded once in
/// `main()` and handed to the widget tree via `Provider.value`, the same way
/// [PrefsService] is.
class RecipeService {
  RecipeService._(this._recipesById, this._mealPlanByMonth);

  final Map<String, Recipe> _recipesById;
  final Map<int, List<MealPlanDay>> _mealPlanByMonth;

  static Future<RecipeService> load() async {
    final recipesJson = jsonDecode(
      await rootBundle.loadString('assets/data/recipes.json'),
    ) as List<dynamic>;
    final recipesById = <String, Recipe>{
      for (final entry in recipesJson)
        (entry as Map<String, dynamic>)['id'] as String: Recipe.fromJson(
          entry,
        ),
    };

    final mealPlanJson = jsonDecode(
      await rootBundle.loadString('assets/data/meal_plan.json'),
    ) as Map<String, dynamic>;
    final mealPlanByMonth = <int, List<MealPlanDay>>{
      for (final entry in mealPlanJson.entries)
        int.parse(entry.key): (entry.value as List<dynamic>)
            .map((e) => MealPlanDay.fromJson(e as Map<String, dynamic>))
            .toList(),
    };

    return RecipeService._(recipesById, mealPlanByMonth);
  }

  Recipe? recipeById(String? id) => id == null ? null : _recipesById[id];

  /// The plan row for [date]'s day-of-month, mirroring
  /// `updateMealSuggestions`'s `(dayOfMonth - 1) % suggestions.length`
  /// lookup — the modulo is defensive; in practice each month's row count
  /// matches its real day count exactly.
  MealPlanDay? planFor(DateTime date) {
    final days = _mealPlanByMonth[date.month];
    if (days == null || days.isEmpty) return null;
    return days[(date.day - 1) % days.length];
  }
}
