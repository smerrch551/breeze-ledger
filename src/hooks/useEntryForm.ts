import { useCallback, useMemo, useState } from 'react';
import type { CategoryId, NoteId } from '../game/types';
import { MAX_DECIMALS, MAX_INT_DIGITS } from '../constants/config';

export type FormError = '' | 'zero' | 'cap';

export type EntryFormSeed = {
  amountCents?: number;
  category: CategoryId;
  note?: NoteId;
};

function bufferToCents(buffer: string): number {
  const dot = buffer.indexOf('.');
  const whole = dot < 0 ? buffer : buffer.slice(0, dot);
  const frac = dot < 0 ? '' : buffer.slice(dot + 1);
  const cents = (frac + '00').slice(0, 2);
  return parseInt(whole || '0', 10) * 100 + parseInt(cents, 10);
}

function centsToBuffer(cents: number): string {
  if (!cents) {
    return '0';
  }
  const whole = Math.floor(cents / 100);
  const frac = cents % 100;
  return frac ? whole + '.' + frac.toString().padStart(2, '0') : String(whole);
}

/**
 * The keypad buffer and its validation. Kept as a plain string so the trailing
 * dot a user has just typed survives until the next digit (`12.` renders as
 * `12.` and not `12`).
 */
export function useEntryForm(seed: EntryFormSeed) {
  const [buffer, setBuffer] = useState<string>(() =>
    centsToBuffer(seed.amountCents || 0),
  );
  const [category, setCategory] = useState<CategoryId>(seed.category);
  const [note, setNote] = useState<NoteId>(seed.note || 'none');
  const [error, setError] = useState<FormError>('');

  const pushDigit = useCallback((digit: string) => {
    setError('');
    setBuffer(prev => {
      const dot = prev.indexOf('.');
      if (dot >= 0) {
        if (prev.length - dot - 1 >= MAX_DECIMALS) {
          return prev;
        }
        return prev + digit;
      }
      if (prev === '0') {
        return digit === '0' ? '0' : digit;
      }
      if (prev.length >= MAX_INT_DIGITS) {
        setError('cap');
        return prev;
      }
      return prev + digit;
    });
  }, []);

  const pushDot = useCallback(() => {
    setError('');
    setBuffer(prev => (prev.indexOf('.') >= 0 ? prev : prev + '.'));
  }, []);

  const backspace = useCallback(() => {
    setError('');
    setBuffer(prev => {
      const next = prev.slice(0, -1);
      return next.length ? next : '0';
    });
  }, []);

  const clear = useCallback(() => {
    setError('');
    setBuffer('0');
  }, []);

  const amountCents = useMemo(() => bufferToCents(buffer), [buffer]);
  const valid = amountCents > 0;

  const display = useMemo(() => {
    const dot = buffer.indexOf('.');
    if (dot < 0) {
      return buffer + '.00';
    }
    const frac = buffer.slice(dot + 1);
    return buffer.slice(0, dot) + '.' + (frac + '00').slice(0, 2);
  }, [buffer]);

  const flagZero = useCallback(() => setError('zero'), []);

  return {
    buffer,
    display,
    amountCents,
    valid,
    error,
    category,
    note,
    setCategory,
    setNote,
    pushDigit,
    pushDot,
    backspace,
    clear,
    flagZero,
  };
}

export default useEntryForm;
