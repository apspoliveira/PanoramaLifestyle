import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Wraps [SharedPreferences] with the key scheme used by the original
/// Android app: flat, per-calendar-day boolean/int flags for each pillar
/// ("<pillar>_<goal>_<dd-MM-yyyy>", from the old `NEWSTART_Prefs` file) plus
/// a small set of profile/settings keys (from the old `user_prefs` file and
/// DatabaseHelper's language row). A single [SharedPreferences] instance
/// backs both — Android's separate "files" were just separate key
/// namespaces, which a prefix already gives us here.
class PrefsService {
  PrefsService(this._prefs);

  final SharedPreferences _prefs;

  static final DateFormat _dayFormat = DateFormat('dd-MM-yyyy');

  /// Same day-key format the Java code used, so a future data-import from
  /// the Android app's backup would line up key-for-key.
  static String dayKey(DateTime date) => _dayFormat.format(date);

  // ---- Daily pillar goals ----------------------------------------------

  String _goalKey(String pillar, String goal, DateTime date) =>
      '${pillar}_${goal}_${dayKey(date)}';

  bool getDailyBool(String pillar, String goal, DateTime date) =>
      _prefs.getBool(_goalKey(pillar, goal, date)) ?? false;

  Future<void> setDailyBool(
    String pillar,
    String goal,
    DateTime date,
    bool value,
  ) => _prefs.setBool(_goalKey(pillar, goal, date), value);

  int getDailyInt(String pillar, String goal, DateTime date) =>
      _prefs.getInt(_goalKey(pillar, goal, date)) ?? 0;

  Future<void> setDailyInt(
    String pillar,
    String goal,
    DateTime date,
    int value,
  ) => _prefs.setInt(_goalKey(pillar, goal, date), value);

  // ---- Profile (was `user_prefs`) ---------------------------------------

  bool get setupCompleted => _prefs.getBool('setup_completed') ?? false;

  String get userName => _prefs.getString('user_name') ?? 'User';

  int get userAge => _prefs.getInt('user_age') ?? 0;

  double get userWeight => _prefs.getDouble('user_weight') ?? 0;

  double get userHeight => _prefs.getDouble('user_height') ?? 0;

  Future<void> saveProfile({
    required String name,
    required int age,
    required double weight,
    required double height,
  }) async {
    await _prefs.setString('user_name', name);
    await _prefs.setInt('user_age', age);
    await _prefs.setDouble('user_weight', weight);
    await _prefs.setDouble('user_height', height);
    await _prefs.setBool('setup_completed', true);
  }

  // ---- Language (was DatabaseHelper.getSettingsLanguage) ----------------

  /// 'pt', 'en', or 'system'.
  String get language => _prefs.getString('app_language') ?? 'pt';

  Future<void> setLanguage(String language) =>
      _prefs.setString('app_language', language);

  // ---- Notification toggles (Fragment_Settings) --------------------------

  static const notificationPillars = [
    'nutrition',
    'workout',
    'water',
    'sun',
    'temperance',
    'air',
    'rest',
    'trust',
  ];

  bool getNotificationEnabled(String pillar) =>
      _prefs.getBool('notif_$pillar') ?? false;

  Future<void> setNotificationEnabled(String pillar, bool value) =>
      _prefs.setBool('notif_$pillar', value);
}
