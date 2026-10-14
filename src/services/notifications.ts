import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { Translate } from '@/i18n';
import { REMINDERS, type ReminderSettings, type ReminderTimesMap } from './reminders';

const CHANNEL_ID = 'NEWSTART_Notifications';
const IDENTIFIER_PREFIX = 'newstart-';

export const notificationsSupported = true;

export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'NEWSTART Reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    // Android 13+ only shows the permission prompt once a channel exists.
    await ensureChannel();
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    return (await Notifications.requestPermissionsAsync()).granted;
  } catch {
    return false;
  }
}

/**
 * Cancels every notification this app has scheduled and re-schedules the enabled reminders
 * using `times` (falling back to each reminder's `REMINDERS` default). Cancelling everything
 * up front — rather than guessing at old identifiers — keeps this correct even when the user
 * has changed how many times a reminder fires since the last save.
 */
export async function syncReminders(
  enabled: ReminderSettings,
  times: ReminderTimesMap,
  t: Translate,
): Promise<void> {
  await ensureChannel();

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((notification) => notification.identifier.startsWith(IDENTIFIER_PREFIX))
      .map((notification) => Notifications.cancelScheduledNotificationAsync(notification.identifier).catch(() => {})),
  );

  for (const reminder of REMINDERS) {
    if (!enabled[reminder.prefKey]) continue;
    const reminderTimes = times[reminder.prefKey] ?? reminder.times;
    await Promise.all(
      reminderTimes.map((time, index) =>
        Notifications.scheduleNotificationAsync({
          identifier: `${IDENTIFIER_PREFIX}${reminder.prefKey}-${index}`,
          content: {
            title: t(reminder.titleKey),
            body: t(reminder.bodyKey),
            data: { section: reminder.section },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: time.hour,
            minute: time.minute,
            channelId: CHANNEL_ID,
          },
        }),
      ),
    );
  }
}
