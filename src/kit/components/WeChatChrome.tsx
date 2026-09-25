/**
 * WeChatChrome —— 微信聊天界面镜像件(2026-09-03 Agent Teams 片立,L1 共享)。
 *
 * 出处:移植自 sxhzju/wechat-2d(commit 45a2f84,2026-04-27;本地克隆在 参考仓库/wechat-2d)
 *   shared/features/demoMotion/scenes/DemoMotionScene.jsx + chatMotionData.js。
 *   原件是 Tailwind v4 类名,这里逐条换成行内样式(本管线不吃 Tailwind,HARD_RULES ①-8);
 *   尺寸(屏宽 390 / 顶栏 49 / 输入栏 82)、颜色(#ededed 顶栏 / #f7f7f7 输入栏 / #95ec69 己方绿泡 / 白泡 / #9b9b9b 灰字)、
 *   五个 SVG 图标(返回 / 更多 / 语音波 / 表情 / 加号)、气泡小尾巴(8px 方块转 45°)、
 *   弹入(easeOutBack 0.32s 自 0.86 缩放)、对方文字逐字流出(0.045s/字 · 0.4–0.9s · ÷1.5 · 0.14s 上浮 8px)、
 *   消息间隔 0.5s —— 全部按原件常数搬,不改数。
 * 本件新增(原件是单聊,没有这些):群聊的发送者昵称行、居中灰字系统通知、图片消息卡、@ 片段用微信链接蓝 #576b95。
 *
 * 颜色纪律:这里的色是【镜像真实微信】,不是品牌 token(HARD_RULES ③-3 的例外,理由同 ClaudeCodeChrome:
 *   原生 UI 镜像必须保留来源身份)。品牌强调仍由调用方从 theme 取。
 * 帧驱动纪律:本件不读时钟、无随机;所有动效由调用方传 progress(0..1)驱动,progress 由 useCurrentFrame 算出。
 */
import React from 'react';

export const WX = {
  SCREEN_W: 390,
  HEADER_H: 49,
  COMPOSER_H: 82,
  VIEWPORT_H: 660,
  PAD: 16, // px-4 py-4
  ITEM_GAP: 24, // space-y-6
  bg: '#ededed',
  composerBg: '#f7f7f7',
  border: '#d1d5db', // border-gray-300
  edge: '#e5e7eb', // border-gray-200(屏两侧)
  selfBubble: '#95ec69',
  bubble: '#ffffff',
  text: '#1f2937', // text-gray-800
  muted: '#9b9b9b',
  icon: '#2f2f2f',
  link: '#576b95', // 微信链接 / @ 蓝(本件新增)
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
  POP_SEC: 0.32,
  STREAM_CHAR_SEC: 0.045,
  STREAM_MIN_SEC: 0.4,
  STREAM_MAX_SEC: 0.9,
  STREAM_REVEAL_SEC: 0.14,
  STREAM_SPEED: 1.5,
  GAP_SEC: 0.5,
} as const;

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** 原件 easeOutBack(c1 = 1.70158) */
export const easeOutBack = (v: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(v - 1, 3) + c1 * Math.pow(v - 1, 2);
};

/** 原件 getFrameProgress:startFrame 起 durationFrames 帧走完 0..1 */
export const frameProgress = (frame: number, startFrame: number, durationFrames: number): number =>
  durationFrames <= 0 ? (frame >= startFrame ? 1 : 0) : clamp01((frame - startFrame) / durationFrames);

/** 原件 getMotionSeconds(流出文字):按字数算,夹在 0.4–0.9s,再 ÷1.5 */
export const streamSeconds = (text: string): number =>
  Math.min(WX.STREAM_MAX_SEC, Math.max(WX.STREAM_MIN_SEC, Array.from(text).length * WX.STREAM_CHAR_SEC)) / WX.STREAM_SPEED;

/** 原件 getPopStyle:透明度 = progress,缩放 0.86→1(easeOutBack),原点在气泡靠头像那一侧 */
export const popStyle = (progress: number, isSelf: boolean): React.CSSProperties => ({
  opacity: progress,
  transform: `scale(${0.86 + 0.14 * easeOutBack(progress)})`,
  transformOrigin: isSelf ? 'right center' : 'left center',
});

/** 原件流出消息的整体上浮:0.14s ÷ 1.5,translateY 8px → 0 */
export const revealStyle = (progress: number): React.CSSProperties => ({
  opacity: progress,
  transform: `translateY(${(1 - progress) * 8}px)`,
});

/* ────────── 图标(原件 SVG 原样,尺寸按 h-6/h-7 = 24/28px) ────────── */
const IconChevronLeft: React.FC = () => (
  <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconMore: React.FC = () => (
  <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
    />
  </svg>
);

const VOICE_STROKE = 0.55;
const VOICE_SPACING = 1.03;

const IconMicrophone: React.FC = () => {
  const offset1 = (94 - 110.85) * VOICE_SPACING + 110.85;
  const offset2 = 118.4;
  const offset3 = (135.4 - 110.85) * VOICE_SPACING + 110.85;
  const wave = { fill: 'currentColor', stroke: 'currentColor', strokeWidth: VOICE_STROKE, strokeLinecap: 'round', strokeLinejoin: 'round', vectorEffect: 'non-scaling-stroke' } as const;
  return (
    <svg width={28} height={28} fill="none" viewBox="0 0 24 24" style={{ color: WX.icon, shapeRendering: 'geometricPrecision' }} aria-hidden="true">
      <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.7} />
      <path d="m86.31 121.6 15.67-15.4c4.84 3.96 5.45 10.65 5.45 15.4 0 6.28-2.72 11.13-5.45 14.5l-15.67-14.5z" {...wave} transform={`translate(${offset1 - 94}, 0) scale(0.096)`} />
      <path d="m118.4 89.46-7.13 7.6c7.63 8.02 10.51 16.19 10.51 24.68 0 10.03-4.84 19.14-10.51 25.17l7.5 7.34c9.95-10.28 13.1-21.51 13.1-32.51 0-12.89-5.92-25.13-13.47-32.28z" {...wave} transform={`translate(${offset2 - 118.4}, 0) scale(0.096)`} />
      <path d="m135.4 71.21-7.54 7.9c11.83 12.62 18.09 25.51 18.09 42.5 0 15.55-7.01 31.37-17.89 43.71l7.54 6.4c13.49-13.96 20.9-30.11 20.9-50.11 0-18.7-7.62-36.59-21.1-50.4z" {...wave} transform={`translate(${offset3 - 135.4}, 0) scale(0.096)`} />
    </svg>
  );
};

const IconEmoji: React.FC = () => (
  <svg width={28} height={28} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: WX.icon }}>
    <circle cx={12} cy={12} r={9} strokeWidth={1.7} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.8} d="M8.5 8.5v.01M15.5 8.5v.01" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M7 12.5h10a5 5 0 0 1-10 0z" />
  </svg>
);

const IconPlus: React.FC = () => (
  <svg width={28} height={28} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: WX.icon }}>
    <circle cx={12} cy={12} r={9} strokeWidth={1.7} />
    <path strokeLinecap="round" strokeWidth={1.7} d="M12 8v8M8 12h8" />
  </svg>
);

/* ────────── 壳:顶栏 / 输入栏 / 屏 ────────── */

/** 顶栏(原件 ChatHeader):返回 + 居中标题 + 更多;群聊标题由调用方拼「群名(人数)」 */
export const WeChatHeader: React.FC<{ title: React.ReactNode }> = ({ title }) => (
  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: WX.HEADER_H, boxSizing: 'border-box', padding: '12px 16px', borderBottom: `1px solid ${WX.border}`, backgroundColor: WX.bg, color: WX.text }}>
    <IconChevronLeft />
    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: 18, lineHeight: '28px', fontWeight: 500, whiteSpace: 'nowrap' }}>{title}</span>
    <IconMore />
  </div>
);

/** 输入栏(原件 ChatComposer):语音 / 空输入框 / 表情 / 加号 —— 你没说话,输入框一直空着 */
export const WeChatComposer: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, height: WX.COMPOSER_H, boxSizing: 'border-box', padding: '10px 12px 16px', backgroundColor: WX.composerBg }}>
    <div style={{ marginTop: 5, flex: 'none' }}><IconMicrophone /></div>
    <div style={{ marginTop: -1, height: 40, flex: 1, borderRadius: 6, backgroundColor: '#ffffff', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)' }} />
    <div style={{ marginTop: 5, flex: 'none' }}><IconEmoji /></div>
    <div style={{ marginTop: 5, flex: 'none' }}><IconPlus /></div>
  </div>
);

/** 时间戳 / 系统通知(原件 TimeStamp 样式;群聊「xx 加入了群聊」同款居中灰字) */
export const WeChatNotice: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ textAlign: 'center', ...style }}>
    <span style={{ display: 'inline-block', borderRadius: 4, padding: '3px 8px', fontSize: 13, lineHeight: '18px', color: WX.muted }}>{children}</span>
  </div>
);

/** 头像(原件 40×40 圆角 4;原件用照片,这里是纯色底 + 头肩剪影,调用方给颜色)。
 *  2026-09-04 小陈:「有人说话时给人物加上头像」→ 传 initial(名字首字)改画白色粗体首字头像(像微信默认昵称头像,一眼认人);
 *  speaking(0..1)= 正在说话:头像外圈微信绿描边 + 微放大,调用方按帧算。 */
export const WeChatAvatar: React.FC<{ color: string; size?: number; initial?: string; speaking?: number }> = ({ color, size = 40, initial, speaking = 0 }) => (
  <div style={{ position: 'relative', flex: 'none', width: size, height: size, transform: `scale(${1 + 0.1 * speaking})`, transformOrigin: '50% 50%' }}>
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: 'block', borderRadius: 4, boxShadow: speaking > 0.01 ? `0 0 0 ${2 * speaking}px #07c160, 0 1px 2px rgba(0,0,0,0.05)` : '0 1px 2px rgba(0,0,0,0.05)' }}>
      <rect width={40} height={40} rx={4} fill={color} />
      {initial ? (
        <text x={20} y={21} textAnchor="middle" dominantBaseline="central" fontFamily={WX.font} fontSize={22} fontWeight={700} fill="rgba(255,255,255,0.96)">{Array.from(initial)[0] ?? ''}</text>
      ) : (
        <>
          <circle cx={20} cy={15} r={7} fill="rgba(255,255,255,0.92)" />
          <path d="M7 36 C9 25, 31 25, 33 36 Z" fill="rgba(255,255,255,0.92)" />
        </>
      )}
    </svg>
  </div>
);

/** 文字气泡(原件 TextBubble):白泡 / 己方绿泡,8px 小尾巴,14.5px / 24px 行高,最宽 250 */
export const WeChatTextBubble: React.FC<{ isSelf?: boolean; children: React.ReactNode; minWidth?: number }> = ({ isSelf = false, children, minWidth }) => {
  const bg = isSelf ? WX.selfBubble : WX.bubble;
  return (
    <div style={{ position: 'relative', maxWidth: 250, minWidth, boxSizing: 'border-box', borderRadius: 8, padding: isSelf ? '8px 10px' : '8px 9px 8px 10px', fontSize: 14.5, lineHeight: '24px', color: WX.text, backgroundColor: bg, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', wordBreak: 'break-word' }}>
      {children}
      <span style={{ position: 'absolute', top: 12, width: 8, height: 8, transform: 'rotate(45deg)', backgroundColor: bg, ...(isSelf ? { right: -4 } : { left: -4 }) }} />
    </div>
  );
};

/** 图片消息卡(本件新增,尺寸规则沿用原件媒体卡:圆角 4 + 内描边) */
export const WeChatImageCard: React.FC<{ width: number; height: number; children: React.ReactNode }> = ({ width, height, children }) => (
  <div style={{ position: 'relative', width, height, overflow: 'hidden', borderRadius: 4, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)', backgroundColor: '#000000' }}>{children}</div>
);

/** 一行消息(原件 MessageRow + 群聊昵称行):头像 + [昵称] + 内容;己方镜像到右边 */
export const WeChatMessageRow: React.FC<{ avatarColor: string; senderName?: string; isSelf?: boolean; initial?: string; speaking?: number; children: React.ReactNode }> = ({ avatarColor, senderName, isSelf = false, initial, speaking = 0, children }) => (
  <div style={{ display: 'flex', maxWidth: '100%', gap: 12, flexDirection: isSelf ? 'row-reverse' : 'row' }}>
    <WeChatAvatar color={avatarColor} initial={initial} speaking={speaking} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: isSelf ? 'flex-end' : 'flex-start', minWidth: 0 }}>
      {senderName ? <div style={{ fontSize: 12, lineHeight: '17px', color: WX.muted, marginBottom: -2 }}>{senderName}</div> : null}
      {children}
    </div>
  </div>
);

/**
 * 整块屏(原件 DemoMotionScene 的屏容器):顶栏 + 消息视口 + 输入栏,宽 390,高 = 49 + viewportH + 82。
 * children 放进视口(内边距 16,条目间距 24,scrollOffset 整体上移)。borderRadius 是本件加的(手机屏圆角),原件为 0。
 */
export const WeChatScreen: React.FC<{
  title: React.ReactNode;
  viewportH?: number;
  scrollOffset?: number;
  borderRadius?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, viewportH = WX.VIEWPORT_H, scrollOffset = 0, borderRadius = 0, children, style }) => (
  <div style={{ position: 'relative', width: WX.SCREEN_W, height: WX.HEADER_H + viewportH + WX.COMPOSER_H, overflow: 'hidden', borderRadius, backgroundColor: WX.bg, color: WX.text, fontFamily: WX.font, borderLeft: `1px solid ${WX.edge}`, borderRight: `1px solid ${WX.edge}`, boxSizing: 'border-box', ...style }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: WX.HEADER_H, bottom: WX.COMPOSER_H, overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: WX.ITEM_GAP, padding: WX.PAD, transform: `translateY(${-scrollOffset}px)` }}>{children}</div>
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0 }}><WeChatHeader title={title} /></div>
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}><WeChatComposer /></div>
  </div>
);

export default WeChatScreen;
