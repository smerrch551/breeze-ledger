import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { weekdayInitials } from '../utils/format';

type Props = {
  slots: number[];
  todaySlot: number;
  weekStartsOn: 0 | 1;
};

const BAR_W = 10;
const BAR_MAX = 64;
const BAR_MIN = 12;

/**
 * Seven vertical bars, one per weekday.
 *
 * Heights are laid out statically and the entrance is a transform/opacity
 * stagger — animating `height` would be a JS-driven tween that repaints every
 * frame and keeps the window from going idle.
 */
function SparkWeek({ slots, todaySlot, weekStartsOn }: Props) {
  const rise = useRef(new Animated.Value(0)).current;
  const initials = weekdayInitials(weekStartsOn);

  useEffect(() => {
    rise.setValue(0);
    Animated.timing(rise, {
      toValue: 1,
      duration: 420,
      delay: 120,
      useNativeDriver: true,
    }).start();
  }, [rise]);

  let peak = 0;
  for (const v of slots) {
    if (v > peak) {
      peak = v;
    }
  }

  return (
    <View style={styles.row}>
      {slots.map((value, index) => {
        const ratio = peak > 0 ? value / peak : 0;
        const barH = value > 0 ? BAR_MIN + Math.round(ratio * (BAR_MAX - BAR_MIN)) : BAR_MIN;
        const isToday = index === todaySlot;
        const color =
          value <= 0
            ? theme.colors.surfaceSunk
            : isToday
            ? theme.colors.primary
            : theme.colors.secondary;
        return (
          <View key={'d' + index} style={styles.column}>
            <Animated.View
              pointerEvents="box-none"
              style={[
                styles.bar,
                {
                  height: barH,
                  backgroundColor: color,
                  opacity: rise,
                  transform: [
                    {
                      translateY: rise.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Text
              style={[
                styles.day,
                isToday ? { color: theme.colors.primary, fontWeight: '700' } : null,
              ]}>
              {initials[index]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: BAR_MAX + 22,
  },
  column: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 28,
  },
  bar: {
    width: BAR_W,
    borderRadius: BAR_W / 2,
  },
  day: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.textFaint,
    marginTop: 6,
  },
});

export default memo(SparkWeek);
