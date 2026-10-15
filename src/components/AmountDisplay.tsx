import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  display: string;
  symbol: string;
  zero: boolean;
};

/**
 * The hero amount on the entry screen: a small currency glyph, the live
 * tabular number, and a resting amber caret.
 *
 * The caret does NOT blink on a loop — a perpetual animation keeps the window
 * non-idle and uiautomator can then never dump the screen the harness has to
 * tap through.
 */
function AmountDisplay({ display, symbol, zero }: Props) {
  const pop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    pop.setValue(0.94);
    Animated.spring(pop, {
      toValue: 1,
      tension: 220,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [display, pop]);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.root, { transform: [{ scale: pop }] }]}>
      <Text style={styles.symbol}>{symbol}</Text>
      <Text
        style={[styles.value, zero ? styles.valueZero : null]}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {display}
      </Text>
      <View style={styles.caret} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
    marginRight: 6,
    marginBottom: 10,
  },
  value: {
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -1.5,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  valueZero: {
    color: theme.colors.textFaint,
  },
  caret: {
    width: 2,
    height: 28,
    borderRadius: 1,
    backgroundColor: theme.colors.accent,
    marginLeft: 6,
    marginBottom: 4,
  },
});

export default memo(AmountDisplay);
