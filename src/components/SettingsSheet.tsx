import React, { memo, useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { CTA_W, SCREEN_H } from '../constants/config';
import { CATEGORIES } from '../game/categories';
import type { CategoryId, CurrencyId, Settings } from '../game/types';
import ConfirmInline from './ConfirmInline';
import IconButton from './IconButton';

type Props = {
  visible: boolean;
  settings: Settings;
  onChange: (next: Settings) => void;
  onReset: () => void;
  onClose: () => void;
};

const SHEET_H = Math.round(SCREEN_H * 0.56);
const CURRENCIES: CurrencyId[] = ['USD', 'EUR', 'GBP'];

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

const Chip = memo(function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={[styles.chip, active ? styles.chipActive : null]}>
      <Text style={[styles.chipLabel, active ? styles.chipLabelActive : null]}>
        {label}
      </Text>
    </Pressable>
  );
});

/**
 * Bottom sheet over the home screen. Slides on `translateY` only, so the
 * entrance runs on the native driver.
 */
function SettingsSheet({ visible, settings, onChange, onReset, onClose }: Props) {
  const slide = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) {
      slide.setValue(1);
      return;
    }
    Animated.spring(slide, {
      toValue: 0,
      tension: 55,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [slide, visible]);

  const setCurrency = useCallback(
    (currency: CurrencyId) => onChange({ ...settings, currency }),
    [onChange, settings],
  );
  const setWeekStart = useCallback(
    (weekStartsOn: 0 | 1) => onChange({ ...settings, weekStartsOn }),
    [onChange, settings],
  );
  const setDefaultCategory = useCallback(
    (defaultCategory: CategoryId) => onChange({ ...settings, defaultCategory }),
    [onChange, settings],
  );

  if (!visible) {
    return null;
  }

  const offset = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SHEET_H],
  });

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <Pressable
        style={styles.backdrop}
        accessibilityRole="button"
        accessibilityLabel="CLOSE SETTINGS"
        onPress={onClose}
      />
      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheet, { transform: [{ translateY: offset }] }]}>
        <View style={styles.grab} />
        <View style={styles.headRow}>
          <Text style={styles.heading}>SETTINGS</Text>
          <IconButton Icon={X} onPress={onClose} label="CLOSE" tone="neutral" />
        </View>

        <Text style={styles.section}>CURRENCY</Text>
        <View style={styles.chipRow}>
          {CURRENCIES.map(c => (
            <Chip
              key={c}
              label={c}
              active={settings.currency === c}
              onPress={() => setCurrency(c)}
            />
          ))}
        </View>

        <Text style={styles.section}>WEEK BEGINS</Text>
        <View style={styles.chipRow}>
          <Chip
            label="MON"
            active={settings.weekStartsOn === 1}
            onPress={() => setWeekStart(1)}
          />
          <Chip
            label="SUN"
            active={settings.weekStartsOn === 0}
            onPress={() => setWeekStart(0)}
          />
        </View>

        <Text style={styles.section}>DEFAULT CATEGORY</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map(c => (
            <Chip
              key={c.id}
              label={c.label}
              active={settings.defaultCategory === c.id}
              onPress={() => setDefaultCategory(c.id)}
            />
          ))}
        </View>

        <View style={styles.resetWrap}>
          <ConfirmInline
            label="RESET ALL RECORDS"
            armedLabel="TAP AGAIN TO CONFIRM"
            onConfirm={onReset}
            width={CTA_W}
            tone="danger"
          />
        </View>

        <Text style={styles.footer}>
          OFFLINE - NO ACCOUNTS - NO BANK LINKS - NOT FINANCIAL ADVICE
        </Text>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,43,39,0.42)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SHEET_H,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: theme.colors.hairline,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  grab: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.hairline,
    alignSelf: 'center',
    marginBottom: 10,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  heading: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.4,
    color: theme.colors.text,
  },
  section: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2.4,
    color: theme.colors.textMuted,
    marginTop: 12,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    height: 34,
    minWidth: 60,
    paddingHorizontal: 12,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(42,157,143,0.10)',
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.textMuted,
  },
  chipLabelActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  resetWrap: {
    marginTop: 18,
    alignItems: 'center',
  },
  footer: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: theme.colors.textFaint,
    textAlign: 'center',
    marginTop: 14,
  },
});

export default memo(SettingsSheet);
