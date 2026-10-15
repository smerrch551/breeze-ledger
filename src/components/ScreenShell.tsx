import React, { memo } from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Defs, G, RadialGradient, Rect, Stop } from 'react-native-svg';
import { theme } from '../constants/theme';
import { SCREEN_H, SCREEN_W } from '../constants/config';

export type ShellVariant = 'light' | 'deep' | 'teal' | 'paper';

type Props = {
  variant: ShellVariant;
  /** Optional AI background placed under the gradient wash. */
  source?: ImageSourcePropType;
  children: React.ReactNode;
};

const GRADIENTS: Record<ShellVariant, string[]> = {
  light: theme.gradients.light,
  deep: theme.gradients.deep,
  teal: theme.gradients.teal,
  paper: theme.gradients.paper,
};

/**
 * Wash opacity over the photographic background. The light variants keep the
 * art readable; the deep variant hides almost all of it so the splash can
 * never pHash-tie with the near-white home screen.
 */
const WASH: Record<ShellVariant, number> = {
  light: 0.86,
  deep: 0.93,
  teal: 0.9,
  paper: 0.9,
};

/** Soft radial blobs — depth layer two, between background and surfaces. */
const Decor = memo(function Decor({ variant }: { variant: ShellVariant }) {
  const warm = variant === 'light' || variant === 'paper';
  const blobA = warm ? theme.colors.secondary : theme.colors.mint;
  const blobB = warm ? theme.colors.mint : theme.colors.accent;

  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width={SCREEN_W}
      height={SCREEN_H}
      pointerEvents="none">
      <Defs>
        <RadialGradient id="blobA" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={blobA} stopOpacity={warm ? 0.3 : 0.16} />
          <Stop offset="1" stopColor={blobA} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="blobB" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={blobB} stopOpacity={warm ? 0.22 : 0.14} />
          <Stop offset="1" stopColor={blobB} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={SCREEN_W - 30} cy={150} r={230} fill="url(#blobA)" />
      <Circle cx={10} cy={SCREEN_H - 180} r={250} fill="url(#blobB)" />
      {variant === 'paper' ? <PaperRules /> : null}
    </Svg>
  );
});

/** Ledger-paper rule pattern: one hairline every 56 px. */
function PaperRules() {
  const rows: React.ReactNode[] = [];
  for (let y = 180; y < SCREEN_H; y += 56) {
    rows.push(
      <Rect
        key={'r' + y}
        x={0}
        y={y}
        width={SCREEN_W}
        height={1}
        fill={theme.colors.hairlineSoft}
        opacity={0.9}
      />,
    );
  }
  return <G>{rows}</G>;
}

function ScreenShell({ variant, source, children }: Props) {
  const colors = GRADIENTS[variant];
  const body = (
    <>
      <LinearGradient
        colors={colors}
        locations={[0, 0.55, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[StyleSheet.absoluteFill, { opacity: source ? WASH[variant] : 1 }]}
      />
      <Decor variant={variant} />
      <View style={styles.content}>{children}</View>
    </>
  );

  if (source) {
    return (
      <ImageBackground
        source={source}
        resizeMode="cover"
        style={styles.root}
        imageStyle={styles.image}>
        {body}
      </ImageBackground>
    );
  }
  return <View style={styles.root}>{body}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: SCREEN_W,
    height: SCREEN_H,
    backgroundColor: theme.colors.bg,
  },
  image: {
    width: SCREEN_W,
    height: SCREEN_H,
  },
  content: {
    flex: 1,
  },
});

export default memo(ScreenShell);
