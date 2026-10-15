import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Check, ChevronLeft, Plus } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { CTA_W, GUTTER } from '../constants/config';
import ScreenShell from '../components/ScreenShell';
import ScreenHeader from '../components/ScreenHeader';
import IconButton from '../components/IconButton';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import StatRow from '../components/StatRow';
import { categoryOf, noteLabel } from '../game/categories';
import { currencySymbol, formatCents } from '../utils/format';
import type { Entry, Settings } from '../game/types';

type Props = {
  entry: Entry;
  settings: Settings;
  today: number;
  todayEntries: number;
  onAgain: () => void;
  onHome: () => void;
};

/**
 * "Entry Saved" — a discrete result screen rather than a toast on the form.
 * It is the inverse of the near-white home canvas, so the two never read as
 * the same screen.
 */
function GameOverScreen({
  entry,
  settings,
  today,
  todayEntries,
  onAgain,
  onHome,
}: Props) {
  const pop = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const symbol = currencySymbol(settings.currency);
  const cat = categoryOf(entry.category);
  const note = noteLabel(entry.note);

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.spring(pop, {
        toValue: 1,
        tension: 48,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(ring, {
        toValue: 1,
        duration: 760,
        useNativeDriver: true,
      }),
    ]);
    anim.start();
    return () => {
      anim.stop();
    };
  }, [pop, ring]);

  const popScale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });
  const ringScale = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] });
  const ringFade = ring.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  const stats = [
    {
      value: symbol + formatCents(today),
      label: 'TODAY NOW',
      accent: theme.colors.accent,
    },
    {
      value: String(todayEntries),
      label: 'ENTRIES',
      accent: theme.colors.secondary,
    },
  ];

  const caption =
    entry.note === 'none' ? cat.label : cat.label + ' - ' + note;

  return (
    <ScreenShell variant="teal">
      <ScreenHeader
        title="RECORD ADDED"
        tone="dark"
        left={
          <IconButton
            Icon={ChevronLeft}
            onPress={onHome}
            label="HOME"
            tone="onDark"
          />
        }
      />

      <View style={styles.body}>
        <View style={styles.markWrap}>
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.ring,
              { opacity: ringFade, transform: [{ scale: ringScale }] },
            ]}
          />
          <Animated.View
            pointerEvents="box-none"
            style={[styles.mark, { transform: [{ scale: popScale }] }]}>
            <Check size={40} color={theme.colors.accent} strokeWidth={1.5} />
          </Animated.View>
        </View>

        <Text style={styles.heading}>ENTRY SAVED</Text>
        <View style={styles.rule} />

        <View style={styles.amountRow}>
          <Text style={styles.amountSymbol}>{symbol}</Text>
          <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>
            {formatCents(entry.amountCents)}
          </Text>
        </View>
        <Text style={styles.caption}>{caption}</Text>

        <View style={styles.stats}>
          <StatRow items={stats} onTeal />
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.hint}>TAP LOG AGAIN TO ADD ANOTHER</Text>
        <PrimaryButton label="LOG AGAIN" onPress={onAgain} Icon={Plus} tone="amber" />
        <View style={styles.secondaryWrap}>
          <SecondaryButton
            label="HOME"
            onPress={onHome}
            tone="onDark"
            width={CTA_W}
          />
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: GUTTER,
  },
  markWrap: {
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  mark: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.26)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2.4,
    color: theme.colors.onDark,
    marginTop: 18,
    textAlign: 'center',
  },
  rule: {
    width: 56,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.accent,
    marginTop: 10,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 22,
  },
  amountSymbol: {
    fontSize: 22,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    marginRight: 4,
    marginBottom: 7,
  },
  amount: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 50,
    color: theme.colors.accent,
    fontVariant: ['tabular-nums'],
  },
  caption: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 8,
  },
  stats: {
    width: CTA_W,
    marginTop: 28,
  },
  bottom: {
    paddingHorizontal: GUTTER,
    paddingBottom: 26,
    alignItems: 'center',
  },
  hint: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 10,
  },
  secondaryWrap: {
    marginTop: 14,
  },
});

export default memo(GameOverScreen);
