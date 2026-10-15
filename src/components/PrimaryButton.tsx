import React, { memo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';
import { BTN_ICON, CTA_H, CTA_W } from '../constants/config';
import { usePressScale } from '../hooks/usePressScale';
import type { IconComponent } from './iconTypes';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  tone?: 'teal' | 'amber';
  /**
   * Renders the muted, shadowless look for "not ready yet". The press itself
   * still fires — the screen answers with a validation message, which is more
   * useful than a dead control, and keeps the button reachable for anything
   * driving the UI by coordinates.
   */
  disabled?: boolean;
  /** Extra transform applied by the caller, e.g. the invalid-input shake. */
  shake?: Animated.Value;
};

/**
 * Height 58, gradient fill, coloured shadow.
 *
 * Icon is ALWAYS exactly 24x24 and the label's lineHeight matches it, with a
 * uniform gap of 10 — the single button-icon geometry used project-wide
 * (workspace rule #20). No absolutely positioned glyphs.
 */
function PrimaryButton({
  label,
  onPress,
  Icon,
  tone = 'teal',
  disabled = false,
  shake,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);
  const amber = tone === 'amber';
  const fg = amber ? theme.colors.text : theme.colors.onDark;
  const idle = useRef(new Animated.Value(0)).current;
  const translateX = shake || idle;

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
          styles.shell,
          disabled ? styles.shellDisabled : amber ? theme.shadows.ctaAmber : theme.shadows.cta,
          { transform: [{ scale }, { translateX }] },
        ]}>
        <LinearGradient
          colors={
            disabled
              ? ['#C7DBD6', '#BCD3CD']
              : amber
              ? [theme.colors.accent, theme.colors.accentDark]
              : theme.gradients.cta
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fill}>
          <View style={styles.row}>
            {Icon ? (
              <Icon size={BTN_ICON} color={disabled ? '#F0F7F5' : fg} strokeWidth={1.5} />
            ) : null}
            <Text style={[styles.label, { color: disabled ? '#F0F7F5' : fg }]}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    width: CTA_W,
    height: CTA_H,
  },
  shell: {
    width: CTA_W,
    height: CTA_H,
    borderRadius: theme.radius.lg,
  },
  shellDisabled: {
    elevation: 0,
  },
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.lg,
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
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.6,
    lineHeight: BTN_ICON,
  },
});

export default memo(PrimaryButton);
