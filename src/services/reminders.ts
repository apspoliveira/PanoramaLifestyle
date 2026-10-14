import type { StringKey } from '@/i18n/strings';
import type { SectionId } from '@/theme';
import { getString, setString } from './storage';

export interface ReminderTime {
  hour: number;
  minute: number;
}

export interface Reminder {
  prefKey: string;
  section: SectionId;
  labelKey: StringKey;
  titleKey: StringKey;
  bodyKey: StringKey;
  /** One toggle can fire more than once a day (e.g. nutrition: breakfast/lunch/dinner). */
  times: ReminderTime[];
}

/** One reminder per hour, on the hour, from `from` to `to` inclusive (e.g. water: 10h-19h). */
function hourlyTimes(from: number, to: number): ReminderTime[] {
  const times: ReminderTime[] = [];
  for (let hour = from; hour <= to; hour++) times.push({ hour, minute: 0 });
  return times;
}

/** Daily reminders scheduled by Fragment_Settings (order matches its checkbox list). */
export const REMINDERS: Reminder[] = [
  { prefKey: 'notif_air', section: 'air', labelKey: 'settings_notif_air', titleKey: 'notif_air_title', bodyKey: 'notif_air_body', times: [{ hour: 11, minute: 0 }, { hour: 16, minute: 0 }] },
  { prefKey: 'notif_nutrition', section: 'nutrition', labelKey: 'settings_notif_nutrition', titleKey: 'notif_nutrition_title', bodyKey: 'notif_nutrition_body', times: [{ hour: 8, minute: 30 }, { hour: 13, minute: 30 }, { hour: 18, minute: 30 }] },
  { prefKey: 'notif_sun', section: 'sun', labelKey: 'settings_notif_sun', titleKey: 'notif_sun_title', bodyKey: 'notif_sun_body', times: [{ hour: 10, minute: 0 }, { hour: 15, minute: 0 }] },
  { prefKey: 'notif_water', section: 'water', labelKey: 'settings_notif_water', titleKey: 'notif_water_title', bodyKey: 'notif_water_body', times: hourlyTimes(10, 19) },
  { prefKey: 'notif_workout', section: 'workout', labelKey: 'settings_notif_workout', titleKey: 'notif_workout_title', bodyKey: 'notif_workout_body', times: [{ hour: 9, minute: 0 }, { hour: 19, minute: 0 }] },
  { prefKey: 'notif_temp', section: 'temperance', labelKey: 'settings_notif_temperance', titleKey: 'notif_temp_title', bodyKey: 'notif_temp_body', times: [{ hour: 10, minute: 0 }, { hour: 12, minute: 0 }, { hour: 14, minute: 30 }, { hour: 16, minute: 0 }, { hour: 18, minute: 0 }] },
  { prefKey: 'notif_rest', section: 'rest', labelKey: 'settings_notif_rest', titleKey: 'notif_rest_title', bodyKey: 'notif_rest_body', times: [{ hour: 22, minute: 0 }] },
  { prefKey: 'notif_trust', section: 'trust', labelKey: 'settings_notif_trust', titleKey: 'notif_trust_title', bodyKey: 'notif_trust_body', times: [{ hour: 7, minute: 0 }, { hour: 20, minute: 0 }] },
];

export type ReminderSettings = Record<string, boolean>;

export type ReminderTimesMap = Record<string, ReminderTime[]>;

const timesStorageKey = (prefKey: string) => `${prefKey}_times`;

function isValidTime(value: unknown): value is ReminderTime {
  const time = value as Partial<ReminderTime> | null;
  return (
    !!time &&
    Number.isInteger(time.hour) &&
    Number.isInteger(time.minute) &&
    time.hour! >= 0 &&
    time.hour! <= 23 &&
    time.minute! >= 0 &&
    time.minute! <= 59
  );
}

/** Loads each reminder's user-edited times, falling back to its `REMINDERS` default. */
export async function getReminderTimes(): Promise<ReminderTimesMap> {
  const entries = await Promise.all(
    REMINDERS.map(async (reminder) => {
      const raw = await getString(timesStorageKey(reminder.prefKey));
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(isValidTime)) {
            return [reminder.prefKey, parsed as ReminderTime[]] as const;
          }
        } catch {
          // Fall through to the default below.
        }
      }
      return [reminder.prefKey, reminder.times] as const;
    }),
  );
  return Object.fromEntries(entries);
}

export async function saveReminderTimes(times: ReminderTimesMap): Promise<void> {
  await Promise.all(
    REMINDERS.map((reminder) =>
      setString(timesStorageKey(reminder.prefKey), JSON.stringify(times[reminder.prefKey] ?? reminder.times)),
    ),
  );
}
