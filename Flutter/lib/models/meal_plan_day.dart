/// One calendar day's breakfast/lunch/dinner recipe ids, from
/// assets/data/meal_plan.json. Mirrors the `mealSuggestionsPtXxx`
/// `String[][]` arrays in `Fragment_Nutrition.java`: row = day of month,
/// columns = [breakfast, lunch, dinner].
class MealPlanDay {
  const MealPlanDay({
    required this.day,
    required this.breakfastId,
    required this.lunchId,
    required this.dinnerId,
  });

  factory MealPlanDay.fromJson(Map<String, dynamic> json) {
    return MealPlanDay(
      day: json['day'] as int,
      breakfastId: json['breakfast'] as String,
      lunchId: json['lunch'] as String,
      dinnerId: json['dinner'] as String,
    );
  }

  final int day;
  final String breakfastId;
  final String lunchId;
  final String dinnerId;
}
