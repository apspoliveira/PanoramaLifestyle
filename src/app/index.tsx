import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { useI18n } from '@/i18n';
import { useProfile } from '@/services/profile';

/** Launcher gate (Activity_InitialSetup): go to the app once the profile exists. */
export default function Index() {
  const { ready } = useI18n();
  const { loaded, profile } = useProfile();

  if (!ready || !loaded) return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;

  return <Redirect href={profile.setupCompleted ? '/home' : '/setup'} />;
}
