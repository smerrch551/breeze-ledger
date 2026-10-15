import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { categoryOf, noteLabel } from '../game/categories';
import type { Entry } from '../game/types';
import { formatCents, formatTime } from '../utils/format';

type Props = {
  entry: Entry;
  symbol: string;
  onPress: (id: string) => void;
  onLongPress: (id: string) => void;
};

export const ENTRY_ROW_H = 56;

/**
 * One compact data row. Memoised and fed only primitives plus a stable entry
 * reference, so scrolling the list does not re-render untouched rows.
 */
function EntryRow({ entry, symbol, onPress, onLongPress }: Props) {
  const handlePress = useCallback(() => onPress(entry.id), [entry.id, onPress]);
  const handleLongPress = useCallback(() => onLongPress(entry.id), [entry.id, onLongPress]);

  const cat = categoryOf(entry.category);
  const Icon = cat.Icon;
  const note = noteLabel(entry.note);
  const title = entry.note === 'none' ? cat.label : note + ' - ' + cat.label;

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      accessibilityRole="button"
      accessibilityLabel={title + ' ' + symbol + formatCents(entry.amountCents)}
      style={({ pressed }) => [styles.row, pressed ? styles.rowPressed : null]}>
      <View style={[styles.badge, { backgroundColor: cat.accent + '1F' }]}>
        <Icon size={18} color={cat.accent} strokeWidth={1.5} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.time}>{formatTime(entry.ts)}</Text>
      </View>
      <Text style={styles.amount} numberOfLines={1}>
        {symbol + formatCents(entry.amountCents)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    height: ENTRY_ROW_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.hairlineSoft,
    backgroundColor: theme.colors.surface,
  },
  rowPressed: {
    backgroundColor: theme.colors.surfaceAlt,
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  time: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.textFaint,
    marginTop: 3,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
    marginLeft: 10,
  },
});

export default memo(EntryRow);
