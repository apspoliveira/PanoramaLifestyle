import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/recipe.dart';
import '../../services/recipe_service.dart';
import '../../theme/app_theme.dart';
import '../recipe_detail_screen.dart';

const _monthNamesPt = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

String _formatDate(DateTime date) =>
    '${date.day} de ${_monthNamesPt[date.month - 1]}';

class _MealSlot {
  const _MealSlot(this.label, this.icon, this.recipeId);

  final String label;
  final IconData icon;
  final String recipeId;
}

/// Ports Fragment_Nutrition: a deterministic day-of-month meal plan (see
/// [RecipeService.planFor]) shown as three cards — breakfast, lunch,
/// dinner — each opening its full recipe via [RecipeDetailScreen].
class NutritionScreen extends StatelessWidget {
  const NutritionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final recipes = context.watch<RecipeService>();
    final today = DateTime.now();
    final plan = recipes.planFor(today);
    final accent = Pillar.nutrition.primary;

    if (plan == null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Text(
            'Sem plano de refeições disponível para hoje.',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyLarge,
          ),
        ),
      );
    }

    final slots = [
      _MealSlot('Pequeno-almoço', Icons.free_breakfast, plan.breakfastId),
      _MealSlot('Almoço', Icons.lunch_dining, plan.lunchId),
      _MealSlot('Jantar', Icons.dinner_dining, plan.dinnerId),
    ];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(_formatDate(today), style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 16),
        for (final slot in slots)
          _MealCard(
            slot: slot,
            recipe: recipes.recipeById(slot.recipeId),
            accent: accent,
          ),
      ],
    );
  }
}

class _MealCard extends StatelessWidget {
  const _MealCard({
    required this.slot,
    required this.recipe,
    required this.accent,
  });

  final _MealSlot slot;
  final Recipe? recipe;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    final hasRecipe = recipe?.content != null;
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Card(
        clipBehavior: Clip.antiAlias,
        child: ListTile(
          contentPadding: const EdgeInsets.all(16),
          leading: CircleAvatar(
            backgroundColor: accent.withValues(alpha: 0.2),
            child: Icon(slot.icon, color: accent),
          ),
          title: Text(slot.label, style: Theme.of(context).textTheme.bodySmall),
          subtitle: Text(
            recipe?.title ?? 'Receita indisponível',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          trailing: hasRecipe ? const Icon(Icons.chevron_right) : null,
          onTap: hasRecipe
              ? () => Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => RecipeDetailScreen(recipe: recipe!),
                  ),
                )
              : null,
        ),
      ),
    );
  }
}
