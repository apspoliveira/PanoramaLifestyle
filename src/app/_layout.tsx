import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider } from '@/components/Toast';
import { I18nProvider } from '@/i18n';
import { configureNotifications } from '@/services/notifications';
import { ProfileProvider } from '@/services/profile';

configureNotifications();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nProvider>
          <ProfileProvider>
            <ToastProvider>
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="setup" />
                <Stack.Screen name="(drawer)" />
                <Stack.Screen name="recipe/[id]" options={{ headerShown: true }} />
                <Stack.Screen name="calendar" options={{ headerShown: true }} />
              </Stack>
            </ToastProvider>
          </ProfileProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
