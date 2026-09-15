import { Stack, useLocalSearchParams } from 'expo-router';

import { RecipeHtmlView } from '@/components/RecipeHtmlView';
import { recipeById } from '@/data/recipes';
import { useI18n } from '@/i18n';
import { Colors } from '@/theme';
import { buildRecipeHtml } from '@/utils/recipeHtml';

/** Activity_FullContent: recipe HTML in a styled page under a coloured toolbar. */
export default function RecipeScreen() {
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = recipeById(id);
  const content = recipe?.content ?? `<h1>${t('nutrition_recipe_soon_title')}</h1>`;

  return (
    <>
      <Stack.Screen
        options={{
          title: recipe?.title ?? t('nutrition_title'),
          headerStyle: { backgroundColor: Colors.nutrition },
          headerTintColor: Colors.white,
        }}
      />
      <RecipeHtmlView html={buildRecipeHtml(content, Colors.nutrition)} />
    </>
  );
}
