import { Stack, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

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
  const title = recipe?.title ?? t('nutrition_title');

  return (
    <>
      <Stack.Screen
        options={{
          title,
          // Default native-stack header truncates the title to one line; recipe
          // titles run long, so wrap to two lines instead of cutting them off.
          headerTitle: () => (
            <Text numberOfLines={2} style={{ color: Colors.white, fontSize: 17, fontWeight: '600', flexShrink: 1 }}>
              {title}
            </Text>
          ),
          headerStyle: { backgroundColor: Colors.nutrition },
          headerTintColor: Colors.white,
        }}
      />
      <RecipeHtmlView html={buildRecipeHtml(content, Colors.nutrition)} />
    </>
  );
}
