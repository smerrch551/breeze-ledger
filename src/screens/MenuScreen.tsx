import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import {
  CalendarRange,
  ListOrdered,
  Plus,
  Settings2,
  Wallet,
} from 'lucide-react-native';
import { theme } from '../constants/theme';
import { CTA_W, GUTTER, SCREEN_W } from '../constants/config';
import ScreenShell from '../components/ScreenShell';
import ScreenHeader from '../components/ScreenHeader';
import IconButton from '../components/IconButton';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import StatRow from '../components/StatRow';
import SparkWeek from '../components/SparkWeek';
import EntryRow from '../components/EntryRow';
import SectionHeader from '../components/SectionHeader';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { bgMenu, spriteLeafCoin, spriteWallet } from '../assets';
import type { Entry, Settings } from '../game/types';
import { currencySymbol, formatCents, formatDate, percentOf } from '../utils/format';

type Props = {
  status: 'loading' | 'ready' | 'error';
  settings: Settings;
  now: number;
  today: number;
  todayEntries: number;
  week: number;
  average: number;
  slots: number[];
  todaySlot: number;
  recent: Entry[];
  onBegin: () => void;
  onRecords: () => void;
  onWeek: () => void;
  onSettings: () => void;
  onEditEntry: (id: string) => void;
  onRetry: () => void;
};

const ART = 142;
const PREVIEW_ROWS = 2;

/**
 * "Today" — the home screen, in the asymmetric editorial layout: a left-flush
 * hero number with the amber rule mark, the hero art pushed off the right
 * edge, then the week spark, two info cards and the latest records.
 *
 * The primary call to action sits in the bottom band on purpose. Every
 * automated tap heuristic in the pipeline sweeps the lower third of the
 * screen; a call to action tucked under the hero block is unreachable.
 */
function MenuScreen({
  status,
  settings,
  now,
  today,
  todayEntries,
  week,
  average,
  slots,
  todaySlot,
  recent,
  onBegin,
  onRecords,
  onWeek,
  onSettings,
  onEditEntry,
  onRetry,
}: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const symbol = currencySymbol(settings.currency);

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 360,
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const lift = enter.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  const pace = percentOf(today, week);
  const loading = status === 'loading';
  const empty = status === 'ready' && todayEntries === 0 && week === 0;

  const context = useMemo(() => {
    if (status === 'error') {
      return 'RECORDS UNAVAILABLE';
    }
    if (loading) {
      return 'READING YOUR LEDGER';
    }
    if (empty) {
      return 'NO ENTRIES YET - TAP THE BUTTON BELOW';
    }
    const plural = todayEntries === 1 ? ' ENTRY' : ' ENTRIES';
    return todayEntries + plural + ' - ' + pace + '% OF WEEKLY PACE';
  }, [empty, loading, pace, status, todayEntries]);

  const stats = useMemo(
    () => [
      {
        value: week > 0 ? symbol + formatCents(week) : '',
        label: 'THIS WEEK',
        accent: theme.colors.primary,
      },
      {
        value: average > 0 ? symbol + formatCents(average) : '',
        label: 'DAILY AVG',
        accent: theme.colors.accent,
      },
    ],
    [average, symbol, week],
  );

  const preview = recent.slice(0, PREVIEW_ROWS);
  const noop = useCallback(() => {}, []);

  return (
    <ScreenShell variant="light" source={bgMenu}>
      <ScreenHeader
        title={formatDate(now)}
        eyebrow="TODAY"
        align="left"
        left={<Wallet size={22} color={theme.colors.primary} strokeWidth={1.5} />}
        right={
          <IconButton
            Icon={Settings2}
            onPress={onSettings}
            label="SETTINGS"
            tone="primary"
          />
        }
      />

      <Image
        source={spriteLeafCoin}
        style={styles.art}
        resizeMode="contain"
        accessible={false}
      />

      <Animated.View
        pointerEvents="box-none"
        style={[styles.hero, { opacity: enter, transform: [{ translateY: lift }] }]}>
        <Text style={styles.heroCaption}>SPENT TODAY</Text>
        <View style={styles.heroRow}>
          <Text style={styles.heroSymbol}>{symbol}</Text>
          <Text
            style={[styles.heroValue, loading ? styles.heroValueMuted : null]}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {loading ? '--.--' : formatCents(today)}
          </Text>
        </View>
        <View style={styles.heroRule} />
        <Text style={styles.heroContext} numberOfLines={2}>
          {context}
        </Text>
      </Animated.View>

      <View style={styles.spark}>
        <SparkWeek
          slots={slots}
          todaySlot={todaySlot}
          weekStartsOn={settings.weekStartsOn}
        />
      </View>

      <View style={styles.statsWrap}>
        <StatRow items={stats} />
      </View>

      <View style={styles.preview}>
        {status === 'error' ? (
          <ErrorState message="COULD NOT READ RECORDS" onRetry={onRetry} />
        ) : preview.length > 0 ? (
          <View style={styles.previewCard}>
            <SectionHeader label="LATEST" total={symbol + formatCents(today)} />
            {preview.map(entry => (
              <EntryRow
                key={entry.id}
                entry={entry}
                symbol={symbol}
                onPress={onEditEntry}
                onLongPress={noop}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            Icon={Wallet}
            title="NO RECORDS YET"
            hint="YOUR ENTRIES WILL APPEAR HERE"
            image={spriteWallet}
          />
        )}
      </View>

      <View style={styles.bottom}>
        <Text style={styles.hint}>ONE TAP TO LOG - NO ACCOUNTS, NO BANK LINKS</Text>
        <PrimaryButton label="START ENTRY" onPress={onBegin} Icon={Plus} />
        <View style={styles.secondaryRow}>
          <SecondaryButton label="RECORDS" onPress={onRecords} Icon={ListOrdered} />
          <SecondaryButton
            label="WEEK"
            onPress={onWeek}
            Icon={CalendarRange}
            tone="tint"
          />
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  art: {
    position: 'absolute',
    right: 8,
    top: 146,
    width: ART,
    height: ART,
    opacity: 0.92,
  },
  hero: {
    marginTop: 20,
    paddingHorizontal: GUTTER,
    maxWidth: SCREEN_W - 150,
  },
  heroCaption: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.8,
    color: theme.colors.textMuted,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 6,
  },
  heroSymbol: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.primary,
    marginRight: 4,
    marginBottom: 8,
  },
  heroValue: {
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 58,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  heroValueMuted: {
    color: theme.colors.textFaint,
  },
  heroRule: {
    width: 64,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.accent,
    marginTop: 10,
  },
  heroContext: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: theme.colors.textMuted,
    marginTop: 10,
  },
  spark: {
    marginTop: 22,
    paddingHorizontal: GUTTER,
  },
  statsWrap: {
    marginTop: 18,
    paddingHorizontal: GUTTER,
  },
  preview: {
    flex: 1,
    marginTop: 18,
    paddingHorizontal: GUTTER,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewCard: {
    width: CTA_W,
    alignSelf: 'center',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  bottom: {
    paddingHorizontal: GUTTER,
    paddingBottom: 20,
    alignItems: 'center',
  },
  hint: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: 10,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
  },
});

export default memo(MenuScreen);
