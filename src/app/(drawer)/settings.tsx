import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { OutlinedInput } from '@/components/OutlinedInput';
import { useToast } from '@/components/Toast';
import { Card, Checkbox, PrimaryButton } from '@/components/ui';
import { translate, useI18n, type Language } from '@/i18n';
import {
  notificationsSupported,
  requestNotificationPermission,
  syncReminders,
} from '@/services/notifications';
import { useProfile } from '@/services/profile';
import { REMINDERS, type ReminderSettings } from '@/services/reminders';
import { getBool, setBool } from '@/services/storage';
import { Colors } from '@/theme';
import { parseDecimal, parseInteger } from '@/utils/numbers';

const COLOR = Colors.settings;
const LANGUAGES: { code: Language; labelKey: 'lang_pt' | 'lang_en' }[] = [
  { code: 'pt', labelKey: 'lang_pt' },
  { code: 'en', labelKey: 'lang_en' },
];

const noneEnabled = (): ReminderSettings => Object.fromEntries(REMINDERS.map((r) => [r.prefKey, false]));

export default function SettingsScreen() {
  const { t, language, setLanguage } = useI18n();
  const { profile, loaded, saveProfile } = useProfile();
  const toast = useToast();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [reminders, setReminders] = useState<ReminderSettings>(noneEnabled);
  const permissionGranted = useRef(false);

  // Fill the form once the stored profile/language are available (the screen can open before they load).
  useEffect(() => {
    if (!loaded) return;
    setName(profile.name);
    setAge(profile.age ? String(profile.age) : '');
    setWeight(profile.weight ? String(profile.weight) : '');
    setHeight(profile.height ? String(profile.height) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  useEffect(() => setSelectedLanguage(language), [language]);

  useEffect(() => {
    Promise.all(REMINDERS.map((r) => getBool(r.prefKey))).then((values) =>
      setReminders(Object.fromEntries(REMINDERS.map((r, i) => [r.prefKey, values[i]]))),
    );
  }, []);

  const toggleReminder = async (prefKey: string, checked: boolean) => {
    if (!checked) {
      setReminders((current) => ({ ...current, [prefKey]: false }));
      return;
    }
    if (!notificationsSupported) {
      toast(t('notif_unsupported'));
      setReminders(noneEnabled());
      return;
    }
    setReminders((current) => ({ ...current, [prefKey]: true }));
    if (permissionGranted.current) return;
    if (await requestNotificationPermission()) {
      permissionGranted.current = true;
      toast(t('notif_enabled'));
    } else {
      toast(t('notif_denied'));
      setReminders(noneEnabled());
    }
  };

  const save = async () => {
    // Like Fragment_Settings, only non-empty (and valid) profile fields are saved.
    const changes: Parameters<typeof saveProfile>[0] = {};
    if (name.trim()) changes.name = name.trim();
    const parsedAge = parseInteger(age.trim());
    if (!Number.isNaN(parsedAge)) changes.age = parsedAge;
    const parsedWeight = parseDecimal(weight.trim());
    if (!Number.isNaN(parsedWeight)) changes.weight = parsedWeight;
    const parsedHeight = parseDecimal(height.trim());
    if (!Number.isNaN(parsedHeight)) changes.height = parsedHeight;

    await Promise.all([
      saveProfile(changes),
      setLanguage(selectedLanguage),
      ...REMINDERS.map((r) => setBool(r.prefKey, reminders[r.prefKey])),
    ]);
    const tNew = (key: Parameters<typeof t>[0], ...args: (string | number)[]) =>
      translate(selectedLanguage, key, ...args);
    await syncReminders(reminders, tNew).catch(() => {});
    toast(tNew('settings_saved'));
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Card radius={16} style={styles.card}>
        <Text style={styles.sectionTitle}>{t('title_general_data')}</Text>
        <OutlinedInput label={t('setup_hint_name')} color={COLOR} icon="person" value={name} onChangeText={setName} />
        <View style={styles.row}>
          <OutlinedInput
            label={t('setup_hint_age')}
            color={COLOR}
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            style={styles.rowField}
          />
          <OutlinedInput
            label={t('setup_hint_weight')}
            color={COLOR}
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            style={styles.rowField}
          />
          <OutlinedInput
            label={t('setup_hint_height')}
            color={COLOR}
            value={height}
            onChangeText={setHeight}
            keyboardType="decimal-pad"
            style={styles.rowField}
          />
        </View>
      </Card>

      <Card radius={16} style={styles.card}>
        <Text style={styles.sectionTitle}>{t('settings_lang')}</Text>
        <View role="radiogroup" style={styles.languages}>
          {LANGUAGES.map(({ code, labelKey }) => {
            const selected = selectedLanguage === code;
            return (
              <Pressable
                key={code}
                role="radio"
                aria-checked={selected}
                onPress={() => setSelectedLanguage(code)}
                style={[styles.chip, selected && styles.chipSelected]}>
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{t(labelKey)}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card radius={16} style={styles.card}>
        <Text style={styles.sectionTitle}>{t('settings_notifications')}</Text>
        {REMINDERS.map((r) => (
          <Checkbox
            key={r.prefKey}
            checked={reminders[r.prefKey]}
            onToggle={(checked) => toggleReminder(r.prefKey, checked)}
            color={COLOR}
            label={t(r.labelKey)}
            labelStyle={styles.reminderLabel}
          />
        ))}
      </Card>

      <PrimaryButton label={t('button_text_save')} onPress={save} color={COLOR} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F7F8' },
  content: { padding: 16, paddingBottom: 32, width: '100%', maxWidth: 720, alignSelf: 'center' },
  card: { marginBottom: 16 },
  sectionTitle: {
    color: '#49454F',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  rowField: { flexGrow: 1, flexBasis: 90 },
  languages: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { borderWidth: 1.5, borderColor: '#79747E', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  chipSelected: { backgroundColor: COLOR, borderColor: COLOR },
  chipText: { color: '#1C1B1F', fontSize: 15, fontWeight: '600' },
  chipTextSelected: { color: Colors.white },
  reminderLabel: { color: '#1C1B1F', fontWeight: '500', textTransform: 'none', fontSize: 16 },
});
