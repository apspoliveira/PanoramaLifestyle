import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { Colors, type IconSpec } from '@/theme';

export type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

export function Icon({ icon, size = 24, color }: { icon: IconSpec; size?: number; color: string }) {
  if (icon.family === 'community') {
    const name = icon.name as ComponentProps<typeof MaterialCommunityIcons>['name'];
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
  }
  return <MaterialIcons name={icon.name as MaterialIconName} size={size} color={color} />;
}

export function Card({
  children,
  style,
  radius = 24,
  padding = 16,
  color = Colors.white,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  padding?: number;
  color?: string;
}) {
  return (
    <View style={[styles.card, { backgroundColor: color, borderRadius: radius, padding }, style]}>{children}</View>
  );
}

export function ScreenScroll({ background, children }: { background: string; children: ReactNode }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: background }} contentContainerStyle={styles.screenContent}>
      {children}
    </ScrollView>
  );
}

export function SectionTitle({ children, color = Colors.white }: { children: string; color?: string }) {
  return <Text style={[styles.sectionTitle, { color }]}>{children}</Text>;
}

export function CardTitle({ children, color, style }: { children: string; color: string; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.cardTitle, { color }, style]}>{children}</Text>;
}

export function Checkbox({
  checked,
  onToggle,
  color,
  label,
  labelStyle,
}: {
  checked: boolean;
  onToggle: (checked: boolean) => void;
  color: string;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
}) {
  return (
    <Pressable
      role="checkbox"
      aria-checked={checked}
      onPress={() => onToggle(!checked)}
      hitSlop={4}
      style={styles.checkboxRow}>
      <MaterialIcons name={checked ? 'check-box' : 'check-box-outline-blank'} size={26} color={color} />
      <Text style={[styles.checkboxLabel, labelStyle]}>{label}</Text>
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  color,
  height = 56,
  radius = 12,
  fontSize = 16,
  style,
}: {
  label: string;
  onPress: () => void;
  color: string;
  height?: number;
  radius?: number;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      role="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: color, height, borderRadius: radius, opacity: pressed ? 0.85 : 1 },
        style,
      ]}>
      <Text style={[styles.buttonText, { fontSize }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)' },
  screenContent: { padding: 16, paddingBottom: 32 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginStart: 4,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  checkboxLabel: { flex: 1, fontSize: 14, fontWeight: '700', textTransform: 'uppercase' },
  button: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  buttonText: { color: Colors.white, fontWeight: '700' },
});
