import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OutlinedInput } from '@/components/OutlinedInput';
import { useToast } from '@/components/Toast';
import { Card, PrimaryButton } from '@/components/ui';
import { useI18n } from '@/i18n';
import { useProfile } from '@/services/profile';
import { Colors } from '@/theme';
import { parseDecimal, parseInteger } from '@/utils/numbers';

const PRIMARY = Colors.nutrition;

export default function SetupScreen() {
  const { t } = useI18n();
  const toast = useToast();
  const { saveProfile } = useProfile();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const start = async () => {
    const fields = [name, age, height, weight].map((f) => f.trim());
    if (fields.some((f) => f === '')) {
      toast(t('setup_fill_all'));
      return;
    }
    const parsedAge = parseInteger(fields[1]);
    const parsedHeight = parseDecimal(fields[2]);
    const parsedWeight = parseDecimal(fields[3]);
    if ([parsedAge, parsedHeight, parsedWeight].some(Number.isNaN)) {
      toast(t('setup_invalid_numbers'));
      return;
    }
    await saveProfile({
      name: fields[0],
      age: parsedAge,
      height: parsedHeight,
      weight: parsedWeight,
      setupCompleted: true,
    });
    router.replace('/home');
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.flex}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.title}>{t('setup_welcome')}</Text>
        <Text style={styles.subtitle}>{t('setup_subtitle')}</Text>

        <Card padding={20} style={styles.card}>
          <OutlinedInput
            label={t('setup_hint_name')}
            color={PRIMARY}
            icon="person"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
          />
          <OutlinedInput
            label={t('setup_hint_age')}
            color={PRIMARY}
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            style={styles.field}
          />
          <OutlinedInput
            label={t('setup_hint_height')}
            color={PRIMARY}
            suffix="cm"
            value={height}
            onChangeText={setHeight}
            keyboardType="decimal-pad"
            style={styles.field}
          />
          <OutlinedInput
            label={t('setup_hint_weight')}
            color={PRIMARY}
            suffix="kg"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            style={styles.field}
            onSubmitEditing={start}
          />
        </Card>

        <PrimaryButton
          label={t('setup_button_start')}
          onPress={start}
          color={PRIMARY}
          height={64}
          radius={16}
          fontSize={18}
          style={styles.button}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.white },
  content: { paddingHorizontal: 24, width: '100%', maxWidth: 560, alignSelf: 'center' },
  title: { color: PRIMARY, fontSize: 32, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: '#49454F', fontSize: 16, textAlign: 'center', marginTop: 8 },
  card: { marginTop: 32 },
  field: { marginTop: 16 },
  button: { marginTop: 32 },
});
