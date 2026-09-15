import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { YouTubeEmbed } from './YouTubeEmbed';

/**
 * Shows the video thumbnail and only mounts the (heavy) player once tapped,
 * so screens with several videos stay responsive.
 */
export function LazyYouTube({ videoId, height = 200 }: { videoId: string; height?: number }) {
  const [playing, setPlaying] = useState(false);

  if (playing) return <YouTubeEmbed videoId={videoId} height={height} autoplay />;

  return (
    <Pressable role="button" aria-label="Play video" onPress={() => setPlaying(true)} style={[styles.frame, { height }]}>
      <Image
        source={{ uri: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.overlay}>
        <View style={styles.play}>
          <MaterialIcons name="play-arrow" size={34} color="#FFFFFF" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  frame: { backgroundColor: '#000000', borderRadius: 16, overflow: 'hidden' },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  play: {
    width: 68,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
