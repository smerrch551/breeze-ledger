import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  label: string;
  total: string;
};

export const SECTION_HEADER_H = 34;

/** The day divider inside the history list: label left, day total right. */
function SectionHeader({ label, total }: Props) {
  return (
    <View style={styles.root}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.total} numberOfLines={1}>
        {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: SECTION_HEADER_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    backgroundColor: theme.colors.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.hairline,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: theme.colors.textMuted,
  },
  total: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
});

export default memo(SectionHeader);
