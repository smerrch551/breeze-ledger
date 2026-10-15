export type CategoryId =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'home'
  | 'health'
  | 'other';

export type NoteId =
  | 'none'
  | 'lunch'
  | 'coffee'
  | 'groceries'
  | 'fare'
  | 'gift'
  | 'bill';

export type CurrencyId = 'USD' | 'EUR' | 'GBP';

/** Money is always integer cents — no float drift in the totals. */
export type Entry = {
  id: string;
  amountCents: number;
  category: CategoryId;
  note: NoteId;
  ts: number;
};

export type Settings = {
  currency: CurrencyId;
  /** 1 = week starts Monday, 0 = week starts Sunday. */
  weekStartsOn: 0 | 1;
  defaultCategory: CategoryId;
};

export type LedgerStatus = 'loading' | 'ready' | 'error';
