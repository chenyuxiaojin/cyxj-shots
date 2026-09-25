/**
 * 中文主字体 Noto Sans SC(700/800)+ 等宽 Space Mono(400/700),woff2 在 public/fonts/。
 * delayRender 兜住，渲染前等字体到位，避免开头闪字体。
 */
import { loadFont } from '@remotion/fonts';
import { staticFile, delayRender, continueRender } from 'remotion';

const handle = delayRender('Loading fonts');
Promise.all([
  loadFont({ family: 'Noto Sans SC', url: staticFile('fonts/NotoSansSC-sc-700.woff2'), weight: '700' }),
  loadFont({ family: 'Noto Sans SC', url: staticFile('fonts/NotoSansSC-latin-700.woff2'), weight: '700' }),
  loadFont({ family: 'Noto Sans SC', url: staticFile('fonts/NotoSansSC-sc-800.woff2'), weight: '800' }),
  loadFont({ family: 'Noto Sans SC', url: staticFile('fonts/NotoSansSC-latin-800.woff2'), weight: '800' }),
  loadFont({ family: 'Space Mono', url: staticFile('fonts/SpaceMono-latin-400.woff2'), weight: '400' }),
  loadFont({ family: 'Space Mono', url: staticFile('fonts/SpaceMono-latin-700.woff2'), weight: '700' }),
])
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));
