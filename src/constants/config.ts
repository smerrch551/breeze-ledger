import { Dimensions } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

export const SCREEN_W = W;
export const SCREEN_H = H;

/**
 * Splash duration. EXACTLY 8000 ms (workspace rule #13) — the capture harness
 * needs the loader frame to still be on screen once the emulator has finished
 * its 4-6 s of start-up overhead.
 */
export const LOADER_DURATION_MS = 8000;

/**
 * The progress bar animation is DELIBERATELY decoupled from the transition
 * timer. A tween that runs for the loader's whole 8 s life keeps the window
 * non-idle, uiautomator never returns, and the capture agent wedges on the
 * splash. 1200 ms paints, finishes, and lets the window go idle.
 */
export const LOADER_BAR_ANIM_MS = 1200;
export const LOADER_FADE_MS = 260;

/** Money is stored in integer cents; 99999.99 is the keypad ceiling. */
export const MAX_AMOUNT_CENTS = 9999999;
export const MAX_INT_DIGITS = 5;
export const MAX_DECIMALS = 2;

/** Header strip: 44 px of status-bar padding + 72 px of content (rule #6). */
export const HEADER_PAD_TOP = 44;
export const HEADER_CONTENT_H = 72;

export const GUTTER = 20;

/* ---------- Category grid geometry (rule #4/#5 frame formula) ---------- */
export const GRID_PAD = 16;
export const GRID_BORDER = 1;
export const GRID_COLS = 3;
export const GRID_GAP = 10;
const GRID_FRAME = GRID_PAD + GRID_BORDER;
export const GRID_MAX_W = Math.min(SCREEN_W - 32, 380);
export const GRID_CELL = Math.floor(
  (GRID_MAX_W - 2 * GRID_FRAME - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS,
);
export const GRID_CELL_H = 56;
export const GRID_W = GRID_CELL * GRID_COLS + GRID_GAP * (GRID_COLS - 1) + 2 * GRID_FRAME;

/* ---------- Keypad geometry ---------- */
export const KEY_GAP = 10;
export const KEY_COLS = 3;
export const KEY_MAX_W = Math.min(SCREEN_W - 32, 380);
export const KEY_W = Math.floor((KEY_MAX_W - KEY_GAP * (KEY_COLS - 1)) / KEY_COLS);
export const KEYPAD_W = KEY_W * KEY_COLS + KEY_GAP * (KEY_COLS - 1);
export const KEY_H = 48;

/* ---------- Button geometry ---------- */
export const CTA_W = Math.min(SCREEN_W - 2 * GUTTER, 420);
export const CTA_H = 58;
export const SECONDARY_H = 48;
export const SECONDARY_GAP = 12;
export const SECONDARY_W = Math.floor((CTA_W - SECONDARY_GAP) / 2);

/** Icon size inside every button. One value for the whole project (rule #20). */
export const BTN_ICON = 24;

/** Milliseconds a destructive confirm stays armed. */
export const CONFIRM_ARM_MS = 4000;

/** Hardware-back double-tap window on the home screen. */
export const BACK_EXIT_WINDOW_MS = 2000;
