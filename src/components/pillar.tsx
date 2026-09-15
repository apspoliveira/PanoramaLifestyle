import { MaterialIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/theme';
import { LazyYouTube } from './LazyYouTube';
import { Card } from './ui';

/** Big number with −/+ buttons (Fragment_Water glasses, Fragment_Sun minutes). */
export function CounterCard({
  color,
  value,
  goal,
  onMinus,
  onPlus,
}: {
  color: string;
  value: string;
  goal: string;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <Card padding={24} style={styles.counter}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <View style={styles.buttons}>
        <Pressable
          role="button"
          aria-label="-"
          onPress={onMinus}
          style={({ pressed }) => [styles.round, styles.outlined, { borderColor: color, opacity: pressed ? 0.7 : 1 }]}>
          <MaterialIcons name="remove" size={30} color={color} />
        </Pressable>
        <Pressable
          role="button"
          aria-label="+"
          onPress={onPlus}
          style={({ pressed }) => [styles.round, { backgroundColor: color, marginStart: 32, opacity: pressed ? 0.85 : 1 }]}>
          <MaterialIcons name="add" size={30} color={Colors.white} />
        </Pressable>
      </View>
      <Text style={styles.goal}>{goal}</Text>
    </Card>
  );
}

/** Card with a header (title or checkbox) above a 200dp YouTube player. */
export function VideoCard({
  header,
  videoId,
  background = Colors.white,
}: {
  header: ReactNode;
  videoId: string;
  background?: string;
}) {
  return (
    <Card color={background} style={styles.videoCard}>
      {header}
      <LazyYouTube videoId={videoId} />
    </Card>
  );
}

const styles = StyleSheet.create({
  counter: { alignItems: 'center', marginBottom: 16 },
  value: { fontSize: 48, fontWeight: '700' },
  buttons: { flexDirection: 'row', marginTop: 24 },
  round: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  outlined: { borderWidth: 1.5 },
  goal: { color: Colors.textLow, fontSize: 12, marginTop: 24 },
  videoCard: { marginBottom: 16 },
});
