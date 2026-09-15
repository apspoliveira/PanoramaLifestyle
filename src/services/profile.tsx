import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { Keys, getBool, getNumber, getString, setBool, setNumber, setString } from './storage';

export interface Profile {
  name: string;
  age: number;
  height: number;
  weight: number;
  setupCompleted: boolean;
}

interface ProfileValue {
  profile: Profile;
  loaded: boolean;
  saveProfile: (changes: Partial<Profile>) => Promise<void>;
}

const EMPTY: Profile = { name: '', age: 0, height: 0, weight: 0, setupCompleted: false };

const ProfileContext = createContext<ProfileValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      getString(Keys.userName),
      getNumber(Keys.userAge),
      getNumber(Keys.userHeight),
      getNumber(Keys.userWeight),
      getBool(Keys.setupCompleted),
    ]).then(([name, age, height, weight, setupCompleted]) => {
      setProfile({ name: name ?? '', age, height, weight, setupCompleted });
      setLoaded(true);
    });
  }, []);

  const saveProfile = useCallback(async (changes: Partial<Profile>) => {
    setProfile((current) => ({ ...current, ...changes }));
    const writes: Promise<void>[] = [];
    if (changes.name !== undefined) writes.push(setString(Keys.userName, changes.name));
    if (changes.age !== undefined) writes.push(setNumber(Keys.userAge, changes.age));
    if (changes.height !== undefined) writes.push(setNumber(Keys.userHeight, changes.height));
    if (changes.weight !== undefined) writes.push(setNumber(Keys.userWeight, changes.weight));
    if (changes.setupCompleted !== undefined) writes.push(setBool(Keys.setupCompleted, changes.setupCompleted));
    await Promise.all(writes);
  }, []);

  const value = useMemo(() => ({ profile, loaded, saveProfile }), [profile, loaded, saveProfile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}
