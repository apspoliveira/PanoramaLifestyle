import * as Notifications from 'expo-notifications';
import { router, type Href } from 'expo-router';
import { useEffect } from 'react';

import { SECTIONS } from '@/theme';

let handledId: string | null = null;

/** Opens the pillar a reminder belongs to when the user taps it (NotificationReceiver's fragmentID). */
export function NotificationTapHandler() {
  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!response) return;
    const { identifier, content } = response.notification.request;
    if (handledId === identifier + response.notification.date) return;
    handledId = identifier + response.notification.date;
    const section = content.data?.section;
    if (typeof section === 'string' && SECTIONS.some((s) => s.id === section)) {
      router.navigate(`/${section}` as Href);
    }
  }, [response]);

  return null;
}
