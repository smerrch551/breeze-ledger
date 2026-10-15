import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import type { IconComponent } from './iconTypes';

export type IconButtonTone = 'neutral' | 'primary' | 'danger' | 'onDark';

type Props = {
  Icon: IconComponent;
  onPress: () => void;
  label: string;
  tone?: IconButtonTone;
};

const SIZE = 40;
const GLYPH = 20;

const TONES: Record<IconButtonTone, { bg: string; border: string; color: string }> = {
  neutral: {
    bg: theme.colors.surface,
    border: theme.colors.hairline,
    color: theme.colors.text,
  },
  primary: {
    bg: theme.colors.surface,
    border: theme.colors.hairline,
    color: theme.colors.primary,
  },
  danger: {
    bg: 'rgba(200,85,61,0.08)',
    border: 'rgba(200,85,61,0.3)',
    color: theme.colors.danger,
  },
  onDark: {
    bg: 'rgba(255,255,255,0.12)',
    border: 'rgba(255,255,255,0.24)',
    color: theme.colors.onDark,
  },
};

/**
 * The 40x40 hairline square used for back / settings / reset / close.
 * Pressable is the PARENT, the Animated.View its CHILD, and the wrapper
 * carries pointerEvents="box-none" so it can never swallow the tap.
 */
function IconButton({ Icon, onPress, label, tone = 'neutral' }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.9);
  const palette = TONES[tone];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.hit}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.box,
          {
            backgroundColor: palette.bg,
            borderColor: palette.border,
            transform: [{ scale }],
          },
        ]}>
        <Icon size={GLYPH} color={palette.color} strokeWidth={1.5} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    width: SIZE,
    height: SIZE,
  },
  box: {
    width: SIZE,
    height: SIZE,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(IconButton);
