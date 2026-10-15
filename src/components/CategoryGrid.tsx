import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { CATEGORIES, CategoryDef } from '../game/categories';
import type { CategoryId } from '../game/types';
import { GRID_CELL, GRID_CELL_H, GRID_GAP, GRID_PAD, GRID_W } from '../constants/config';

type Props = {
  value: CategoryId;
  onChange: (id: CategoryId) => void;
};

type CellProps = {
  def: CategoryDef;
  selected: boolean;
  onPress: (id: CategoryId) => void;
};

const Cell = memo(function Cell({ def, selected, onPress }: CellProps) {
  const handlePress = useCallback(() => onPress(def.id), [def.id, onPress]);
  const Icon = def.Icon;
  const tint = selected ? def.accent : theme.colors.textMuted;

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      accessibilityRole="button"
      accessibilityLabel={def.label}
      accessibilityState={{ selected }}
      style={[
        styles.cell,
        selected ? { borderColor: def.accent, backgroundColor: 'rgba(42,157,143,0.10)' } : null,
      ]}>
      <Icon size={22} color={tint} strokeWidth={1.5} />
      <Text style={[styles.label, { color: selected ? theme.colors.text : theme.colors.textMuted }]}>
        {def.label}
      </Text>
    </Pressable>
  );
});

/**
 * Two rows of three. Cell size comes from the frame formula so the grid can
 * never overflow its padded parent (workspace rules #4 and #5).
 */
function CategoryGrid({ value, onChange }: Props) {
  return (
    <View style={styles.grid}>
      {CATEGORIES.map(def => (
        <Cell key={def.id} def={def} selected={def.id === value} onPress={onChange} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: GRID_W,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: GRID_GAP,
    paddingHorizontal: GRID_PAD,
  },
  cell: {
    width: GRID_CELL,
    height: GRID_CELL_H,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    marginTop: 5,
  },
});

export default memo(CategoryGrid);
