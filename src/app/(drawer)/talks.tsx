import { MaterialIcons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Icon, ScreenScroll } from '@/components/ui';
import { useI18n } from '@/i18n';
import type { StringKey } from '@/i18n/strings';
import { sectionById, type SectionId } from '@/theme';

/** `route` overrides the screen opened when it differs from the pillar id (e.g. talks-only screens). */
const TALKS: { section: SectionId; route?: string; descriptionKey: StringKey }[] = [
  { section: 'nutrition', route: 'talks-nutrition', descriptionKey: 'hint_nutr_1' },
  { section: 'workout', route: 'talks-workout', descriptionKey: 'workout_hint_1' },
  { section: 'water', descriptionKey: 'hint_water_1' },
  { section: 'sun', descriptionKey: 'hint_sun_1' },
  { section: 'temperance', descriptionKey: 'hint_temp_1' },
  { section: 'air', descriptionKey: 'hint_air_1' },
  { section: 'rest', descriptionKey: 'hint_rest_1' },
  { section: 'trust', descriptionKey: 'hint_trust_1' },
];

/** Hub listing every pillar with a short description; each card opens that pillar's screen. */
export default function TalksScreen() {
  const { t } = useI18n();

  return (
    <ScreenScroll background={sectionById('talks').color}>
      {TALKS.map(({ section, route, descriptionKey }) => {
        const { id, color, icon, labelKey } = sectionById(section);
        return (
          <Pressable
            key={id}
            role="button"
            onPress={() => router.navigate({ pathname: `/${route ?? id}`, params: { from: 'talks' } } as Href)}
            style={({ pressed }) => [styles.pressable, { opacity: pressed ? 0.85 : 1 }]}>
            <Card padding={16} style={styles.card}>
              <View style={[styles.chip, { backgroundColor: `${color}26` }]}>
                <Icon icon={icon} size={24} color={color} />
              </View>
              <View style={styles.text}>
                <Text style={styles.title}>{t(labelKey)}</Text>
                <Text style={styles.description}>{t(descriptionKey)}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#79747E" />
            </Card>
          </Pressable>
        );
      })}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  pressable: { marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  chip: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1 },
  title: { color: '#1C1B1F', fontSize: 17, fontWeight: '700' },
  description: { color: '#49454F', fontSize: 14, lineHeight: 20, marginTop: 3 },
});
