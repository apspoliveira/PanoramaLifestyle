import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { Keys, getString, setString } from '@/services/storage';
import { en, pt, type StringKey } from './strings';

export type Language = 'pt' | 'en';
export type Translate = (key: StringKey, ...args: (string | number)[]) => string;

const tables: Record<Language, Record<StringKey, string>> = { pt, en };

/** Expands Android-style format strings: %s, %d, %1$s, %2$d … */
export function formatString(template: string, args: (string | number)[]): string {
  let next = 0;
  return template.replace(/%(?:(\d+)\$)?([sd])/g, (_match, position: string | undefined, type: string) => {
    const value = args[position ? Number(position) - 1 : next++];
    if (value === undefined) return '';
    return type === 'd' ? String(Math.trunc(Number(value))) : String(value);
  });
}

export function translate(language: Language, key: StringKey, ...args: (string | number)[]): string {
  return formatString(tables[language][key] ?? pt[key] ?? key, args);
}

interface I18nValue {
  language: Language;
  ready: boolean;
  setLanguage: (language: Language) => Promise<void>;
  t: Translate;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // The Android app defaults to Portuguese.
  const [language, setLanguageState] = useState<Language>('pt');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getString(Keys.language).then((stored) => {
      if (stored === 'pt' || stored === 'en') setLanguageState(stored);
      setReady(true);
    });
  }, []);

  const setLanguage = useCallback(async (next: Language) => {
    setLanguageState(next);
    await setString(Keys.language, next);
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      language,
      ready,
      setLanguage,
      t: (key, ...args) => translate(language, key, ...args),
    }),
    [language, ready, setLanguage],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
