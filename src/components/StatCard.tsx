import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

export type StatCardProps = {
  value: string;
  label: string;
  accent: string;
  onTeal?: boolean;
};

/**
 * The single stat component, reused on the home screen, the saved-entry screen
 * and the weekly tab — so the three can never drift apart.
 *
 * No raster icon inside: every AI sprite has its own internal aspect ratio, so
 * a row of three of them renders at three visually different sizes whatever
 * resizeMode is used. The semantics are carried by the accent dot colour, the
 * big tabular number and the caption (workspace rule #21).
 *
 * `width: '100%'` and NOT `flex: 1` — the parent slot already owns the flex,
 * and flex inside flex collapses the card to ~0 px tall (rule #19a).
 */
function StatCard({ value, label, accent, onTeal = false }: StatCardProps) {
  return (
    <View
      style={[
        styles.card,
        onTeal ? styles.cardOnTeal : styles.cardLight,
        onTeal ? null : theme.shadows.card,
      ]}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text
        style={[styles.value, { color: onTeal ? theme.colors.onDark : theme.colors.text }]}
        numberOfLines={1}>
        {value}
      </Text>
      <Text
        style={[
          styles.label,
          { color: onTeal ? 'rgba(255,255,255,0.7)' : theme.colors.textMuted },
        ]}
        numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
  },
  cardLight: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.hairline,
  },
  cardOnTeal: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.18)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.2,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2.2,
    marginTop: 4,
  },
});

export default memo(StatCard);
