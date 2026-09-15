import 'package:flutter_test/flutter_test.dart';

import 'package:panorama/services/recipe_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('loads recipes and meal plan from assets', () async {
    final service = await RecipeService.load();

    final today = DateTime(2026, 1, 1);
    final plan = service.planFor(today);
    expect(plan, isNotNull);

    final recipe = service.recipeById(plan!.breakfastId);
    expect(recipe, isNotNull);
    expect(recipe!.title, isNotEmpty);
  });
}
