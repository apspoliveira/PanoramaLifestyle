import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import { AppDrawerContent } from '@/components/AppDrawerContent';
import { NotificationTapHandler } from '@/components/NotificationTapHandler';
import { useI18n } from '@/i18n';
import { useProfile } from '@/services/profile';
import { Colors, SECTIONS } from '@/theme';

/** Activity_Main: drawer navigation with a white toolbar and one screen per pillar. */
export default function DrawerLayout() {
  const { t } = useI18n();
  const { loaded, profile } = useProfile();

  if (loaded && !profile.setupCompleted) return <Redirect href="/setup" />;

  return (
    <>
      <NotificationTapHandler />
      <Drawer
        drawerContent={(props) => <AppDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.hintCardBg,
          headerTitleStyle: { fontWeight: '700' },
          drawerStyle: { backgroundColor: Colors.white },
        }}>
        {SECTIONS.map((section) => (
          <Drawer.Screen key={section.id} name={section.id} options={{ title: t(section.labelKey) }} />
        ))}
      </Drawer>
    </>
  );
}
