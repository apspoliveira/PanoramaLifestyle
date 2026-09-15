import { MaterialIcons } from '@expo/vector-icons';
import * as Network from 'expo-network';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { mealImages, mealVideos } from '@/data/mealImages';
import { recipeById } from '@/data/recipes';
import { useI18n } from '@/i18n';
import { Colors } from '@/theme';
import { useToast } from './Toast';
import { YouTubeEmbed } from './YouTubeEmbed';
import { Card } from './ui';

interface Props {
  recipeId?: string;
  typeLabel: string;
  description: string;
  color: string;
  onOpenRecipe: () => void;
}

/** layout_meal_card.xml: photo header with play button, description and "view recipe". */
export function MealCard({ recipeId, typeLabel, description, color, onOpenRecipe }: Props) {
  const { t } = useI18n();
  const toast = useToast();
  const [playing, setPlaying] = useState(false);
  const recipe = recipeById(recipeId);
  const image = recipeId ? mealImages[recipeId] : undefined;
  const videoId = recipeId ? mealVideos[recipeId] : undefined;

  const play = async () => {
    const state = await Network.getNetworkStateAsync().catch(() => null);
    if (state?.isConnected === false) {
      toast(t('no_internet_short'));
    } else if (videoId) {
      setPlaying(true);
    } else {
      toast(t('video_soon'));
    }
  };

  return (
    <Card padding={0} style={styles.card}>
      {playing && videoId ? (
        <YouTubeEmbed videoId={videoId} height={200} autoplay />
      ) : (
        <View style={styles.header}>
          {image !== undefined && (
            <Image source={image} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
          )}
          <View style={styles.overlay}>
            <Text style={styles.type}>{typeLabel}</Text>
            <Text style={styles.title}>{recipe?.title ?? t('loading')}</Text>
            <Pressable
              role="button"
              aria-label="Play video"
              onPress={play}
              style={({ pressed }) => [styles.fab, { backgroundColor: color, opacity: pressed ? 0.85 : 1 }]}>
              <MaterialIcons name="play-arrow" size={30} color={Colors.white} />
            </Pressable>
          </View>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.description}>{description}</Text>
        <Pressable
          role="button"
          onPress={onOpenRecipe}
          style={({ pressed }) => [styles.recipeButton, { borderColor: color, opacity: pressed ? 0.7 : 1 }]}>
          <MaterialIcons name="restaurant" size={18} color={color} />
          <Text style={[styles.recipeButtonText, { color }]}>{t('nutrition_view_recipe')}</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  header: { height: 200, backgroundColor: Colors.hintCardBg },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.376)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  type: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: { color: Colors.white, fontSize: 22, fontWeight: '700', textAlign: 'center', marginTop: 4 },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.3)',
  },
  body: { padding: 20 },
  description: { color: '#000000', fontSize: 14, opacity: 0.7, lineHeight: 20 },
  recipeButton: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  recipeButtonText: { fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
});
