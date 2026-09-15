import type { StringKey } from '@/i18n/strings';
import type { SectionId } from '@/theme';

export interface Reminder {
  prefKey: string;
  section: SectionId;
  labelKey: StringKey;
  titleKey: StringKey;
  bodyKey: StringKey;
  hour: number;
  minute: number;
}

/** Daily reminders scheduled by Fragment_Settings (order matches its checkbox list). */
export const REMINDERS: Reminder[] = [
  { prefKey: 'notif_air', section: 'air', labelKey: 'settings_notif_air', titleKey: 'notif_air_title', bodyKey: 'notif_air_body', hour: 9, minute: 0 },
  { prefKey: 'notif_nutrition', section: 'nutrition', labelKey: 'settings_notif_nutrition', titleKey: 'notif_nutrition_title', bodyKey: 'notif_nutrition_body', hour: 12, minute: 30 },
  { prefKey: 'notif_sun', section: 'sun', labelKey: 'settings_notif_sun', titleKey: 'notif_sun_title', bodyKey: 'notif_sun_body', hour: 11, minute: 40 },
  { prefKey: 'notif_water', section: 'water', labelKey: 'settings_notif_water', titleKey: 'notif_water_title', bodyKey: 'notif_water_body', hour: 15, minute: 0 },
  { prefKey: 'notif_workout', section: 'workout', labelKey: 'settings_notif_workout', titleKey: 'notif_workout_title', bodyKey: 'notif_workout_body', hour: 17, minute: 30 },
  { prefKey: 'notif_temp', section: 'temperance', labelKey: 'settings_notif_temperance', titleKey: 'notif_temp_title', bodyKey: 'notif_temp_body', hour: 10, minute: 0 },
  { prefKey: 'notif_rest', section: 'rest', labelKey: 'settings_notif_rest', titleKey: 'notif_rest_title', bodyKey: 'notif_rest_body', hour: 22, minute: 0 },
  { prefKey: 'notif_trust', section: 'trust', labelKey: 'settings_notif_trust', titleKey: 'notif_trust_title', bodyKey: 'notif_trust_body', hour: 20, minute: 0 },
];

export type ReminderSettings = Record<string, boolean>;
