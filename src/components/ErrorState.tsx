import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { theme } from '../constants/theme';
import SecondaryButton from './SecondaryButton';
import { CTA_W } from '../constants/config';

type Props = {
  message: string;
  onRetry: () => void;
};

/** The bordered failure card shown when the repository read rejects. */
function ErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.hint}>THE LOCAL LEDGER COULD NOT BE READ</Text>
      <SecondaryButton
        label="TRY AGAIN"
        onPress={onRetry}
        Icon={RefreshCw}
        tone="tint"
        width={CTA_W - 48}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    width: CTA_W,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.danger,
    backgroundColor: theme.colors.surface,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.danger,
    textAlign: 'center',
  },
  hint: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.textMuted,
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default memo(ErrorState);
