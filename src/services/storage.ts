import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

/**
 * Keys mirror the Android SharedPreferences ("user_prefs") names so the data
 * model stays the same across both apps.
 */
export const Keys = {
  setupCompleted: 'setup_completed',
  userName: 'user_name',
  userAge: 'user_age',
  userHeight: 'user_height',
  userWeight: 'user_weight',
  language: 'language',
} as const;

export const dailyKey = (prefix: string, date: string) => `${prefix}_${date}`;

export async function getString(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function setString(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    // Storage failures are non-fatal; the UI keeps its in-memory state.
  }
}

export async function getNumber(key: string, fallback = 0): Promise<number> {
  const raw = await getString(key);
  const n = raw == null ? NaN : Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export async function getBool(key: string): Promise<boolean> {
  return (await getString(key)) === 'true';
}

export const setNumber = (key: string, value: number) => setString(key, String(value));
export const setBool = (key: string, value: boolean) => setString(key, value ? 'true' : 'false');

function useStored<T>(
  key: string,
  initial: T,
  read: (key: string) => Promise<T>,
  write: (key: string, value: T) => Promise<void>,
) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    let active = true;
    setValue(initial);
    read(key).then((v) => active && setValue(v));
    return () => {
      active = false;
    };
    // `initial`, `read` are stable per call site; reload only when the key changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T) => {
      setValue(next);
      write(key, next);
    },
    [key, write],
  );

  return [value, update] as const;
}

export const useStoredBool = (key: string) => useStored(key, false, getBool, setBool);

export const useStoredNumber = (key: string) =>
  useStored(key, 0, (k) => getNumber(k, 0), setNumber);
