/**
 * AiInputShotsScene -- reusable AI input UI shots.
 *
 * Ported from the create-vibe-motion workbench into L1 so L2 projects can
 * assemble Claude / Codex / Gemini / Claude Code input shots from props.json.
 * Animation is deterministic and driven by useCurrentFrame().
 *
 * ⚠️ 用法契约(2026-07-05 loop-intro 实战踩坑):
 *   1. transparentBackground 默认 true —— 当全屏盖镜头用(底下有口播人像)必须显式传 false,
 *      否则 composer 半透明浮在人脸上(claude-code 分支例外,恒不透明)。
 *   2. responseText 只有 claude-code 分支渲染;claude/codex/gemini 分支不渲(传了 = 死 prop)。
 *      claude-code 分支不传则上屏 DEFAULT 的界面设计话术 —— 正式出片必须显式传贴合口播的文案。
 *   3. 默认打字/发送节奏按 ~5.8s 镜头设计(typingStart 0.65 / sendAt 3.45);
 *      窗口 <5s 时要传 typingStartSec / typingDurationSec / sendAtSec 压紧,否则响应来不及上屏。
 */
import {CLAMP as MOTION_CLAMP} from '../components/motion';
import {FONT_STACKS, withAlpha} from '../components/styleTokens';
import {DesignCanvas} from '../components/DesignCanvas';
import {sliceTypewriterText} from '../components/TextEffects';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import type {SceneTag} from '../schema/sceneTag';

const DESIGN_W = 1920;
const DESIGN_H = 1080;
const CLAMP = MOTION_CLAMP;
const FONT = FONT_STACKS.zh;
const MONO = FONT_STACKS.monoZh;

export type AiInputProvider = 'claude' | 'codex' | 'gemini' | 'claude-code';

export type AiInputShotsSceneProps = {
  provider?: AiInputProvider;
  promptText?: string;
  headlineText?: string;
  responseText?: string;
  transparentBackground?: boolean;
  backgroundColor?: string;
  composerColor?: string;
  accentColor?: string;
  sendColor?: string;
  darkBackgroundColor?: string;
  darkComposerColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  fontScale?: number;
  typingStartSec?: number;
  typingDurationSec?: number;
  sendAtSec?: number;
  sendDurationSec?: number;
  cursorTravelSec?: number;
  showCursor?: boolean;
  sceneDurationFrames?: number;
};

type RuntimeProps = Required<
  Pick<
    AiInputShotsSceneProps,
    | 'provider'
    | 'promptText'
    | 'headlineText'
    | 'responseText'
    | 'transparentBackground'
    | 'backgroundColor'
    | 'composerColor'
    | 'accentColor'
    | 'sendColor'
    | 'darkBackgroundColor'
    | 'darkComposerColor'
    | 'textColor'
    | 'mutedTextColor'
    | 'fontScale'
    | 'typingStartSec'
    | 'typingDurationSec'
    | 'sendAtSec'
    | 'sendDurationSec'
    | 'cursorTravelSec'
    | 'showCursor'
  >
> & {
  frame: number;
  fps: number;
  durationInFrames: number;
  typedText: string;
  typingProgress: number;
  sendProgress: number;
  commitProgress: number;
  thinkingProgress: number;
  cursorMoveProgress: number;
  cursorAppearProgress: number;
  cursorClickProgress: number;
  caretVisible: boolean;
};

const providerTargets: Record<Exclude<AiInputProvider, 'claude-code'>, {x: number; y: number}> = {
  claude: {x: 1582, y: 579},
  codex: {x: 1838, y: 600},
  gemini: {x: 1628, y: 614},
};

const cursorStart = {x: 1842, y: 925};

const defaults = {
  provider: 'claude' as AiInputProvider,
  promptText: "Let's design an interface for a new AI workbench",
  headlineText: 'CYXJ，我们开始吧',
  responseText:
    '你好，小陈\n\n我已经收到需求。接下来我会先确认界面状态，再把它拆成可复用的镜头代码。',
  transparentBackground: true,
  backgroundColor: theme.warmPaper.canvas,
  composerColor: theme.colors.white,
  accentColor: theme.colors.orange,
  sendColor: theme.colors.orange,
  darkBackgroundColor: theme.darkGlass.bg,
  darkComposerColor: 'rgba(22,24,28,.92)',
  textColor: theme.colors.ink,
  mutedTextColor: theme.colors.inkMuted,
  fontScale: 1,
  typingStartSec: 0.65,
  typingDurationSec: 2.15,
  sendAtSec: 3.45,
  sendDurationSec: 0.55,
  cursorTravelSec: 0.58,
  showCursor: true,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
const linear = (value: number) => value;

const toNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toText = (value: unknown, fallback: string) => {
  if (typeof value !== 'string') return fallback;
  const resolved = value.trim();
  return resolved.length > 0 ? resolved : fallback;
};

const toColor = (value: unknown, fallback: string) =>
  typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;

const progress = (
  frame: number,
  startFrame: number,
  durationFrames: number,
  easing: (value: number) => number = Easing.inOut(Easing.cubic),
) =>
  interpolate(frame, [startFrame, startFrame + Math.max(1, durationFrames)], [0, 1], {
    ...CLAMP,
    easing,
  });

const resolveProvider = (value: unknown): AiInputProvider => {
  if (value === 'codex' || value === 'gemini' || value === 'claude-code') return value;
  return 'claude';
};

const resolveRuntime = (props: AiInputShotsSceneProps): Omit<
  RuntimeProps,
  | 'frame'
  | 'fps'
  | 'durationInFrames'
  | 'typedText'
  | 'typingProgress'
  | 'sendProgress'
  | 'commitProgress'
  | 'thinkingProgress'
  | 'cursorMoveProgress'
  | 'cursorAppearProgress'
  | 'cursorClickProgress'
  | 'caretVisible'
> => ({
  provider: resolveProvider(props.provider),
  promptText: toText(props.promptText, defaults.promptText),
  headlineText: toText(props.headlineText, defaults.headlineText),
  responseText: toText(props.responseText, defaults.responseText),
  transparentBackground:
    typeof props.transparentBackground === 'boolean'
      ? props.transparentBackground
      : defaults.transparentBackground,
  backgroundColor: toColor(props.backgroundColor, defaults.backgroundColor),
  composerColor: toColor(props.composerColor, defaults.composerColor),
  accentColor: toColor(props.accentColor, defaults.accentColor),
  sendColor: toColor(props.sendColor, defaults.sendColor),
  darkBackgroundColor: toColor(props.darkBackgroundColor, defaults.darkBackgroundColor),
  darkComposerColor:
    typeof props.darkComposerColor === 'string' ? props.darkComposerColor : defaults.darkComposerColor,
  textColor: toColor(props.textColor, defaults.textColor),
  mutedTextColor: toColor(props.mutedTextColor, defaults.mutedTextColor),
  fontScale: clamp(toNumber(props.fontScale, defaults.fontScale), 0.75, 1.3),
  typingStartSec: clamp(toNumber(props.typingStartSec, defaults.typingStartSec), 0, 2),
  typingDurationSec: clamp(toNumber(props.typingDurationSec, defaults.typingDurationSec), 0.4, 4.5),
  sendAtSec: toNumber(props.sendAtSec, defaults.sendAtSec),
  sendDurationSec: clamp(toNumber(props.sendDurationSec, defaults.sendDurationSec), 0.2, 1.2),
  cursorTravelSec: clamp(toNumber(props.cursorTravelSec, defaults.cursorTravelSec), 0.15, 1.4),
  showCursor: props.showCursor !== false,
});

const buildRuntime = (
  props: AiInputShotsSceneProps,
  frame: number,
  fps: number,
): RuntimeProps => {
  const resolved = resolveRuntime(props);
  const durationInFrames = Math.max(1, props.sceneDurationFrames ?? Math.round(5.8 * fps));
  const boundedFrame = Math.min(Math.max(0, Math.floor(frame)), durationInFrames - 1);
  const typingStartFrame = Math.round(resolved.typingStartSec * fps);
  const typingDurationFrames = Math.max(1, Math.round(resolved.typingDurationSec * fps));
  const typingEndFrame = typingStartFrame + typingDurationFrames;
  const requestedSendFrame = Math.round(resolved.sendAtSec * fps);
  const sendStartFrame = Math.max(requestedSendFrame, typingEndFrame + Math.round(0.18 * fps));
  const sendDurationFrames = Math.max(1, Math.round(resolved.sendDurationSec * fps));
  const cursorTravelFrames = Math.max(1, Math.round(resolved.cursorTravelSec * fps));
  const cursorStartFrame = Math.max(0, sendStartFrame - cursorTravelFrames);
  const typingProgress = progress(boundedFrame, typingStartFrame, typingDurationFrames, linear);

  return {
    ...resolved,
    frame: boundedFrame,
    fps,
    durationInFrames,
    typedText: sliceTypewriterText(
      resolved.promptText,
      boundedFrame,
      typingStartFrame,
      typingDurationFrames,
    ),
    typingProgress,
    sendProgress: progress(boundedFrame, sendStartFrame, sendDurationFrames, Easing.out(Easing.cubic)),
    commitProgress: progress(
      boundedFrame,
      sendStartFrame + Math.round(sendDurationFrames * 0.35),
      Math.round(0.46 * fps),
      Easing.out(Easing.cubic),
    ),
    thinkingProgress: progress(
      boundedFrame,
      sendStartFrame + Math.round(sendDurationFrames * 0.72),
      Math.round(0.65 * fps),
      Easing.out(Easing.cubic),
    ),
    cursorMoveProgress: progress(boundedFrame, cursorStartFrame, cursorTravelFrames),
    cursorAppearProgress: resolved.showCursor
      ? progress(boundedFrame, Math.max(0, cursorStartFrame - 10), 10, Easing.out(Easing.cubic))
      : 0,
    cursorClickProgress: progress(boundedFrame, sendStartFrame, Math.round(0.24 * fps), Easing.out(Easing.cubic)),
    caretVisible: boundedFrame < sendStartFrame && Math.floor(boundedFrame / 14) % 2 === 0,
  };
};

const UpArrowIcon: React.FC<{color?: string}> = ({color = 'currentColor'}) => (
  <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
    <path
      d="M24 38V11M13 22L24 11L35 22"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4.2"
    />
  </svg>
);

const PlusIcon: React.FC<{color?: string}> = ({color = 'currentColor'}) => (
  <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
    <path d="M24 10V38M10 24H38" fill="none" stroke={color} strokeLinecap="round" strokeWidth="3.4" />
  </svg>
);

const MicIcon: React.FC<{color?: string}> = ({color = 'currentColor'}) => (
  <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
    <path
      d="M24 8C20.7 8 18 10.7 18 14V25C18 28.3 20.7 31 24 31C27.3 31 30 28.3 30 25V14C30 10.7 27.3 8 24 8Z"
      fill="none"
      stroke={color}
      strokeWidth="3.4"
    />
    <path
      d="M12 24C12 31 17 36 24 36M24 36C31 36 36 31 36 24M24 36V42"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="3.4"
    />
  </svg>
);

const ShieldIcon: React.FC<{color?: string}> = ({color = 'currentColor'}) => (
  <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
    <path
      d="M24 6L37 11V22C37 31.5 31.6 38.2 24 42C16.4 38.2 11 31.5 11 22V11L24 6Z"
      fill="none"
      stroke={color}
      strokeLinejoin="round"
      strokeWidth="3.4"
    />
    <path d="M24 17V26M24 32H24.1" fill="none" stroke={color} strokeLinecap="round" strokeWidth="3.6" />
  </svg>
);

const StopIcon: React.FC<{color?: string}> = ({color = 'currentColor'}) => (
  <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
    <rect x="16" y="16" width="16" height="16" rx="3" fill={color} />
  </svg>
);

const SpinnerIcon: React.FC<{color?: string; rotation?: number}> = ({
  color = 'currentColor',
  rotation = 0,
}) => (
  <svg
    viewBox="0 0 48 48"
    width="100%"
    height="100%"
    aria-hidden="true"
    style={{transform: `rotate(${rotation}deg)`}}
  >
    <path
      d="M38 24C38 31.7 31.7 38 24 38C16.3 38 10 31.7 10 24C10 16.3 16.3 10 24 10"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="4"
    />
  </svg>
);

const CopyIcon: React.FC<{color?: string}> = ({color = 'currentColor'}) => (
  <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
    <rect x="18" y="12" width="18" height="24" rx="4" fill="none" stroke={color} strokeWidth="3" />
    <rect x="12" y="18" width="18" height="24" rx="4" fill="none" stroke={color} strokeWidth="3" />
  </svg>
);

const SendTriangleIcon: React.FC<{color?: string}> = ({color = 'currentColor'}) => (
  <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
    <path
      d="M9 8L39 24L9 40V28L25 24L9 20Z"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3.6"
    />
  </svg>
);

const SlidersIcon: React.FC<{color?: string}> = ({color = 'currentColor'}) => (
  <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
    <path
      d="M10 16H22M30 16H38M26 11V21M10 32H16M24 32H38M20 27V37"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="3.4"
    />
  </svg>
);

const GlobeIcon: React.FC<{color?: string}> = ({color = 'currentColor'}) => (
  <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
    <circle cx="24" cy="24" r="16" fill="none" stroke={color} strokeWidth="3.2" />
    <path
      d="M8 24H40M24 8C29 13 31 18 31 24C31 30 29 35 24 40M24 8C19 13 17 18 17 24C17 30 19 35 24 40"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="3.2"
    />
  </svg>
);

const SparkIcon: React.FC<{color?: string}> = ({color = 'currentColor'}) => (
  <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
    <path
      d="M24 5C25.2 15.5 32.5 22.8 43 24C32.5 25.2 25.2 32.5 24 43C22.8 32.5 15.5 25.2 5 24C15.5 22.8 22.8 15.5 24 5Z"
      fill={color}
    />
  </svg>
);

const MouseCursor: React.FC<{
  provider: Exclude<AiInputProvider, 'claude-code'>;
  color: string;
  cursorMoveProgress: number;
  cursorClickProgress: number;
  cursorAppearProgress: number;
}> = ({provider, color, cursorMoveProgress, cursorClickProgress, cursorAppearProgress}) => {
  const target = providerTargets[provider];
  const x = lerp(cursorStart.x, target.x, cursorMoveProgress);
  const y = lerp(cursorStart.y, target.y, cursorMoveProgress);
  const clickScale = lerp(1, 0.86, Math.sin(cursorClickProgress * Math.PI));
  const opacity =
    cursorAppearProgress * lerp(1, 0, clamp((cursorClickProgress - 0.88) / 0.12, 0, 1));

  return (
    <svg
      viewBox="0 0 92 118"
      width={92}
      height={118}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 50,
        opacity,
        transform: `translate(-12px, -16px) scale(${clickScale})`,
        transformOrigin: '20px 20px',
        filter: `drop-shadow(0 5px 10px ${withAlpha(color, 0.38)})`,
      }}
    >
      <path
        d="M9 7L82 78L51 82L66 112L50 118L35 88L11 111Z"
        fill={theme.colors.white}
        stroke={theme.colors.ink}
        strokeLinejoin="round"
        strokeWidth="5"
      />
    </svg>
  );
};

const TypedText: React.FC<{
  text: string;
  caretVisible: boolean;
  color: string;
  fontSize: number;
  lineHeight?: number;
  weight?: number;
}> = ({text, caretVisible, color, fontSize, lineHeight = 1.25, weight = 500}) => (
  <div
    style={{
      color,
      fontFamily: FONT,
      fontSize,
      fontWeight: weight,
      lineHeight,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    }}
  >
    {text}
    {caretVisible ? <span style={{display: 'inline-block', marginLeft: 4, opacity: 0.84}}>|</span> : null}
  </div>
);

const ThinkingDots: React.FC<{progressValue: number; color: string}> = ({progressValue, color}) => {
  if (progressValue <= 0) return null;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 8, opacity: progressValue}}>
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: color,
            opacity: 0.46 + 0.28 * Math.sin(progressValue * Math.PI + dot * 1.4),
          }}
        />
      ))}
    </div>
  );
};

const IconSquare: React.FC<{
  children: React.ReactNode;
  size?: number;
  borderColor: string;
  color: string;
}> = ({children, size = 94, borderColor, color}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 22,
      border: `3px solid ${borderColor}`,
      color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <div style={{width: size * 0.45, height: size * 0.45}}>{children}</div>
  </div>
);

const ClaudeInput: React.FC<{runtime: RuntimeProps}> = ({runtime}) => {
  const inputOpacity = lerp(1, 0, runtime.commitProgress);
  const buttonPress = Math.sin(runtime.sendProgress * Math.PI);
  const claudeText = runtime.textColor;
  const claudeMuted = runtime.mutedTextColor;
  const claudeOrange = runtime.accentColor;
  // 标题对比度直修(2026-07-27 round2 静帧证据):透明底时本镜叠在暗 A-roll/预览黑底上,
  // 标题恒用 ink 近黑 = 深字压深底几乎不可读。透明底改走 theme 暖白 + 墨色柔影托底;
  // 不透明底(warmPaper 亮底)保持 ink 原样,渲染结果不变。
  const headlineColor = runtime.transparentBackground ? theme.darkGlass.onDark : claudeText;
  const headlineShadow = runtime.transparentBackground
    ? `0 2px 16px ${withAlpha(theme.colors.ink, 0.55)}`
    : 'none';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: runtime.transparentBackground ? 'transparent' : runtime.backgroundColor,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 58%, ${withAlpha(runtime.accentColor, 0.10)}, transparent 44%)`,
          opacity: runtime.transparentBackground ? 0 : 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 220,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 18,
          color: headlineColor,
          fontFamily: FONT,
          fontSize: 44 * runtime.fontScale,
          fontWeight: 600,
          textShadow: headlineShadow,
        }}
      >
        <span style={{width: 38, height: 38, color: claudeOrange}}>
          <SparkIcon color={claudeOrange} />
        </span>
        <span>How can I help you today?</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 284,
          top: 382,
          width: 1352,
          height: 236,
          borderRadius: 28,
          background: runtime.composerColor,
          border: `1.5px solid ${withAlpha(claudeText, 0.12)}`,
          boxShadow: theme.shadow.card,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 30,
            top: 26,
            right: 30,
            opacity: inputOpacity,
            transform: `translateY(${-24 * runtime.commitProgress}px)`,
          }}
        >
          <TypedText
            text={runtime.typedText}
            caretVisible={runtime.caretVisible}
            color={claudeText}
            fontSize={26 * runtime.fontScale}
            lineHeight={1.34}
            weight={450}
          />
        </div>
        <div style={{position: 'absolute', left: 24, bottom: 18, display: 'flex', alignItems: 'center', gap: 12}}>
          <IconSquare size={44} borderColor={withAlpha(claudeText, 0.14)} color={claudeMuted}>
            <PlusIcon />
          </IconSquare>
          <IconSquare size={44} borderColor={withAlpha(claudeText, 0.14)} color={claudeMuted}>
            <SlidersIcon />
          </IconSquare>
          <IconSquare size={44} borderColor={withAlpha(claudeText, 0.14)} color={claudeMuted}>
            <GlobeIcon />
          </IconSquare>
          <div
            style={{
              height: 44,
              padding: '0 16px',
              borderRadius: 22,
              border: `1.5px solid ${withAlpha(claudeText, 0.14)}`,
              color: claudeMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT,
              fontSize: 18 * runtime.fontScale,
              fontWeight: 650,
              opacity: inputOpacity,
            }}
          >
            Claude Sonnet 4.5 ▾
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 22,
            bottom: 18,
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: claudeOrange,
            color: theme.colors.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${lerp(1, 0.95, buttonPress)})`,
            boxShadow: buttonPress > 0 ? `0 0 ${18 + buttonPress * 18}px ${withAlpha(claudeOrange, 0.34)}` : 'none',
          }}
        >
          <span style={{width: 28, height: 28}}>
            <UpArrowIcon color={theme.colors.white} />
          </span>
        </div>
        <div style={{position: 'absolute', right: 88, bottom: 28, height: 26}}>
          <ThinkingDots progressValue={runtime.commitProgress} color={claudeOrange} />
        </div>
      </div>
    </div>
  );
};

const CodexInput: React.FC<{runtime: RuntimeProps}> = ({runtime}) => {
  const buttonPress = Math.sin(runtime.sendProgress * Math.PI);
  const inputOpacity = lerp(1, 0, runtime.commitProgress);
  const placeholderOpacity = clamp((runtime.commitProgress - 0.18) / 0.72, 0, 1);
  const bubbleOpacity = clamp((runtime.commitProgress - 0.08) / 0.92, 0, 1);
  const thinkingOpacity = clamp((runtime.thinkingProgress - 0.08) / 0.92, 0, 1);
  const stopOpacity = clamp((runtime.sendProgress - 0.38) / 0.62, 0, 1);
  const composerTop = 424;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: runtime.transparentBackground ? 'transparent' : runtime.composerColor,
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: 52,
          top: composerTop - 184,
          maxWidth: 860,
          opacity: bubbleOpacity,
          transform: `translateY(${lerp(28, 0, bubbleOpacity)}px)`,
          borderRadius: 27,
          padding: '22px 28px',
          background: withAlpha(runtime.mutedTextColor, 0.13),
          color: runtime.textColor,
          fontFamily: FONT,
          fontSize: 31 * runtime.fontScale,
          fontWeight: 560,
          lineHeight: 1.3,
          boxShadow: `0 1px 0 ${withAlpha(runtime.textColor, 0.04)}`,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {runtime.promptText}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 58,
          top: composerTop - 84,
          width: 36,
          height: 36,
          opacity: bubbleOpacity,
          color: withAlpha(runtime.textColor, 0.42),
        }}
      >
        <CopyIcon color={withAlpha(runtime.textColor, 0.42)} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: composerTop - 58,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          opacity: thinkingOpacity,
          color: withAlpha(runtime.textColor, 0.48),
          fontFamily: FONT,
          fontSize: 31 * runtime.fontScale,
          fontWeight: 470,
        }}
      >
        <span>正在思考</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 18,
          right: 18,
          top: composerTop,
          height: 232,
          borderRadius: 34,
          background: runtime.composerColor,
          border: `1.5px solid ${withAlpha(runtime.textColor, 0.12)}`,
          boxShadow: theme.shadow.card,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 30,
            top: 34,
            right: 118,
            opacity: inputOpacity,
            transform: `translateY(${-14 * runtime.commitProgress}px)`,
          }}
        >
          <TypedText
            text={runtime.typedText}
            caretVisible={runtime.caretVisible}
            color={runtime.textColor}
            fontSize={31 * runtime.fontScale}
            lineHeight={1.35}
            weight={520}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 30,
            top: 34,
            right: 118,
            opacity: placeholderOpacity,
            transform: `translateY(${lerp(14, 0, placeholderOpacity)}px)`,
            color: withAlpha(runtime.textColor, 0.38),
            fontFamily: FONT,
            fontSize: 31 * runtime.fontScale,
            lineHeight: 1.35,
            fontWeight: 470,
          }}
        >
          要求后续变更
        </div>
        <div
          style={{
            position: 'absolute',
            left: 32,
            bottom: 25,
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            color: runtime.mutedTextColor,
            fontFamily: FONT,
            fontSize: 26 * runtime.fontScale,
          }}
        >
          <div style={{width: 36, height: 36}}>
            <PlusIcon color={runtime.mutedTextColor} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, color: runtime.accentColor, fontWeight: 720}}>
            <span style={{width: 28, height: 28}}>
              <ShieldIcon color={runtime.accentColor} />
            </span>
            <span>完全访问⌄</span>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 116,
            bottom: 29,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            color: runtime.mutedTextColor,
            fontFamily: FONT,
            fontSize: 28 * runtime.fontScale,
          }}
        >
          <span style={{width: 34, height: 34, color: runtime.mutedTextColor}}>
            <SpinnerIcon color={runtime.mutedTextColor} rotation={runtime.frame * 7} />
          </span>
          <span style={{color: runtime.textColor, fontWeight: 760}}>5.5</span>
          <span>超高⌄</span>
          <span style={{width: 34, height: 34}}>
            <MicIcon color={runtime.mutedTextColor} />
          </span>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 28,
            bottom: 20,
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: theme.colors.chrome,
            transform: `scale(${lerp(1, 0.88, buttonPress)})`,
            boxShadow: buttonPress > 0 ? `0 0 26px ${withAlpha(theme.colors.chrome, 0.35)}` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{position: 'absolute', width: 48, height: 48, opacity: lerp(1, 0, stopOpacity)}}>
            <UpArrowIcon color={theme.colors.white} />
          </span>
          <span style={{position: 'absolute', width: 48, height: 48, opacity: stopOpacity}}>
            <StopIcon color={theme.colors.white} />
          </span>
        </div>
      </div>
    </div>
  );
};

const GeminiInput: React.FC<{runtime: RuntimeProps}> = ({runtime}) => {
  const lightText = theme.darkGlass.onDark;
  const softText = theme.darkGlass.muted;
  const buttonPress = Math.sin(runtime.sendProgress * Math.PI);
  const inputOpacity = lerp(1, 0, runtime.commitProgress);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: runtime.transparentBackground ? 'transparent' : runtime.darkBackgroundColor,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 48% 70%, ${withAlpha(runtime.accentColor, 0.24)}, transparent 42%)`,
          opacity: runtime.transparentBackground ? 0 : 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 338,
          left: 0,
          width: '100%',
          textAlign: 'center',
          color: lightText,
          fontFamily: FONT,
          fontSize: 60 * runtime.fontScale,
          fontWeight: 400,
        }}
      >
        {runtime.headlineText}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 228,
          top: 550,
          width: 1464,
          height: 128,
          borderRadius: 64,
          background: runtime.darkComposerColor,
          boxShadow: theme.shadow.dark,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{marginLeft: 42, width: 48, height: 48, color: softText}}>
          <PlusIcon color={softText} />
        </div>
        <div
          style={{
            marginLeft: 28,
            width: 980,
            opacity: inputOpacity,
            transform: `translateY(${-14 * runtime.commitProgress}px)`,
          }}
        >
          <TypedText
            text={runtime.typedText}
            caretVisible={runtime.caretVisible}
            color={runtime.typedText.length > 0 ? lightText : runtime.mutedTextColor}
            fontSize={32 * runtime.fontScale}
            lineHeight={1.3}
            weight={400}
          />
        </div>
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 34,
            marginRight: 36,
            color: softText,
            fontFamily: FONT,
            fontSize: 30 * runtime.fontScale,
          }}
        >
          <span>Pro⌄</span>
          <span style={{width: 42, height: 42}}>
            <MicIcon color={softText} />
          </span>
          <div
            style={{
              width: 66,
              height: 66,
              borderRadius: '50%',
              background: runtime.typedText.length > 0 || runtime.sendProgress > 0 ? lightText : withAlpha(lightText, 0.1),
              transform: `scale(${lerp(1, 0.88, buttonPress)})`,
              boxShadow: buttonPress > 0 ? `0 0 28px ${withAlpha(runtime.accentColor, 0.42)}` : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UpArrowIcon
              color={runtime.typedText.length > 0 || runtime.sendProgress > 0 ? runtime.darkBackgroundColor : softText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CrabMascot: React.FC<{color: string}> = ({color}) => (
  <svg viewBox="0 0 24 24" width="164" height="164" aria-hidden="true">
    <path
      d="M20.998 10.949H24v3.102h-3v3.028h-1.487V20H18v-2.921h-1.487V20H15v-2.921H9V20H7.488v-2.921H6V20H4.487v-2.921H3V14.05H0V10.95h3V5h17.998v5.949zM6 10.949h1.488V8.102H6v2.847zm10.51 0H18V8.102h-1.49v2.847z"
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);

const ClaudeCodeInput: React.FC<{runtime: RuntimeProps}> = ({runtime}) => {
  const cursorOpacity = runtime.caretVisible || Math.floor(runtime.frame / 14) % 2 === 0 ? 1 : 0;
  const outputProgress = clamp((runtime.thinkingProgress - 0.28) / 0.72, 0, 1);
  const synthProgress = runtime.thinkingProgress * lerp(1, 0.18, outputProgress);
  const outputLines = runtime.responseText.split('\n').filter(Boolean).slice(0, 7);

  return (
    <div style={{position: 'absolute', inset: 0, background: runtime.composerColor}}>
      <div
        style={{
          position: 'absolute',
          left: 14,
          top: 8,
          right: 14,
          height: 54,
          borderRadius: 28,
          border: `3px solid ${withAlpha(runtime.textColor, 0.16)}`,
          background: runtime.backgroundColor,
          color: runtime.textColor,
          fontFamily: FONT,
          fontSize: 24,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ~/项目/内容创作 - Claude Code - caffeinate ‹ Claude
      </div>
      <div style={{position: 'absolute', left: 24, top: 88}}>
        <CrabMascot color={runtime.accentColor} />
      </div>
      <div style={{position: 'absolute', left: 220, top: 94, fontFamily: MONO, color: runtime.textColor}}>
        <div style={{fontSize: 34 * runtime.fontScale, fontWeight: 800}}>
          Claude Code <span style={{color: runtime.mutedTextColor, fontWeight: 600}}>v2.1.195</span>
        </div>
        <div style={{marginTop: 8, fontSize: 31 * runtime.fontScale, color: runtime.mutedTextColor}}>
          Opus 4.8 (1M context) with xhigh effort · Claude Max
        </div>
        <div style={{marginTop: 8, fontSize: 31 * runtime.fontScale, color: runtime.mutedTextColor}}>
          ~/项目/内容创作
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 52,
          top: 318,
          right: 84,
          opacity: runtime.commitProgress,
          transform: `translateY(${lerp(22, 0, runtime.commitProgress)}px)`,
          fontFamily: MONO,
          color: runtime.textColor,
          fontSize: 31 * runtime.fontScale,
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
        }}
      >
        <span style={{color: runtime.mutedTextColor, marginRight: 12}}>›</span>
        {runtime.promptText}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 52,
          top: 388,
          right: 88,
          opacity: synthProgress,
          fontFamily: MONO,
          color: runtime.accentColor,
          fontSize: 27 * runtime.fontScale,
          lineHeight: 1.45,
        }}
      >
        ✣ Synthesizing...
      </div>
      <div
        style={{
          position: 'absolute',
          left: 52,
          top: 392,
          right: 88,
          opacity: outputProgress,
          transform: `translateY(${lerp(22, 0, outputProgress)}px)`,
          fontFamily: MONO,
          color: runtime.textColor,
          fontSize: 27 * runtime.fontScale,
          lineHeight: 1.52,
          whiteSpace: 'pre-wrap',
        }}
      >
        {outputLines.map((line, index) => (
          <div key={`${line}-${index}`} style={{marginTop: index === 0 ? 0 : 12}}>
            {line}
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 16,
          bottom: 154,
          right: 52,
          height: 2,
          background: withAlpha(runtime.textColor, 0.42),
          opacity: 0.78,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 16,
          bottom: 210,
          right: 52,
          minHeight: 52,
          display: 'flex',
          alignItems: 'center',
          fontFamily: MONO,
          fontSize: 31 * runtime.fontScale,
          color: runtime.textColor,
        }}
      >
        <span style={{marginRight: 16}}>›</span>
        <span style={{opacity: lerp(1, 0, runtime.commitProgress), whiteSpace: 'pre-wrap'}}>{runtime.typedText}</span>
        <span
          style={{
            display: 'inline-block',
            width: 18,
            height: 34,
            marginLeft: 8,
            background: runtime.mutedTextColor,
            opacity: lerp(cursorOpacity, 0, runtime.commitProgress),
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 16,
          bottom: 176,
          right: 52,
          height: 2,
          background: withAlpha(runtime.textColor, 0.42),
          opacity: 0.78,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 58,
          bottom: 130,
          fontFamily: MONO,
          color: theme.colors.blue,
          fontSize: 28 * runtime.fontScale,
          fontWeight: 700,
        }}
      >
        项目/内容创作 · <span style={{color: theme.colors.orange}}>(main)</span> ·{' '}
        <span style={{color: runtime.mutedTextColor}}>Opus 4.8 (1M context)</span> ·{' '}
        <span style={{color: runtime.sendColor}}>auto mode on</span>
      </div>
    </div>
  );
};

export const AiInputShotsScene: React.FC<AiInputShotsSceneProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const runtime = buildRuntime(props, frame, fps);

  const scene =
    runtime.provider === 'codex' ? (
      <CodexInput runtime={runtime} />
    ) : runtime.provider === 'gemini' ? (
      <GeminiInput runtime={runtime} />
    ) : runtime.provider === 'claude-code' ? (
      <ClaudeCodeInput runtime={runtime} />
    ) : (
      <ClaudeInput runtime={runtime} />
    );

  return (
    <AbsoluteFill
      style={{
        background: runtime.transparentBackground && runtime.provider !== 'claude-code'
          ? 'transparent'
          : runtime.backgroundColor,
      }}
    >
      <DesignCanvas width={DESIGN_W} height={DESIGN_H}>
        {scene}
        {runtime.showCursor && runtime.provider !== 'claude-code' ? (
          <MouseCursor
            provider={runtime.provider}
            color={runtime.accentColor}
            cursorMoveProgress={runtime.cursorMoveProgress}
            cursorClickProgress={runtime.cursorClickProgress}
            cursorAppearProgress={runtime.cursorAppearProgress}
          />
        ) : null}
      </DesignCanvas>
    </AbsoluteFill>
  );
};

/**
 * 镜头说明书(SceneTag)—— 见 ../schema/sceneTag.ts。
 * 与 AiInputShotsScene 同文件 co-located(Q3「先镜像」)。这是可切 provider 的总口。
 * 说明:sceneDurationFrames 由 EdlRenderer 注入(EDL 概念,不进 fields);颜色多数缺省走 theme(非字面量),
 *   故这些 color 字段不给 default(以 help 说明),对齐组件「未显式给就用 theme」的行为。
 */
export const aiinputTag: SceneTag = {
  id: 'aiinput',
  componentName: 'AiInputShotsScene',
  title: 'AI 输入页(可换 AI)',
  category: 'AI 对话·终端',
  style: '品牌·双主题',
  status: 'stable',
  intent: '复刻 Claude/Codex/Gemini/Claude Code 输入框:逐字打字 → 发送 → 思考状态,provider 可切换',
  suitableFor: '演示在 AI 工具里打字、发送、等待思考的过程，provider 可切换。',
  notFor: '需要 Claude Code 专用终端输出时用 claudecodeinput；普通 Claude/Codex/Gemini 输入演示都由本镜 provider 切换',
  form: 'F4',
  defaultPose: 'audio-only',
  fullscreenOnly: true,
  needsExternalAsset: false,
  assetType: null,
  textBinding: 'promptText',
  fields: [
    { key: 'provider', label: '产品', type: 'enum', tier: 'primary', required: true, default: 'claude', values: ['claude', 'codex', 'gemini', 'claude-code'], help: '渲染哪个产品的输入页 UI' },
    { key: 'promptText', label: '提示词', type: 'text', tier: 'primary', default: "Let's design an interface for a new AI workbench", help: '输入框里逐字打出的提示词;默认接口播文本' },
    { key: 'headlineText', label: '标题/问候', type: 'text', tier: 'primary', default: 'CYXJ，我们开始吧', help: '标题/问候(Gemini 变体显示在输入框上方)' },
    { key: 'responseText', label: '回复', type: 'text', tier: 'primary', default: '你好，小陈\n\n我已经收到需求。接下来我会先确认界面状态，再把它拆成可复用的镜头代码。', help: '发送后浮出的回复(Claude Code 变体按 \\n 拆成多行输出)' },
    { key: 'transparentBackground', label: '透明底', type: 'boolean', tier: 'advanced', default: true, help: '透明底便于叠层;Claude Code 变体忽略此项(恒绘终端底)' },
    { key: 'fontScale', label: '字号缩放', type: 'number', tier: 'advanced', default: 1, help: '整体字号缩放(0.75..1.3)' },
    { key: 'typingStartSec', label: '打字开始秒', type: 'number', tier: 'advanced', default: 0.65, help: '打字开始本地秒' },
    { key: 'typingDurationSec', label: '打字时长秒', type: 'number', tier: 'advanced', default: 2.15, help: '打字时长秒' },
    { key: 'sendAtSec', label: '发送秒', type: 'number', tier: 'advanced', default: 3.45, help: '发送触发本地秒' },
    { key: 'sendDurationSec', label: '发送时长秒', type: 'number', tier: 'advanced', default: 0.55, help: '发送动画时长秒' },
    { key: 'cursorTravelSec', label: '光标移动秒', type: 'number', tier: 'advanced', default: 0.58, help: '鼠标移到发送键的时长秒' },
    { key: 'showCursor', label: '显示鼠标', type: 'boolean', tier: 'advanced', default: true, help: '是否显示鼠标(Claude Code 变体无鼠标)' },
    { key: 'accentColor', label: '强调色', type: 'color', tier: 'advanced', help: '强调色;缺省走 theme 陶土橙' },
    { key: 'backgroundColor', label: '亮底色', type: 'color', tier: 'advanced', help: '亮底色;缺省走 theme warmPaper' },
    { key: 'composerColor', label: '输入框色', type: 'color', tier: 'advanced', help: '输入框底色;缺省走 theme' },
    { key: 'sendColor', label: '发送键色', type: 'color', tier: 'advanced', help: '发送键色;缺省走 theme 橙' },
    { key: 'textColor', label: '正文色', type: 'color', tier: 'advanced', help: '正文色;缺省走 theme ink' },
    { key: 'mutedTextColor', label: '弱化文字色', type: 'color', tier: 'advanced', help: '弱化文字色;缺省走 theme inkMuted' },
    { key: 'darkBackgroundColor', label: '暗底色', type: 'color', tier: 'advanced', help: '暗底色(Gemini 变体用);缺省走 theme darkGlass' },
    { key: 'darkComposerColor', label: '暗输入框色', type: 'color', tier: 'advanced', default: 'rgba(22,24,28,.92)', help: '暗输入框色(Gemini 变体用)' },
  ],
  catalog: {
    narratorPosition: '不出现/仅声音，画面被全屏 UI 覆盖',
    supportingElements: ['UI', '关键词'],
    animation: '其他-在 AI 对话框里逐字打字 → 发送 → 思考状态（可切 provider）',
    background: '全屏 AI 工具输入页 UI',
  },
  tagVersion: 1,
  promotedFrom: 'create-vibe-motion',
};

export const ClaudeInputScene: React.FC<AiInputShotsSceneProps> = (props) => (
  <AiInputShotsScene {...props} provider="claude" />
);

/**
 * 镜头说明书(SceneTag)—— provider 锁死 'claude' 的变体(=AiInputShotsScene provider="claude")。
 * fields 相较 aiinput 去掉 provider(该字段锁死,写进 intent/notFor)。
 */
export const claudeinputTag: SceneTag = {
  id: 'claudeinput',
  componentName: 'ClaudeInputScene',
  title: 'Claude 输入页',
  category: 'AI 对话·终端',
  style: '品牌·双主题',
  status: 'deprecated',
  intent: '在 Claude 对话框里逐字打字 → 发送 → 思考状态(provider 锁死 claude)',
  suitableFor: '在 Claude 对话框里打字、发送、思考的输入页镜头（aiinput 的 Claude 变体）。',
  notFor: 'provider 已锁死为 Claude;要换产品或需要可切换用 aiinput / 对应变体',
  form: 'F4',
  defaultPose: 'audio-only',
  fullscreenOnly: true,
  needsExternalAsset: false,
  assetType: null,
  textBinding: 'promptText',
  fields: [
    { key: 'promptText', label: '提示词', type: 'text', tier: 'primary', default: "Let's design an interface for a new AI workbench", help: '输入框里逐字打出的提示词;默认接口播文本' },
    { key: 'transparentBackground', label: '透明底', type: 'boolean', tier: 'advanced', default: true, help: '透明底便于叠层' },
    { key: 'fontScale', label: '字号缩放', type: 'number', tier: 'advanced', default: 1, help: '整体字号缩放(0.75..1.3)' },
    { key: 'typingStartSec', label: '打字开始秒', type: 'number', tier: 'advanced', default: 0.65, help: '打字开始本地秒' },
    { key: 'typingDurationSec', label: '打字时长秒', type: 'number', tier: 'advanced', default: 2.15, help: '打字时长秒' },
    { key: 'sendAtSec', label: '发送秒', type: 'number', tier: 'advanced', default: 3.45, help: '发送触发本地秒' },
    { key: 'sendDurationSec', label: '发送时长秒', type: 'number', tier: 'advanced', default: 0.55, help: '发送动画时长秒' },
    { key: 'cursorTravelSec', label: '光标移动秒', type: 'number', tier: 'advanced', default: 0.58, help: '鼠标移到发送键的时长秒' },
    { key: 'showCursor', label: '显示鼠标', type: 'boolean', tier: 'advanced', default: true, help: '是否显示鼠标' },
    { key: 'accentColor', label: '强调色', type: 'color', tier: 'advanced', help: '强调色;缺省走 theme 陶土橙' },
    { key: 'backgroundColor', label: '亮底色', type: 'color', tier: 'advanced', help: '亮底色;缺省走 theme warmPaper' },
    { key: 'composerColor', label: '输入框色', type: 'color', tier: 'advanced', help: '输入框底色;缺省走 theme' },
    { key: 'sendColor', label: '发送键色', type: 'color', tier: 'advanced', help: '发送键色;缺省走 theme 橙' },
    { key: 'textColor', label: '正文色', type: 'color', tier: 'advanced', help: '正文色;缺省走 theme ink' },
    { key: 'mutedTextColor', label: '弱化文字色', type: 'color', tier: 'advanced', help: '弱化文字色;缺省走 theme inkMuted' },
    { key: 'darkBackgroundColor', label: '暗底色', type: 'color', tier: 'advanced', help: '暗底色;缺省走 theme darkGlass' },
    { key: 'darkComposerColor', label: '暗输入框色', type: 'color', tier: 'advanced', default: 'rgba(22,24,28,.92)', help: '暗输入框色' },
  ],
  catalog: {
    narratorPosition: '不出现/仅声音，画面被全屏 UI 覆盖',
    supportingElements: ['UI', '关键词'],
    animation: '其他-Claude 对话框逐字打字 → 发送 → 思考状态',
    background: '全屏 Claude 输入页 UI',
  },
  tagVersion: 1,
  promotedFrom: 'create-vibe-motion',
};

export const CodexInputScene: React.FC<AiInputShotsSceneProps> = (props) => (
  <AiInputShotsScene {...props} provider="codex" />
);

/**
 * 镜头说明书(SceneTag)—— provider 锁死 'codex' 的变体(=AiInputShotsScene provider="codex")。
 * fields 相较 aiinput 去掉 provider(该字段锁死,写进 intent/notFor)。
 */
export const codexinputTag: SceneTag = {
  id: 'codexinput',
  componentName: 'CodexInputScene',
  title: 'Codex 输入页',
  category: 'AI 对话·终端',
  style: '品牌·双主题',
  status: 'deprecated',
  intent: '在 Codex 对话框里逐字打字 → 发送 → 思考状态(provider 锁死 codex)',
  suitableFor: '在 Codex 对话框里打字、发送、思考的输入页镜头（aiinput 的 Codex 变体）。',
  notFor: '常规选 aiinput(provider 可切),本预设仅 Codex 专题时用;provider 已锁死为 Codex,要换产品或需要可切换用 aiinput / 对应变体',
  form: 'F4',
  defaultPose: 'audio-only',
  fullscreenOnly: true,
  needsExternalAsset: false,
  assetType: null,
  textBinding: 'promptText',
  fields: [
    { key: 'promptText', label: '提示词', type: 'text', tier: 'primary', default: "Let's design an interface for a new AI workbench", help: '输入框里逐字打出的提示词(也回显为已发气泡);默认接口播文本' },
    { key: 'transparentBackground', label: '透明底', type: 'boolean', tier: 'advanced', default: true, help: '透明底便于叠层' },
    { key: 'fontScale', label: '字号缩放', type: 'number', tier: 'advanced', default: 1, help: '整体字号缩放(0.75..1.3)' },
    { key: 'typingStartSec', label: '打字开始秒', type: 'number', tier: 'advanced', default: 0.65, help: '打字开始本地秒' },
    { key: 'typingDurationSec', label: '打字时长秒', type: 'number', tier: 'advanced', default: 2.15, help: '打字时长秒' },
    { key: 'sendAtSec', label: '发送秒', type: 'number', tier: 'advanced', default: 3.45, help: '发送触发本地秒' },
    { key: 'sendDurationSec', label: '发送时长秒', type: 'number', tier: 'advanced', default: 0.55, help: '发送动画时长秒' },
    { key: 'cursorTravelSec', label: '光标移动秒', type: 'number', tier: 'advanced', default: 0.58, help: '鼠标移到发送键的时长秒' },
    { key: 'showCursor', label: '显示鼠标', type: 'boolean', tier: 'advanced', default: true, help: '是否显示鼠标' },
    { key: 'accentColor', label: '强调色', type: 'color', tier: 'advanced', help: '强调色;缺省走 theme 陶土橙' },
    { key: 'backgroundColor', label: '亮底色', type: 'color', tier: 'advanced', help: '亮底色;缺省走 theme warmPaper' },
    { key: 'composerColor', label: '输入框色', type: 'color', tier: 'advanced', help: '输入框底色;缺省走 theme' },
    { key: 'sendColor', label: '发送键色', type: 'color', tier: 'advanced', help: '发送键色;缺省走 theme 橙' },
    { key: 'mutedTextColor', label: '弱化文字色', type: 'color', tier: 'advanced', help: '弱化文字色;缺省走 theme inkMuted' },
    { key: 'darkBackgroundColor', label: '暗底色', type: 'color', tier: 'advanced', help: '暗底色;缺省走 theme darkGlass' },
    { key: 'darkComposerColor', label: '暗输入框色', type: 'color', tier: 'advanced', default: 'rgba(22,24,28,.92)', help: '暗输入框色' },
  ],
  catalog: {
    narratorPosition: '不出现/仅声音，画面被全屏 UI 覆盖',
    supportingElements: ['UI', '关键词'],
    animation: '其他-Codex 对话框逐字打字 → 发送 → 思考状态',
    background: '全屏 Codex 输入页 UI',
  },
  tagVersion: 1,
  promotedFrom: 'create-vibe-motion',
};

export const GeminiInputScene: React.FC<AiInputShotsSceneProps> = (props) => (
  <AiInputShotsScene {...props} provider="gemini" />
);

/**
 * 镜头说明书(SceneTag)—— provider 锁死 'gemini' 的变体(=AiInputShotsScene provider="gemini")。
 * fields 相较 aiinput 去掉 provider(该字段锁死)。Gemini 变体为暗底,headlineText 居中显示在输入框上方。
 */
export const geminiinputTag: SceneTag = {
  id: 'geminiinput',
  componentName: 'GeminiInputScene',
  title: 'Gemini 输入页',
  category: 'AI 对话·终端',
  style: '品牌·双主题',
  status: 'deprecated',
  intent: '在 Gemini(暗底)对话框里逐字打字 → 发送 → 思考状态(provider 锁死 gemini)',
  suitableFor: '在 Gemini 对话框里打字、发送、思考的输入页镜头（aiinput 的 Gemini 变体）。',
  notFor: 'provider 已锁死为 Gemini;要换产品或需要可切换用 aiinput / 对应变体',
  form: 'F4',
  defaultPose: 'audio-only',
  fullscreenOnly: true,
  needsExternalAsset: false,
  assetType: null,
  textBinding: 'promptText',
  fields: [
    { key: 'promptText', label: '提示词', type: 'text', tier: 'primary', default: "Let's design an interface for a new AI workbench", help: '输入框里逐字打出的提示词;默认接口播文本' },
    { key: 'headlineText', label: '标题/问候', type: 'text', tier: 'primary', default: 'CYXJ，我们开始吧', help: '居中显示在输入框上方的大标题/问候' },
    { key: 'transparentBackground', label: '透明底', type: 'boolean', tier: 'advanced', default: true, help: '透明底便于叠层' },
    { key: 'fontScale', label: '字号缩放', type: 'number', tier: 'advanced', default: 1, help: '整体字号缩放(0.75..1.3)' },
    { key: 'typingStartSec', label: '打字开始秒', type: 'number', tier: 'advanced', default: 0.65, help: '打字开始本地秒' },
    { key: 'typingDurationSec', label: '打字时长秒', type: 'number', tier: 'advanced', default: 2.15, help: '打字时长秒' },
    { key: 'sendAtSec', label: '发送秒', type: 'number', tier: 'advanced', default: 3.45, help: '发送触发本地秒' },
    { key: 'sendDurationSec', label: '发送时长秒', type: 'number', tier: 'advanced', default: 0.55, help: '发送动画时长秒' },
    { key: 'cursorTravelSec', label: '光标移动秒', type: 'number', tier: 'advanced', default: 0.58, help: '鼠标移到发送键的时长秒' },
    { key: 'showCursor', label: '显示鼠标', type: 'boolean', tier: 'advanced', default: true, help: '是否显示鼠标' },
    { key: 'accentColor', label: '强调色', type: 'color', tier: 'advanced', help: '强调色;缺省走 theme 陶土橙' },
    { key: 'backgroundColor', label: '亮底色', type: 'color', tier: 'advanced', help: '亮底色;缺省走 theme warmPaper' },
    { key: 'composerColor', label: '输入框色', type: 'color', tier: 'advanced', help: '输入框底色;缺省走 theme' },
    { key: 'sendColor', label: '发送键色', type: 'color', tier: 'advanced', help: '发送键色;缺省走 theme 橙' },
    { key: 'mutedTextColor', label: '弱化文字色', type: 'color', tier: 'advanced', help: '弱化文字色;缺省走 theme inkMuted' },
    { key: 'darkBackgroundColor', label: '暗底色', type: 'color', tier: 'advanced', help: '暗底色(Gemini 主用);缺省走 theme darkGlass' },
    { key: 'darkComposerColor', label: '暗输入框色', type: 'color', tier: 'advanced', default: 'rgba(22,24,28,.92)', help: '暗输入框色(Gemini 主用)' },
  ],
  catalog: {
    narratorPosition: '不出现/仅声音，画面被全屏 UI 覆盖',
    supportingElements: ['UI', '关键词'],
    animation: '其他-Gemini 对话框逐字打字 → 发送 → 思考状态',
    background: '全屏 Gemini 输入页 UI',
  },
  tagVersion: 1,
  promotedFrom: 'create-vibe-motion',
};

export const ClaudeCodeInputScene: React.FC<AiInputShotsSceneProps> = (props) => (
  <AiInputShotsScene {...props} provider="claude-code" />
);

/**
 * 镜头说明书(SceneTag)—— provider 锁死 'claude-code' 的终端变体(=AiInputShotsScene provider="claude-code")。
 * fields 相较 aiinput 去掉 provider(锁死)。注:本终端变体【忽略 transparentBackground】(恒绘终端底)、且无鼠标
 *   (showCursor 无效);responseText 按 \n 拆成多行合成输出(取前 7 行)——这些差异写进各字段 help。
 */
export const claudecodeinputTag: SceneTag = {
  id: 'claudecodeinput',
  componentName: 'ClaudeCodeInputScene',
  title: 'Claude Code 输入页',
  category: 'AI 对话·终端',
  style: '品牌·双主题',
  status: 'deprecated',
  intent: '在 Claude Code 终端里逐字打 › 命令 → 发送 → 合成多行输出(provider 锁死 claude-code)',
  suitableFor: '在 Claude Code 里输入 prompt、发送、思考的输入页镜头（aiinput 的 Claude Code 变体）。',
  notFor: 'provider 已锁死为 Claude Code(终端);要换产品或需要可切换用 aiinput / 对应变体',
  form: 'F4',
  defaultPose: 'audio-only',
  fullscreenOnly: true,
  needsExternalAsset: false,
  assetType: null,
  textBinding: 'promptText',
  fields: [
    { key: 'promptText', label: '终端命令', type: 'text', tier: 'primary', default: "Let's design an interface for a new AI workbench", help: '终端里逐字打出的 › 命令;默认接口播文本' },
    { key: 'headlineText', label: '标题/问候', type: 'text', tier: 'primary', default: 'CYXJ，我们开始吧', help: '标题/问候(本终端变体不显著使用)' },
    { key: 'responseText', label: '合成输出', type: 'text', tier: 'primary', default: '你好，小陈\n\n我已经收到需求。接下来我会先确认界面状态，再把它拆成可复用的镜头代码。', help: '合成的多行输出,按 \\n 拆行(取前 7 行)' },
    { key: 'transparentBackground', label: '透明底', type: 'boolean', tier: 'advanced', default: true, help: '本终端变体忽略此项(恒绘终端底);传了也无效' },
    { key: 'fontScale', label: '字号缩放', type: 'number', tier: 'advanced', default: 1, help: '整体字号缩放(0.75..1.3)' },
    { key: 'typingStartSec', label: '打字开始秒', type: 'number', tier: 'advanced', default: 0.65, help: '打字开始本地秒' },
    { key: 'typingDurationSec', label: '打字时长秒', type: 'number', tier: 'advanced', default: 2.15, help: '打字时长秒' },
    { key: 'sendAtSec', label: '发送秒', type: 'number', tier: 'advanced', default: 3.45, help: '发送/提交本地秒' },
    { key: 'sendDurationSec', label: '发送时长秒', type: 'number', tier: 'advanced', default: 0.55, help: '发送动画时长秒' },
    { key: 'cursorTravelSec', label: '光标移动秒', type: 'number', tier: 'advanced', default: 0.58, help: '鼠标移动时长秒(本变体无鼠标,无效)' },
    { key: 'showCursor', label: '显示鼠标', type: 'boolean', tier: 'advanced', default: true, help: '本终端变体无鼠标,此项无效' },
    { key: 'accentColor', label: '强调色', type: 'color', tier: 'advanced', help: '强调色(蟹标/Synthesizing);缺省走 theme 陶土橙' },
    { key: 'backgroundColor', label: '亮底色', type: 'color', tier: 'advanced', help: '顶栏输入框底色;缺省走 theme warmPaper' },
    { key: 'composerColor', label: '终端底色', type: 'color', tier: 'advanced', help: '终端整体底色;缺省走 theme' },
    { key: 'sendColor', label: '状态色', type: 'color', tier: 'advanced', help: 'auto mode 状态色;缺省走 theme 橙' },
    { key: 'textColor', label: '正文色', type: 'color', tier: 'advanced', help: '终端正文色;缺省走 theme ink' },
    { key: 'mutedTextColor', label: '弱化文字色', type: 'color', tier: 'advanced', help: '弱化文字/光标色;缺省走 theme inkMuted' },
    { key: 'darkBackgroundColor', label: '暗底色', type: 'color', tier: 'advanced', help: '暗底色;缺省走 theme darkGlass' },
    { key: 'darkComposerColor', label: '暗输入框色', type: 'color', tier: 'advanced', default: 'rgba(22,24,28,.92)', help: '暗输入框色' },
  ],
  catalog: {
    narratorPosition: '不出现/仅声音，画面被全屏 UI 覆盖',
    supportingElements: ['UI', '终端'],
    animation: '其他-Claude Code 输入框逐字打字 → 发送 → 思考状态',
    background: '全屏 Claude Code 输入页 UI',
  },
  tagVersion: 1,
  promotedFrom: 'create-vibe-motion',
};

export default AiInputShotsScene;
