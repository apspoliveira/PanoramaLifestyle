import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, ScreenScroll, SectionTitle } from '@/components/ui';
import { HOME_SECTIONS } from '@/data/homeContent';
import { useI18n } from '@/i18n';
import { useProfile } from '@/services/profile';
import { Colors } from '@/theme';

const palette = {
  ink: '#252516',
  muted: '#77776E',
  white: '#FFFFFF',
  line: '#E9E7DF',
};

const serif = Platform.select({ ios: 'Georgia', android: 'serif', web: 'Georgia, serif' });

export default function HomeScreen() {
  const { t } = useI18n();
  const { profile } = useProfile();
  const [notifications, setNotifications] = useState(false);
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.page}>
      <ScreenScroll background={Colors.home}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.brandBlock}>
              <Text style={styles.brand}>PANORAMA LIFESTYLE</Text>
              <Text style={styles.greeting}>{t('home_greeting', profile.name || t('user_default'))}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('home_notifications')}
              onPress={() => setNotifications(true)}
              style={styles.bell}>
              <MaterialCommunityIcons name="bell-outline" size={22} color={Colors.home} />
            </Pressable>
          </View>

          {HOME_SECTIONS.map((section) => (
            <View key={section.titleKey}>
              <View style={styles.sectionHeader}>
                <SectionTitle color={palette.ink}>{t(section.titleKey)}</SectionTitle>
                <Pressable accessibilityRole="link" onPress={() => router.navigate(section.href as Href)} hitSlop={10}>
                  <Text style={styles.all}>{t(section.seeAllKey)}</Text>
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cards}
                style={styles.carousel}>
                {section.cards.map((card) => (
                  <Pressable
                    key={card.id}
                    accessibilityRole="link"
                    accessibilityLabel={`Abrir: ${card.title.replace('\n', ' ')}`}
                    onPress={() => router.navigate(card.href as Href)}
                    style={({ pressed }) => [
                      { width: Math.min(width - 78, 300) },
                      pressed && styles.pressed,
                    ]}>
                    <Card padding={16} radius={20} style={styles.card}>
                      <View style={styles.cardTop}>
                        <View style={[styles.accent, { backgroundColor: card.color }]} />
                        <Text style={styles.cardTitle}>{card.title}</Text>
                        <MaterialCommunityIcons name="arrow-top-right" size={19} color={palette.ink} />
                      </View>
                      <Text style={styles.date}>{card.date}</Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={card.category}
                        onPress={(event) => {
                          event.stopPropagation();
                          router.navigate(card.categoryHref as Href);
                        }}
                        hitSlop={8}
                        style={({ pressed }) => [styles.category, pressed && styles.pressed]}>
                        <MaterialCommunityIcons name={card.icon} size={17} color={card.color} />
                        <Text style={styles.categoryText}>{card.category}</Text>
                      </Pressable>
                    </Card>
                  </Pressable>
                ))}
                {!section.cards.length && <Text style={styles.body}>{t('home_empty_conversations')}</Text>}
              </ScrollView>
            </View>
          ))}
        </View>

        <Modal
          visible={notifications}
          transparent
          animationType="fade"
          onRequestClose={() => setNotifications(false)}>
          <View style={styles.scrim}>
            <View style={styles.modal}>
              <SectionTitle color={palette.ink}>{t('home_notifications')}</SectionTitle>
              <Text style={styles.body}>{t('home_empty_notifications')}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setNotifications(false)}
                style={styles.close}>
                <Text style={styles.closeText}>{t('home_close')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScreenScroll>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Colors.home },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  brandBlock: { gap: 7 },
  brand: { fontSize: 10, letterSpacing: 2, color: 'rgba(37, 37, 22, 0.72)', fontWeight: '700' },
  greeting: { fontFamily: serif, fontSize: 19, fontWeight: '600', color: palette.ink },
  bell: {
    width: 48,
    height: 48,
    backgroundColor: palette.white,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  all: { fontSize: 14, color: 'rgba(37, 37, 22, 0.76)', marginBottom: 12 },
  carousel: { marginHorizontal: -16, marginBottom: 16 },
  cards: { paddingHorizontal: 16, gap: 12 },
  card: { minHeight: 150 },
  pressed: { opacity: 0.7 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  accent: { width: 4, height: 40, borderRadius: 4 },
  cardTitle: { flex: 1, fontFamily: serif, fontSize: 19, lineHeight: 24, fontWeight: '600', color: palette.ink },
  date: { fontSize: 9, letterSpacing: 1, color: palette.muted, marginTop: 16, marginBottom: 10 },
  category: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 8, borderWidth: 1, borderColor: palette.line, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  categoryText: { fontSize: 13, color: palette.ink },
  body: { fontSize: 15, lineHeight: 23, color: palette.muted },
  scrim: { flex: 1, backgroundColor: '#25251655', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { width: '100%', maxWidth: 380, padding: 24, borderRadius: 24, backgroundColor: palette.white, gap: 12 },
  close: { backgroundColor: Colors.home, borderRadius: 12, padding: 15, alignItems: 'center' },
  closeText: { color: palette.white },
});
