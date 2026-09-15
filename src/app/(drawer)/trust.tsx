import { BibleVerseCard } from '@/components/BibleVerseCard';
import { ChecklistScreen } from '@/components/ChecklistScreen';
import { Colors } from '@/theme';

export default function TrustScreen() {
  return (
    <ChecklistScreen
      section="trust"
      hintKeys={['hint_trust_1', 'hint_trust_2', 'hint_trust_3', 'hint_trust_4', 'hint_trust_5']}
      hintIntervalMs={6000}
      hintVariant="translucent"
      sectionTitleKey="trust_section"
      labelSize={16}
      header={<BibleVerseCard color={Colors.trust} />}
      items={[
        { prefix: 'trust_prayer', labelKey: 'trust_prayer', videos: ['3qDneS3hK3o'] },
        { prefix: 'trust_medit', labelKey: 'trust_meditation', videos: ['MH5lnMCGVFk'] },
        { prefix: 'trust_gratitude', labelKey: 'trust_gratitude', videos: ['7vYm2y8p1fA'] },
        { prefix: 'trust_rest', labelKey: 'trust_rest', videos: ['a6Ue690_q4U'] },
      ]}
    />
  );
}
