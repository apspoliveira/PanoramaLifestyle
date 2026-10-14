import { MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem, type DrawerContentComponentProps } from 'expo-router/drawer';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '@/i18n';
import { useProfile } from '@/services/profile';
import { Colors, DRAWER_SECTIONS, SECTIONS, sectionById, type Section } from '@/theme';
import { Icon } from './ui';

/** NavigationView with nav_header_main and drawer_menu from Activity_Main. */
export function AppDrawerContent(props: DrawerContentComponentProps) {
  const { t } = useI18n();
  const { profile } = useProfile();
  const insets = useSafeAreaInsets();
  const activeRoute = props.state.routeNames[props.state.index];

  // Pillars missing from the drawer live under "talks", which stays highlighted while one is open.
  const isTalkPillar = !DRAWER_SECTIONS.some((id) => id === activeRoute) && activeRoute !== 'settings';

  const renderItem = (section: Section) => {
    const focused = activeRoute === section.id || (section.id === 'talks' && isTalkPillar);
    return (
      <DrawerItem
        key={section.id}
        label={t(section.labelKey)}
        focused={focused}
        icon={({ size }) => <Icon icon={section.icon} size={size} color={focused ? section.color : '#49454F'} />}
        activeTintColor={section.color}
        inactiveTintColor="#1C1B1F"
        activeBackgroundColor={`${section.color}1F`}
        onPress={() => {
          props.navigation.navigate(section.id, { from: undefined });
          props.navigation.closeDrawer();
        }}
      />
    );
  };

  const stats = t('profile_stats_format', profile.age, profile.weight.toFixed(1), profile.height.toFixed(0));

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.content}>
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <MaterialIcons name="favorite" size={48} color={Colors.accentTeal} />
        <Text style={styles.name}>{profile.name || t('user_default')}</Text>
        <Text style={styles.stats}>{stats}</Text>
      </View>
      <View style={styles.items}>
        {DRAWER_SECTIONS.map((id) => renderItem(sectionById(id)))}
        <View style={styles.divider} />
        <Text style={styles.subheader}>{t('nav_application')}</Text>
        {SECTIONS.filter((s) => s.id === 'settings').map(renderItem)}
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0, paddingStart: 0, paddingEnd: 0 },
  header: { backgroundColor: Colors.hintCardBg, padding: 24 },
  name: { color: Colors.textHigh, fontSize: 20, fontWeight: '700', marginTop: 12 },
  stats: { color: Colors.textMiddle, fontSize: 13, marginTop: 4 },
  items: { paddingHorizontal: 12, paddingTop: 8 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#CAC4D0', marginVertical: 8 },
  subheader: { color: '#49454F', fontSize: 14, fontWeight: '600', marginStart: 16, marginVertical: 12 },
});
