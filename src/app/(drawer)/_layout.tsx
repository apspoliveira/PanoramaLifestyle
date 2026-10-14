import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, usePathname } from 'expo-router';
import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { NotificationTapHandler } from '@/components/NotificationTapHandler';
import { TalksBackButton } from '@/components/TalksBackButton';
import { useI18n } from '@/i18n';
import { useProfile } from '@/services/profile';
import { Colors, SECTIONS, type SectionId } from '@/theme';

type TabIcon = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const TABS: { name: string; href: `/${string}`; labelKey: 'nav_home' | 'nav_talks' | 'nav_meal' | 'nav_exercise' | 'nav_settings'; icon: TabIcon; color: string }[] = [
  { name: 'home', href: '/home', labelKey: 'nav_home', icon: 'home-outline', color: Colors.home },
  { name: 'talks', href: '/talks', labelKey: 'nav_talks', icon: 'chat-outline', color: Colors.talks },
  { name: 'nutrition', href: '/nutrition', labelKey: 'nav_meal', icon: 'silverware-fork-knife', color: Colors.nutrition },
  { name: 'workout', href: '/workout', labelKey: 'nav_exercise', icon: 'dumbbell', color: Colors.workout },
  { name: 'settings', href: '/settings', labelKey: 'nav_settings', icon: 'cog-outline', color: Colors.settings },
];

function BottomTabButton({
  children,
  isFocused,
  icon,
  activeColor,
  ...props
}: TabTriggerSlotProps & { icon: TabIcon; activeColor: string }) {
  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <View style={[styles.icon, isFocused && styles.activeIcon]}>
        <MaterialCommunityIcons name={icon} size={22} color={isFocused ? activeColor : '#77776E'} />
      </View>
      <Text style={[styles.tabLabel, isFocused && styles.activeLabel, isFocused && { color: activeColor }]}>{children}</Text>
    </Pressable>
  );
}

export default function DrawerLayout() {
  const { t } = useI18n();
  const { loaded, profile } = useProfile();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  if (loaded && !profile.setupCompleted) return <Redirect href="/setup" />;

  const routeName = pathname.split('/').filter(Boolean).at(-1) ?? '';
  const sectionId: SectionId | undefined =
    routeName === 'talks-nutrition'
      ? 'nutrition'
      : routeName === 'talks-workout'
        ? 'workout'
        : SECTIONS.find((section) => section.id === routeName)?.id;
  const titleKey = sectionId ? SECTIONS.find((section) => section.id === sectionId)?.labelKey : undefined;
  const isHome = routeName === 'home';
  const isTalkDetail =
    routeName === 'talks-nutrition' ||
    routeName === 'talks-workout' ||
    (sectionId !== undefined && !TABS.some((tab) => tab.name === sectionId));

  return (
    <View style={styles.root}>
      <NotificationTapHandler />
      {!isHome && (
        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.headerContent}>
            {isTalkDetail ? <TalksBackButton /> : <View style={styles.headerSpacer} />}
            <Text style={styles.headerTitle}>{titleKey ? t(titleKey) : ''}</Text>
          </View>
        </SafeAreaView>
      )}
      <Tabs style={styles.tabs}>
        <TabSlot style={styles.slot} />
        <TabList style={[styles.tabList, { bottom: Math.max(insets.bottom, 16) }]}>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <BottomTabButton icon={tab.icon} activeColor={tab.color}>{t(tab.labelKey)}</BottomTabButton>
            </TabTrigger>
          ))}
          {SECTIONS.filter((section) => !TABS.some((tab) => tab.name === section.id)).map((section) => (
            <TabTrigger key={section.id} name={section.id} href={`/${section.id}`} style={styles.hiddenTab} />
          ))}
          <TabTrigger name="talks-nutrition" href="/talks-nutrition" style={styles.hiddenTab} />
          <TabTrigger name="talks-workout" href="/talks-workout" style={styles.hiddenTab} />
        </TabList>
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },
  tabs: { flex: 1 },
  header: { backgroundColor: Colors.white },
  headerContent: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  headerSpacer: { width: 52 },
  headerTitle: { color: Colors.hintCardBg, fontSize: 20, fontWeight: '700' },
  slot: { flex: 1 },
  tabList: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    width: '92%',
    maxWidth: 560,
    backgroundColor: Colors.white,
    borderRadius: 44,
    padding: 8,
    boxShadow: '0px 6px 32px rgba(49, 44, 24, 0.10)',
  },
  tabButton: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 4, minHeight: 58 },
  pressed: { opacity: 0.65 },
  icon: { width: 42, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  activeIcon: { backgroundColor: '#F3EFDF' },
  tabLabel: { fontSize: 11, color: '#77776E' },
  activeLabel: { color: Colors.hintCardBg, fontWeight: '600' },
  hiddenTab: { display: 'none' },
});
