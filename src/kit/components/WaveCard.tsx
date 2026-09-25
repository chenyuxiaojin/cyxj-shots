/**
 * WaveCard —— 「波涌卡」共享件(2026-09-04 从 LabelSwitchCompareScene 的标签卡抽出;第 2 消费者即晋升)。
 *
 * 语言 = labelswitch 那张标签卡(与 wavedots 波涌背景成对入库,小陈 2026-09-01 验收):
 *   钴蓝填充 #003196 / 电蓝描边 #0057ff / 冰蓝字 #a0cdfe / 顶部 18% 提亮渐变 / 双层辉光 / 圆角≈11 / 大号描边数字水印。
 * 2026-09-04 小陈拍板:《Agent Teams》片里所有标题卡 / 底座卡 / 对比卡统一用这一款,别再各画各的暗玻璃卡。
 *
 * 颜色纪律:这组色是复刻件定色,不是 theme token(与 labelswitch 同一例外:复刻件保留来源身份);消费者可整体覆盖。
 * 字:纯英文/数字走 display italic uppercase(原件);含 CJK 的文案自动改 zh 粗体正体——合成斜体对中文难看,
 *   且 text-stroke × italic 在 Chrome 下会多画一条斜线(labelswitch TRACE.md 战疤),数字水印一律 skewX 代替 italic。
 * 帧驱动纪律:本件不读时钟;入场进度 progress(0..1)由调用方用 useCurrentFrame 算出传入。
 */
import React from 'react';
import { FONT_STACKS, withAlpha } from './styleTokens';

/** 逻辑画布(HARD_RULES ③-0):几何常数以 1920 宽为基准 */
const W = 1920;

export const WAVE_CARD = {
  fill: '#003196',
  border: '#0057ff',
  text: '#a0cdfe',
  textHi: '#ffffff', // highlight 卡文字
  borderHi: '#4d8dff', // highlight 卡描边
  arrow: '#ffffff',
  radius: 11,
  borderWidth: Math.max(2, W * 0.0018), // ≈3.5
  numeralOpacity: 0.25,
} as const;

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
/* 实证曲线族(labelswitch TRACE.md):入场 expo-out;回稳 easeOutQuart;滑动 easeInOutQuint */
export const expoOut = (t: number): number => (t >= 1 ? 1 : 1 - 2 ** (-7 * clamp01(t)));
export const easeOutQuart = (t: number): number => 1 - (1 - clamp01(t)) ** 4;
export const easeInOutQuint = (t: number): number => {
  const p = clamp01(t);
  return p < 0.5 ? 16 * p ** 5 : 1 - (-2 * p + 2) ** 5 / 2;
};

export const hasCJK = (s: string): boolean => /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/.test(s);

/** 白色下指箭头(原件几何) */
export const WaveArrow: React.FC<{ width: number; height: number; color?: string; style?: React.CSSProperties }> = ({ width, height, color = WAVE_CARD.arrow, style }) => (
  <svg width={width} height={height} viewBox="0 0 94 150" style={{ display: 'block', overflow: 'visible', ...style }}>
    <path d="M 33 0 L 61 0 L 61 88 L 90 88 L 47 148 L 4 88 L 33 88 Z" fill={color} stroke={color} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

/** 文案「宽度单位」:CJK 一字 1em,拉丁/数字/空格 0.6em */
export const textUnits = (text: string): number => Array.from(text).reduce((n, ch) => n + (hasCJK(ch) ? 1 : 0.6), 0);

/** 按卡尺寸与文案长度自动定字号 */
export const waveFontSize = (text: string, boxW: number, boxH: number, textScale = 1): number => {
  const units = Math.max(1, textUnits(text));
  const cjk = hasCJK(text);
  const minUnits = cjk ? 4 : 4.8;
  return Math.min(boxH * (cjk ? 0.34 : 0.32), (boxW * 0.86) / Math.max(minUnits, units)) * textScale;
};

export type WaveCardProps = {
  width: number;
  height: number;
  /** 主文案 */
  label: string;
  /** 次文案(小字,label 之下) */
  sub?: string;
  /** 水印数字(不传 = 不画) */
  numeral?: string | number;
  numeralOpacity?: number;
  /** 入场进度 0..1(0.1→1 缩放 expo-out;0 = 不渲染) */
  progress?: number;
  /** 降权 0..1(1 = 完全降权:透明度 0.55、去辉光) */
  demote?: number;
  /** 强调卡:白字 + 亮描边 + 强辉光 */
  highlight?: boolean;
  textScale?: number;
  /** 直接钉字号(px);给了就不按卡尺寸自动算 */
  fontSizePx?: number;
  subFontSizePx?: number;
  fill?: string;
  border?: string;
  text?: string;
  /** 正文对齐(默认居中) */
  align?: 'center' | 'left';
  style?: React.CSSProperties;
  /** 自定义正文(给了就不画 label/sub) */
  children?: React.ReactNode;
};

export const WaveCard: React.FC<WaveCardProps> = ({
  width,
  height,
  label,
  sub,
  numeral,
  numeralOpacity = WAVE_CARD.numeralOpacity,
  progress = 1,
  demote = 0,
  highlight = false,
  textScale = 1,
  fontSizePx,
  subFontSizePx,
  fill = WAVE_CARD.fill,
  border,
  text,
  align = 'center',
  style,
  children,
}) => {
  if (progress <= 0) return null;
  const edge = border ?? (highlight ? WAVE_CARD.borderHi : WAVE_CARD.border);
  const ink = text ?? (highlight ? WAVE_CARD.textHi : WAVE_CARD.text);
  const scale = 0.1 + 0.9 * expoOut(progress);
  const glowA = (highlight ? 1.5 : 1) * (1 - 0.85 * demote);
  const cjk = hasCJK(label);
  const hasNumeral = numeral !== undefined && numeral !== null && numeral !== '';
  // 左对齐 + 有水印数字:正文让出左侧数字区,别叠在数字上
  const numeralZone = align === 'left' && hasNumeral ? Math.round(height * 0.9) : 0;
  const fontSize = fontSizePx ?? waveFontSize(label, width - numeralZone, sub ? height * 0.62 : height, textScale);
  const subSize = sub ? subFontSizePx ?? Math.min(height * 0.16, fontSize * 0.52) : 0;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        transform: `scale(${scale})`,
        transformOrigin: '50% 50%',
        opacity: 1 - 0.45 * demote,
        borderRadius: WAVE_CARD.radius,
        border: `${WAVE_CARD.borderWidth}px solid ${edge}`,
        background: `linear-gradient(180deg, ${withAlpha(edge, 0.18)} 0%, transparent 18%), ${fill}`,
        boxShadow: `0 0 ${W * 0.012 * glowA}px ${withAlpha(edge, 0.22)}, 0 0 ${W * 0.035 * glowA}px ${withAlpha(edge, 0.08)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'left' ? 'flex-start' : 'center',
        padding: align === 'left' ? `0 ${Math.round(height * 0.22)}px` : '0 18px',
        overflow: 'hidden',
        ...style,
      }}
    >
      {hasNumeral ? (
        <span
          style={{
            position: 'absolute',
            left: align === 'left' ? `${Math.round(height * 0.16)}px` : '50%',
            top: '50%',
            // 斜体用 skewX(战疤:合成斜体 × text-stroke 多画一条斜线)
            transform: `translate(${align === 'left' ? '0' : '-50%'}, -50%) skewX(-12deg)`,
            fontFamily: FONT_STACKS.display,
            fontStyle: 'normal',
            fontWeight: 800,
            fontSize: height * 1.5,
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: `${Math.max(1.5, W * 0.0013)}px ${withAlpha(WAVE_CARD.text, numeralOpacity)}`,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {String(numeral)}
        </span>
      ) : null}
      {children ?? (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: align === 'left' ? 'flex-start' : 'center', lineHeight: 1.05, marginLeft: numeralZone }}>
          <span
            style={{
              fontFamily: cjk ? FONT_STACKS.zh : FONT_STACKS.display,
              fontStyle: cjk ? 'normal' : 'italic',
              fontWeight: 700,
              fontSize,
              letterSpacing: cjk ? '0.04em' : '0.02em',
              textTransform: cjk ? 'none' : 'uppercase',
              whiteSpace: 'nowrap',
              color: ink,
              textShadow: `0 0 ${W * 0.007}px ${withAlpha(ink, 0.35)}`,
            }}
          >
            {label}
          </span>
          {sub ? (
            <span
              style={{
                marginTop: Math.round(subSize * 0.45),
                fontFamily: hasCJK(sub) ? FONT_STACKS.zh : FONT_STACKS.display,
                fontWeight: 600,
                fontSize: subSize,
                letterSpacing: hasCJK(sub) ? '0.04em' : '0.14em',
                textTransform: hasCJK(sub) ? 'none' : 'uppercase',
                whiteSpace: 'nowrap',
                color: withAlpha(ink, 0.66),
              }}
            >
              {sub}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default WaveCard;
