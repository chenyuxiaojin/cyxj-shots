/**
 * RankingDaysScene -- Day ranking UI shot.
 *
 * L1 stays dependency-free: this component only uses React + Remotion.
 * L2 projects expose the editable color/text controls through their own Zod schema.
 */
import {CLAMP as MOTION_CLAMP} from '../components/motion';
import {FONT_STACKS} from '../components/styleTokens';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {SceneTag} from '../schema/sceneTag';
import {theme} from '../theme';
import {withAlpha} from '../components/styleTokens';
import {CameraRig, type CameraWaypoint, useCamera} from '../components/CameraRig';

const DESIGN_W = 1920;
const DESIGN_H = 1080;
const CARD_W = 760;
const CARD_H = 392;
const CURSOR_START = {x: 1840, y: 980};
const ROW_TOP = 100;
const ROW_STEP = 72;
const ROW_H = 58;
const AUDIO_W = 62;
const CLAMP = MOTION_CLAMP;
const FONT = FONT_STACKS.display;
const BODY_FONT = FONT_STACKS.zh;

const gridTargets = [
  {cx: 500, cy: 278},
  {cx: 1420, cy: 278},
  {cx: 500, cy: 756},
  {cx: 1420, cy: 756},
];

export type RankingDayItem = {
  label: string;
  dimmed?: boolean;
};

export type RankingDay = {
  title: string;
  items: RankingDayItem[];
};

export type RankingDaysClick = {
  /** Legacy 0-based day index. Prefer clickDay for new props. */
  dayIndex?: number;
  /** Legacy 0-based row index. Prefer clickRow for new props. */
  rowIndex?: number;
  /** Legacy click second. New timing derives click from camera timing. */
  atSec?: number;
};

/**
 * 分类卡模式(cardMode='category')的卡片数据。复用本镜头「2×2 四卡 + 光标移到目标卡 + 镜头推近」
 * 的运镜,但把卡片内部从「职位排名行」换成「图标 + 标题 + 副标」的分类卡(如 CLAUDE.md/规则/Hooks/Skills)。
 */
export type CategoryCardItem = {
  /** 主标题(如 CLAUDE.md) */
  title: string;
  /** 副标(如 只放路由) */
  sub?: string;
  /** 图标字形:'doc'|'rules'|'hook'|'tool';不给则按位次取默认 */
  glyph?: 'doc' | 'rules' | 'hook' | 'tool';
  /** 锚点卡(陶土橙高亮 + 发光);四样里 = CLAUDE.md */
  anchor?: boolean;
};

export type RankingDaysSceneProps = {
  days?: RankingDay[];
  day1Title?: string;
  day2Title?: string;
  day3Title?: string;
  day4Title?: string;
  day1Items?: string;
  day2Items?: string;
  day3Items?: string;
  day4Items?: string;
  backgroundColor?: string;
  panelColor?: string;
  accentColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  itemFontSize?: number;
  /** Legacy alias kept for old props.json files. */
  itemFontSizePx?: number;
  dayRevealGapSec?: number;
  dayRevealDurSec?: number;
  cameraToDay1AtSec?: number;
  cameraMoveDurSec?: number;
  closeScale?: number;
  dimLowerAtSec?: number | null;
  dimLowerCards?: boolean;
  /** 1-based target day for the page-level cursor and camera push. */
  clickDay?: number;
  /** 1-based target row for the page-level cursor and camera push. */
  clickRow?: number;
  click?: RankingDaysClick;
  /** 'rank'(默认,职位排名行)| 'category'(图标+标题+副标的分类卡)。 */
  cardMode?: 'rank' | 'category';
  /** cardMode='category' 时的四张卡数据(最多 4)。 */
  categoryCards?: CategoryCardItem[];
};

const DEFAULT_DAYS: RankingDay[] = [
  {
    title: 'Day 1',
    items: [
      {label: 'Video Editor - Apple'},
      {label: 'Back End Developer - Meta'},
      {label: 'Front End Developer - Nokia'},
      {label: 'AI Developer - Google'},
    ],
  },
  {
    title: 'Day 2',
    items: [
      {label: 'Video Editor - Apple'},
      {label: 'Front End Developer - Nokia'},
      {label: 'Back End Developer - Meta'},
      {label: 'AI Developer - Google'},
    ],
  },
  {
    title: 'Day 3',
    items: [
      {label: 'Video Editor - Apple'},
      {label: 'AI Developer - Google'},
      {label: 'Back End Developer - Meta'},
      {label: 'Front End Developer - Nokia'},
    ],
  },
  {
    title: 'Day 4',
    items: [
      {label: 'Video Editor - Apple'},
      {label: 'Back End Developer - Meta'},
      {label: 'AI Developer - Google'},
      {label: 'Front End Developer - Nokia'},
    ],
  },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

const toNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeColor = (value: unknown, fallback: string) =>
  typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;

const toText = (value: unknown, fallback: string) => {
  if (typeof value !== 'string') return fallback;
  const resolved = value.trim();
  return resolved.length > 0 ? resolved : fallback;
};

const itemsFromLines = (value: unknown, fallback: RankingDayItem[]) => {
  if (typeof value !== 'string') return fallback;
  const items = value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, 4)
    .map((label) => ({label}));
  return items.length > 0 ? items : fallback;
};

const resolveDays = ({
  days,
  day1Title,
  day2Title,
  day3Title,
  day4Title,
  day1Items,
  day2Items,
  day3Items,
  day4Items,
}: Pick<
  RankingDaysSceneProps,
  | 'days'
  | 'day1Title'
  | 'day2Title'
  | 'day3Title'
  | 'day4Title'
  | 'day1Items'
  | 'day2Items'
  | 'day3Items'
  | 'day4Items'
>) => {
  if (Array.isArray(days) && days.length > 0) {
    return days.slice(0, 4);
  }

  return [
    {
      title: toText(day1Title, DEFAULT_DAYS[0].title),
      items: itemsFromLines(day1Items, DEFAULT_DAYS[0].items),
    },
    {
      title: toText(day2Title, DEFAULT_DAYS[1].title),
      items: itemsFromLines(day2Items, DEFAULT_DAYS[1].items),
    },
    {
      title: toText(day3Title, DEFAULT_DAYS[2].title),
      items: itemsFromLines(day3Items, DEFAULT_DAYS[2].items),
    },
    {
      title: toText(day4Title, DEFAULT_DAYS[3].title),
      items: itemsFromLines(day4Items, DEFAULT_DAYS[3].items),
    },
  ];
};

const progress = (
  frame: number,
  startFrame: number,
  durationFrames: number,
  easing: (input: number) => number = Easing.inOut(Easing.cubic),
) =>
  interpolate(frame, [startFrame, startFrame + Math.max(1, durationFrames)], [0, 1], {
    ...CLAMP,
    easing,
  });

const SpeakerIcon: React.FC<{color: string; pulse: number}> = ({color, pulse}) => {
  const strokeWidth = 3.1 + pulse * 1.15;

  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <path
        d="M14 25H25L39 13V51L25 39H14Z"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M45 23C49 28 49 36 45 41"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M51 17C58 25 58 39 51 47"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        opacity={0.82}
      />
    </svg>
  );
};

const Cursor: React.FC<{
  color: string;
  clickProgress: number;
  appearProgress: number;
}> = ({color, clickProgress, appearProgress}) => {
  const scale = lerp(1, 0.86, Math.sin(clickProgress * Math.PI));
  const opacity = appearProgress * lerp(1, 0, clamp((clickProgress - 0.85) / 0.15, 0, 1));

  return (
    <svg
      viewBox="0 0 92 118"
      width={92}
      height={118}
      style={{
        position: 'absolute',
        opacity,
        transform: `translate(-12px, -16px) scale(${scale})`,
        transformOrigin: '20px 20px',
        filter: `drop-shadow(0 4px 10px ${withAlpha(color, 0.52)})`,
      }}
    >
      <path
        d="M9 7L82 78L51 82L66 112L50 118L35 88L11 111Z"
        fill="#ffffff"
        stroke="#111111"
        strokeLinejoin="round"
        strokeWidth={5}
      />
    </svg>
  );
};

const CameraCursor: React.FC<{
  targetPoint: {x: number; y: number};
  moveProgress: number;
  clickProgress: number;
  appearProgress: number;
  color: string;
}> = ({targetPoint, moveProgress, clickProgress, appearProgress, color}) => {
  const {cam} = useCamera();
  const transformedTarget = {
    x: cam.anchorX + cam.zoom * (targetPoint.x - cam.x),
    y: cam.anchorY + cam.zoom * (targetPoint.y - cam.y),
  };
  const cursorX = lerp(CURSOR_START.x, transformedTarget.x, moveProgress);
  const cursorY = lerp(CURSOR_START.y, transformedTarget.y, moveProgress);

  return (
    <div style={{position: 'absolute', left: cursorX, top: cursorY, zIndex: 20}}>
      <Cursor color={color} clickProgress={clickProgress} appearProgress={appearProgress} />
    </div>
  );
};

const Row: React.FC<{
  item: RankingDayItem;
  index: number;
  frame: number;
  accentColor: string;
  panelColor: string;
  textColor: string;
  mutedTextColor: string;
  itemFontSize: number;
  isClicked: boolean;
  cursorPulseProgress: number;
}> = ({
  item,
  index,
  frame,
  accentColor,
  panelColor,
  textColor,
  mutedTextColor,
  itemFontSize,
  isClicked,
  cursorPulseProgress,
}) => {
  const appearStart = index * 4;
  const enter = clamp((frame - appearStart) / 18, 0, 1);
  const enterEase = 1 - Math.pow(1 - enter, 3);
  const opacity = clamp((frame - appearStart) / 10, 0, 1);
  const x = lerp(28, 0, enterEase);
  const pulse = isClicked ? Math.sin(cursorPulseProgress * Math.PI) : 0;
  const y = 100 + index * 72;
  const lineWidth = 2.5 + pulse;
  const color = item.dimmed ? mutedTextColor : textColor;
  const rowOpacity = item.dimmed ? 0.62 : 1;

  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 56,
        width: CARD_W - 112,
        height: 58,
        opacity: opacity * rowOpacity,
        transform: `translateX(${x}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 66,
          height: 58,
          borderRadius: 13,
          border: `${lineWidth}px solid ${accentColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accentColor,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 38,
          boxShadow: pulse > 0 ? `0 0 ${18 + pulse * 12}px ${withAlpha(accentColor, 0.22)}` : 'none',
        }}
      >
        {index + 1}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 86,
          top: 0,
          width: 500,
          height: 58,
          borderRadius: 13,
          border: `${2.5 + pulse * 0.6}px solid ${accentColor}`,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 22,
          paddingRight: 22,
          overflow: 'hidden',
          color,
          fontFamily: BODY_FONT,
          fontWeight: 700,
          fontSize: itemFontSize,
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          background: panelColor,
          boxShadow: pulse > 0 ? `0 0 ${14 + pulse * 12}px ${withAlpha(accentColor, 0.18)}` : 'none',
        }}
      >
        {item.label}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 62,
          height: 58,
          borderRadius: 13,
          border: `${lineWidth}px solid ${accentColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: panelColor,
          boxShadow: pulse > 0 ? `0 0 ${16 + pulse * 12}px ${withAlpha(accentColor, 0.2)}` : 'none',
        }}
      >
        <SpeakerIcon color={accentColor} pulse={pulse} />
      </div>
    </div>
  );
};

const DayCard: React.FC<{
  day: RankingDay;
  dayIndex: number;
  frame: number;
  accentColor: string;
  panelColor: string;
  textColor: string;
  mutedTextColor: string;
  itemFontSize: number;
  clickDayIndex: number;
  clickRowIndex: number;
  cursorPulseProgress: number;
}> = ({
  day,
  dayIndex,
  frame,
  accentColor,
  panelColor,
  textColor,
  mutedTextColor,
  itemFontSize,
  clickDayIndex,
  clickRowIndex,
  cursorPulseProgress,
}) => (
  <div
    style={{
      position: 'relative',
      width: CARD_W,
      height: CARD_H,
      borderRadius: 44,
      background: panelColor,
      boxShadow: '0 20px 50px rgba(0,0,0,0.42)',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 44,
        border: '1px solid rgba(255,255,255,0.15)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: 2,
        left: 0,
        width: '100%',
        textAlign: 'center',
        color: textColor,
        fontFamily: FONT,
        fontSize: 50,
        fontWeight: 800,
        lineHeight: '64px',
      }}
    >
      {day.title}
    </div>
    {day.items.slice(0, 4).map((item, index) => (
      <Row
        key={`${day.title}-${item.label}-${index}`}
        item={item}
        index={index}
        frame={frame}
        accentColor={accentColor}
        panelColor={panelColor}
        textColor={textColor}
        mutedTextColor={mutedTextColor}
        itemFontSize={itemFontSize}
        isClicked={dayIndex === clickDayIndex && index === clickRowIndex}
        cursorPulseProgress={cursorPulseProgress}
      />
    ))}
  </div>
);

/* ── 分类卡模式(cardMode='category')── 复用本镜头的四卡运镜,卡片内容换成图标+标题+副标。 */
const GLYPH_BY_INDEX: Array<'doc' | 'rules' | 'hook' | 'tool'> = ['doc', 'rules', 'hook', 'tool'];

const CategoryGlyph: React.FC<{glyph: string; color: string}> = ({glyph, color}) => {
  const s = {
    fill: 'none',
    stroke: color,
    strokeWidth: 4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      {glyph === 'doc' ? (
        <>
          <path d="M18 8h20l10 10v36a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z" {...s} />
          <path d="M38 8v10h10" {...s} />
          <path d="M24 30h16M24 40h16M24 22h7" {...s} />
        </>
      ) : null}
      {glyph === 'rules' ? (
        <>
          <circle cx="18" cy="18" r="2.4" fill={color} stroke="none" />
          <circle cx="18" cy="32" r="2.4" fill={color} stroke="none" />
          <circle cx="18" cy="46" r="2.4" fill={color} stroke="none" />
          <path d="M28 18h22M28 32h22M28 46h22" {...s} />
        </>
      ) : null}
      {glyph === 'hook' ? (
        <path d="M34 7 19 37h11l-3 20 21-32H37l3-18Z" fill={color} stroke="none" />
      ) : null}
      {glyph === 'tool' ? (
        <>
          <circle cx="32" cy="32" r="11" {...s} />
          <circle cx="32" cy="32" r="3.4" fill={color} stroke="none" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="32" y1="13" x2="32" y2="19" {...s} transform={`rotate(${a} 32 32)`} />
          ))}
        </>
      ) : null}
    </svg>
  );
};

const CategoryCard: React.FC<{
  item: CategoryCardItem;
  index: number;
  pulse: number;
}> = ({item, index, pulse}) => {
  const anchor = !!item.anchor;
  const glyph = item.glyph ?? GLYPH_BY_INDEX[index] ?? 'doc';
  const orange = theme.colors.orange;
  const orangeStrong = theme.colors.orangeStrong;
  const blue = theme.colors.blue;
  const white = theme.colors.white;
  const glowK = anchor ? 0.5 + pulse * 0.5 : 0;
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 44,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        background: anchor
          ? `linear-gradient(150deg, ${orange}, ${orangeStrong})`
          : theme.darkGlass.gradient,
        border: anchor ? `3px solid ${withAlpha(orange, 0.9)}` : `1px solid ${theme.darkGlass.stroke}`,
        boxShadow: anchor
          ? `0 24px 60px -18px ${withAlpha(orange, 0.55 + glowK * 0.3)}, 0 0 ${50 + pulse * 44}px ${withAlpha(orange, 0.3 + glowK * 0.3)}, inset 0 1px 0 rgba(255,255,255,0.25)`
          : '0 18px 44px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 26,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: anchor ? 'rgba(255,255,255,0.94)' : withAlpha(blue, 0.16),
          border: anchor ? 'none' : `1.5px solid ${withAlpha(blue, 0.5)}`,
          boxShadow: anchor ? '0 6px 16px rgba(0,0,0,0.25)' : 'none',
        }}
      >
        <CategoryGlyph glyph={glyph} color={anchor ? orangeStrong : blue} />
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 64,
          color: anchor ? white : theme.darkGlass.onDark,
          letterSpacing: 0.5,
          textAlign: 'center',
          lineHeight: 1.1,
        }}
      >
        {item.title}
      </div>
      {item.sub ? (
        <div
          style={{
            fontFamily: BODY_FONT,
            fontWeight: 600,
            fontSize: 32,
            color: anchor ? 'rgba(255,255,255,0.88)' : theme.darkGlass.muted,
            letterSpacing: 1.5,
          }}
        >
          {item.sub}
        </div>
      ) : null}
    </div>
  );
};

export const RankingDaysScene: React.FC<RankingDaysSceneProps> = ({
  days,
  day1Title,
  day2Title,
  day3Title,
  day4Title,
  day1Items,
  day2Items,
  day3Items,
  day4Items,
  // 2026-07-06 去绿收编品牌:默认色全走 theme(美学审计:绿#35e68c 非品牌色板)。
  // panel/muted 无独立 hex token(normalizeColor 只收 6 位 hex,darkGlass.surface/muted 是 rgba):
  //   panel '#34291f' = darkGlass.bgGrad 亮端值;muted '#a7a39d' = darkGlass.muted 在 espresso 上的实色合成。
  backgroundColor = theme.darkGlass.bg,
  panelColor = '#34291f',
  accentColor = theme.colors.orange,
  textColor = theme.darkGlass.onDark,
  mutedTextColor = '#a7a39d',
  itemFontSize,
  itemFontSizePx = 25,
  dayRevealGapSec = 0.55,
  dayRevealDurSec = 0.42,
  cameraToDay1AtSec = 2.75,
  cameraMoveDurSec = 1.2,
  closeScale = 1.94,
  dimLowerAtSec = 5,
  dimLowerCards = false,
  clickDay,
  clickRow,
  click = {},
  cardMode = 'rank',
  categoryCards,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const isCategory = cardMode === 'category';
  const resolvedDays = resolveDays({
    days,
    day1Title,
    day2Title,
    day3Title,
    day4Title,
    day1Items,
    day2Items,
    day3Items,
    day4Items,
  });
  const catCards = (categoryCards ?? []).slice(0, 4);
  // 卡数:两种模式都按实际条数渲(1–4 张;少于 4 张时后面的宫格位留空)。
  const cardCount = isCategory ? catCards.length : resolvedDays.length;
  if (cardCount === 0) return null;
  // 分类卡模式默认走 theme 品牌色(espresso 底 + 陶土橙强调),不再用绿主题。
  const resolvedBackgroundColor = isCategory
    ? theme.darkGlass.bg
    : normalizeColor(backgroundColor, theme.darkGlass.bg);
  const resolvedPanelColor = normalizeColor(panelColor, '#34291f');
  const resolvedAccentColor = isCategory
    ? theme.colors.orange
    : normalizeColor(accentColor, theme.colors.orange);
  const resolvedTextColor = normalizeColor(textColor, theme.darkGlass.onDark);
  const resolvedMutedTextColor = normalizeColor(mutedTextColor, '#a7a39d');
  const resolvedItemFontSize = clamp(toNumber(itemFontSize, itemFontSizePx), 18, 36);
  const clickDayIndex = clamp(
    Math.round(toNumber(clickDay, (click.dayIndex ?? 0) + 1)) - 1,
    0,
    cardCount - 1,
  );
  const clickRowIndex = clamp(
    Math.round(toNumber(clickRow, (click.rowIndex ?? 0) + 1)) - 1,
    0,
    3,
  );
  const cameraStartFrame = Math.round(cameraToDay1AtSec * fps);
  const cameraTotalFrames = Math.max(2, Math.round(cameraMoveDurSec * fps));
  const clickFrame = cameraStartFrame + cameraTotalFrames;
  const cursorMoveProgress = progress(frame, cameraStartFrame, cameraTotalFrames);
  const cursorClickProgress = progress(frame, clickFrame, 18, Easing.out(Easing.cubic));
  const cursorAppearProgress = progress(frame, Math.max(0, cameraStartFrame - 12), 12, Easing.out(Easing.cubic));
  const cursorPulseProgress = progress(frame, clickFrame, 18, Easing.out(Easing.cubic));
  const dimProgress =
    dimLowerCards && dimLowerAtSec !== null
      ? progress(frame, Math.round(dimLowerAtSec * fps), Math.round(0.85 * fps), Easing.out(Easing.cubic))
      : 0;
  const dayRevealProgresses = resolvedDays.map((_, index) =>
    progress(
      frame,
      Math.round(index * dayRevealGapSec * fps),
      Math.round(dayRevealDurSec * fps),
      Easing.out(Easing.cubic),
    ),
  );
  const scale = Math.min(width / DESIGN_W, height / DESIGN_H);
  const offsetX = (width - DESIGN_W * scale) / 2;
  const offsetY = (height - DESIGN_H * scale) / 2;
  const closeCenter = {cx: DESIGN_W / 2, cy: DESIGN_H / 2 - 6};
  const focusTarget = gridTargets[clickDayIndex] ?? gridTargets[0];
  // 分类卡模式:光标/相机指向卡片中心;排名卡模式:指向目标行的喇叭按钮(沿用旧几何)。
  const targetPoint = isCategory
    ? {x: focusTarget.cx, y: focusTarget.cy}
    : {
        x: focusTarget.cx - CARD_W / 2 + CARD_W - AUDIO_W / 2,
        y: focusTarget.cy - CARD_H / 2 + ROW_TOP + clickRowIndex * ROW_STEP + ROW_H / 2,
      };
  const cameraWaypoints: CameraWaypoint[] = [
    {
      x: focusTarget.cx,
      y: focusTarget.cy,
      zoom: 1,
      anchorX: focusTarget.cx,
      anchorY: focusTarget.cy,
      atSec: 0,
    },
    {
      x: focusTarget.cx,
      y: focusTarget.cy,
      zoom: closeScale,
      anchorX: closeCenter.cx,
      anchorY: closeCenter.cy,
      atSec: clickFrame / fps,
      travelSec: cameraTotalFrames / fps,
    },
  ];

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: resolvedBackgroundColor}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 48% 42%, ${withAlpha(resolvedAccentColor, 0.16)}, transparent 46%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: offsetX,
          top: offsetY,
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <CameraRig waypoints={cameraWaypoints} viewportWidth={DESIGN_W} viewportHeight={DESIGN_H}>
          <CameraRig.World>
          {Array.from({length: cardCount}).map((_unused, index) => {
            const target = gridTargets[index] ?? gridTargets[0];
            const entryEase = dayRevealProgresses[index] ?? 1;
            const cx = target.cx;
            const cy = lerp(target.cy + 24, target.cy, entryEase);
            const cardScale = lerp(0.92, 1, entryEase);
            // 排名卡的「下排压暗」逻辑只在 rank 模式生效;分类卡四张始终全亮。
            const lowerRow = !isCategory && index >= 2;
            const lowerOpacity = lowerRow ? lerp(1, index === 2 ? 0.44 : 0.18, dimProgress) : 1;
            const blur = lowerRow ? lerp(0, index === 2 ? 1.2 : 2.8, dimProgress) : 0;

            let inner: React.ReactNode;
            let key: string;
            if (isCategory) {
              const card = catCards[index];
              key = `cat-${card?.title ?? index}-${index}`;
              inner = (
                <CategoryCard
                  item={card}
                  index={index}
                  pulse={index === clickDayIndex ? cursorPulseProgress : 0}
                />
              );
            } else {
              const day = resolvedDays[index];
              const dayWithDimmedRows =
                dimProgress > 0 && index === 3
                  ? {
                      ...day,
                      items: day.items.map((item, rowIndex) => ({
                        ...item,
                        dimmed: rowIndex === 3,
                      })),
                    }
                  : day;
              key = `${day.title}-${index}`;
              inner = (
                <DayCard
                  day={dayWithDimmedRows}
                  dayIndex={index}
                  frame={frame}
                  accentColor={resolvedAccentColor}
                  panelColor={resolvedPanelColor}
                  textColor={resolvedTextColor}
                  mutedTextColor={resolvedMutedTextColor}
                  itemFontSize={resolvedItemFontSize}
                  clickDayIndex={clickDayIndex}
                  clickRowIndex={clickRowIndex}
                  cursorPulseProgress={cursorPulseProgress}
                />
              );
            }

            return (
              <div
                key={key}
                style={{
                  position: 'absolute',
                  left: cx,
                  top: cy,
                  width: CARD_W,
                  height: CARD_H,
                  opacity: entryEase * lowerOpacity,
                  filter: blur > 0 ? `blur(${blur}px)` : 'none',
                  transform: `translate(-50%, -50%) scale(${cardScale})`,
                  transformOrigin: 'center center',
                }}
              >
                {inner}
              </div>
            );
          })}
          </CameraRig.World>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, transparent 47%, ${resolvedBackgroundColor} 100%)`,
              opacity: dimProgress * 0.86,
              pointerEvents: 'none',
            }}
          />
          {cursorAppearProgress > 0 ? (
            <CameraCursor
              targetPoint={targetPoint}
              moveProgress={cursorMoveProgress}
              color={resolvedAccentColor}
              clickProgress={cursorClickProgress}
              appearProgress={cursorAppearProgress}
            />
          ) : null}
        </CameraRig>
      </div>
    </AbsoluteFill>
  );
};

/**
 * 镜头说明书(SceneTag)—— 见 ../schema/sceneTag.ts。co-located 紧跟组件。
 * defaultPose:poses.ts `rankdays`→center;四宫格排名卡全屏盖住口播人物 →
 *   人不出镜 = audio-only + fullscreenOnly。days 是结构化主内容;textBinding=day1Items:
 *   高亮日默认 Day1(clickDay 缺省=1),口播文案按换行逐行填它的排名行。
 */
export const rankdaysTag: SceneTag = {
  id: 'rankdays',
  componentName: 'RankingDaysScene',
  title: '排名四宫格',
  category: '数据图表',
  style: '品牌·espresso深底',
  status: 'stable',
  intent: 'Day 1–4 四张排名卡逐个出现,页面级鼠标从右下角移到目标行,镜头同步推近落点',
  suitableFor: '按天/名次逐条列出并推近目标行，做排行榜或进度排名。',
  notFor: '非排名/名次型的列表(用 list 或 timeline)',
  form: 'F4',
  defaultPose: 'audio-only',
  fullscreenOnly: true,
  needsExternalAsset: false,
  assetType: null,
  textBinding: 'day1Items',
  fields: [
    {
      key: 'days',
      label: '按天排名',
      type: 'list',
      tier: 'primary',
      help: '最多 4 张 Day 卡 × 最多 4 行排名(首选结构化真源)',
      itemFields: [
        { key: 'title', label: '卡标题', type: 'text', tier: 'primary', required: true, help: '如 Day 1' },
        {
          key: 'items',
          label: '排名行',
          type: 'list',
          tier: 'primary',
          required: true,
          help: '该日的排名行(最多 4)',
          itemFields: [
            { key: 'label', label: '条目', type: 'text', tier: 'primary', required: true, help: '排名条目文字' },
            { key: 'dimmed', label: '压暗', type: 'boolean', tier: 'advanced', help: 'true=该行压暗淡出' },
          ],
        },
      ],
    },
    { key: 'day1Title', label: 'Day1 标题', type: 'text', tier: 'advanced', help: '逐日别名(days 缺省时用)' },
    { key: 'day2Title', label: 'Day2 标题', type: 'text', tier: 'advanced', help: '逐日别名' },
    { key: 'day3Title', label: 'Day3 标题', type: 'text', tier: 'advanced', help: '逐日别名' },
    { key: 'day4Title', label: 'Day4 标题', type: 'text', tier: 'advanced', help: '逐日别名' },
    { key: 'day1Items', label: 'Day1 排名', type: 'text', tier: 'advanced', help: '换行分隔的排名行(逐日别名)' },
    { key: 'day2Items', label: 'Day2 排名', type: 'text', tier: 'advanced', help: '换行分隔的排名行' },
    { key: 'day3Items', label: 'Day3 排名', type: 'text', tier: 'advanced', help: '换行分隔的排名行' },
    { key: 'day4Items', label: 'Day4 排名', type: 'text', tier: 'advanced', help: '换行分隔的排名行' },
    { key: 'clickDay', label: '高亮日', type: 'number', tier: 'advanced', help: '1-based 高亮目标日(相机/光标落点)' },
    { key: 'clickRow', label: '高亮行', type: 'number', tier: 'advanced', help: '1-based 高亮目标行' },
    // 字面量镜像 theme 品牌值(2026-07-06 去绿:espresso 底 + 陶土橙强调,darkGlass 文字)
    { key: 'backgroundColor', label: '背景色', type: 'color', tier: 'advanced', default: '#29201a', help: '页面背景(默认 espresso 暖暗底)' },
    { key: 'panelColor', label: '卡片色', type: 'color', tier: 'advanced', default: '#34291f', help: '卡片底色(默认暖褐,darkGlass 渐变亮端)' },
    { key: 'accentColor', label: '强调色', type: 'color', tier: 'advanced', default: '#d97757', help: '边框/光标强调色(默认陶土橙)' },
    { key: 'textColor', label: '文字色', type: 'color', tier: 'advanced', default: '#F5F3EE', help: '正文色(默认暖白)' },
    { key: 'mutedTextColor', label: '弱化文字色', type: 'color', tier: 'advanced', default: '#a7a39d', help: '压暗行文字色(暖灰)' },
    { key: 'itemFontSize', label: '行字号', type: 'number', tier: 'advanced', help: '排名行字号;缺省走 itemFontSizePx' },
    { key: 'itemFontSizePx', label: '行字号(旧别名)', type: 'number', tier: 'advanced', default: 25, help: 'itemFontSize 的旧别名' },
    { key: 'dayRevealGapSec', label: '逐卡出现间隔', type: 'number', tier: 'advanced', default: 0.55, help: '各 Day 卡出现错峰秒' },
    { key: 'dayRevealDurSec', label: '逐卡出现时长', type: 'number', tier: 'advanced', default: 0.42, help: '单卡入场时长秒' },
    { key: 'cameraToDay1AtSec', label: '推近起点秒', type: 'number', tier: 'advanced', default: 2.75, help: '相机开始推近目标的本地秒' },
    { key: 'cameraMoveDurSec', label: '推近时长', type: 'number', tier: 'advanced', default: 1.2, help: '相机推近时长秒' },
    { key: 'closeScale', label: '推近倍数', type: 'number', tier: 'advanced', default: 1.94, help: '推近后缩放倍数' },
    { key: 'dimLowerAtSec', label: '下排压暗秒', type: 'number', tier: 'advanced', default: 5, help: '下排卡开始压暗的本地秒(null=不压暗)' },
    { key: 'dimLowerCards', label: '压暗下排', type: 'boolean', tier: 'advanced', default: false, help: 'true=启用下排压暗' },
    {
      key: 'click',
      label: '(旧)点击',
      type: 'group',
      tier: 'advanced',
      help: '旧版点击(0-based);优先用 clickDay/clickRow',
      fields: [
        { key: 'dayIndex', label: '(旧)日索引', type: 'number', tier: 'advanced', help: '0-based' },
        { key: 'rowIndex', label: '(旧)行索引', type: 'number', tier: 'advanced', help: '0-based' },
      ],
    },
    { key: 'cardMode', label: '卡片模式', type: 'enum', tier: 'advanced', values: ['rank', 'category'], default: 'rank', help: 'rank=排名行;category=图标+标题+副标分类卡' },
    {
      key: 'categoryCards',
      label: '分类卡',
      type: 'list',
      tier: 'advanced',
      help: 'cardMode=category 时的四张卡(最多 4)',
      itemFields: [
        { key: 'title', label: '主标题', type: 'text', tier: 'primary', required: true, help: '如 CLAUDE.md' },
        { key: 'sub', label: '副标', type: 'text', tier: 'advanced', help: '如 只放路由' },
        { key: 'glyph', label: '图标', type: 'enum', tier: 'advanced', values: ['doc', 'rules', 'hook', 'tool'], help: '不给则按位次取默认' },
        { key: 'anchor', label: '锚点卡', type: 'boolean', tier: 'advanced', help: 'true=陶土橙高亮 + 发光' },
      ],
    },
  ],
  catalog: {
    narratorPosition: '不出现/仅声音，画面被全屏图形覆盖',
    supportingElements: ['列表', '数据'],
    animation: '其他-Day 1-4 逐个出现 → 页面级鼠标从右下角移动 → 镜头同步推近目标行',
    background: '全屏排名卡页面',
  },
  tagVersion: 1,
  promotedFrom: 'create-vibe-motion',
};

export default RankingDaysScene;
