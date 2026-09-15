import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

export interface YouTubeEmbedProps {
  videoId: string;
  height?: number;
  autoplay?: boolean;
}

export function YouTubeEmbed({ videoId, height = 200, autoplay = false }: YouTubeEmbedProps) {
  const [width, setWidth] = useState(0);

  return (
    <View style={[styles.frame, { height }]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <YoutubePlayer
          height={height}
          width={width}
          videoId={videoId}
          play={autoplay}
          webViewProps={{ allowsInlineMediaPlayback: true, mediaPlaybackRequiresUserAction: false }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { backgroundColor: '#000000', borderRadius: 16, overflow: 'hidden' },
});
