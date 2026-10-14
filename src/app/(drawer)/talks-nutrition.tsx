import { ChecklistScreen } from '@/components/ChecklistScreen';

/** Nutrition pillar opened from the talks hub; same checklist layout as Exercise, Air, Rest and Trust. */
export default function TalksNutritionScreen() {
  return (
    <ChecklistScreen
      section="nutrition"
      hintKeys={['hint_nutr_1', 'hint_nutr_2', 'hint_nutr_3', 'hint_nutr_4', 'hint_nutr_5', 'hint_nutr_6']}
      hintIntervalMs={5500}
      hintVariant="light"
      sectionTitleKey="nutrition_section"
      items={[
        // TODO: add the video IDs for each item (empty until they are provided).
        { prefix: 'nutrition_fruit_veg', labelKey: 'nutrition_check_fruit_veg', videos: ['KeEs15ehpKE', 'amdu2xFttKg','UQ5cwy_yFvg','L8SSL8GH6pU','xdoX__q-9N4'] },
      { prefix: 'nutrition_whole_grains', labelKey: 'nutrition_check_whole_grains', videos: ['kC-PlJOqWWA','v9Y_Q0GHrGU','W7wdGICViHY','2cAVOtpeD7'] },
        { prefix: 'nutrition_plant_protein', labelKey: 'nutrition_check_plant_protein', videos: ['YlgnUm3V5BA','k7CJGA5NWCU','iDMVTIlMxA8', '-qFA2-0rLdE'] },
        { prefix: 'nutrition_limit_processed', labelKey: 'nutrition_check_limit_processed', videos: ['VKgq23teO6I','NC0IlmXdNn0','T6WbCzzlR30','SmCpunyLINA'] },
        { prefix: 'nutrition_breakfast', labelKey: 'nutrition_check_breakfast', videos: ['Ts9_qlJO3aA', 'uFsMb3oZvjA','RQ91JC-aHks','hXXz2w7Zah4'] },
      ]}
    />
  );
}
