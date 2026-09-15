/// One recipe from the ported `DatabaseHelper.java` / `MealConstants.java`
/// library (assets/data/recipes.json). [content] is a small, fixed subset
/// of HTML (h3/h4/p/ul/ol/li/b/strong/i/br) rendered by [RecipeHtmlView].
class Recipe {
  const Recipe({
    required this.id,
    required this.title,
    required this.content,
    required this.slots,
    required this.months,
  });

  factory Recipe.fromJson(Map<String, dynamic> json) {
    return Recipe(
      id: json['id'] as String,
      title: json['title'] as String,
      content: json['content'] as String?,
      slots: (json['slots'] as List).cast<String>(),
      months: (json['months'] as List).cast<int>(),
    );
  }

  final String id;
  final String title;
  final String? content;
  final List<String> slots;
  final List<int> months;
}
