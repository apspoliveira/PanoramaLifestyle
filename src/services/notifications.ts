import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { Translate } from '@/i18n';
import { REMINDERS, type ReminderSettings } from './reminders';

const CHANNEL_ID = 'NEWSTART_Notifications';

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

/** Cancels every reminder and re-schedules the enabled ones as daily notifications. */
export async function syncReminders(enabled: ReminderSettings, t: Translate): Promise<void> {
  await ensureChannel();
  for (const reminder of REMINDERS) {
    const identifier = `newstart-${reminder.prefKey}`;
    await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {});
    if (!enabled[reminder.prefKey]) continue;
    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title: t(reminder.titleKey),
        body: t(reminder.bodyKey),
        data: { section: reminder.section },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: reminder.hour,
        minute: reminder.minute,
        channelId: CHANNEL_ID,
      },
    });
  }
}
