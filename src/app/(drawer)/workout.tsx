import { ChecklistScreen } from '@/components/ChecklistScreen';

export default function WorkoutScreen() {
  return (
    <ChecklistScreen
      section="workout"
      hintKeys={['workout_hint_1', 'workout_hint_2', 'workout_hint_3', 'workout_hint_4', 'workout_hint_5', 'workout_hint_6']}
      hintIntervalMs={5500}
      hintVariant="light"
      sectionTitleKey="workout_section"
      items={[
        { prefix: 'workout_strength', labelKey: 'workout_strength_training', videos: ['MwMmJcZLgF4', 'q0f5w152UQE','2odjF6gH_WY','cIe6nbS5-Kk','YXJdILvutSA','azLIkcfIeZM','61AMFNBiUaQ'] },
        { prefix: 'workout_cardio', labelKey: 'workout_cardio_exercise', videos: ['A0tivMcE6fY', 'pZ-OC7fWzLA','Yt0xycjqr7s','8HmoTvoEy3M','AI-wztWEW1k','7Dh8kR_iLV8','cU3k8yVcTig'] },
        { prefix: 'workout_flexibility', labelKey: 'workout_flexibility_stretching', videos: ['Y90XpR3zyz4', 'shvlqYI7GqA','IvVV2ZdFIus','BD-n1gZXh2M','GbIFV3FhpFE','rifzI7BKcm0'] },
      ]}
    />
  );
}
