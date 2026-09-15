import 'package:flutter/material.dart';

import '../models/recipe.dart';
import '../theme/app_theme.dart';
import '../widgets/recipe_html_view.dart';

/// Full-recipe view, replacing `Activity_FullContent`'s WebView of the
/// stored HTML with a native render via [RecipeHtmlView].
class RecipeDetailScreen extends StatelessWidget {
  const RecipeDetailScreen({super.key, required this.recipe});

  final Recipe recipe;

  @override
  Widget build(BuildContext context) {
    final accent = Pillar.nutrition.primary;
    final content = recipe.content;

    return Scaffold(
      appBar: AppBar(
        title: Text(recipe.title),
        backgroundColor: accent.withValues(alpha: 0.15),
      ),
      body: content == null
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Text(
                  'Receita indisponível de momento.',
                  style: Theme.of(context).textTheme.bodyLarge,
                  textAlign: TextAlign.center,
                ),
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: RecipeHtmlView(html: content, accentColor: accent),
            ),
    );
  }
}
