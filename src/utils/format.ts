import type { CurrencyId } from '../game/types';

const SYMBOLS: Record<CurrencyId, string> = {
  USD: '$',
  EUR: 'E',
  GBP: 'L',
};

/** Hermes on this stack ships an incomplete Intl — group thousands by hand. */
export function groupThousands(whole: string): string {
  let out = '';
  let count = 0;
  for (let i = whole.length - 1; i >= 0; i--) {
    out = whole[i] + out;
    count++;
    if (count % 3 === 0 && i > 0) {
      out = ',' + out;
    }
  }
  return out;
}

export function currencySymbol(currency: CurrencyId): string {
  return SYMBOLS[currency] || '$';
}

/** 123456 -> "1,234.56" (no symbol; the symbol is a separate <Text>). */
export function formatCents(cents: number): string {
  const safe = Math.max(0, Math.round(cents || 0));
  const whole = Math.floor(safe / 100).toString();
  const frac = (safe % 100).toString().padStart(2, '0');
  return groupThousands(whole) + '.' + frac;
}

/** 123456 -> "$1,234.56" for inline single-run labels. */
export function formatMoney(cents: number, currency: CurrencyId = 'USD'): string {
  return currencySymbol(currency) + formatCents(cents);
}

const DAYS_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

/** 1760400000000 -> "MON 14 OCT" (ASCII only, no locale lookup). */
export function formatDate(ts: number): string {
  const d = new Date(ts);
  return (
    DAYS_SHORT[d.getDay()] +
    ' ' +
    d.getDate().toString().padStart(2, '0') +
    ' ' +
    MONTHS_SHORT[d.getMonth()]
  );
}

/** 1760400000000 -> "14:05" */
export function formatTime(ts: number): string {
  const d = new Date(ts);
  return (
    d.getHours().toString().padStart(2, '0') +
    ':' +
    d.getMinutes().toString().padStart(2, '0')
  );
}

/** Weekday initials for the spark row, ordered by the week-start setting. */
export function weekdayInitials(weekStartsOn: 0 | 1): string[] {
  const base = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    out.push(base[(i + weekStartsOn) % 7]);
  }
  return out;
}

export function weekdayLabels(weekStartsOn: 0 | 1): string[] {
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    out.push(DAYS_SHORT[(i + weekStartsOn) % 7]);
  }
  return out;
}

/** Percent of a total, clamped to 0..100 and rounded. */
export function percentOf(part: number, total: number): number {
  if (!total || total <= 0) {
    return 0;
  }
  const pct = Math.round((part / total) * 100);
  return Math.max(0, Math.min(100, pct));
}
