/**
 * ClaudeCodeChrome —— Claude Code 2.1.259 真实界面镜像件(2026-09-03 Agent Teams 片立,L1 共享)。
 *
 * 出处:08-26 移植工程 src/lib/chrome.tsx「镜像窗六笔」(小陈拍板设计语言)第 2 个消费者即晋升,
 * 并按 2026-09-03 tmux 实录(素材包 终端实录/00-home、01-辩论排错 的 .ansi)把 2.1.259 的
 * 真实 UI 原文与颜色码钉进来:ASCII 品牌块、状态行、⏵⏵ 模式行、Agent 面板行、后台 agent 列表。
 *
 * 颜色纪律:这里的色是【镜像真实终端】的 xterm-256 / ANSI 码换算值,不是品牌 token——
 * 真实界面长什么样就画什么样(HARD_RULES ③-3 的例外,理由同「原生 UI 镜像必须保留来源身份」)。
 * 品牌强调(陶土橙)仍从 theme 取。字体 = JetBrains Mono(宿主工程以 'Scene Mono' 注册)。
 *
 * 帧驱动纪律:所有动效吃传入的 frame(或 useCurrentFrame),interpolate 带 CLAMP,无随机无时钟。
 * 文本纪律:界面上的每一行文字都应来自实录;本文件只给形状,不带任何默认台词。
 */
import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../theme';
import { CLAMP } from './motion';
import { FONT_STACKS } from './styleTokens';
import { WaveCard } from './WaveCard';

/* ── 实录颜色(xterm-256 → hex;ANSI 16 色按 Terminal.app Basic 主题) ── */
/* 2026-09-03 小陈拍板(bake-off C):终端镜像改浅色主题——奶油底 + 墨字。
 * 语义不变(仍是实录 ANSI 色号的角色),只是把每个色号换成 light 主题下的对应色;
 * 六笔招牌(红绿灯 / 品牌行 / ❯ / 块光标 / 无题顶栏 / 面板行)全部保留。 */
export const CC = {
  bg: '#f4f0e8',          // 终端窗底(奶油,浅色主题;镜像窗六笔①)
  bar: '#e6e1d7',         // 无题顶栏(六笔②)
  fg: '#15171e',          // 正文(theme ink)
  dim: '#6e7280',         // 灰(路径 / 面板行 / 提示)
  dimmer: '#9a9da8',      // \e[2m 暗
  logo: '#d7875f',        // ASCII 品牌块(接近陶土橙)
  promptBg: '#e9e4da',    // 输入区底
  promptGlyph: '#8a8d98', // ❯
  ok: '#2f9e44',          // ⏺ 绿(agents launched)
  cyan: '#0b7f8a',        // 路径
  magenta: '#8f2a95',     // (main)
  green: '#1f8f2a',       // 进度条
  yellow: '#b8860b',      // ⏵⏵ auto mode
  rule: 'rgba(0,0,0,0.14)',
  brand: theme.colors.orange,
} as const;

export const CC_FONT = "'Scene Mono','JetBrains Mono',var(--cyxj-font-zh, 'Noto Sans SC'),ui-monospace,Menlo,monospace";
export const CC_VERSION = 'v2.1.259';

/** 全幅终端窗的横向几何(2026-09-04 小陈:「终端太宽、超安全区」):窗 x 168..1752,各镜头 padding≈24 时正文落在
 *  design.md 文字安全区 x=192–1728 内。全幅终端镜头(terminalmeet / debate / keys / tmux / boardstates)一律吃这两个值,别各自写 60/1800。 */
export const FULL_TERMINAL_X = 168;
export const FULL_TERMINAL_W = 1584;

/** 帧驱动闪烁(六笔⑤:周期 32,亮 0.9 / 暗 0.15) */
export const blink = (f: number, period = 32): number => (f % period < period / 2 ? 0.9 : 0.15);

/** 逐字打出:from 帧起每 cpf 帧一个字符 */
export const typed = (text: string, frame: number, from: number, cpf = 2): string => {
  if (text.length === 0) return '';
  const n = Math.floor(interpolate(frame, [from, from + text.length * cpf], [0, text.length], { ...CLAMP, easing: Easing.linear }));
  return text.slice(0, n);
};

export const TrafficLights: React.FC<{ size?: number }> = ({ size = 11 }) => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
      <div key={c} style={{ width: size, height: size, borderRadius: size, backgroundColor: c }} />
    ))}
  </div>
);

export const BlockCursor: React.FC<{ frame: number; on?: number; color?: string }> = ({ frame, on = 1, color = CC.fg }) => (
  <span style={{ display: 'inline-block', width: 9, height: '1.05em', marginLeft: 3, borderRadius: 1.5, backgroundColor: color, translate: '0px 3px', opacity: on * blink(frame) }} />
);

/** 镜像窗容器(六笔①②):纯黑圆角 + #1a1a1a 无题顶栏红黄绿灯。title 传字 = mac 终端式居中窗题。 */
export const TerminalWindow: React.FC<{
  box: { x: number; y: number; w: number; h: number };
  title?: string;
  accent?: string;
  opacity?: number;
  scale?: number;
  fontSize?: number;
  barHeight?: number;
  radius?: number;
  padding?: number;
  children?: React.ReactNode;
}> = ({ box, title = '', accent, opacity = 1, scale = 1, fontSize = 20, barHeight = 34, radius = 12, padding = 16, children }) => (
  <div
    style={{
      position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h,
      borderRadius: radius, backgroundColor: CC.bg,
      border: `1.5px solid ${accent ?? 'rgba(0,0,0,0.14)'}`,
      opacity, transform: `scale(${scale})`, transformOrigin: '50% 50%', overflow: 'hidden',
      fontFamily: CC_FONT, fontSize, color: CC.fg, letterSpacing: '0.02em', lineHeight: 1.45,
    }}
  >
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: barHeight, padding: '0 14px', backgroundColor: CC.bar }}>
      <TrafficLights />
      {title !== '' ? (
        <span style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: Math.round(barHeight * 0.44), color: CC.dim, letterSpacing: 4 }}>{title}</span>
      ) : null}
    </div>
    <div style={{ position: 'relative', width: '100%', height: box.h - barHeight, padding, boxSizing: 'border-box', whiteSpace: 'pre', overflow: 'hidden' }}>{children}</div>
  </div>
);

/** 2.1.259 启动画面品牌块(实录 00-home 原文,逐字) */
export const CcLogoHeader: React.FC<{ model?: string; cwd?: string; version?: string }> = ({ model = 'Opus 5 with xhigh effort · Claude Max', cwd = '', version = CC_VERSION }) => (
  <div style={{ whiteSpace: 'pre', lineHeight: 1.35 }}>
    <div><span style={{ color: CC.logo }}>{' ▐▛███▛█ '}</span>{'  Claude Code '}{version}</div>
    <div><span style={{ color: CC.logo }}>{'▝▜██████▀'}</span>{'  '}<span style={{ color: CC.dim }}>{model}</span></div>
    <div><span style={{ color: CC.logo }}>{'  ▝▝ ▝▝  '}</span>{'  '}<span style={{ color: CC.dim }}>{cwd}</span></div>
  </div>
);

/** 横向细线(实录里的 ─ 分隔行) */
export const Rule: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ height: 1, backgroundColor: CC.rule, margin: '6px 0', ...style }} />
);

/** 输入行:❯ + 逐字 + 块状光标(六笔④⑤);frame 为本地帧 */
export const PromptLine: React.FC<{ frame: number; text: string; typeFrom?: number; cpf?: number; cursorOn?: number; dim?: boolean }> = ({ frame, text, typeFrom = 0, cpf = 2, cursorOn = 1, dim = false }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', padding: '4px 0', whiteSpace: 'pre-wrap' }}>
    <span style={{ color: dim ? CC.promptGlyph : CC.fg, marginRight: 8 }}>❯</span>
    <span style={{ color: dim ? CC.dimmer : CC.fg, flex: 1 }}>{typed(text, frame, typeFrom, cpf)}<BlockCursor frame={frame} on={cursorOn} /></span>
  </div>
);

/** 状态行:  沙盒/chat-app · (main) · Opus 5 · [█░░░░░░░░░] 12%                     /rc */
export const StatusLine: React.FC<{ cwdShort: string; branch?: string; model?: string; percent?: number; right?: string }> = ({ cwdShort, branch = '(main)', model = 'Opus 5', percent = 0, right = '/rc' }) => {
  const filled = Math.max(0, Math.min(10, Math.round(percent / 10)));
  const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', color: CC.dim, whiteSpace: 'pre' }}>
      <span>{'  '}<span style={{ color: CC.cyan }}>{cwdShort}</span>{' · '}<span style={{ color: CC.magenta }}>{branch}</span>{' · '}{model}{' · '}<span style={{ color: CC.green }}>{`[${bar}] ${percent}%`}</span></span>
      <span>{right}</span>
    </div>
  );
};

/** 模式行:  ⏵⏵ auto mode on (shift+tab to cycle) · ← 2 agents */
export const ModeLine: React.FC<{ mode?: string; hint?: string; extra?: string }> = ({ mode = '⏵⏵ auto mode on', hint = '(shift+tab to cycle)', extra = '' }) => (
  <div style={{ whiteSpace: 'pre' }}>{'  '}<span style={{ color: CC.yellow }}>{mode}</span><span style={{ color: CC.dim }}>{` ${hint}${extra ? ' · ' + extra : ''}`}</span></div>
);

export type AgentRow = { name: string; excerpt?: string; meta?: string; state?: 'lead' | 'working' | 'idle' | 'selected' };

/** Agent 面板(实录:「  ⏺ main」加粗;队员行 246 灰「  ◯ name  摘要…   2m 46s · ↓ 54.5k tokens」) */
export const AgentPanel: React.FC<{ rows: AgentRow[]; selected?: number; highlightColor?: string; width?: number }> = ({ rows, selected = -1, highlightColor = 'rgba(0,0,0,0.07)', width }) => (
  <div style={{ whiteSpace: 'pre', width }}>
    {rows.map((r, i) => {
      const lead = r.state === 'lead';
      const sel = i === selected;
      return (
        <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between', color: lead ? CC.fg : CC.dim, fontWeight: lead ? 700 : 400, backgroundColor: sel ? highlightColor : 'transparent', borderLeft: sel ? `3px solid ${CC.brand}` : '3px solid transparent', paddingLeft: 6 }}>
          <span>{'  '}{lead ? '⏺' : r.state === 'working' ? '⏺' : '◯'}{' '}{r.name.padEnd(10)}{r.excerpt ? '  ' + r.excerpt : ''}</span>
          <span>{r.meta ?? ''}</span>
        </div>
      );
    })}
  </div>
);

/** ⏺ 行(实录:白 ⏺ + 正文;绿 ⏺ = 后台 agent 启动) */
export const DotLine: React.FC<{ text: React.ReactNode; color?: string; dim?: boolean }> = ({ text, color = CC.fg, dim = false }) => (
  <div style={{ whiteSpace: 'pre-wrap', color: dim ? CC.dim : CC.fg }}><span style={{ color }}>⏺</span>{' '}{text}</div>
);

/** ⏺ 3 background agents launched (↓ to manage) ├ @a ├ @b └ @c(实录原文形态) */
export const AgentsLaunched: React.FC<{ names: string[]; shown?: number }> = ({ names, shown = names.length }) => (
  <div style={{ whiteSpace: 'pre' }}>
    <div><span style={{ color: CC.ok }}>⏺</span>{' '}<b>{names.length}</b>{' background agents launched '}<span style={{ color: CC.dim }}>(↓ to manage)</span></div>
    {names.slice(0, Math.max(0, shown)).map((n, i) => (
      <div key={n}>{'   '}<span style={{ color: CC.dim }}>{i === names.length - 1 ? '└' : '├'}</span>{' '}<b>@{n}</b></div>
    ))}
  </div>
);

/** 键帽浮层(↑ ↓ Ctrl T Enter):暗玻璃圆角键帽,pressed 时缩 0.94 */
export const Keycap: React.FC<{ label: string; pressed?: number; size?: number }> = ({ label, pressed = 0, size = 44 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: size, height: size, padding: '0 12px', marginRight: 8, borderRadius: 10, backgroundColor: 'rgba(21,23,30,0.9)', border: '1px solid rgba(0,0,0,0.3)', boxShadow: '0 6px 18px rgba(0,0,0,0.25)', color: '#efe7dd', fontFamily: CC_FONT, fontSize: size * 0.42, transform: `scale(${1 - 0.06 * pressed})`, transformOrigin: '50% 50%' }}>{label}</div>
);

/** 底座卡家族(①组长 Team Lead / ②队员 Teammates / ③共享看板 Task List / ④邮箱 Mailbox):
 *  2026-09-04 小陈拍板换成「波涌卡」(components/WaveCard,与 wavedots 背景成对的那款钴蓝发光卡),几何不变:
 *  640×150 居中上方(cy 300),左大号水印序号,右上中文名、右下英文名。frame 本地帧:0..14 从下落定;
 *  停一拍让观众读完;exitAt 起 16f 向上滑出 + 淡出,之后不再渲染(不留角标——画面四角浮层一律禁止,2026-09-03 小陈拍板)。 */
export const PillarCard: React.FC<{ frame: number; index: number; zh: string; en: string; exitAt?: number; fps?: number }> = ({ frame, index, zh, en, exitAt = 40 }) => {
  const enter = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const exit = interpolate(frame, [exitAt, exitAt + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  if (exit >= 1) return null;
  const w = 640, h = 150;
  const cx = 960 - w / 2, cy = 300;
  return (
    <div style={{ position: 'absolute', left: cx, top: cy, width: w, height: h, transform: `translateY(${(1 - enter) * 60 - 90 * exit}px)`, opacity: enter * (1 - exit) }}>
      <WaveCard width={w} height={h} label={zh} sub={en} numeral={index} numeralOpacity={0.42} align="left" progress={enter} fontSizePx={44} subFontSizePx={22} />
    </div>
  );
};

/** 便利:在组件里直接拿本地帧 */
export const useFrame = (): number => useCurrentFrame();
