import type { CategoryId, Entry } from './types';
import { CATEGORIES } from './categories';

const DAY_MS = 86400000;

export function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** First millisecond of the week containing `ts`, honouring the setting. */
export function startOfWeek(ts: number, weekStartsOn: 0 | 1): number {
  const day = new Date(ts).getDay();
  const delta = (day - weekStartsOn + 7) % 7;
  return startOfDay(ts) - delta * DAY_MS;
}

export function todayTotal(entries: Entry[], now: number): number {
  const from = startOfDay(now);
  const to = from + DAY_MS;
  let sum = 0;
  for (const e of entries) {
    if (e.ts >= from && e.ts < to) {
      sum += e.amountCents;
    }
  }
  return sum;
}

export function todayCount(entries: Entry[], now: number): number {
  const from = startOfDay(now);
  const to = from + DAY_MS;
  let n = 0;
  for (const e of entries) {
    if (e.ts >= from && e.ts < to) {
      n++;
    }
  }
  return n;
}

export function weekTotal(entries: Entry[], now: number, weekStartsOn: 0 | 1): number {
  const from = startOfWeek(now, weekStartsOn);
  const to = from + 7 * DAY_MS;
  let sum = 0;
  for (const e of entries) {
    if (e.ts >= from && e.ts < to) {
      sum += e.amountCents;
    }
  }
  return sum;
}

/** Seven slots, index 0 = the first day of the configured week. */
export function byDay(entries: Entry[], now: number, weekStartsOn: 0 | 1): number[] {
  const from = startOfWeek(now, weekStartsOn);
  const slots = [0, 0, 0, 0, 0, 0, 0];
  for (const e of entries) {
    const idx = Math.floor((startOfDay(e.ts) - from) / DAY_MS);
    if (idx >= 0 && idx < 7) {
      slots[idx] += e.amountCents;
    }
  }
  return slots;
}

export function todayIndex(now: number, weekStartsOn: 0 | 1): number {
  return Math.floor((startOfDay(now) - startOfWeek(now, weekStartsOn)) / DAY_MS);
}

export function dailyAverage(entries: Entry[], now: number, weekStartsOn: 0 | 1): number {
  return Math.round(weekTotal(entries, now, weekStartsOn) / 7);
}

export function maxDayIndex(slots: number[]): number {
  let best = -1;
  let bestVal = 0;
  for (let i = 0; i < slots.length; i++) {
    if (slots[i] > bestVal) {
      bestVal = slots[i];
      best = i;
    }
  }
  return best;
}

/** Heaviest category of the current week, or null when there is no data. */
export function topCategory(
  entries: Entry[],
  now: number,
  weekStartsOn: 0 | 1,
): CategoryId | null {
  const from = startOfWeek(now, weekStartsOn);
  const to = from + 7 * DAY_MS;
  const sums: Record<string, number> = {};
  for (const c of CATEGORIES) {
    sums[c.id] = 0;
  }
  let any = false;
  for (const e of entries) {
    if (e.ts >= from && e.ts < to) {
      sums[e.category] = (sums[e.category] || 0) + e.amountCents;
      any = true;
    }
  }
  if (!any) {
    return null;
  }
  let best: CategoryId = CATEGORIES[0].id;
  for (const c of CATEGORIES) {
    if (sums[c.id] > sums[best]) {
      best = c.id;
    }
  }
  return best;
}

/** Newest first — the order the history list renders in. */
export function sortDescending(entries: Entry[]): Entry[] {
  return entries.slice().sort((a, b) => b.ts - a.ts);
}
