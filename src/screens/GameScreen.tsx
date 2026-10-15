import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Check, ChevronLeft } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { CTA_W, GUTTER } from '../constants/config';
import ScreenShell from '../components/ScreenShell';
import ScreenHeader from '../components/ScreenHeader';
import IconButton from '../components/IconButton';
import PrimaryButton from '../components/PrimaryButton';
import AmountDisplay from '../components/AmountDisplay';
import CategoryGrid from '../components/CategoryGrid';
import NoteChips from '../components/NoteChips';
import Keypad from '../components/Keypad';
import { useEntryForm } from '../hooks/useEntryForm';
import { currencySymbol, formatCents } from '../utils/format';
import { bgGame } from '../assets';
import type { CategoryId, Entry, NoteId, Settings } from '../game/types';

export type EntryDraft = {
  amountCents: number;
  category: CategoryId;
  note: NoteId;
};

type Props = {
  settings: Settings;
  today: number;
  week: number;
  todayEntries: number;
  /** Present when the screen was opened from a record, absent for a new one. */
  editing: Entry | null;
  onSubmit: (draft: EntryDraft) => void;
  onBack: () => void;
};

const ERROR_TEXT: Record<string, string> = {
  zero: 'AMOUNT MUST BE ABOVE 0.00',
  cap: 'MAX 99999.99',
};

/**
 * "New Entry" — the core workflow, in the split-panel layout: the amount
 * canvas on top, a thin totals strip, then the keypad and the commit button
 * on a raised surface.
 *
 * There is no TextInput anywhere: the soft keyboard would cover the lower half
 * of the screen, and a one-tap note is faster than typing anyway.
 */
function GameScreen({
  settings,
  today,
  week,
  todayEntries,
  editing,
  onSubmit,
  onBack,
}: Props) {
  const form = useEntryForm({
    amountCents: editing ? editing.amountCents : 0,
    category: editing ? editing.category : settings.defaultCategory,
    note: editing ? editing.note : 'none',
  });

  const shake = useRef(new Animated.Value(0)).current;
  const symbol = currencySymbol(settings.currency);

  const { valid, amountCents, category, note, flagZero } = form;

  useEffect(() => {
    return () => {
      shake.stopAnimation();
    };
  }, [shake]);

  const handleSubmit = useCallback(() => {
    if (!valid) {
      flagZero();
      Animated.sequence([
        Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 4, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
      return;
    }
    onSubmit({ amountCents, category, note });
  }, [amountCents, category, flagZero, note, onSubmit, shake, valid]);

  const message = form.error ? ERROR_TEXT[form.error] : '';

  return (
    <ScreenShell variant="light" source={bgGame}>
      <ScreenHeader
        title={editing ? 'EDIT ENTRY' : 'NEW ENTRY'}
        left={
          <IconButton
            Icon={ChevronLeft}
            onPress={onBack}
            label="BACK"
            tone="neutral"
          />
        }
        right={
          <View style={styles.pill}>
            <Text style={styles.pillText}>TODAY</Text>
          </View>
        }
      />

      <View style={styles.canvas}>
        <View style={styles.amountSlot}>
          <AmountDisplay display={form.display} symbol={symbol} zero={!valid} />
        </View>

        <View style={styles.validation}>
          {message ? <Text style={styles.validationText}>{message}</Text> : null}
        </View>

        <View style={styles.grid}>
          <CategoryGrid value={category} onChange={form.setCategory} />
        </View>

        <View style={styles.chips}>
          <NoteChips value={note} onChange={form.setNote} />
        </View>
      </View>

      <View style={styles.strip}>
        <View style={styles.stripSlot}>
          <Text style={styles.stripLabel}>TODAY</Text>
          <Text style={styles.stripValue}>{symbol + formatCents(today)}</Text>
        </View>
        <View style={styles.stripDivider} />
        <View style={styles.stripSlot}>
          <Text style={styles.stripLabel}>WEEK</Text>
          <Text style={styles.stripValue}>{symbol + formatCents(week)}</Text>
        </View>
        <View style={styles.stripDivider} />
        <View style={styles.stripSlot}>
          <Text style={styles.stripLabel}>ENTRIES</Text>
          <Text style={styles.stripValue}>{String(todayEntries)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Keypad
          onDigit={form.pushDigit}
          onDot={form.pushDot}
          onBackspace={form.backspace}
        />
        <View style={styles.ctaWrap}>
          <PrimaryButton
            label={editing ? 'SAVE CHANGES' : 'SAVE ENTRY'}
            onPress={handleSubmit}
            Icon={Check}
            disabled={!valid}
            shake={shake}
          />
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  pill: {
    width: 68,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.2)',
    backgroundColor: 'rgba(42,157,143,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.primary,
  },
  canvas: {
    flex: 1,
    paddingHorizontal: GUTTER,
  },
  amountSlot: {
    height: 64,
    marginTop: 10,
    justifyContent: 'center',
  },
  validation: {
    height: 18,
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validationText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.danger,
  },
  grid: {
    marginTop: 12,
  },
  chips: {
    marginTop: 12,
  },
  strip: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(42,157,143,0.06)',
    borderTopWidth: 1,
    borderTopColor: theme.colors.hairline,
  },
  stripSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.hairline,
  },
  stripLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.8,
    color: theme.colors.textMuted,
  },
  stripValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  controls: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.hairline,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 44,
    alignItems: 'center',
    shadowColor: '#1F4A42',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  ctaWrap: {
    width: CTA_W,
    marginTop: 12,
    alignItems: 'center',
  },
});

export default memo(GameScreen);
