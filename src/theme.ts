import type { StringKey } from '@/i18n/strings';

export const Colors = {
  white: '#FFFFFF',
  black: '#000000',
  darkNavyBg: '#0F1424',
  hintCardBg: '#1E273E',
  textHigh: '#E0E6ED',
  textMiddle: '#8A96A8',
  textLow: '#5C6B82',
  proMaxCardBg: '#F8F4F8',
  accentTeal: '#4DB6AC',
  nutrition: '#9C27B0',
  workout: '#1565C0',
  water: '#03A9F4',
  sun: '#8BC34A',
  temperance: '#FFB300',
  air: '#F4511E',
  rest: '#E53935',
  trust: '#D81B60',
  settings: '#607D8B',
  talks: '#00796B',
  home: '#98A784',
};

export type IconSpec =
  | { family: 'material'; name: string }
  | { family: 'community'; name: string };

export type SectionId =
  | 'nutrition'
  | 'workout'
  | 'water'
  | 'sun'
  | 'temperance'
  | 'air'
  | 'rest'
  | 'trust'
  | 'talks'
  | 'settings'
  | 'home';

export interface Section {
  id: SectionId;
  labelKey: StringKey;
  color: string;
  icon: IconSpec;
}

/** Ordered like Activity_Main's fragmentID (0 = nutrition … 7 = trust), then the talks hub and settings. */
export const SECTIONS: Section[] = [
  { id: 'nutrition', labelKey: 'nav_meal', color: Colors.nutrition, icon: { family: 'material', name: 'restaurant' } },
  { id: 'workout', labelKey: 'nav_exercise', color: Colors.workout, icon: { family: 'community', name: 'dumbbell' } },
  { id: 'water', labelKey: 'nav_water', color: Colors.water, icon: { family: 'material', name: 'water-drop' } },
  { id: 'sun', labelKey: 'nav_sun', color: Colors.sun, icon: { family: 'material', name: 'wb-sunny' } },
  { id: 'temperance', labelKey: 'nav_temperance', color: Colors.temperance, icon: { family: 'material', name: 'balance' } },
  { id: 'air', labelKey: 'nav_air', color: Colors.air, icon: { family: 'material', name: 'air' } },
  { id: 'rest', labelKey: 'nav_rest', color: Colors.rest, icon: { family: 'material', name: 'bedtime' } },
  { id: 'trust', labelKey: 'nav_trust', color: Colors.trust, icon: { family: 'material', name: 'favorite' } },
  { id: 'talks', labelKey: 'nav_talks', color: Colors.talks, icon: { family: 'material', name: 'chat' } },
  { id: 'settings', labelKey: 'nav_settings', color: Colors.settings, icon: { family: 'material', name: 'settings' } },
  { id: 'home', labelKey: 'nav_home', color: Colors.home, icon: { family: 'material', name: 'home' } },
];

/** Sections listed in the drawer; the remaining pillars are reached through the talks screen. */
export const DRAWER_SECTIONS: SectionId[] = ['home', 'nutrition', 'workout', 'talks'];

export const sectionById =(id: SectionId) => SECTIONS.find((s) => s.id === id)!;

export const sectionByIndex = (index: number) => SECTIONS[index] ?? SECTIONS[0];
