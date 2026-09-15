import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import type { MaterialIconName } from './ui';

interface Props extends Omit<TextInputProps, 'style'> {
  label: string;
  color: string;
  icon?: MaterialIconName;
  suffix?: string;
  style?: StyleProp<ViewStyle>;
}

/** Material "outlined" text field, as used on the setup and settings screens. */
export function OutlinedInput({ label, color, icon, suffix, style, onFocus, onBlur, ...inputProps }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={style}>
      <Text style={[styles.label, { color: focused ? color : '#49454F' }]}>{label}</Text>
      <View style={[styles.box, { borderColor: focused ? color : '#79747E' }]}>
        {icon && <MaterialIcons name={icon} size={22} color="#49454F" />}
        <TextInput
          {...inputProps}
          aria-label={label}
          placeholderTextColor="#9E9E9E"
          style={[styles.input, Platform.OS === 'web' && ({ outlineStyle: 'none' } as object)]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginStart: 4 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 52,
  },
  input: { flex: 1, fontSize: 16, color: '#1C1B1F', paddingVertical: 12, minWidth: 0 },
  suffix: { fontSize: 16, color: '#49454F' },
});
