import { ChecklistScreen } from '@/components/ChecklistScreen';

export default function WorkoutScreen() {
  return (
    <ChecklistScreen
      section="workout"
      dark
      hintKeys={['workout_hint_1', 'workout_hint_2', 'workout_hint_3', 'workout_hint_4', 'workout_hint_5', 'workout_hint_6']}
      hintIntervalMs={5500}
      hintVariant="dark"
      sectionTitleKey="workout_section"
      items={[
        { prefix: 'workout_strength', labelKey: 'workout_strength_training', videos: ['3vS6-O7Yy8Y', 'UItWltVZZmE'] },
        { prefix: 'workout_cardio', labelKey: 'workout_cardio_exercise', videos: ['ml6cT4AZdqI', 'gC_L9qAHVJ8'] },
        { prefix: 'workout_flexibility', labelKey: 'workout_flexibility_stretching', videos: ['Y6Z7H8p2Yt0', 'L_xrDAtykMI'] },
      ]}
    />
  );
}
