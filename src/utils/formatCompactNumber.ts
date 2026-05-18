export type CompactNumberLocale = 'international' | 'indian';

export interface FormatCompactNumberOptions {
  /** `international`: K, M, B — `indian`: K, L, Cr */
  locale?: CompactNumberLocale;
  /** Max digits after decimal for compact form (default 1 → 1100 → 1.1K) */
  maximumFractionDigits?: number;
  /** Only compact when |value| >= this (default 1000) */
  threshold?: number;
}

function trimFraction(s: string): string {
  return s.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

function formatScaled(
  scaled: number,
  maximumFractionDigits: number,
  prefix: string,
  suffix: string
): string {
  const str = trimFraction(scaled.toFixed(maximumFractionDigits));
  return `${prefix}${str}${suffix}`;
}

/**
 * Shortens large numbers for display.
 *
 * International (default): 1000 → 1K, 1100 → 1.1K, 1_500_000 → 1.5M
 * Indian: 100_000 → 1L, 10_000_000 → 1Cr
 */
export function formatCompactNumber(
  value: number,
  options: FormatCompactNumberOptions = {}
): string {
  const {
    locale = 'international',
    maximumFractionDigits = 1,
    threshold = 1000,
  } = options;

  if (!Number.isFinite(value)) return '0';

  const negative = value < 0;
  const abs = Math.abs(value);
  const prefix = negative ? '-' : '';

  if (abs < threshold) {
    if (Number.isInteger(value)) {
      return `${prefix}${Math.round(abs)}`;
    }
    return `${prefix}${trimFraction(abs.toFixed(maximumFractionDigits))}`;
  }

  if (locale === 'indian') {
    if (abs >= 10_000_000) {
      return formatScaled(abs / 10_000_000, maximumFractionDigits, prefix, 'Cr');
    }
    if (abs >= 100_000) {
      return formatScaled(abs / 100_000, maximumFractionDigits, prefix, 'L');
    }
    return formatScaled(abs / 1000, maximumFractionDigits, prefix, 'K');
  }

  if (abs >= 1_000_000_000) {
    return formatScaled(abs / 1_000_000_000, maximumFractionDigits, prefix, 'B');
  }
  if (abs >= 1_000_000) {
    return formatScaled(abs / 1_000_000, maximumFractionDigits, prefix, 'M');
  }
  return formatScaled(abs / 1000, maximumFractionDigits, prefix, 'K');
}
