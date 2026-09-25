/**
 * 镜头层可直接复用的成品字体栈和 alpha helper。
 *
 * 基色仍只来自 theme.ts；本文件只组合字体栈和修改 alpha，
 * 避免各镜头手拼 `Inter/system-ui` 或复制 hexToRgba。
 */
import {theme} from '../theme';

// 宿主工程可用 CSS 变量覆盖字族；未覆盖时仍严格回落到统一视觉系统默认值。
// 这样单片可定制字体，不会把 L1 共享镜头库或其他视频项目一起改掉。
const FONT_VARS = {
  zh: `var(--cyxj-font-zh, '${theme.fonts.zh}')`,
  display: `var(--cyxj-font-display, '${theme.fonts.display}')`,
} as const;

export const FONT_STACKS = {
  zh: `${FONT_VARS.zh},'Inter',system-ui,sans-serif`,
  display: `${FONT_VARS.display},${FONT_VARS.zh},system-ui,sans-serif`,
  mono: `${theme.fonts.mono},ui-monospace,SFMono-Regular,Menlo,monospace`,
  monoZh: `${theme.fonts.mono},${FONT_VARS.zh},ui-monospace,SFMono-Regular,Menlo,monospace`,
  serif: `${theme.fonts.serif},${FONT_VARS.zh},serif`,
} as const;

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** 给 hex 颜色加 alpha。非 hex 值保持原样，避免产出非法 CSS。 */
export const withAlpha = (color: string, alpha: number): string => {
  const match = color.match(HEX);
  if (!match) return color;
  const raw = match[1].length === 3
    ? match[1].split('').map((c) => c + c).join('')
    : match[1];
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  const a = Math.min(1, Math.max(0, alpha));
  return `rgba(${r},${g},${b},${a})`;
};
