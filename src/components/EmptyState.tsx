import React, { memo } from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import type { IconComponent } from './iconTypes';

type Props = {
  Icon: IconComponent;
  title: string;
  hint: string;
  /**
   * Optional illustration shown instead of the icon. Rendered at a fixed
   * 72x72 and on its own, never alongside other sprites in a row — a row of
   * sprites with different internal aspect ratios can never be made to look
   * evenly sized.
   */
  image?: ImageSourcePropType;
};

/** Shared by the home screen and the history list. */
function EmptyState({ Icon, title, hint, image }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.ring}>
        {image ? (
          <Image source={image} style={styles.art} resizeMode="contain" accessible={false} />
        ) : (
          <Icon size={44} color={'#C7DBD6'} strokeWidth={1.5} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  ring: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  art: {
    width: 72,
    height: 72,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.textMuted,
  },
  hint: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: theme.colors.textFaint,
    marginTop: 6,
    textAlign: 'center',
  },
});

export default memo(EmptyState);
