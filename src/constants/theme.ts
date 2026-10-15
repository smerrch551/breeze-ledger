/**
 * NORDIC_MINIMAL preset, accents overridden to the BreezeLedger brief.
 * `name` stays exactly as the preset ships it (workspace rule #11b) — the
 * build gate validates it against the list of the ten canonical presets.
 *
 * NOT declared `as const`: a frozen readonly tuple breaks the `colors` prop
 * typing of react-native-linear-gradient.
 */
export const theme = {
  name: 'nordic-minimal',

  colors: {
    bg: '#F4FAF8',
    bgTop: '#FBFEFD',
    bgMid: '#F4FAF8',
    bgBottom: '#E6F3F0',

    surface: '#FFFFFF',
    surfaceAlt: '#EDF6F3',
    surfaceSunk: '#E3EFEC',

    hairline: '#DCEAE6',
    hairlineSoft: '#E3EFEC',

    primary: '#2A9D8F',
    primaryDark: '#238A7D',
    accent: '#E9C46A',
    accentDark: '#D9AE4F',
    secondary: '#A8DADC',
    mint: '#7FE8C5',

    text: '#24332F',
    textMuted: '#6E837D',
    textFaint: '#9BB0AA',
    onDark: '#FFFFFF',

    danger: '#C8553D',
    info: '#4A90E2',
    leaf: '#7FA46B',

    loaderTop: '#0E2B27',
    loaderMid: '#14453E',
    loaderBottom: '#2A9D8F',
  },

  gradients: {
    light: ['#FBFEFD', '#F4FAF8', '#E6F3F0'],
    deep: ['#0E2B27', '#14453E', '#2A9D8F'],
    teal: ['#2A9D8F', '#1F7E73', '#14453E'],
    cta: ['#2A9D8F', '#238A7D'],
    bar: ['#E9C46A', '#7FE8C5'],
    fill: ['#2A9D8F', '#7FE8C5'],
    paper: ['#F4FAF8', '#EEF7F4', '#E3F0EC'],
  },

  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 24,
  },

  /** Four-plus distinguishable type levels, editorial contrast. */
  type: {
    hero: { fontSize: 52, fontWeight: '800' as const, letterSpacing: -1 },
    result: { fontSize: 44, fontWeight: '800' as const, letterSpacing: -0.5 },
    title: { fontSize: 28, fontWeight: '800' as const, letterSpacing: 2.4 },
    cardValue: { fontSize: 22, fontWeight: '800' as const, letterSpacing: -0.2 },
    row: { fontSize: 15, fontWeight: '700' as const, letterSpacing: 0 },
    body: { fontSize: 13, fontWeight: '600' as const, letterSpacing: 0 },
    caption: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 2.8 },
    micro: { fontSize: 10, fontWeight: '600' as const, letterSpacing: 2.4 },
  },

  shadows: {
    card: {
      shadowColor: '#1F4A42',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    cta: {
      shadowColor: '#2A9D8F',
      shadowOpacity: 0.32,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 7,
    },
    ctaAmber: {
      shadowColor: '#0E2B27',
      shadowOpacity: 0.28,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 5 },
      elevation: 6,
    },
    sheet: {
      shadowColor: '#1F4A42',
      shadowOpacity: 0.06,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: -4 },
      elevation: 8,
    },
  },

  /** Spring presets. Press feedback is snappier than entrance motion. */
  spring: {
    entrance: { tension: 55, friction: 9 },
    press: { tension: 300, friction: 12 },
    pop: { tension: 48, friction: 7 },
  },
};

export type Theme = typeof theme;
export const C = theme.colors;
export default theme;
