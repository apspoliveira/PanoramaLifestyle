import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useI18n } from '@/i18n';
import { Card } from './ui';

const VERSE_URL = 'https://www.abibliadigital.com.br/api/verses/nvi/random';

type VerseState =
  | { status: 'loading' }
  | { status: 'loaded'; text: string; reference: string }
  | { status: 'failed' };

/** "Daily inspiration" card from Fragment_Trust: random NVI verse with a fallback. */
export function BibleVerseCard({ color }: { color: string }) {
  const { t } = useI18n();
  const [verse, setVerse] = useState<VerseState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    fetch(VERSE_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (typeof json?.text !== 'string') throw new Error('Unexpected response');
        setVerse({ status: 'loaded', text: json.text, reference: `${json.book?.name} ${json.chapter}:${json.number}` });
      })
      .catch(() => setVerse({ status: 'failed' }))
      .finally(() => clearTimeout(timeout));

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  let text = t('settings_bible_loading');
  let reference = '';
  if (verse.status === 'loaded') {
    text = t('bible_verse_format', verse.text);
    reference = t('bible_reference_format', verse.reference);
  } else if (verse.status === 'failed') {
    text = t('default_bible_verse');
    reference = t('default_bible_reference');
  }

  return (
    <Card padding={24} style={styles.card}>
      <Text style={[styles.title, { color }]}>{t('settings_bible_title')}</Text>
      <Text style={styles.verse}>{text}</Text>
      {reference !== '' && <Text style={[styles.reference, { color }]}>{reference}</Text>}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 24 },
  title: {
    fontSize: 14,
    fontWeight: '700',
    opacity: 0.7,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  verse: { color: '#000000', fontSize: 18, fontStyle: 'italic', textAlign: 'center', lineHeight: 26 },
  reference: { fontSize: 14, fontWeight: '700', textAlign: 'center', marginTop: 16 },
});
