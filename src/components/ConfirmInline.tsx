import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';
import { CONFIRM_ARM_MS, SECONDARY_H } from '../constants/config';

type Props = {
  label: string;
  armedLabel: string;
  onConfirm: () => void;
  width: number;
  tone?: 'danger' | 'neutral';
};

/**
 * Two-step destructive confirm. The first tap arms the control for four
 * seconds; only the second tap inside that window commits.
 */
function ConfirmInline({ label, armedLabel, onConfirm, width, tone = 'danger' }: Props) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const handlePress = useCallback(() => {
    if (armed) {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      setArmed(false);
      onConfirm();
      return;
    }
    setArmed(true);
    timer.current = setTimeout(() => {
      setArmed(false);
      timer.current = null;
    }, CONFIRM_ARM_MS);
  }, [armed, onConfirm]);

  const danger = tone === 'danger';

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={armed ? armedLabel : label}
      style={[
        styles.root,
        {
          width,
          backgroundColor: armed
            ? danger
              ? theme.colors.danger
              : theme.colors.primary
            : danger
            ? 'rgba(200,85,61,0.08)'
            : 'rgba(42,157,143,0.08)',
          borderColor: armed
            ? 'transparent'
            : danger
            ? 'rgba(200,85,61,0.3)'
            : 'rgba(42,157,143,0.22)',
        },
      ]}>
      <Text
        style={[
          styles.label,
          {
            color: armed
              ? theme.colors.onDark
              : danger
              ? theme.colors.danger
              : theme.colors.primary,
          },
        ]}
        numberOfLines={1}>
        {armed ? armedLabel : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    height: SECONDARY_H,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
});

export default memo(ConfirmInline);
