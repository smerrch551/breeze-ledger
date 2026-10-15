import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { GUTTER, HEADER_CONTENT_H, HEADER_PAD_TOP } from '../constants/config';

type Props = {
  title: string;
  /** Small uppercase line above the title (home screen uses it for TODAY). */
  eyebrow?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  tone?: 'light' | 'dark';
  align?: 'center' | 'left';
};

/**
 * The one header used by every screen. Inline per-screen header markup is what
 * makes badges and back buttons drift apart between screens, so there is
 * exactly one implementation and the screens only vary the slots.
 *
 * paddingTop: 44 clears the status bar (workspace rule #6).
 */
function ScreenHeader({
  title,
  eyebrow,
  left,
  right,
  tone = 'light',
  align = 'center',
}: Props) {
  const dark = tone === 'dark';
  const titleColor = dark ? theme.colors.onDark : theme.colors.text;
  const eyebrowColor = dark ? 'rgba(255,255,255,0.66)' : theme.colors.textMuted;

  return (
    <View
      style={[
        styles.root,
        dark ? styles.rootDark : styles.rootLight,
      ]}>
      <View style={styles.slot}>{left ? left : null}</View>

      <View style={align === 'left' ? styles.middleLeft : styles.middle}>
        {eyebrow ? (
          <Text style={[styles.eyebrow, { color: eyebrowColor }]} numberOfLines={1}>
            {eyebrow}
          </Text>
        ) : null}
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.slotRight}>{right ? right : null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: HEADER_PAD_TOP,
    height: HEADER_PAD_TOP + HEADER_CONTENT_H,
    paddingHorizontal: GUTTER,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  rootLight: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderBottomColor: theme.colors.hairline,
  },
  rootDark: {
    backgroundColor: 'rgba(14,43,39,0.22)',
    borderBottomColor: 'rgba(255,255,255,0.16)',
  },
  slot: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  slotRight: {
    width: 70,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 3,
    marginBottom: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.4,
  },
});

export default memo(ScreenHeader);
