import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

import { useI18n } from '@/i18n';
import { Colors } from '@/theme';

/** Header back arrow for pillar screens opened from the talks screen. */
export function TalksBackButton() {
  const { t } = useI18n();
  return (
    <Pressable
      role="button"
      aria-label={t('button_text_back')}
      onPress={() => router.navigate('/talks')}
      style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', marginStart: 4 }}>
      <MaterialIcons name="arrow-back" size={24} color={Colors.hintCardBg} />
    </Pressable>
  );
}
