import type { CategoryId, Entry, NoteId } from './types';

const DAY_MS = 86400000;

type SeedSpec = {
  daysAgo: number;
  hour: number;
  minute: number;
  amountCents: number;
  category: CategoryId;
  note: NoteId;
};

/**
 * Eleven demo records spread over this week and the previous one, so Today,
 * History and the weekly overview are never empty on a fresh install.
 * Built as a function, never a module-top computation (ANR-at-launch risk).
 */
const SPECS: SeedSpec[] = [
  { daysAgo: 0, hour: 8, minute: 15, amountCents: 420, category: 'food', note: 'coffee' },
  { daysAgo: 0, hour: 12, minute: 40, amountCents: 1240, category: 'food', note: 'lunch' },
  { daysAgo: 0, hour: 14, minute: 5, amountCents: 260, category: 'transport', note: 'fare' },
  { daysAgo: 0, hour: 17, minute: 30, amountCents: 1860, category: 'shopping', note: 'gift' },
  { daysAgo: 0, hour: 19, minute: 10, amountCents: 500, category: 'other', note: 'none' },
  { daysAgo: 1, hour: 9, minute: 20, amountCents: 3250, category: 'home', note: 'bill' },
  { daysAgo: 1, hour: 18, minute: 45, amountCents: 2410, category: 'food', note: 'groceries' },
  { daysAgo: 2, hour: 11, minute: 0, amountCents: 1580, category: 'health', note: 'none' },
  { daysAgo: 3, hour: 13, minute: 25, amountCents: 2090, category: 'food', note: 'lunch' },
  { daysAgo: 4, hour: 8, minute: 50, amountCents: 740, category: 'transport', note: 'fare' },
  { daysAgo: 5, hour: 16, minute: 35, amountCents: 3110, category: 'shopping', note: 'none' },
];

export function buildSeed(now: number): Entry[] {
  const out: Entry[] = [];
  for (let i = 0; i < SPECS.length; i++) {
    const s = SPECS[i];
    const base = new Date(now - s.daysAgo * DAY_MS);
    base.setHours(s.hour, s.minute, 0, 0);
    out.push({
      id: 'seed-' + i.toString(36) + '-' + base.getTime().toString(36),
      amountCents: s.amountCents,
      category: s.category,
      note: s.note,
      ts: base.getTime(),
    });
  }
  return out;
}
