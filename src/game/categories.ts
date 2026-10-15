import {
  Utensils,
  Bus,
  ShoppingBag,
  Home,
  HeartPulse,
  Sparkles,
} from 'lucide-react-native';
import type { CategoryId, NoteId } from './types';
import type { IconComponent } from '../components/iconTypes';

/**
 * The field is `Icon` (a lucide component), never a string glyph: Android's
 * Roboto fallback collapses high-codepoint emoji to one generic shape, so a
 * six-category row would render six identical icons (rule #16).
 */
export type CategoryDef = {
  id: CategoryId;
  label: string;
  accent: string;
  Icon: IconComponent;
};

export const CATEGORIES: CategoryDef[] = [
  { id: 'food', label: 'FOOD', accent: '#2A9D8F', Icon: Utensils },
  { id: 'transport', label: 'TRANSPORT', accent: '#4A90E2', Icon: Bus },
  { id: 'shopping', label: 'SHOPPING', accent: '#E9C46A', Icon: ShoppingBag },
  { id: 'home', label: 'HOME', accent: '#7FA46B', Icon: Home },
  { id: 'health', label: 'HEALTH', accent: '#C8553D', Icon: HeartPulse },
  { id: 'other', label: 'OTHER', accent: '#A8DADC', Icon: Sparkles },
];

const BY_ID: Record<string, CategoryDef> = {};
for (const c of CATEGORIES) {
  BY_ID[c.id] = c;
}

export function categoryOf(id: CategoryId): CategoryDef {
  return BY_ID[id] || CATEGORIES[0];
}

export type NoteDef = { id: NoteId; label: string };

export const NOTES: NoteDef[] = [
  { id: 'none', label: 'NO NOTE' },
  { id: 'lunch', label: 'LUNCH' },
  { id: 'coffee', label: 'COFFEE' },
  { id: 'groceries', label: 'GROCERIES' },
  { id: 'fare', label: 'FARE' },
  { id: 'gift', label: 'GIFT' },
  { id: 'bill', label: 'BILL' },
];

const NOTE_BY_ID: Record<string, NoteDef> = {};
for (const n of NOTES) {
  NOTE_BY_ID[n.id] = n;
}

export function noteLabel(id: NoteId): string {
  const n = NOTE_BY_ID[id];
  return n ? n.label : 'NO NOTE';
}
