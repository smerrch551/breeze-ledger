import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';
import { formatCents, weekdayLabels } from '../utils/format';
import { CTA_W } from '../constants/config';

type Props = {
  slots: number[];
  maxIndex: number;
  weekStartsOn: 0 | 1;
  symbol: string;
};

const LABEL_W = 38;
const AMOUNT_W = 68;
const CARD_PAD = 16;
const TRACK_W = Math.max(60, CTA_W - 2 * CARD_PAD - 2 - LABEL_W - AMOUNT_W - 16);
const TRACK_H = 10;

/**
 * Seven horizontal bars, one per weekday. Fill widths are laid out, never
 * tweened: a width animation is JS-driven and would repaint for its whole
 * duration.
 */
function WeeklyBars({ slots, maxIndex, weekStartsOn, symbol }: Props) {
  const labels = weekdayLabels(weekStartsOn);
  let peak = 0;
  for (const v of slots) {
    if (v > peak) {
      peak = v;
    }
  }

  return (
    <View style={styles.card}>
      {slots.map((value, index) => {
        const fill = peak > 0 ? Math.round((TRACK_W * value) / peak) : 0;
        const heaviest = index === maxIndex && value > 0;
        return (
          <View key={'w' + index} style={styles.row}>
            <Text style={styles.label}>{labels[index]}</Text>
            <View style={styles.track}>
              {fill > 0 ? (
                <LinearGradient
                  colors={
                    heaviest
                      ? [theme.colors.accent, theme.colors.accentDark]
                      : theme.gradients.fill
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.fill, { width: Math.max(fill, TRACK_H) }]}
                />
              ) : null}
            </View>
            <Text style={styles.amount} numberOfLines={1}>
              {symbol + formatCents(value)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    padding: CARD_PAD,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  label: {
    width: LABEL_W,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
  },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    backgroundColor: theme.colors.surfaceAlt,
    overflow: 'hidden',
    marginRight: 12,
  },
  fill: {
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
  },
  amount: {
    width: AMOUNT_W,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
});

export default memo(WeeklyBars);
