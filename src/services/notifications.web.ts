import type { Translate } from '@/i18n';
import type { ReminderSettings } from './reminders';

// expo-notifications has no web support; reminders are a native-only feature.
export const notificationsSupported = false;

export function configureNotifications() {}

export async function requestNotificationPermission(): Promise<boolean> {
  return false;
}

export async function syncReminders(_enabled: ReminderSettings, _t: Translate): Promise<void> {}
