import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:panorama/main.dart';
import 'package:panorama/services/prefs_service.dart';
import 'package:panorama/services/recipe_service.dart';

void main() {
  testWidgets('shows onboarding on first run', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues({});
    final prefs = PrefsService(await SharedPreferences.getInstance());
    // RecipeService.load() does real asset I/O, which never resolves under
    // testWidgets' fake-async zone unless run through runAsync.
    final recipes = await tester.runAsync(RecipeService.load);

    await tester.pumpWidget(
      PanoramaApp(prefsService: prefs, recipeService: recipes!),
    );
    await tester.pumpAndSettle();

    expect(find.text('Bem-vindo!'), findsOneWidget);
  });
}
