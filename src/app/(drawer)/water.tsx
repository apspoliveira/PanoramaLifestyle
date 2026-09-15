import { HintCarousel } from '@/components/HintCarousel';
import { CounterCard, VideoCard } from '@/components/pillar';
import { CardTitle, Checkbox, ScreenScroll, SectionTitle } from '@/components/ui';
import { useDateParam, useRandomPick } from '@/hooks/useDateParam';
import { useI18n } from '@/i18n';
import { dailyKey, useStoredBool, useStoredNumber } from '@/services/storage';
import { Colors } from '@/theme';
import { tapFeedback } from '@/utils/haptics';

const COLOR = Colors.water;

export default function WaterScreen() {
  const { t } = useI18n();
  const date = useDateParam();
  const [glasses, setGlasses] = useStoredNumber(dailyKey('water_glasses', date));
  const [hydro, setHydro] = useStoredBool(dailyKey('water_hydro', date));
  const importanceVideo = useRandomPick(['AVSNiAndIGU', 'rlFRSJYCax8']);
  const hydroVideo = useRandomPick(['HfBWUzP2tYU', 'F2hIAOfw5h8']);

  const change = (delta: number) => {
    const next = glasses + delta;
    if (next < 0) return;
    tapFeedback();
    setGlasses(next);
  };

  return (
    <ScreenScroll background={COLOR}>
      <HintCarousel
        hintKeys={['hint_water_1', 'hint_water_2', 'hint_water_3', 'hint_water_4', 'hint_water_5']}
        intervalMs={5500}
        variant="light"
        color={COLOR}
      />
      <SectionTitle>{t('water_daily_label')}</SectionTitle>
      <CounterCard
        color={COLOR}
        value={t(glasses === 1 ? 'water_glass_format' : 'water_glasses_format', glasses)}
        goal={t('water_goal')}
        onMinus={() => change(-1)}
        onPlus={() => change(1)}
      />
      <VideoCard
        videoId={importanceVideo}
        header={<CardTitle color={COLOR}>{t('water_importance_label')}</CardTitle>}
      />
      <VideoCard
        videoId={hydroVideo}
        header={
          <Checkbox
            checked={hydro}
            onToggle={setHydro}
            color={COLOR}
            label={t('water_hydro')}
            labelStyle={{ color: COLOR }}
          />
        }
      />
    </ScreenScroll>
  );
}
