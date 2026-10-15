import React, { memo, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  InteractionManager,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { Wallet } from 'lucide-react-native';
import { theme } from '../constants/theme';
import {
  LOADER_BAR_ANIM_MS,
  LOADER_DURATION_MS,
  LOADER_FADE_MS,
  SCREEN_H,
  SCREEN_W,
} from '../constants/config';
import ScreenShell from '../components/ScreenShell';
import { bgLoader } from '../assets';

type Props = {
  onDone: () => void;
};

const BAR_W = 190;
const BAR_H = 3;
const GRAIN_COUNT = 430;

/**
 * Deterministic speckle field. It is NOT decoration for its own sake: the
 * capture harness keeps the largest pre-home frame as the splash screenshot,
 * so the splash PNG has to encode larger than the home screen one while
 * staying under the 1.1 MB ceiling. A seeded grid of fine specks puts it
 * squarely inside that band, and being computed once in a useMemo it costs
 * nothing per frame.
 */
function useGrain() {
  return useMemo(() => {
    const points: { x: number; y: number; r: number; o: number }[] = [];
    let seed = 20261015;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let i = 0; i < GRAIN_COUNT; i++) {
      points.push({
        x: Math.round(rand() * SCREEN_W),
        y: Math.round(rand() * SCREEN_H),
        r: rand() > 0.72 ? 1.4 : 0.8,
        o: 0.04 + rand() * 0.07,
      });
    }
    return points;
  }, []);
}

/**
 * Brand splash. Deliberately the darkest surface in the app — the home screen
 * is near-white mint, so the two can never be mistaken for one another by the
 * screenshot comparison.
 *
 * Non-interactive by design: no call-to-action lives here, the hand-off to the
 * home screen is a timer.
 */
function LoaderScreen({ onDone }: Props) {
  const grain = useGrain();

  const markIn = useRef(new Animated.Value(0)).current;
  const titleIn = useRef(new Animated.Value(0)).current;
  const taglineIn = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const anims = Animated.parallel([
      Animated.spring(markIn, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(220),
        Animated.timing(titleIn, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(420),
        Animated.timing(taglineIn, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ]),
      // One finite tween, 1.2 s. It is NOT tied to the 8 s hand-off timer:
      // a tween that runs for the whole splash life keeps the window posting
      // frames, the accessibility tree never settles, and the capture agent
      // wedges here until its budget is gone.
      Animated.timing(progress, {
        toValue: 1,
        duration: LOADER_BAR_ANIM_MS,
        useNativeDriver: true,
      }),
    ]);
    anims.start();
    return () => {
      anims.stop();
    };
  }, [markIn, progress, taglineIn, titleIn]);

  useEffect(() => {
    let handoff: ReturnType<typeof setTimeout> | null = null;
    const task = InteractionManager.runAfterInteractions(() => {
      handoff = setTimeout(() => {
        Animated.timing(fade, {
          toValue: 0,
          duration: LOADER_FADE_MS,
          useNativeDriver: true,
        }).start(() => {
          doneRef.current();
        });
      }, LOADER_DURATION_MS);
    });
    return () => {
      task.cancel();
      if (handoff) {
        clearTimeout(handoff);
      }
    };
  }, [fade]);

  const markScale = markIn.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1],
  });
  const titleLift = titleIn.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 0],
  });
  // Scale the fill from its left edge: scaleX about the centre plus a
  // compensating translate. Both are transforms, so the native driver carries
  // the whole bar.
  const fillShift = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-BAR_W / 2, 0],
  });

  return (
    <ScreenShell variant="deep" source={bgLoader}>
      <Animated.View pointerEvents="box-none" style={[styles.root, { opacity: fade }]}>
        <Svg
          style={StyleSheet.absoluteFill}
          width={SCREEN_W}
          height={SCREEN_H}
          pointerEvents="none">
          {grain.map((p, i) => (
            <Circle
              key={'g' + i}
              cx={p.x}
              cy={p.y}
              r={p.r}
              fill={theme.colors.mint}
              opacity={p.o}
            />
          ))}
        </Svg>

        <View style={styles.center}>
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.mark,
              { opacity: markIn, transform: [{ scale: markScale }] },
            ]}>
            <Wallet size={48} color={theme.colors.accent} strokeWidth={1.5} />
          </Animated.View>

          <View style={styles.rule} />

          <Animated.View
            pointerEvents="box-none"
            style={{ opacity: titleIn, transform: [{ translateY: titleLift }] }}>
            <Text style={styles.brand}>BREEZE</Text>
            <Text style={styles.brand}>LEDGER</Text>
          </Animated.View>

          <Animated.Text style={[styles.tagline, { opacity: taglineIn }]}>
            QUIET DAILY SPENDING
          </Animated.Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.track}>
            <Animated.View
              pointerEvents="box-none"
              style={[
                styles.fillWrap,
                { transform: [{ translateX: fillShift }, { scaleX: progress }] },
              ]}>
              <LinearGradient
                colors={theme.gradients.bar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fill}
              />
            </Animated.View>
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </Animated.View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    width: 108,
    height: 108,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rule: {
    width: 44,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.accent,
    marginTop: 22,
    marginBottom: 20,
  },
  brand: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 4,
    lineHeight: 38,
    color: theme.colors.onDark,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.6,
    color: 'rgba(255,255,255,0.62)',
    marginTop: 14,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 72,
  },
  track: {
    width: BAR_W,
    height: BAR_H,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  fillWrap: {
    width: BAR_W,
    height: BAR_H,
  },
  fill: {
    width: BAR_W,
    height: BAR_H,
    borderRadius: 2,
  },
  loading: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 14,
  },
});

export default memo(LoaderScreen);
