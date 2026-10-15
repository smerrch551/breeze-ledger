/**
 * Re-exports of the AI-generated PNGs in assets/. Every screen imports from
 * here so a renamed asset is a one-line change.
 *
 * `icon_1024.png` is deliberately NOT re-exported — it ships as the launcher
 * icon through res/mipmap-*, and bundling a 1024px PNG into the JS asset
 * registry only inflates the APK.
 */
export const bgLoader = require('../../assets/bg_loader.png');
export const bgMenu = require('../../assets/bg_menu.png');
export const bgGame = require('../../assets/bg_game.png');
export const spriteLeafCoin = require('../../assets/sprite_leaf_coin.png');
export const spriteReceipt = require('../../assets/sprite_receipt.png');
export const spriteWallet = require('../../assets/sprite_wallet.png');

export default {
  bgLoader,
  bgMenu,
  bgGame,
  spriteLeafCoin,
  spriteReceipt,
  spriteWallet,
};
