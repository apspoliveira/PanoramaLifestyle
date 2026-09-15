/** Parses a non-negative decimal, accepting "," or "." as separator; NaN when invalid. */
export const parseDecimal = (value: string) =>
  /^\d+([.,]\d+)?$/.test(value) ? Number(value.replace(',', '.')) : NaN;

/** Parses a non-negative integer; NaN when invalid. */
export const parseInteger = (value: string) => (/^\d+$/.test(value) ? Number(value) : NaN);
