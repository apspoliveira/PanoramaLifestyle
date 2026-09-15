import { createElement } from 'react';
import { StyleSheet, View } from 'react-native';

import type { YouTubeEmbedProps } from './YouTubeEmbed';

export function YouTubeEmbed({ videoId, height = 200, autoplay = false }: YouTubeEmbedProps) {
  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?playsinline=1&rel=0${
    autoplay ? '&autoplay=1' : ''
  }`;

  return (
    <View style={[styles.frame, { height }]}>
      {createElement('iframe', {
        src,
        title: 'YouTube video',
        allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen',
        allowFullScreen: true,
        style: { border: 0, width: '100%', height: '100%' },
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { backgroundColor: '#000000', borderRadius: 16, overflow: 'hidden' },
});
