import { useState, type ReactNode } from 'react';

import { useDateParam } from '@/hooks/useDateParam';
import { useI18n } from '@/i18n';
import type { StringKey } from '@/i18n/strings';
import { dailyKey, useStoredBool } from '@/services/storage';
import { Colors, sectionById, type SectionId } from '@/theme';
import { HintCarousel, type HintVariant } from './HintCarousel';
import { VideoCard } from './pillar';
import { Card, Checkbox, ScreenScroll, SectionTitle } from './ui';

export interface ChecklistItem {
  /** Preference prefix; stored as `<prefix>_<dd-MM-yyyy>`. */
  prefix: string;
  labelKey: StringKey;
  /** One is chosen at random each time the screen opens. */
  videos: string[];
}

interface Props {
  section: SectionId;
  hintKeys: StringKey[];
  hintIntervalMs: number;
  hintVariant: HintVariant;
  sectionTitleKey: StringKey;
  items: ChecklistItem[];
  /** Workout/Temperance use the dark navy "pro max" look. */
  dark?: boolean;
  labelSize?: number;
  header?: ReactNode;
}

/** Shared layout of the Workout, Temperance, Air, Rest and Trust fragments. */
export function ChecklistScreen({
  section,
  hintKeys,
  hintIntervalMs,
  hintVariant,
  sectionTitleKey,
  items,
  dark = false,
  labelSize = 14,
  header,
}: Props) {
  const { t } = useI18n();
  const date = useDateParam();
  const color = sectionById(section).color;
  const [videos] = useState(() => items.map((i) => i.videos[Math.floor(Math.random() * i.videos.length)]));

  return (
    <ScreenScroll background={dark ? Colors.darkNavyBg : color}>
      <HintCarousel hintKeys={hintKeys} intervalMs={hintIntervalMs} variant={hintVariant} color={color} />
      {header}
      <SectionTitle color={dark ? Colors.textMiddle : Colors.white}>{t(sectionTitleKey)}</SectionTitle>
      {items.map((item, index) => (
        <ChecklistItemCard
          key={item.prefix}
          storageKey={dailyKey(item.prefix, date)}
          label={t(item.labelKey)}
          videoId={videos[index]}
          color={color}
          dark={dark}
          labelSize={labelSize}
        />
      ))}
    </ScreenScroll>
  );
}

function ChecklistItemCard({
  storageKey,
  label,
  videoId,
  color,
  dark,
  labelSize,
}: {
  storageKey: string;
  label: string;
  videoId: string;
  color: string;
  dark: boolean;
  labelSize: number;
}) {
  const [checked, setChecked] = useStoredBool(storageKey);

  const checkbox = (
    <Checkbox
      checked={checked}
      onToggle={setChecked}
      color={color}
      label={label}
      labelStyle={{ color: dark ? Colors.textLow : color, fontSize: labelSize }}
    />
  );

  // Items without a video yet still show their checkbox.
  if (!videoId) {
    return <Card style={{ backgroundColor: dark ? Colors.proMaxCardBg : Colors.white }}>{checkbox}</Card>;
  }

  return <VideoCard background={dark ? Colors.proMaxCardBg : Colors.white} videoId={videoId} header={checkbox} />;
}
