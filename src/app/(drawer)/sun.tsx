import { HintCarousel } from '@/components/HintCarousel';
import { CounterCard, VideoCard } from '@/components/pillar';
import { CardTitle, ScreenScroll, SectionTitle } from '@/components/ui';
import { useDateParam } from '@/hooks/useDateParam';
import { useI18n } from '@/i18n';
import { dailyKey, useStoredNumber } from '@/services/storage';
import { Colors } from '@/theme';
import { tapFeedback } from '@/utils/haptics';

const COLOR = Colors.sun;
const GOAL_MINUTES = 20;
const STEP = 5;

export default function SunScreen() {
  const { t } = useI18n();
  const date = useDateParam();
  const [minutes, setMinutes] = useStoredNumber(dailyKey('sun_mins', date));

  return (
    <ScreenScroll background={COLOR}>
      <HintCarousel
        hintKeys={['hint_sun_1', 'hint_sun_2', 'hint_sun_3', 'hint_sun_4', 'hint_sun_5']}
        intervalMs={5000}
        variant="translucent"
        color={COLOR}
      />
      <SectionTitle>{t('sun_exposure_label')}</SectionTitle>
      <CounterCard
        color={COLOR}
        value={t('sun_minutes_format', minutes)}
        goal={t('sun_goal_format', GOAL_MINUTES)}
        onMinus={() => {
          if (minutes < STEP) return;
          tapFeedback();
          setMinutes(minutes - STEP);
        }}
        onPlus={() => {
          tapFeedback();
          setMinutes(minutes + STEP);
        }}
      />
      <VideoCard videoId="7SRE9963F9U" header={<CardTitle color={COLOR}>{t('sun_benefits_label')}</CardTitle>} />
      <VideoCard videoId="6_z2iK2W-4k" header={<CardTitle color={COLOR}>{t('sun_vitamin_d_label')}</CardTitle>} />
    </ScreenScroll>
  );
}
