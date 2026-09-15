import { Stack, router, useLocalSearchParams, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import { Card, PrimaryButton } from '@/components/ui';
import { useI18n } from '@/i18n';
import { Colors, SECTIONS } from '@/theme';
import { fromIsoDate, toIsoDate, today } from '@/utils/dates';

/** Activity_Calendar: pick a day and return to the originating pillar with that date. */
export default function CalendarScreen() {
  const { t } = useI18n();
  const params = useLocalSearchParams<{ date?: string; section?: string }>();
  const section = SECTIONS.find((s) => s.id === params.section) ?? SECTIONS[0];
  const [selected, setSelected] = useState(() => toIsoDate(params.date ?? today()));

  const confirm = () => {
    router.dismissTo({ pathname: `/${section.id}`, params: { date: fromIsoDate(selected) } } as Href);
  };

  const cancel = () => {
    if (router.canGoBack()) router.back();
    else router.replace(`/${section.id}` as Href);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: t('settings_goals'),
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: section.color,
        }}
      />
      <Card radius={16} padding={8}>
        <Calendar
          current={selected}
          markedDates={{ [selected]: { selected: true, selectedColor: section.color } }}
          onDayPress={(day) => setSelected(day.dateString)}
          theme={{
            todayTextColor: section.color,
            arrowColor: section.color,
            selectedDayBackgroundColor: section.color,
            textDayFontWeight: '500',
            textMonthFontWeight: '700',
          }}
        />
      </Card>
      <View style={styles.actions}>
        <Pressable role="button" onPress={cancel} style={styles.textButton}>
          <Text style={[styles.textButtonLabel, { color: section.color }]}>{t('button_text_cancel')}</Text>
        </Pressable>
        <PrimaryButton label={t('button_confirm')} onPress={confirm} color={section.color} height={48} radius={24} fontSize={15} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 16, width: '100%', maxWidth: 560, alignSelf: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 16 },
  textButton: { paddingHorizontal: 16, height: 48, justifyContent: 'center' },
  textButtonLabel: { fontSize: 15, fontWeight: '700' },
});
