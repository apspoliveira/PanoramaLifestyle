import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Platform, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const useNativeDriver = Platform.OS !== 'web';

const ToastContext = createContext<(message: string) => void>(() => {});

/** Lightweight replacement for Android's Toast.makeText(...).show(). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const insets = useSafeAreaInsets();

  const show = useCallback(
    (text: string) => {
      clearTimeout(timer.current);
      setMessage(text);
      Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver }).start(({ finished }) => {
          if (finished) setMessage(null);
        });
      }, 2200);
    },
    [opacity],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {message !== null && (
        <Animated.View style={[styles.toast, { bottom: insets.bottom + 48, opacity }]}>
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    maxWidth: '85%',
    backgroundColor: 'rgba(40, 40, 40, 0.92)',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    pointerEvents: 'none',
  },
  text: { color: '#FFFFFF', fontSize: 14, textAlign: 'center' },
});
