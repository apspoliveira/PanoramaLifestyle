import { ChecklistScreen } from '@/components/ChecklistScreen';

export default function RestScreen() {
  return (
    <ChecklistScreen
      section="rest"
      hintKeys={['hint_rest_1', 'hint_rest_2', 'hint_rest_3', 'hint_rest_4', 'hint_rest_5']}
      hintIntervalMs={6000}
      hintVariant="light"
      sectionTitleKey="rest_section"
      items={[
        { prefix: 'rest_hours', labelKey: 'rest_hours', videos: ['MvM93SOn96Q'] },
        { prefix: 'rest_screens', labelKey: 'rest_no_screens', videos: ['E08Oq8_iXas'] },
        { prefix: 'rest_sched', labelKey: 'rest_regular_schedule', videos: ['G0zJ_q_S-90'] },
        { prefix: 'rest_env', labelKey: 'rest_environment', videos: ['9m5D-7F9v-g'] },
      ]}
    />
  );
}
