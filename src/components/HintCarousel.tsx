import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';

import { useI18n } from '@/i18n';
import type { StringKey } from '@/i18n/strings';
import { Colors } from '@/theme';

export type HintVariant = 'light' | 'translucent' | 'dark';

const useNativeDriver = Platform.OS !== 'web';

const VARIANTS: Record<HintVariant, { background: string; label?: string; text: string; labelOpacity: number }> = {
  // Android used white text on this near-white card, which was unreadable; text uses a dark slate instead.
  light: { background: 'rgba(255, 255, 255, 0.8)', text: '#334155', labelOpacity: 1 },
  translucent: { background: 'rgba(255, 255, 255, 0.2)', label: Colors.white, text: Colors.white, labelOpacity: 0.9 },
  dark: { background: Colors.hintCardBg, label: Colors.textMiddle, text: Colors.white, labelOpacity: 1 },
};

interface Props {
  hintKeys: StringKey[];
  intervalMs: number;
  variant: HintVariant;
  color: string;
}

/** Rotating "health hint" card (slide in from the left, out to the right). */
export function HintCarousel({ hintKeys, intervalMs, variant, color }: Props) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const width = useRef(320);
  const style = VARIANTS[variant];

  useEffect(() => {
    const id = setInterval(() => {
      Animated.parallel([
        Animated.timing(translateX, { toValue: width.current, duration: 250, useNativeDriver }),
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver }),
      ]).start(() => {
        setIndex((i) => (i + 1) % hintKeys.length);
        translateX.setValue(-width.current);
        Animated.parallel([
          Animated.timing(translateX, { toValue: 0, duration: 300, useNativeDriver }),
          Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver }),
        ]).start();
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, hintKeys.length, translateX, opacity]);

  return (
    <View
      style={[styles.card, { backgroundColor: style.background }]}
      onLayout={(e) => (width.current = e.nativeEvent.layout.width)}>
      <Text style={[styles.label, { color: style.label ?? color, opacity: style.labelOpacity }]}>
        {t('health_hint_label')}
      </Text>
      <Animated.Text
        aria-live="polite"
        style={[styles.text, { color: style.text, opacity, transform: [{ translateX }] }]}>
        {t(hintKeys[index % hintKeys.length])}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 20, marginBottom: 24, overflow: 'hidden', minHeight: 104 },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 },
  text: { fontSize: 16, lineHeight: 23, fontWeight: '500' },
});
