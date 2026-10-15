import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import StatCard, { StatCardProps } from './StatCard';

type Props = {
  items: StatCardProps[];
  onTeal?: boolean;
};

/**
 * Renders the row only when at least two cards survive. A lone pill in a row
 * reads as a broken skeleton loader, and an empty pill even more so — so an
 * item with no value is dropped rather than rendered blank (rule #13 of the
 * self-verification list).
 */
function StatRow({ items, onTeal = false }: Props) {
  const visible = items.filter(i => i.value && i.value.length > 0);
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={styles.row}>
      {visible.map(item => (
        <View key={item.label} style={styles.slot}>
          <StatCard
            value={item.value}
            label={item.label}
            accent={item.accent}
            onTeal={onTeal}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  slot: {
    flex: 1,
  },
});

export default memo(StatRow);
