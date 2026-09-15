import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Fragment } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HintCarousel } from '@/components/HintCarousel';
import { MealCard } from '@/components/MealCard';
import { Card, ScreenScroll, SectionTitle } from '@/components/ui';
import { planFor, recipeById } from '@/data/recipes';
import { useDateParam } from '@/hooks/useDateParam';
import { useI18n } from '@/i18n';
import type { StringKey } from '@/i18n/strings';
import { Colors } from '@/theme';
import { parseDate } from '@/utils/dates';

const COLOR = Colors.nutrition;

const HINTS: StringKey[] = ['hint_nutr_1', 'hint_nutr_2', 'hint_nutr_3', 'hint_nutr_4', 'hint_nutr_5', 'hint_nutr_6'];

const MEALS = [
  { slot: 'breakfast', labelKey: 'nutrition_breakfast', typeKey: 'nutrition_breakfast_title', descKey: 'nutrition_breakfast_desc' },
  { slot: 'lunch', labelKey: 'nutrition_lunch', typeKey: 'nutrition_lunch_title', descKey: 'nutrition_lunch_desc' },
  { slot: 'dinner', labelKey: 'nutrition_dinner', typeKey: 'nutrition_dinner_title', descKey: 'nutrition_dinner_desc' },
] as const;

export default function NutritionScreen() {
  const { t } = useI18n();
  const date = useDateParam();
  const plan = planFor(parseDate(date));

  const openRecipe = (id: string | undefined) => {
    if (!id) return;
    router.push({ pathname: '/recipe/[id]', params: { id } });
  };

  return (
    <View style={styles.root}>
      <ScreenScroll background={COLOR}>
        <HintCarousel hintKeys={HINTS} intervalMs={5000} variant="light" color={COLOR} />

        <SectionTitle>{t('nutrition_suggested_menu')}</SectionTitle>
        <Card style={styles.summary}>
          {MEALS.map((meal, index) => {
            const id = plan?.[meal.slot];
            return (
              <Fragment key={meal.slot}>
                {index > 0 && <View style={styles.divider} />}
                <Pressable role="button" onPress={() => openRecipe(id)} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t(meal.labelKey)}</Text>
                  <Text style={styles.summaryValue}>{recipeById(id)?.title ?? t('loading')}</Text>
                </Pressable>
              </Fragment>
            );
          })}
        </Card>

        {MEALS.map((meal) => {
          const id = plan?.[meal.slot];
          return (
            <View key={`${meal.slot}-${id}`} style={styles.mealCard}>
              <MealCard
                recipeId={id}
                typeLabel={t(meal.typeKey)}
                description={t(meal.descKey)}
                color={COLOR}
                onOpenRecipe={() => openRecipe(id)}
              />
            </View>
          );
        })}
        <View style={styles.fabSpacer} />
      </ScreenScroll>

      <Pressable
        role="button"
        aria-label={t('calendar')}
        onPress={() => router.push({ pathname: '/calendar', params: { date, section: 'nutrition' } })}
        style={({ pressed }) => [styles.fab, { opacity: pressed ? 0.85 : 1 }]}>
        <MaterialIcons name="calendar-month" size={26} color={COLOR} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  summary: { marginBottom: 16 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  summaryLabel: {
    width: 100,
    color: COLOR,
    opacity: 0.6,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  summaryValue: { flex: 1, color: '#000000', fontWeight: '700', fontSize: 14 },
  divider: { height: 1, backgroundColor: 'rgba(0, 0, 0, 0.06)' },
  mealCard: { marginTop: 16 },
  fabSpacer: { height: 56 },
  fab: {
    position: 'absolute',
    end: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.25)',
  },
});
