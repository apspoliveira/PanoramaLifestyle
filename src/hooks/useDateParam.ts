import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { today } from '@/utils/dates';

/** The screen's `date` param (dd-MM-yyyy), falling back to today like the Android fragments. */
export function useDateParam(): string {
  const { date } = useLocalSearchParams<{ date?: string }>();
  return typeof date === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(date) ? date : today();
}

/** Picks one option at random, once per mount (the fragments pick their videos in onCreateView). */
export function useRandomPick<T>(options: T[]): T {
  const [value] = useState(() => options[Math.floor(Math.random() * options.length)]);
  return value;
}
