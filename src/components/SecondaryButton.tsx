import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { BTN_ICON, SECONDARY_H, SECONDARY_W } from '../constants/config';
import { usePressScale } from '../hooks/usePressScale';
import type { IconComponent } from './iconTypes';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  tone?: 'surface' | 'tint' | 'onDark';
  width?: number;
};

/**
 * Height 48 companion to PrimaryButton. Same icon size (24) and the same
 * lineHeight / gap pairing, so Primary and Secondary never drift apart
 * visually inside one screen.
 */
function SecondaryButton({
  label,
  onPress,
  Icon,
  tone = 'surface',
  width = SECONDARY_W,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);

  const bg =
    tone === 'tint'
      ? 'rgba(42,157,143,0.08)'
      : tone === 'onDark'
      ? 'rgba(255,255,255,0.10)'
      : theme.colors.surface;
  const border =
    tone === 'tint'
      ? 'rgba(42,157,143,0.22)'
      : tone === 'onDark'
      ? 'rgba(255,255,255,0.22)'
      : theme.colors.hairline;
  const fg = tone === 'onDark' ? theme.colors.onDark : theme.colors.primary;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.hit, { width }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.shell,
          { width, backgroundColor: bg, borderColor: border, transform: [{ scale }] },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={BTN_ICON} color={fg} strokeWidth={1.5} /> : null}
          <Text style={[styles.label, { color: fg }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    height: SECONDARY_H,
  },
  shell: {
    height: SECONDARY_H,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: BTN_ICON,
  },
});

export default memo(SecondaryButton);
