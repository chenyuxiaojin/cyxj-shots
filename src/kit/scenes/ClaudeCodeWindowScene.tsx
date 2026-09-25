/**
 * <ClaudeCodeWindowScene> —— Claude Code 镜像窗(通用,props 驱动)。
 *
 * 用 L1 壳件 components/ClaudeCodeChrome(2.1.259 真界面镜像:品牌块 / ❯ 逐字 / ⏺ 行 / 状态行 / ⏵⏵ 模式行 / Agent 面板)
 * 拼出一扇"真终端在跑"的全屏窗:用户 prompt 逐字打出 → Claude 的回应行一行行落下(⏺ 工具调用 / ⎿ 结果 / 正文)
 * → 底部 ❯ 光标闪、状态行进度随行数上跳。内容超过窗高时新行把旧行顶出窗顶(真终端行为)。
 *
 * 岗位:口播讲"我在 Claude Code 里让它做 X"时的界面 B-roll;每一行台词全走 props,库里只给形状和示例。
 * 工程(HARD_RULES ①):全 useCurrentFrame 驱动;interpolate 带 clamp;无随机无时钟;根节点透明(装配层铺底)。
 * 颜色是镜像真实终端的色号(③-3 例外,见 ClaudeCodeChrome 头注),不是品牌 token。
 */
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { CLAMP } from '../components/motion';
import {
  AgentPanel,
  BlockCursor,
  CC,
  CcLogoHeader,
  ModeLine,
  Rule,
  StatusLine,
  TerminalWindow,
  typed,
  type AgentRow,
  FULL_TERMINAL_X,
  FULL_TERMINAL_W,
} from '../components/ClaudeCodeChrome';
import type { SceneTag } from '../schema/sceneTag';

const clampBoth = CLAMP;
const EASE = Easing.out(Easing.cubic);

/** 回应行形态:dot=「⏺ 正文」/ tool=「⏺ Read(path)」/ result=「  ⎿  结果」(灰)/ plain=正文 / dim=灰字 */
export type CcLine = { kind: 'dot' | 'tool' | 'result' | 'plain' | 'dim'; text: string };

export type ClaudeCodeWindowSceneProps = {
  /** 窗体尺寸:full=全幅 168–1752(盖人);center=居中 1200×720 */
  size?: 'full' | 'center';
  /** 顶部 ASCII 品牌块(启动画面);false 只留会话 */
  showHeader?: boolean;
  /** 品牌块第 2 行模型信息 */
  model?: string;
  /** 品牌块第 3 行工作目录 */
  cwd?: string;
  /** 用户输入(❯ 后逐字打出) */
  promptText?: string;
  /** 每帧打几个字的倒数:cpf=2 → 每 2 帧一个字 */
  typeCpf?: number;
  /** Claude 回应行,打完 prompt 后逐行落下 */
  lines?: CcLine[];
  /** 相邻回应行间隔(帧) */
  lineGap?: number;
  /** 状态行左侧短路径 */
  statusCwd?: string;
  /** 状态行进度:段首 → 段末(随回应行数上跳) */
  percentFrom?: number;
  percentTo?: number;
  /** 模式行文字(空串 = 不显示模式行) */
  modeText?: string;
  /** 模式行尾巴(如「← 2 agents」) */
  modeExtra?: string;
  /** Agent 面板行(空 = 不显示面板) */
  agents?: { name: string; excerpt?: string; meta?: string }[];
  /** 字号 */
  fontSize?: number;
};

const DEFAULT_LINES: CcLine[] = [
  { kind: 'tool', text: 'Read(public/captions.srt)' },
  { kind: 'result', text: 'Read 212 lines' },
  { kind: 'dot', text: '归成 14 个语义段。每段一个画面意图,不切声音。' },
  { kind: 'tool', text: 'Write(storyboard-plan.json)' },
  { kind: 'result', text: 'Wrote 14 segments' },
  { kind: 'dot', text: '计划写好了,开审片台可以逐段看。' },
];

const BOXES = {
  full: { x: FULL_TERMINAL_X, y: 60, w: FULL_TERMINAL_W, h: 840 },
  center: { x: 360, y: 150, w: 1200, h: 720 },
} as const;
const WIN_PAD = 22;
const BAR_H = 34;

/** 估一行文本在窗内占几行(mono:CJK 1em / 其它 0.6em;indentEm 为行首缩进) */
const emWidth = (s: string): number => {
  let w = 0;
  for (const ch of s) w += ch.charCodeAt(0) > 0x2e7f ? 1 : 0.6;
  return w;
};
const linesOf = (s: string, fontSize: number, innerW: number, indentEm = 0): number =>
  Math.max(1, Math.ceil(((emWidth(s) + indentEm) * fontSize) / innerW));

export const ClaudeCodeWindowScene: React.FC<ClaudeCodeWindowSceneProps> = ({
  size = 'full',
  showHeader = true,
  model = 'Opus 5 with xhigh effort · Claude Max',
  cwd = '~/项目/视频制作台/Remotion/视频项目/2026-09-05-demo',
  promptText = '把这条口播的 SRT 归成语义段,每段配一个画面意图,写进 storyboard-plan.json。',
  typeCpf = 2,
  lines = DEFAULT_LINES,
  lineGap = 12,
  statusCwd = '2026-09-05-demo',
  percentFrom = 8,
  percentTo = 14,
  modeText = '⏵⏵ auto mode on',
  modeExtra = '',
  agents = [] as { name: string; excerpt?: string; meta?: string }[],
  fontSize = 20,
}) => {
  const frame = useCurrentFrame();
  const BOX = BOXES[size] ?? BOXES.full;

  // 窗体落定:6 帧内 0.96→1 + 淡入
  const settle = interpolate(frame, [0, 6], [0, 1], { ...clampBoth, easing: EASE });

  // prompt 逐字:第 8 帧起;打完后 10 帧回应行开始逐行落下
  const typeFrom = 8;
  const typeEnd = typeFrom + Array.from(promptText).length * typeCpf;
  const linesFrom = typeEnd + 10;
  const lineAt = (i: number) => linesFrom + i * lineGap;

  // 单行入场:淡入 + 上浮 8px,6 帧
  const rise = (at: number): React.CSSProperties => ({
    opacity: interpolate(frame, [at, at + 6], [0, 1], { ...clampBoth, easing: EASE }),
    transform: `translateY(${interpolate(frame, [at, at + 6], [8, 0], { ...clampBoth, easing: EASE })}px)`,
  });

  const arrived = lines.filter((_, i) => frame >= lineAt(i)).length;
  const percent = Math.round(percentFrom + ((percentTo - percentFrom) * arrived) / Math.max(1, lines.length));

  const lineH = fontSize * 1.45;
  const hasPanel = agents.length > 0;
  const hasMode = modeText !== '';
  const rows: AgentRow[] = hasPanel
    ? [{ name: 'main', state: 'lead' }, ...agents.map((a) => ({ name: a.name, excerpt: a.excerpt, meta: a.meta, state: 'idle' as AgentRow['state'] }))]
    : [];

  /* 会话流上滚(真终端行为):可视流高 = 窗内容区 − 底部固定区;内容高按行数估算 */
  const bottomH = lineH * (2 + (hasMode ? 1 : 0) + rows.length) + 8 + 26 + 16;
  const flowH = BOX.h - BAR_H - WIN_PAD - bottomH;
  const innerW = BOX.w - WIN_PAD * 2 - 3;
  let contentH = (showHeader ? 3 * fontSize * 1.35 + lineH * 0.35 * 2 + 1 : 0) + linesOf(promptText, fontSize, innerW, 1.2) * lineH + lineH * 0.4;
  lines.forEach((l, i) => {
    const at = lineAt(i);
    if (frame < at) return;
    const prog = interpolate(frame, [at, at + 6], [0, 1], clampBoth);
    const indent = l.kind === 'result' ? 2.6 : l.kind === 'plain' || l.kind === 'dim' ? 0 : 1.2;
    contentH += linesOf(l.text, fontSize, innerW, indent) * lineH * prog;
  });
  const flowScroll = Math.max(0, contentH - flowH);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <TerminalWindow box={BOX} opacity={settle} scale={0.96 + 0.04 * settle} fontSize={fontSize} padding={WIN_PAD} barHeight={BAR_H}>
        {/* 可视流区 */}
        <div style={{ position: 'absolute', left: WIN_PAD, right: WIN_PAD, top: WIN_PAD, height: flowH, overflow: 'hidden' }}>
          <div style={{ transform: `translateY(${-flowScroll}px)` }}>
            {showHeader ? (
              <>
                <CcLogoHeader model={model} cwd={cwd} />
                <Rule style={{ margin: `${lineH * 0.35}px 0` }} />
              </>
            ) : null}

            {/* ❯ 用户 prompt 逐字 */}
            <div style={{ display: 'flex', whiteSpace: 'pre-wrap', color: CC.fg, lineHeight: 1.45 }}>
              <span style={{ color: CC.fg, marginRight: 8 }}>❯</span>
              <span style={{ flex: 1 }}>
                {typed(promptText, frame, typeFrom, typeCpf)}
                <BlockCursor frame={frame} on={frame < typeEnd + 6 ? 1 : 0} />
              </span>
            </div>

            {/* 回应行 */}
            <div style={{ marginTop: lineH * 0.4, whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>
              {lines.map((l, i) => {
                const at = lineAt(i);
                if (frame < at) return null;
                const st = rise(at);
                if (l.kind === 'result') {
                  return (
                    <div key={i} style={{ ...st, color: CC.dim }}>
                      {'  ⎿  '}{l.text}
                    </div>
                  );
                }
                if (l.kind === 'dim') {
                  return (
                    <div key={i} style={{ ...st, color: CC.dim }}>{l.text}</div>
                  );
                }
                if (l.kind === 'plain') {
                  return (
                    <div key={i} style={{ ...st, color: CC.fg }}>{l.text}</div>
                  );
                }
                // dot / tool:「⏺ 正文」;tool 的函数名加粗
                const paren = l.kind === 'tool' ? l.text.indexOf('(') : -1;
                return (
                  <div key={i} style={{ ...st, color: CC.fg }}>
                    <span style={{ color: CC.fg }}>⏺</span>{' '}
                    {paren > 0 ? (<><b>{l.text.slice(0, paren)}</b>{l.text.slice(paren)}</>) : l.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 底部固定区:输入行 + 状态行 + 模式行 + 面板 */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: `0 ${WIN_PAD}px 16px`, lineHeight: 1.45, backgroundColor: CC.bg }}>
          <Rule />
          <div style={{ display: 'flex', alignItems: 'baseline', padding: '4px 0' }}>
            <span style={{ color: CC.fg, marginRight: 8 }}>❯</span>
            <BlockCursor frame={frame} on={frame >= typeEnd + 6 ? 1 : 0} />
          </div>
          <Rule />
          <StatusLine cwdShort={statusCwd} percent={percent} />
          {hasMode ? <ModeLine mode={modeText} extra={modeExtra} /> : null}
          {hasPanel ? <AgentPanel rows={rows} /> : null}
        </div>
      </TerminalWindow>
    </AbsoluteFill>
  );
};

/** 镜头说明书(SceneTag)—— 值纯字面量。 */
export const ccwindowTag: SceneTag = {
  id: 'ccwindow',
  componentName: 'ClaudeCodeWindowScene',
  title: 'Claude Code 镜像窗',
  category: 'AI 对话·终端',
  style: '品牌·双主题',
  status: 'stable',
  intent: '一扇真实 Claude Code 2.1.259 镜像窗:用户 prompt 逐字打出,Claude 的回应行(⏺ 工具调用 / ⎿ 结果 / 正文)一行行落下,底部 ❯ 光标闪、状态行进度随之上跳——「我在终端里让它干活」的界面 B-roll',
  suitableFor: '口播讲「我让 Claude Code 做了 X」「它读了 / 写了 / 跑了什么」的段落;任何需要看见真终端界面而不是示意图的地方',
  notFor: '多个 agent 互发消息 / 开会的段落(需要会话流往来节拍,另造);需要展示按键操作或分屏的段落;纯代码文件展示(用 code)',
  exampleBeats: ['我直接跟它说 把这条口播归成段 每段配个画面', '它自己去读字幕 写计划 一句话没让我操心'],
  form: 'F4',
  defaultPose: 'audio-only',
  fullscreenOnly: true,
  needsExternalAsset: false,
  assetType: null,
  textBinding: 'promptText',
  fields: [
    { key: 'size', label: '窗体尺寸', type: 'enum', tier: 'primary', default: 'full', values: ['full', 'center'], help: 'full=全幅盖人(168–1752);center=居中 1200×720' },
    { key: 'promptText', label: '用户输入', type: 'text', tier: 'primary', required: true, default: '把这条口播的 SRT 归成语义段,每段配一个画面意图,写进 storyboard-plan.json。', help: '❯ 后逐字打出的那句,写你真的会对 Claude Code 说的话' },
    {
      key: 'lines', label: '回应行', type: 'list', tier: 'primary',
      default: [
        { kind: 'tool', text: 'Read(public/captions.srt)' },
        { kind: 'result', text: 'Read 212 lines' },
        { kind: 'dot', text: '归成 14 个语义段。每段一个画面意图,不切声音。' },
        { kind: 'tool', text: 'Write(storyboard-plan.json)' },
        { kind: 'result', text: 'Wrote 14 segments' },
        { kind: 'dot', text: '计划写好了,开审片台可以逐段看。' },
      ],
      help: '打完 prompt 后逐行落下;kind: tool=「⏺ Read(path)」/ result=「⎿ 结果」灰行 / dot=「⏺ 正文」/ plain=正文 / dim=灰字',
      itemFields: [
        { key: 'kind', label: '形态', type: 'enum', tier: 'primary', required: true, values: ['dot', 'tool', 'result', 'plain', 'dim'] },
        { key: 'text', label: '文字', type: 'text', tier: 'primary', required: true },
      ],
    },
    { key: 'showHeader', label: '显示品牌块', type: 'boolean', tier: 'advanced', default: true, help: '顶部 ASCII 启动画面;讲到会话中途可关' },
    { key: 'model', label: '模型行', type: 'text', tier: 'advanced', default: 'Opus 5 with xhigh effort · Claude Max' },
    { key: 'cwd', label: '工作目录', type: 'text', tier: 'advanced', default: '~/项目/视频制作台/Remotion/视频项目/2026-09-05-demo' },
    { key: 'typeCpf', label: '打字速度', type: 'number', tier: 'advanced', default: 2, help: '每几帧打一个字;越小越快' },
    { key: 'lineGap', label: '行间隔(帧)', type: 'number', tier: 'advanced', default: 12 },
    { key: 'statusCwd', label: '状态行路径', type: 'text', tier: 'advanced', default: '2026-09-05-demo' },
    { key: 'percentFrom', label: '进度起', type: 'number', tier: 'advanced', default: 8 },
    { key: 'percentTo', label: '进度止', type: 'number', tier: 'advanced', default: 14 },
    { key: 'modeText', label: '模式行', type: 'text', tier: 'advanced', default: '⏵⏵ auto mode on', help: '留空 = 不显示模式行' },
    { key: 'modeExtra', label: '模式行尾巴', type: 'text', tier: 'advanced', default: '' },
    {
      key: 'agents', label: 'Agent 面板行', type: 'list', tier: 'advanced', default: [], help: '不填 = 不显示面板;填了底部出「⏺ main + ◯ 队员」面板',
      itemFields: [
        { key: 'name', label: '名字', type: 'text', tier: 'primary', required: true },
        { key: 'excerpt', label: '摘要', type: 'text', tier: 'primary' },
        { key: 'meta', label: '右侧计时·token', type: 'text', tier: 'primary' },
      ],
    },
    { key: 'fontSize', label: '字号', type: 'number', tier: 'advanced', default: 20 },
  ],
  catalog: {
    narratorPosition: '不出现/仅声音,画面被全屏终端镜像窗覆盖',
    supportingElements: ['Claude Code 品牌块', '❯ 逐字 prompt', '⏺ / ⎿ 回应行', '状态行进度条', '⏵⏵ 模式行'],
    animation: '窗体六帧落定 → prompt 逐字打出 → 回应行逐行淡入上浮 → 超出窗高时旧行被顶出窗顶 → 终态底部光标闪',
    background: '透明(装配层铺底)+ 奶油底镜像窗(浅色主题)',
  },
  previewSeconds: 7,
  preview: { version: 1, kind: 'scene', background: 'transparent', context: 'none', galleryLoop: 'once' },
  tagVersion: 1,
};

export default ClaudeCodeWindowScene;
