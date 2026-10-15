import type { Entry, Settings } from './types';
import { buildSeed } from './seed';

/**
 * Single repository module behind a Promise API.
 *
 * `@react-native-async-storage/async-storage` is not on the factory's allowed
 * dependency list, so the backing store is an in-memory table seeded on first
 * read. Every screen talks to these four functions only — swapping the backend
 * later touches this file and nothing else.
 */

let table: Entry[] | null = null;
let settings: Settings = {
  currency: 'USD',
  weekStartsOn: 1,
  defaultCategory: 'food',
};

/** Simulated I/O latency so the loading state is real, not decorative. */
const IO_DELAY_MS = 260;

function delay<T>(value: T): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), IO_DELAY_MS);
  });
}

export function loadEntries(): Promise<Entry[]> {
  if (table === null) {
    table = buildSeed(Date.now());
  }
  return delay(table.slice());
}

export function saveEntries(next: Entry[]): Promise<Entry[]> {
  table = next.slice();
  return Promise.resolve(table.slice());
}

export function resetEntries(): Promise<Entry[]> {
  table = [];
  return Promise.resolve([]);
}

export function loadSettings(): Promise<Settings> {
  return Promise.resolve({ ...settings });
}

export function saveSettings(next: Settings): Promise<Settings> {
  settings = { ...next };
  return Promise.resolve({ ...settings });
}

/** Collision-free enough for a local ledger, and cheap. */
export function makeId(): string {
  return (
    Date.now().toString(36) + '-' + Math.floor(Math.random() * 1e6).toString(36)
  );
}
