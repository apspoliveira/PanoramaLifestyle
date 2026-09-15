import { ChecklistScreen } from '@/components/ChecklistScreen';

export default function TemperanceScreen() {
  return (
    <ChecklistScreen
      section="temperance"
      dark
      hintKeys={['hint_temp_1', 'hint_temp_2', 'hint_temp_3', 'hint_temp_4', 'hint_temp_5']}
      hintIntervalMs={6000}
      hintVariant="dark"
      sectionTitleKey="temp_section"
      items={[
        { prefix: 'temp_subst', labelKey: 'temp_avoid_alcohol', videos: ['6Y_A9Rnd9Is'] },
        { prefix: 'temp_caff', labelKey: 'temp_caffeine', videos: ['fG6i9yE_160'] },
        { prefix: 'temp_bal', labelKey: 'temp_balance', videos: ['iO68V_vH6Gk'] },
        { prefix: 'temp_self', labelKey: 'temp_self_control', videos: ['y7S2S4N88lE'] },
      ]}
    />
  );
}
