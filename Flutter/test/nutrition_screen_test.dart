import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:panorama/screens/pillars/nutrition_screen.dart';
import 'package:panorama/screens/recipe_detail_screen.dart';
import 'package:panorama/services/recipe_service.dart';
import 'package:panorama/theme/app_theme.dart';

void main() {
  testWidgets(
    "shows today's breakfast/lunch/dinner and opens a recipe",
    (tester) async {
      final recipes = await tester.runAsync(RecipeService.load);

      await tester.pumpWidget(
        Provider<RecipeService>.value(
          value: recipes!,
          child: MaterialApp(theme: buildAppTheme(), home: const NutritionScreen()),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Pequeno-almoço'), findsOneWidget);
      expect(find.text('Almoço'), findsOneWidget);
      expect(find.text('Jantar'), findsOneWidget);

      final plan = recipes.planFor(DateTime.now())!;
      final breakfastTitle = recipes.recipeById(plan.breakfastId)!.title;
      expect(find.text(breakfastTitle), findsOneWidget);

      await tester.tap(find.text(breakfastTitle));
      await tester.pumpAndSettle();

      expect(find.byType(RecipeDetailScreen), findsOneWidget);
      expect(find.text(breakfastTitle), findsOneWidget);
    },
  );
}
