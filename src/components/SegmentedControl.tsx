import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { CTA_W } from '../constants/config';

type Props = {
  options: [string, string];
  index: number;
  onChange: (index: number) => void;
};

const TRACK_W = CTA_W;
const TRACK_H = 44;
const INSET = 4;
const PILL_W = Math.floor((TRACK_W - INSET * 2) / 2);
const PILL_H = TRACK_H - INSET * 2;

/**
 * Two-way switch. The moving pill is translated, never resized, so the whole
 * animation runs on the native driver.
 */
function SegmentedControl({ options, index, onChange }: Props) {
  const slide = useRef(new Animated.Value(index)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: index,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [index, slide]);

  const selectFirst = useCallback(() => onChange(0), [onChange]);
  const selectSecond = useCallback(() => onChange(1), [onChange]);

  const shift = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, PILL_W],
  });

  return (
    <View style={styles.track}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.pill, { transform: [{ translateX: shift }] }]}
      />
      <Pressable
        onPress={selectFirst}
        accessibilityRole="button"
        accessibilityLabel={options[0]}
        accessibilityState={{ selected: index === 0 }}
        style={styles.half}>
        <Text style={[styles.label, index === 0 ? styles.labelActive : null]}>
          {options[0]}
        </Text>
      </Pressable>
      <Pressable
        onPress={selectSecond}
        accessibilityRole="button"
        accessibilityLabel={options[1]}
        accessibilityState={{ selected: index === 1 }}
        style={styles.half}>
        <Text style={[styles.label, index === 1 ? styles.labelActive : null]}>
          {options[1]}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  pill: {
    position: 'absolute',
    left: INSET,
    top: INSET,
    width: PILL_W,
    height: PILL_H,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
  },
  half: {
    width: PILL_W,
    height: TRACK_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.textMuted,
  },
  labelActive: {
    color: theme.colors.onDark,
  },
});

export default memo(SegmentedControl);
