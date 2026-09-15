import '../theme/app_theme.dart';

/// One daily checkbox goal within a pillar screen, e.g. "spend time
/// outdoors" under Air. [videoIds] mirrors the original's per-goal video
/// pool, from which one is picked at random each time the screen builds
/// (same behaviour as `Random().nextInt(...)` in the Java fragments).
class PillarGoal {
  const PillarGoal({
    required this.storageKey,
    required this.label,
    required this.videoIds,
  });

  /// Short key matching the original SharedPreferences suffix, e.g.
  /// "fresh" for `air_fresh_<date>`.
  final String storageKey;
  final String label;
  final List<String> videoIds;
}

/// Static configuration for one checklist-style pillar screen (Air, Rest,
/// Temperance, Workout, Trust). Water and Sun use a counter instead and
/// have their own screens.
class PillarChecklistConfig {
  const PillarChecklistConfig({
    required this.pillar,
    required this.storagePillar,
    required this.title,
    required this.hints,
    required this.goals,
    this.hintInterval = const Duration(seconds: 6),
  });

  final Pillar pillar;

  /// Short key matching the original SharedPreferences prefix, e.g. "temp"
  /// for `temp_subst_<date>` (not the same as the pillar's full name).
  final String storagePillar;
  final String title;
  final List<String> hints;
  final List<PillarGoal> goals;
  final Duration hintInterval;
}
