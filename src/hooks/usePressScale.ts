import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { theme } from '../constants/theme';

/**
 * Shared press feedback. The Pressable is always the PARENT and the
 * Animated.View the CHILD (workspace rule #8) — an Animated.View with a
 * native-driver transform wrapping a Pressable swallows onPress on Android
 * release builds.
 *
 * Only `transform` is animated, so useNativeDriver stays true everywhere.
 */
export function usePressScale(pressedScale: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: pressedScale,
      tension: theme.spring.press.tension,
      friction: theme.spring.press.friction,
      useNativeDriver: true,
    }).start();
  }, [pressedScale, scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.spring.press.tension,
      friction: theme.spring.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
