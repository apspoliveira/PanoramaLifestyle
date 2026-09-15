import 'package:flutter/material.dart';

/// Which NEWSTART pillar a screen belongs to. Drives accent color and
/// toolbar/drawer highlight, mirroring the per-fragmentID color switch in
/// the original Activity_Main/Activity_Calendar/Activity_FullContent.
enum Pillar {
  nutrition,
  workout,
  water,
  sun,
  temperance,
  air,
  rest,
  trust,
  settings,
}

extension PillarColor on Pillar {
  Color get primary {
    switch (this) {
      case Pillar.nutrition:
        return const Color(0xFF9C27B0);
      case Pillar.workout:
        return const Color(0xFF1565C0);
      case Pillar.water:
        return const Color(0xFF03A9F4);
      case Pillar.sun:
        return const Color(0xFF8BC34A);
      case Pillar.temperance:
        return const Color(0xFFFFB300);
      case Pillar.air:
        return const Color(0xFFF4511E);
      case Pillar.rest:
        return const Color(0xFFE53935);
      case Pillar.trust:
        return const Color(0xFFD81B60);
      case Pillar.settings:
        return const Color(0xFF607D8B);
    }
  }
}

class AppColors {
  static const darkNavyBg = Color(0xFF0F1424);
  static const hintCardBg = Color(0xFF1E273E);
  static const textHigh = Color(0xFFE0E6ED);
  static const textMiddle = Color(0xFF8A96A8);
  static const textLow = Color(0xFF5C6B82);
}

ThemeData buildAppTheme() {
  const seed = Color(0xFF9C27B0);
  final colorScheme = ColorScheme.fromSeed(
    seedColor: seed,
    brightness: Brightness.dark,
    surface: AppColors.darkNavyBg,
  );

  return ThemeData(
    useMaterial3: true,
    colorScheme: colorScheme,
    scaffoldBackgroundColor: AppColors.darkNavyBg,
    cardColor: AppColors.hintCardBg,
    textTheme: const TextTheme(
      bodyLarge: TextStyle(color: AppColors.textHigh),
      bodyMedium: TextStyle(color: AppColors.textHigh),
      bodySmall: TextStyle(color: AppColors.textMiddle),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.darkNavyBg,
      foregroundColor: AppColors.textHigh,
      elevation: 0,
    ),
    drawerTheme: const DrawerThemeData(backgroundColor: AppColors.darkNavyBg),
    checkboxTheme: CheckboxThemeData(
      fillColor: WidgetStateProperty.resolveWith(
        (states) => states.contains(WidgetState.selected)
            ? seed
            : AppColors.textLow,
      ),
    ),
  );
}
