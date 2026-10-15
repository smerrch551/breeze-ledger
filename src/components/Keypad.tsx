import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Delete } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { KEY_COLS, KEY_GAP, KEY_H, KEY_W, KEYPAD_W } from '../constants/config';

type Props = {
  onDigit: (digit: string) => void;
  onDot: () => void;
  onBackspace: () => void;
};

type KeyDef = { id: string; kind: 'digit' | 'dot' | 'back' };

const KEYS: KeyDef[] = [
  { id: '1', kind: 'digit' },
  { id: '2', kind: 'digit' },
  { id: '3', kind: 'digit' },
  { id: '4', kind: 'digit' },
  { id: '5', kind: 'digit' },
  { id: '6', kind: 'digit' },
  { id: '7', kind: 'digit' },
  { id: '8', kind: 'digit' },
  { id: '9', kind: 'digit' },
  { id: '.', kind: 'dot' },
  { id: '0', kind: 'digit' },
  { id: 'back', kind: 'back' },
];

type KeyProps = {
  def: KeyDef;
  onPress: (def: KeyDef) => void;
};

/**
 * One key. Press feedback is the Pressable's own `pressed` state rather than a
 * spring, so the keypad posts no animation frames at all while the capture
 * harness is dumping the view tree.
 */
const Key = memo(function Key({ def, onPress }: KeyProps) {
  const handlePress = useCallback(() => onPress(def), [def, onPress]);
  const label = def.kind === 'back' ? 'BACKSPACE' : def.id;

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.key, pressed ? styles.keyPressed : null]}>
      {def.kind === 'back' ? (
        <Delete size={22} color={theme.colors.textMuted} strokeWidth={1.5} />
      ) : (
        <Text style={styles.digit}>{def.id}</Text>
      )}
    </Pressable>
  );
});

function Keypad({ onDigit, onDot, onBackspace }: Props) {
  const handleKey = useCallback(
    (def: KeyDef) => {
      if (def.kind === 'digit') {
        onDigit(def.id);
      } else if (def.kind === 'dot') {
        onDot();
      } else {
        onBackspace();
      }
    },
    [onBackspace, onDigit, onDot],
  );

  return (
    <View style={styles.pad}>
      {KEYS.map(def => (
        <Key key={def.id} def={def} onPress={handleKey} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    width: KEYPAD_W,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: KEY_GAP,
    alignSelf: 'center',
  },
  key: {
    width: KEY_W,
    height: KEY_H,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.hairlineSoft,
    backgroundColor: theme.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: {
    backgroundColor: 'rgba(42,157,143,0.12)',
    borderColor: theme.colors.primary,
  },
  digit: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    lineHeight: 26,
  },
});

export default memo(Keypad);

export const KEYPAD_COLUMNS = KEY_COLS;
