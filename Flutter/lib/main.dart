import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'screens/initial_setup_screen.dart';
import 'screens/main_shell.dart';
import 'services/prefs_service.dart';
import 'services/recipe_service.dart';
import 'theme/app_theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final sharedPreferences = await SharedPreferences.getInstance();
  final prefsService = PrefsService(sharedPreferences);
  final recipeService = await RecipeService.load();

  // The original app was portrait-locked on every screen.
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(
    PanoramaApp(prefsService: prefsService, recipeService: recipeService),
  );
}

class PanoramaApp extends StatelessWidget {
  const PanoramaApp({
    super.key,
    required this.prefsService,
    required this.recipeService,
  });

  final PrefsService prefsService;
  final RecipeService recipeService;

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<PrefsService>.value(value: prefsService),
        Provider<RecipeService>.value(value: recipeService),
      ],
      child: MaterialApp(
        title: 'Panorama',
        debugShowCheckedModeBanner: false,
        theme: buildAppTheme(),
        home: prefsService.setupCompleted
            ? const MainShell()
            : const InitialSetupScreen(),
      ),
    );
  }
}
