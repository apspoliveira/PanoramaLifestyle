const pad = (n: number) => String(n).padStart(2, '0');

/** Formats a date as dd-MM-yyyy, the key format used by the Android app. */
export function formatDate(date: Date): string {
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}

export function today(): string {
  return formatDate(new Date());
}

/** Parses dd-MM-yyyy; returns today's date for malformed input. */
export function parseDate(value: string | undefined | null): Date {
  const match = value ? /^(\d{2})-(\d{2})-(\d{4})$/.exec(value) : null;
  if (!match) return new Date();
  return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
}

/** dd-MM-yyyy → yyyy-MM-dd (react-native-calendars format). */
export function toIsoDate(value: string): string {
  const d = parseDate(value);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** yyyy-MM-dd → dd-MM-yyyy. */
export function fromIsoDate(value: string): string {
  const [y, m, d] = value.split('-');
  return `${d}-${m}-${y}`;
}
