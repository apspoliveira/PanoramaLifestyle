import { ChecklistScreen } from '@/components/ChecklistScreen';

export default function AirScreen() {
  return (
    <ChecklistScreen
      section="air"
      hintKeys={['hint_air_1', 'hint_air_2', 'hint_air_3', 'hint_air_4', 'hint_air_5']}
      hintIntervalMs={5500}
      hintVariant="light"
      sectionTitleKey="air_section"
      items={[
        { prefix: 'air_fresh', labelKey: 'air_spend_time', videos: ['OM_X52rdeds', 'oxO2qotv3wM'] },
        { prefix: 'air_vent', labelKey: 'air_keep_windows', videos: ['F2hIAOfw5h8', 'owwfYlpibU0'] },
        // The Android list had a truncated id ("MH5lnMCGVF"); Fragment_Trust uses the full one.
        { prefix: 'air_deep', labelKey: 'air_deep_breathing', videos: ['QVeEhcKIyd8', 'MH5lnMCGVFk'] },
        { prefix: 'air_clean', labelKey: 'air_avoid_polluted', videos: ['rlFRSJYCax8', 'MsZp5thi3sY'] },
      ]}
    />
  );
}
