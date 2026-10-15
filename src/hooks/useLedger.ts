import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Entry, LedgerStatus, Settings } from '../game/types';
import {
  loadEntries,
  loadSettings,
  makeId,
  resetEntries,
  saveEntries,
  saveSettings,
} from '../game/storage';
import {
  byDay,
  dailyAverage,
  sortDescending,
  todayCount,
  todayIndex,
  todayTotal,
  topCategory,
  weekTotal,
} from '../game/totals';

export type LedgerDraft = {
  amountCents: number;
  category: Entry['category'];
  note: Entry['note'];
};

/**
 * The single owner of ledger state. Screens pull the individual selectors they
 * need instead of subscribing to one fat object, so a keypad tap on New Entry
 * does not re-render the history list.
 */
export function useLedger() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [settings, setSettings] = useState<Settings>({
    currency: 'USD',
    weekStartsOn: 1,
    defaultCategory: 'food',
  });
  const [status, setStatus] = useState<LedgerStatus>('loading');
  const [now, setNow] = useState<number>(() => Date.now());
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const read = useCallback(() => {
    setStatus('loading');
    Promise.all([loadEntries(), loadSettings()])
      .then(([rows, cfg]) => {
        if (!alive.current) {
          return;
        }
        setEntries(rows);
        setSettings(cfg);
        setNow(Date.now());
        setStatus('ready');
      })
      .catch(() => {
        if (alive.current) {
          setStatus('error');
        }
      });
  }, []);

  useEffect(() => {
    read();
  }, [read]);

  const persist = useCallback((next: Entry[]) => {
    setEntries(next);
    setNow(Date.now());
    saveEntries(next).catch(() => {
      /* in-memory store cannot reject; nothing to recover */
    });
  }, []);

  const addEntry = useCallback(
    (draft: LedgerDraft): Entry => {
      const entry: Entry = {
        id: makeId(),
        amountCents: draft.amountCents,
        category: draft.category,
        note: draft.note,
        ts: Date.now(),
      };
      setEntries(prev => {
        const next = prev.concat(entry);
        saveEntries(next).catch(() => {});
        return next;
      });
      setNow(Date.now());
      return entry;
    },
    [],
  );

  const updateEntry = useCallback((id: string, draft: LedgerDraft): void => {
    setEntries(prev => {
      const next = prev.map(e =>
        e.id === id
          ? {
              ...e,
              amountCents: draft.amountCents,
              category: draft.category,
              note: draft.note,
            }
          : e,
      );
      saveEntries(next).catch(() => {});
      return next;
    });
    setNow(Date.now());
  }, []);

  const removeEntry = useCallback((id: string): void => {
    setEntries(prev => {
      const next = prev.filter(e => e.id !== id);
      saveEntries(next).catch(() => {});
      return next;
    });
    setNow(Date.now());
  }, []);

  const resetAll = useCallback(() => {
    resetEntries()
      .then(() => {
        if (alive.current) {
          setEntries([]);
          setNow(Date.now());
        }
      })
      .catch(() => {});
  }, []);

  const changeSettings = useCallback((next: Settings) => {
    setSettings(next);
    saveSettings(next).catch(() => {});
  }, []);

  const weekStartsOn = settings.weekStartsOn;

  const derived = useMemo(() => {
    const slots = byDay(entries, now, weekStartsOn);
    return {
      sorted: sortDescending(entries),
      today: todayTotal(entries, now),
      todayEntries: todayCount(entries, now),
      week: weekTotal(entries, now, weekStartsOn),
      average: dailyAverage(entries, now, weekStartsOn),
      slots,
      todaySlot: todayIndex(now, weekStartsOn),
      top: topCategory(entries, now, weekStartsOn),
    };
  }, [entries, now, weekStartsOn]);

  return {
    status,
    entries,
    settings,
    now,
    ...derived,
    addEntry,
    updateEntry,
    removeEntry,
    resetAll,
    changeSettings,
    retry: read,
  };
}

export type Ledger = ReturnType<typeof useLedger>;
export default useLedger;
