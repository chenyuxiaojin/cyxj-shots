/**
 * paper.tsx —— 编辑部·纸面家族共享件(2026-08-24 镜头库大修阶段1)。
 *
 * 家族语言真源 = 差评君档案纸面(视频项目/2026-07-24-wenyan-ai-token/src/common.tsx,只抄语言按晋升标准重写)
 * + 拉片研究(参考/顶级知识片元素系统-2026-08-24.md):纹理律(永不纯白底)/单响色律/应答律。
 * 色值一律取 styles.PAPER_PRESET;本文件只放家族件,品牌 token 件别混进来。
 *
 * ⚠️ 共享组件内部用普通 div 不用 AbsoluteFill(≥4.0.515 AbsoluteFill 在 Studio 画布自动可交互,
 * 共享件内用它会被误拖污染全实例——2026-08-24 fullchain-smoke 实测加固方案)。
 */
import type { FC, ReactNode, CSSProperties } from 'react';
import React from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { PAPER_PRESET } from '../styles';

const P = PAPER_PRESET;

/** 家族字体栈(与差评君工程 common.tsx 同源;出片工程负责真正加载字体子集) */
export const PAPER_FONTS = {
  serif: '"Noto Serif SC", "Songti SC", serif',
  sans: '"Noto Sans SC", sans-serif',
  didone: '"Playfair Display", "Noto Serif SC", serif',
} as const;

/** 小写命名以匹配 hard-rules 守卫的 clamp 检测 */
export const clampPaper = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const FILL: CSSProperties = { position: 'absolute', inset: 0 };

/**
 * <PaperStage> —— 家族舞台底:浅暖灰米纸 + 88px 方格纸网格 + feTurbulence 纸纹颗粒 + 边缘暗角。
 * children 吃「全片唯一相机语言」极缓推近 ~1.6%(微动可读防死帧,职能在此记载;drift=false 关闭)。
 */
export const PaperStage: FC<{ children?: ReactNode; drift?: boolean }> = ({
  children,
  drift = true,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = drift
    ? interpolate(frame, [0, durationInFrames], [1, 1.016], {
        ...clampPaper,
        easing: Easing.inOut(Easing.quad),
      })
    : 1;
  return (
    <div style={{ ...FILL, backgroundColor: P.stage }}>
      <div
        style={{
          ...FILL,
          backgroundImage: `repeating-linear-gradient(0deg, ${P.line} 0px, ${P.line} 2px, transparent 2px, transparent 88px), repeating-linear-gradient(90deg, ${P.line} 0px, ${P.line} 2px, transparent 2px, transparent 88px)`,
        }}
      />
      <div style={{ ...FILL, opacity: 0.05, mixBlendMode: 'multiply' }}>
        <svg width="100%" height="100%">
          <filter id="paperStageNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#paperStageNoise)" />
        </svg>
      </div>
      <div style={{ ...FILL, scale: String(scale) }}>{children}</div>
      <div
        style={{
          ...FILL,
          pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 46%, transparent 58%, ${P.wash} 100%)`,
        }}
      />
    </div>
  );
};

/** 文本按 accentWord 切段(找不到就整段不标)。荧光笔扫亮的家族共享切分。 */
export const splitPaperAccent = (
  text: string,
  accentWord?: string,
): Array<{ text: string; accent: boolean }> => {
  if (!accentWord) return [{ text, accent: false }];
  const i = text.indexOf(accentWord);
  if (i === -1) return [{ text, accent: false }];
  return [
    { text: text.slice(0, i), accent: false },
    { text: accentWord, accent: true },
    { text: text.slice(i + accentWord.length), accent: false },
  ].filter((p) => p.text.length > 0);
};

/**
 * <PaperMarkText> —— 档案黄荧光笔扫亮文本(Mark 手法,家族共享;单响色律的唯一响色出口):
 * accentWord 命中子串垫黄带,sweepPct 0→100 从左扫亮。黄带色 = PAPER_PRESET.yellow @0.62。
 */
export const PaperMarkText: FC<{ text: string; accentWord?: string; sweepPct: number }> = ({
  text,
  accentWord,
  sweepPct,
}) => (
  <>
    {splitPaperAccent(text, accentWord).map((part, i) =>
      part.accent ? (
        <span
          key={i}
          style={{
            backgroundImage: `linear-gradient(rgba(227,179,58,0.62), rgba(227,179,58,0.62))`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${sweepPct}% 58%`,
            backgroundPosition: '0% 82%',
            padding: '0 6px',
          }}
        >
          {part.text}
        </span>
      ) : (
        <span key={i}>{part.text}</span>
      ),
    )}
  </>
);

/**
 * <PaperSeal> —— 红印章(差评君 RedSeal 真源语法,家族共享):
 * 1.7→1 八帧 cubic-out 盖下 + 透明度封顶 0.94 + mixBlendMode multiply 让印泥吃进纸纹。
 * at 为落章帧(本地帧);定论/落款用。
 */
export const PaperSeal: FC<{
  text: string;
  at?: number;
  rotate?: number;
  fontSize?: number;
  style?: CSSProperties;
}> = ({ text, at = 0, rotate = -7, fontSize = 44, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t8 = Math.round((8 / 30) * fps);
  const t6 = Math.round((6 / 30) * fps);
  const scale = interpolate(frame, [at, at + t8], [1.7, 1], {
    ...clampPaper,
    easing: Easing.out(Easing.cubic),
  });
  const opacity = interpolate(frame, [at, at + t6], [0, 0.94], clampPaper);
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '10px 22px',
        border: `5px solid ${P.red}`,
        color: P.red,
        fontFamily: PAPER_FONTS.serif,
        fontWeight: 900,
        fontSize,
        letterSpacing: 8,
        whiteSpace: 'nowrap',
        rotate: `${rotate}deg`,
        scale: String(scale),
        opacity,
        mixBlendMode: 'multiply',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/**
 * <PaperNameTag> —— 纸面名牌(差评君 NameTag + StickerLabel 盖章入场的合体):
 * 卡面暖白 + 细边 + 柔投影 + 微旋转,scale 盖章式落定后静止。口播标签/人物名牌用。
 */
export const PaperNameTag: FC<{
  text: string;
  at?: number;
  rotate?: number;
  fontSize?: number;
  style?: CSSProperties;
}> = ({ text, at = 0, rotate = -2, fontSize = 34, style }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - at);
  const scale = interpolate(local, [0, 7], [1.35, 1], {
    ...clampPaper,
    easing: Easing.out(Easing.cubic),
  });
  const opacity = interpolate(local, [0, 4], [0, 1], clampPaper);
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '12px 30px',
        background: P.card,
        color: P.ink,
        fontFamily: PAPER_FONTS.sans,
        fontWeight: 700,
        fontSize,
        letterSpacing: 2,
        border: '1px solid rgba(38,35,30,0.08)',
        boxShadow: P.shadowSoft,
        rotate: `${rotate}deg`,
        scale: String(scale),
        opacity,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
