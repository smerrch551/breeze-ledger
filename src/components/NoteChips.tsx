import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { NOTES, NoteDef } from '../game/categories';
import type { NoteId } from '../game/types';

type Props = {
  value: NoteId;
  onChange: (id: NoteId) => void;
};

type ChipProps = {
  def: NoteDef;
  active: boolean;
  onPress: (id: NoteId) => void;
};

const Chip = memo(function Chip({ def, active, onPress }: ChipProps) {
  const handlePress = useCallback(() => onPress(def.id), [def.id, onPress]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      accessibilityRole="button"
      accessibilityLabel={def.label}
      accessibilityState={{ selected: active }}
      style={[styles.chip, active ? styles.chipActive : null]}>
      <Text style={[styles.label, active ? styles.labelActive : null]}>{def.label}</Text>
    </Pressable>
  );
});

/** One-tap notes. Tapping the active chip clears it back to NO NOTE. */
function NoteChips({ value, onChange }: Props) {
  const handlePress = useCallback(
    (id: NoteId) => onChange(id === value ? 'none' : id),
    [onChange, value],
  );

  return (
    <View style={styles.wrap}>
      {NOTES.map(def => (
        <Chip key={def.id} def={def} active={def.id === value} onPress={handlePress} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    height: 34,
    minWidth: 64,
    paddingHorizontal: 14,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accentDark,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.textMuted,
  },
  labelActive: {
    color: theme.colors.text,
    fontWeight: '700',
  },
});

export default memo(NoteChips);
