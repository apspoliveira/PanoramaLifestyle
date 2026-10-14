import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

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
import {
  getReminderTimes,
  saveReminderTimes,
  REMINDERS,
  type ReminderSettings,
  type ReminderTime,
  type ReminderTimesMap,
} from '@/services/reminders';
import { getBool, setBool } from '@/services/storage';
import { Colors } from '@/theme';
import { parseDecimal, parseInteger } from '@/utils/numbers';

const COLOR = Colors.settings;
const LANGUAGES: { code: Language; labelKey: 'lang_pt' | 'lang_en' }[] = [
  { code: 'pt', labelKey: 'lang_pt' },
  { code: 'en', labelKey: 'lang_en' },
];

const noneEnabled = (): ReminderSettings => Object.fromEntries(REMINDERS.map((r) => [r.prefKey, false]));
const defaultTimes = (): ReminderTimesMap => Object.fromEntries(REMINDERS.map((r) => [r.prefKey, r.times]));

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
  const [times, setTimes] = useState<ReminderTimesMap>(defaultTimes);
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
    getReminderTimes().then(setTimes);
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
      saveReminderTimes(times),
    ]);
    const tNew = (key: Parameters<typeof t>[0], ...args: (string | number)[]) =>
      translate(selectedLanguage, key, ...args);
    await syncReminders(reminders, times, tNew).catch(() => {});
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
          <View key={r.prefKey} style={styles.reminderRow}>
            <Checkbox
              checked={reminders[r.prefKey]}
              onToggle={(checked) => toggleReminder(r.prefKey, checked)}
              color={COLOR}
              label={t(r.labelKey)}
              labelStyle={styles.reminderLabel}
            />
            <TimeEditor
              times={times[r.prefKey] ?? r.times}
              color={COLOR}
              onChange={(next) => setTimes((current) => ({ ...current, [r.prefKey]: next }))}
            />
          </View>
        ))}
      </Card>

      <PrimaryButton label={t('button_text_save')} onPress={save} color={COLOR} />
    </ScrollView>
  );
}

/** Editable list of times for one reminder: "HH : MM ✕" rows plus an "add" button. */
function TimeEditor({
  times,
  color,
  onChange,
}: {
  times: ReminderTime[];
  color: string;
  onChange: (times: ReminderTime[]) => void;
}) {
  const { t } = useI18n();

  const update = (index: number, patch: Partial<ReminderTime>) =>
    onChange(times.map((time, i) => (i === index ? { ...time, ...patch } : time)));

  const remove = (index: number) => onChange(times.filter((_, i) => i !== index));

  const add = () => onChange([...times, { hour: 9, minute: 0 }]);

  return (
    <View style={styles.timeList}>
      {times.map((time, index) => (
        <View key={index} style={styles.timeRow}>
          <TimeField value={time.hour} max={23} onChange={(hour) => update(index, { hour })} />
          <Text style={styles.timeColon}>:</Text>
          <TimeField value={time.minute} max={59} onChange={(minute) => update(index, { minute })} />
          <Pressable
            role="button"
            aria-label={t('settings_notif_remove_time')}
            onPress={() => remove(index)}
            hitSlop={8}
            style={styles.timeRemove}>
            <MaterialIcons name="close" size={16} color={Colors.textLow} />
          </Pressable>
        </View>
      ))}
      <Pressable role="button" onPress={add} style={styles.timeAdd}>
        <MaterialIcons name="add" size={16} color={color} />
        <Text style={[styles.timeAddText, { color }]}>{t('settings_notif_add_time')}</Text>
      </Pressable>
    </View>
  );
}

/** Compact two-digit HH or MM field; typed digits are clamped to `max` as they're entered. */
function TimeField({ value, max, onChange }: { value: number; max: number; onChange: (value: number) => void }) {
  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 2);
    onChange(digits === '' ? 0 : Math.min(max, Number(digits)));
  };

  return (
    <TextInput
      value={String(value).padStart(2, '0')}
      onChangeText={handleChange}
      keyboardType="number-pad"
      maxLength={2}
      style={styles.timeField}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F7F8' },
  content: { padding: 16, paddingBottom: 140, width: '100%', maxWidth: 720, alignSelf: 'center' },
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
  reminderRow: { marginBottom: 16 },
  timeList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginStart: 38, marginTop: -4 },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F3',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timeField: { width: 22, fontSize: 14, fontWeight: '600', color: '#1C1B1F', textAlign: 'center', padding: 0 },
  timeColon: { fontSize: 14, fontWeight: '600', color: '#1C1B1F' },
  timeRemove: { marginStart: 6 },
  timeAdd: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 6 },
  timeAddText: { fontSize: 13, fontWeight: '600' },
});
