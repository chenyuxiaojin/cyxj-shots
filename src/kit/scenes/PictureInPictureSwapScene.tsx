/**
 * <PictureInPictureSwapScene> —— 全屏人物层旋落成右下画中画。
 *
 * 运动机制来自参考视频逐帧追踪：人物内容画布与外层遮罩分离，遮罩沿
 * 右下弧线缩小并旋转，人物内容只做轻微缩放；遮罩锁定后，背景继续
 * 推近。所有运动由本地 frame/fps 确定，段尾淡出交给 TalkingHead。
 */
import React from 'react';
import {
  Html5Video,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useRemotionEnvironment,
  useVideoConfig,
} from 'remotion';
import {DesignCanvas} from '../components/DesignCanvas';
import {FONT_STACKS, withAlpha} from '../components/styleTokens';
import type {SceneTag} from '../schema/sceneTag';
import {theme} from '../theme';

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const REFERENCE_WIDTH = 1936;
const REFERENCE_X_SCALE = DESIGN_WIDTH / REFERENCE_WIDTH;
const CANONICAL_START_FRAME = 13;
const CANONICAL_LOCK_FRAME = 46;
/**
 * 参考片锁定帧时,落在画中画正中的那个【人物内容坐标】(1920×1080 视频空间)。
 * 由 TRACE_KEYFRAMES 末帧反推:窗中心 (1694·xScale, 838) − 内容中心 (1684·xScale, 943),再除以 contentScale 0.908。
 * 人脸不在参考片位置时,用 contentAnchorX/Y 指定要对准的点,几何会随 progress 把它平移到窗中心。
 */
const REFERENCE_ANCHOR_X = 960 + ((1694 - 1684) * REFERENCE_X_SCALE) / 0.908;
const REFERENCE_ANCHOR_Y = 540 + (838 - 943) / 0.908;

type AccentTone = 'blue' | 'orange';
type SurfaceMode = 'dark' | 'cream';

type TraceKeyframe = {
  f: number;
  cx: number;
  cy: number;
  w: number;
  h: number;
  rotate: number;
  radius: number;
  contentCx: number;
  contentCy: number;
  contentScale: number;
};

export type PipSwapGeometry = {
  cx: number;
  cy: number;
  width: number;
  height: number;
  rotate: number;
  radius: number;
  contentOffsetX: number;
  contentOffsetY: number;
  contentScale: number;
};

const TRACE_KEYFRAMES: TraceKeyframe[] = [
  {f: 0, cx: 968, cy: 540, w: 1936, h: 1080, rotate: 0, radius: 0, contentCx: 968, contentCy: 540, contentScale: 1},
  {f: 13, cx: 968, cy: 540, w: 1936, h: 1080, rotate: 0, radius: 0, contentCx: 968, contentCy: 540, contentScale: 1},
  {f: 14, cx: 968, cy: 515, w: 1640, h: 972, rotate: 0.1, radius: 28, contentCx: 968, contentCy: 540, contentScale: 1},
  {f: 16, cx: 968, cy: 432, w: 958, h: 724, rotate: 0.3, radius: 86, contentCx: 969, contentCy: 539, contentScale: 1.003},
  {f: 18, cx: 970, cy: 388, w: 760, h: 650, rotate: 0.7, radius: 96, contentCx: 970, contentCy: 539, contentScale: 1.004},
  {f: 20, cx: 990, cy: 412, w: 708, h: 620, rotate: 7.8, radius: 98, contentCx: 993, contentCy: 551, contentScale: 1.002},
  {f: 22, cx: 1056, cy: 464, w: 662, h: 596, rotate: 18.5, radius: 98, contentCx: 1066, contentCy: 593, contentScale: 0.986},
  {f: 24, cx: 1138, cy: 526, w: 620, h: 574, rotate: 22.2, radius: 99, contentCx: 1125, contentCy: 627, contentScale: 0.975},
  {f: 26, cx: 1260, cy: 606, w: 586, h: 552, rotate: 23, radius: 100, contentCx: 1269, contentCy: 708, contentScale: 0.955},
  {f: 28, cx: 1376, cy: 688, w: 566, h: 536, rotate: 21.9, radius: 100, contentCx: 1338, contentCy: 748, contentScale: 0.949},
  {f: 30, cx: 1484, cy: 740, w: 550, h: 524, rotate: 17.8, radius: 99, contentCx: 1451, contentCy: 813, contentScale: 0.938},
  {f: 32, cx: 1540, cy: 774, w: 538, h: 514, rotate: 12.9, radius: 98, contentCx: 1533, contentCy: 859, contentScale: 0.928},
  {f: 34, cx: 1576, cy: 792, w: 526, h: 504, rotate: 9.2, radius: 98, contentCx: 1564, contentCy: 877, contentScale: 0.924},
  {f: 36, cx: 1610, cy: 811, w: 516, h: 496, rotate: 7, radius: 97, contentCx: 1612, contentCy: 904, contentScale: 0.919},
  {f: 38, cx: 1638, cy: 818, w: 508, h: 492, rotate: 4.9, radius: 97, contentCx: 1630, contentCy: 914, contentScale: 0.916},
  {f: 40, cx: 1670, cy: 828, w: 500, h: 488, rotate: 3.6, radius: 96, contentCx: 1657, contentCy: 929, contentScale: 0.912},
  {f: 42, cx: 1683, cy: 834, w: 492, h: 486, rotate: 2.6, radius: 96, contentCx: 1673, contentCy: 938, contentScale: 0.909},
  {f: 44, cx: 1687, cy: 836, w: 488, h: 484, rotate: 1.2, radius: 95, contentCx: 1678, contentCy: 941, contentScale: 0.909},
  {f: 46, cx: 1694, cy: 838, w: 484, h: 484, rotate: 0, radius: 94, contentCx: 1684, contentCy: 943, contentScale: 0.908},
  {f: 64, cx: 1694, cy: 838, w: 484, h: 484, rotate: 0, radius: 94, contentCx: 1684, contentCy: 943, contentScale: 0.908},
];

const HOLD_SOURCE_FRAMES = new Set([18, 21, 23, 28, 33, 38, 43, 48, 53, 58, 63]);
const DEFAULT_SECTIONS = ['素材与目标', '人物与场景', '内容分镜', '运动约束'];

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const lerp = (from: number, to: number, amount: number): number =>
  from + (to - from) * amount;

const smooth = (value: number): number => value * value * (3 - 2 * value);

const finiteOr = (value: number | undefined, fallback: number): number =>
  Number.isFinite(value) ? Number(value) : fallback;

const mapFrame = (
  frame: number,
  sourceStart: number,
  sourceEnd: number,
  targetStart: number,
  targetEnd: number,
): number => {
  const amount = clamp(
    (frame - sourceStart) / Math.max(1, sourceEnd - sourceStart),
    0,
    1,
  );
  return lerp(targetStart, targetEnd, amount);
};

const sampleTrace = (frame: number): TraceKeyframe => {
  const first = TRACE_KEYFRAMES[0];
  const last = TRACE_KEYFRAMES[TRACE_KEYFRAMES.length - 1];
  if (frame <= first.f) return {...first};
  if (frame >= last.f) return {...last};

  for (let index = 1; index < TRACE_KEYFRAMES.length; index += 1) {
    const right = TRACE_KEYFRAMES[index];
    if (frame > right.f) continue;
    const left = TRACE_KEYFRAMES[index - 1];
    const amount = (frame - left.f) / Math.max(1, right.f - left.f);
    return {
      f: frame,
      cx: lerp(left.cx, right.cx, amount),
      cy: lerp(left.cy, right.cy, amount),
      w: lerp(left.w, right.w, amount),
      h: lerp(left.h, right.h, amount),
      rotate: lerp(left.rotate, right.rotate, amount),
      radius: lerp(left.radius, right.radius, amount),
      contentCx: lerp(left.contentCx, right.contentCx, amount),
      contentCy: lerp(left.contentCy, right.contentCy, amount),
      contentScale: lerp(left.contentScale, right.contentScale, amount),
    };
  }
  return {...last};
};

const referenceCadenceFrame = (frame: number, enabled: boolean): number => {
  const rounded = clamp(Math.round(frame), 0, 64);
  return enabled && HOLD_SOURCE_FRAMES.has(rounded) ? rounded - 1 : frame;
};

const adaptGeometry = ({
  raw,
  canonicalFrame,
  pipSize,
  pipRightOffset,
  pipBottomOffset,
  peakRotation,
  cornerRadius,
  contentAnchorX = REFERENCE_ANCHOR_X,
  contentAnchorY = REFERENCE_ANCHOR_Y,
}: {
  raw: TraceKeyframe;
  canonicalFrame: number;
  pipSize: number;
  pipRightOffset: number;
  pipBottomOffset: number;
  peakRotation: number;
  cornerRadius: number;
  contentAnchorX?: number;
  contentAnchorY?: number;
}): PipSwapGeometry => {
  const progress = clamp(
    (canonicalFrame - CANONICAL_START_FRAME) /
      (CANONICAL_LOCK_FRAME - CANONICAL_START_FRAME),
    0,
    1,
  );
  const sourceFinalCx = 1694 * REFERENCE_X_SCALE;
  const sourceFinalCy = 838;
  const targetFinalCx = DESIGN_WIDTH - pipRightOffset - pipSize / 2;
  const targetFinalCy = DESIGN_HEIGHT - pipBottomOffset - pipSize / 2;
  const targetDx = targetFinalCx - sourceFinalCx;
  const targetDy = targetFinalCy - sourceFinalCy;
  const width = Math.max(
    1,
    raw.w * REFERENCE_X_SCALE + (pipSize - 484 * REFERENCE_X_SCALE) * progress,
  );
  const height = Math.max(1, raw.h + (pipSize - 484) * progress);
  const cx = raw.cx * REFERENCE_X_SCALE + targetDx * progress;
  const cy = raw.cy + targetDy * progress;
  const rotate = raw.rotate * (peakRotation / 23);
  // 人脸锚点:progress=0(全屏)不动,锁定时把 contentAnchor 平移到窗中心(默认 = 参考片行为,零改动)
  const anchorShiftX = (REFERENCE_ANCHOR_X - contentAnchorX) * raw.contentScale * progress;
  const anchorShiftY = (REFERENCE_ANCHOR_Y - contentAnchorY) * raw.contentScale * progress;
  const contentGlobalCx =
    raw.contentCx * REFERENCE_X_SCALE + targetDx * progress + anchorShiftX;
  const contentGlobalCy = raw.contentCy + targetDy * progress + anchorShiftY;
  const angle = (-rotate * Math.PI) / 180;
  const globalOffsetX = contentGlobalCx - cx;
  const globalOffsetY = contentGlobalCy - cy;

  return {
    cx,
    cy,
    width,
    height,
    rotate,
    radius: Math.max(0, raw.radius * (cornerRadius / 94)),
    contentOffsetX:
      globalOffsetX * Math.cos(angle) - globalOffsetY * Math.sin(angle),
    contentOffsetY:
      globalOffsetX * Math.sin(angle) + globalOffsetY * Math.cos(angle),
    contentScale: raw.contentScale,
  };
};

const resolveAssetSrc = (src: string): string => {
  const value = src.trim();
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
};

const toneColor = (tone: AccentTone): string =>
  tone === 'orange' ? theme.colors.orange : theme.colors.blue;

const WorkspaceFallback: React.FC<{
  title: string;
  sections: string[];
  mode: SurfaceMode;
  accent: string;
}> = ({title, sections, mode, accent}) => {
  const dark = mode === 'dark';
  const background = dark ? theme.darkGlass.bgGrad : theme.colors.bgCream;
  const panel = dark ? theme.darkGlass.surface : theme.cards.glassLight.background;
  const text = dark ? theme.darkGlass.onDark : theme.colors.ink;
  const muted = dark ? theme.darkGlass.muted : theme.colors.inkMuted;
  const safeSections = sections.length ? sections : DEFAULT_SECTIONS;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background,
        color: text,
        fontFamily: FONT_STACKS.zh,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 78% 20%, ${withAlpha(accent, 0.18)}, transparent 36%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: theme.spacing.section,
          top: theme.spacing.xxl,
          width: 1728,
          height: 970,
          overflow: 'hidden',
          borderRadius: theme.radius.video,
          border: `1px solid ${dark ? theme.darkGlass.stroke : withAlpha(theme.colors.ink, 0.12)}`,
          background: panel,
          boxShadow: dark ? theme.shadow.dark : theme.shadow.card,
        }}
      >
        <div
          style={{
            height: 78,
            display: 'flex',
            alignItems: 'center',
            padding: `0 ${theme.spacing.xl}px`,
            gap: theme.spacing.md,
            borderBottom: `1px solid ${dark ? theme.darkGlass.stroke : withAlpha(theme.colors.ink, 0.1)}`,
          }}
        >
          {[theme.colors.orange, theme.colors.blue, theme.focusTones.green.label].map((color) => (
            <div key={color} style={{width: 14, height: 14, borderRadius: theme.radius.round, background: color}} />
          ))}
          <div style={{marginLeft: theme.spacing.sm, fontFamily: FONT_STACKS.display, fontSize: theme.fontSize.minReadable, fontWeight: 800, letterSpacing: '.08em'}}>
            {title}
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 78,
            bottom: 0,
            width: 330,
            padding: `${theme.spacing.xxl}px ${theme.spacing.xl}px`,
            borderRight: `1px solid ${dark ? theme.darkGlass.stroke : withAlpha(theme.colors.ink, 0.1)}`,
          }}
        >
          {safeSections.map((section, index) => (
            <div
              key={`${section}-${index}`}
              style={{
                height: 58,
                marginBottom: theme.spacing.sm,
                padding: `0 ${theme.spacing.md}px`,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.md,
                borderRadius: theme.radius.listPill,
                color: index === 2 ? text : muted,
                background: index === 2 ? withAlpha(accent, 0.16) : 'transparent',
                fontSize: theme.fontSize.minReadable,
                fontWeight: 700,
              }}
            >
              <div style={{width: 10, height: 10, borderRadius: theme.radius.round, background: index === 2 ? accent : muted}} />
              {section}
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 390, right: 72, top: 132, bottom: 56}}>
          <div style={{fontFamily: FONT_STACKS.serif, fontSize: theme.fontSize.modelName, fontStyle: 'italic', color: text}}>
            One continuous world, two coordinated layers
          </div>
          <div style={{marginTop: theme.spacing.xxl, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.xl}}>
            {safeSections.slice(0, 4).map((section, index) => (
              <div
                key={`${section}-panel-${index}`}
                style={{
                  height: index < 2 ? 224 : 248,
                  padding: theme.spacing.xl,
                  borderRadius: theme.radius.card,
                  border: `1px solid ${dark ? theme.darkGlass.stroke : withAlpha(theme.colors.ink, 0.1)}`,
                  background: dark ? withAlpha(theme.colors.white, 0.045) : withAlpha(theme.colors.white, 0.58),
                }}
              >
                <div style={{fontSize: theme.fontSize.listItem, fontWeight: 800}}>{section}</div>
                {Array.from({length: 6}, (_, line) => (
                  <div
                    key={line}
                    style={{
                      width: `${44 + ((line * 19 + index * 13) % 48)}%`,
                      height: line === 0 ? 9 : 6,
                      marginTop: line === 0 ? theme.spacing.xl : theme.spacing.md,
                      borderRadius: theme.radius.round,
                      background: line === 0 ? withAlpha(accent, 0.54) : withAlpha(text, 0.2),
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PresenterFallback: React.FC<{label: string; tone: AccentTone}> = ({label, tone}) => {
  const accent = toneColor(tone);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${theme.colors.bgCreamTo}, ${theme.colors.backcard})`,
        fontFamily: FONT_STACKS.zh,
      }}
    >
      <div style={{position: 'absolute', left: 76, right: 76, top: 62, height: 648, borderRadius: theme.radius.video, background: theme.colors.surface}} />
      {[250, 515, 900, 1260, 1540].map((left, index) => (
        <div
          key={left}
          style={{
            position: 'absolute',
            left,
            top: index % 2 === 0 ? 88 : 142,
            width: index === 2 ? 250 : 178,
            height: index === 2 ? 244 : 138,
            border: `12px solid ${theme.colors.chrome}`,
            background: index % 2 === 0 ? theme.colors.blueSoft : theme.colors.peach,
            boxShadow: theme.shadow.card,
          }}
        />
      ))}
      <div style={{position: 'absolute', left: 664, top: 204, width: 558, height: 350, borderRadius: '46% 54% 42% 52%', background: theme.colors.chrome}} />
      <div style={{position: 'absolute', left: 748, top: 270, width: 390, height: 350, borderRadius: '46% 46% 52% 48%', background: theme.colors.orange}} />
      <div style={{position: 'absolute', left: 596, top: 548, width: 720, height: 640, borderRadius: '46% 46% 0 0', background: `linear-gradient(145deg, ${accent}, ${withAlpha(accent, 0.72)})`}} />
      <div style={{position: 'absolute', left: 955, top: 432, width: 62, height: 500, borderRadius: theme.radius.round, background: theme.colors.chrome, boxShadow: theme.shadow.dark}} />
      <div style={{position: 'absolute', left: 84, top: 84, padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`, borderRadius: theme.radius.round, color: theme.colors.ink, background: withAlpha(theme.colors.white, 0.82), fontSize: theme.fontSize.minReadable, fontWeight: 800}}>
        {label}
      </div>
    </div>
  );
};

const VideoFill: React.FC<{src: string}> = ({src}) => {
  const env = useRemotionEnvironment();
  const Footage = env.isRendering ? OffthreadVideo : Html5Video;
  return (
    <Footage
      src={resolveAssetSrc(src)}
      muted
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
    />
  );
};

export const PresenterCard: React.FC<{
  geometry: PipSwapGeometry;
  blur: number;
  label: string;
  tone: AccentTone;
  videoSrc?: string;
}> = ({geometry, blur, label, tone, videoSrc}) => (
  <div
    style={{
      position: 'absolute',
      left: geometry.cx - geometry.width / 2,
      top: geometry.cy - geometry.height / 2,
      width: geometry.width,
      height: geometry.height,
      overflow: 'hidden',
      borderRadius: geometry.radius,
      transform: `rotate(${geometry.rotate}deg)`,
      transformOrigin: '50% 50%',
      filter: blur > 0.05 ? `blur(${blur}px)` : 'none',
      boxShadow: theme.shadow.dark,
      background: theme.colors.backcard,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: DESIGN_WIDTH,
        height: DESIGN_HEIGHT,
        transform: `translate(calc(-50% + ${geometry.contentOffsetX}px), calc(-50% + ${geometry.contentOffsetY}px)) scale(${geometry.contentScale})`,
        transformOrigin: '50% 50%',
      }}
    >
      {videoSrc ? <VideoFill src={videoSrc} /> : <PresenterFallback label={label} tone={tone} />}
    </div>
  </div>
);

export type PictureInPictureSwapSceneProps = {
  workspaceTitle?: string;
  workspaceSections?: string[];
  presenterLabel?: string;
  presenterVideoSrc?: string;
  backgroundVideoSrc?: string;
  workspaceMode?: SurfaceMode;
  accentTone?: AccentTone;
  presenterTone?: AccentTone;
  pipSize?: number;
  pipRightOffset?: number;
  pipBottomOffset?: number;
  peakRotation?: number;
  cornerRadius?: number;
  backgroundZoom?: number;
  motionBlurStrength?: number;
  motionStartFrame?: number;
  pipLockFrame?: number;
  backgroundZoomStartFrame?: number;
  backgroundZoomLockFrame?: number;
  matchReferenceCadence?: boolean;
  showTracing?: boolean;
  sceneDurationFrames?: number;
};

/** 只算运动(遮罩几何 + 速度模糊),不画背景——给宿主在透明底上复用这支旋落动作(如口播数字人缩卡)。 */
export type PipSwapMotionParams = {
  pipSize?: number;
  pipRightOffset?: number;
  pipBottomOffset?: number;
  peakRotation?: number;
  cornerRadius?: number;
  motionBlurStrength?: number;
  motionStartFrame?: number;
  pipLockFrame?: number;
  matchReferenceCadence?: boolean;
  /** 人物视频里要对准画中画中心的点(1920×1080 视频坐标);不传 = 参考片行为(约 971, 424) */
  contentAnchorX?: number;
  contentAnchorY?: number;
};

export const resolvePipSwapMotion = (
  frame: number,
  fps: number,
  params: PipSwapMotionParams = {},
): {geometry: PipSwapGeometry; blur: number; sourceFrame: number; startFrame: number; lockFrame: number; progress: number} => {
  const sourceFrame = frame * (30 / fps);
  const startFrame = Math.max(0, Math.round(finiteOr(params.motionStartFrame, 13)));
  const lockFrame = Math.max(startFrame + 1, Math.round(finiteOr(params.pipLockFrame, 46)));
  const safePipSize = clamp(finiteOr(params.pipSize, 480), 300, 720);
  const safeRight = clamp(finiteOr(params.pipRightOffset, 0), 0, 360);
  const safeBottom = clamp(finiteOr(params.pipBottomOffset, 0), 0, 240);
  const safeRotation = clamp(finiteOr(params.peakRotation, 23), -36, 36);
  const safeRadius = clamp(finiteOr(params.cornerRadius, 94), 0, 180);
  const safeBlurStrength = clamp(finiteOr(params.motionBlurStrength, 1), 0, 2);
  const cadence = params.matchReferenceCadence ?? true;
  const anchorX = finiteOr(params.contentAnchorX, REFERENCE_ANCHOR_X);
  const anchorY = finiteOr(params.contentAnchorY, REFERENCE_ANCHOR_Y);
  const canonicalRaw = mapFrame(sourceFrame, startFrame, lockFrame, CANONICAL_START_FRAME, CANONICAL_LOCK_FRAME);
  const previousCanonicalRaw = mapFrame(
    Math.max(0, sourceFrame - 1),
    startFrame,
    lockFrame,
    CANONICAL_START_FRAME,
    CANONICAL_LOCK_FRAME,
  );
  const canonicalFrame = referenceCadenceFrame(canonicalRaw, cadence);
  const previousCanonicalFrame = referenceCadenceFrame(previousCanonicalRaw, cadence);
  const shared = {
    pipSize: safePipSize,
    pipRightOffset: safeRight,
    pipBottomOffset: safeBottom,
    peakRotation: safeRotation,
    cornerRadius: safeRadius,
    contentAnchorX: anchorX,
    contentAnchorY: anchorY,
  };
  const geometry = adaptGeometry({raw: sampleTrace(canonicalFrame), canonicalFrame, ...shared});
  const previousGeometry = adaptGeometry({
    raw: sampleTrace(previousCanonicalFrame),
    canonicalFrame: previousCanonicalFrame,
    ...shared,
  });
  const speed = Math.hypot(geometry.cx - previousGeometry.cx, geometry.cy - previousGeometry.cy);
  const blur = clamp((speed / 13) * safeBlurStrength, 0, 9);
  const progress = clamp((sourceFrame - startFrame) / Math.max(1, lockFrame - startFrame), 0, 1);
  return {geometry, blur, sourceFrame, startFrame, lockFrame, progress};
};

export const PictureInPictureSwapScene: React.FC<PictureInPictureSwapSceneProps> = ({
  workspaceTitle = 'WORKSPACE / CONTEXT',
  workspaceSections = DEFAULT_SECTIONS,
  presenterLabel = '可替换人物视频',
  presenterVideoSrc,
  backgroundVideoSrc,
  workspaceMode = 'dark',
  accentTone = 'blue',
  presenterTone = 'blue',
  pipSize = 480,
  pipRightOffset = 0,
  pipBottomOffset = 0,
  peakRotation = 23,
  cornerRadius = 94,
  backgroundZoom = 1.72,
  motionBlurStrength = 1,
  motionStartFrame = 13,
  pipLockFrame = 46,
  backgroundZoomStartFrame = 31,
  backgroundZoomLockFrame = 55,
  matchReferenceCadence = true,
  showTracing = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const zoomStart = Math.max(0, Math.round(finiteOr(backgroundZoomStartFrame, 31)));
  const zoomLock = Math.max(zoomStart + 1, Math.round(finiteOr(backgroundZoomLockFrame, 55)));
  const safeZoom = clamp(finiteOr(backgroundZoom, 1.72), 1, 2.4);
  const {geometry, blur, sourceFrame, lockFrame} = resolvePipSwapMotion(frame, fps, {
    pipSize,
    pipRightOffset,
    pipBottomOffset,
    peakRotation,
    cornerRadius,
    motionBlurStrength,
    motionStartFrame,
    pipLockFrame,
    matchReferenceCadence,
  });
  const backgroundProgress = smooth(
    clamp((sourceFrame - zoomStart) / Math.max(1, zoomLock - zoomStart), 0, 1),
  );
  const previousBackgroundProgress = smooth(
    clamp((sourceFrame - 1 - zoomStart) / Math.max(1, zoomLock - zoomStart), 0, 1),
  );
  const backgroundScale = lerp(1, safeZoom, backgroundProgress);
  const backgroundBlur = clamp(
    Math.abs(backgroundProgress - previousBackgroundProgress) * 120,
    0,
    6,
  );
  const accent = toneColor(accentTone);

  return (
    <DesignCanvas width={DESIGN_WIDTH} height={DESIGN_HEIGHT}>
      <div style={{position: 'relative', width: DESIGN_WIDTH, height: DESIGN_HEIGHT, overflow: 'hidden', background: theme.darkGlass.bg}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `scale(${backgroundScale})`,
            transformOrigin: '43% 48%',
            filter: backgroundBlur > 0.05 ? `blur(${backgroundBlur}px)` : 'none',
          }}
        >
          {backgroundVideoSrc ? (
            <VideoFill src={backgroundVideoSrc} />
          ) : (
            <WorkspaceFallback
              title={workspaceTitle}
              sections={workspaceSections}
              mode={workspaceMode}
              accent={accent}
            />
          )}
        </div>
        <PresenterCard
          geometry={geometry}
          blur={blur}
          label={presenterLabel}
          tone={presenterTone}
          videoSrc={presenterVideoSrc}
        />
        {showTracing ? (
          <svg
            aria-hidden="true"
            width={DESIGN_WIDTH}
            height={DESIGN_HEIGHT}
            viewBox={`0 0 ${DESIGN_WIDTH} ${DESIGN_HEIGHT}`}
            style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
          >
            <g transform={`translate(${geometry.cx} ${geometry.cy}) rotate(${geometry.rotate})`}>
              <rect
                x={-geometry.width / 2}
                y={-geometry.height / 2}
                width={geometry.width}
                height={geometry.height}
                rx={geometry.radius}
                fill="none"
                stroke={sourceFrame >= lockFrame ? theme.focusTones.green.label : theme.colors.orange}
                strokeWidth={5}
              />
              <circle cx={0} cy={0} r={9} fill={sourceFrame >= lockFrame ? theme.focusTones.green.label : theme.colors.orange} />
            </g>
          </svg>
        ) : null}
      </div>
    </DesignCanvas>
  );
};

/** 镜头说明书(SceneTag)—— 见 ../schema/sceneTag.ts。值纯字面量。 */
export const pipswapTag: SceneTag = {
  id: 'pipswap',
  componentName: 'PictureInPictureSwapScene',
  title: '画中画旋落交接',
  category: '运动·转场遮罩',
  style: '品牌·双主题',
  status: 'stable',
  intent: '让全屏人物画面沿弧线旋转收进右下画中画，同时露出并继续推进底层内容世界',
  suitableFor: '从真人讲解自然交接到网页、工作台、截图或录屏主画面；需要保留人物陪伴感但把注意力让给内容层的段落。',
  notFor: '只需要普通淡入淡出、静态右下角小窗，或人物层和背景层无法提前同时存在的素材。',
  exampleBeats: ['我先把画面让给这个工作区', '接下来重点看屏幕里的实际过程'],
  form: 'F2',
  defaultPose: 'audio-only',
  supportedPoses: ['audio-only'],
  fullscreenOnly: true,
  needsExternalAsset: false,
  assetType: null,
  textBinding: 'workspaceTitle',
  fields: [
    {key: 'workspaceTitle', label: '背景界面标题', type: 'text', tier: 'primary', default: 'WORKSPACE / CONTEXT'},
    {key: 'workspaceSections', label: '背景栏目', type: 'list', tier: 'primary', default: ['素材与目标', '人物与场景', '内容分镜', '运动约束'], help: '字符串数组；默认四项，可增减。'},
    {key: 'presenterLabel', label: '人物层标记', type: 'text', tier: 'primary', default: '可替换人物视频'},
    {key: 'presenterVideoSrc', label: '人物视频', type: 'asset', tier: 'primary', assetRoot: 'videos/', help: '可选；填宿主 public/videos 下的视频相对路径。留空时使用无真人示意层。'},
    {key: 'backgroundVideoSrc', label: '背景视频', type: 'asset', tier: 'primary', assetRoot: 'videos/', help: '可选；填宿主 public/videos 下的录屏或工作区视频。留空时使用程序化工作区。'},
    {key: 'workspaceMode', label: '背景主题', type: 'enum', tier: 'primary', values: ['dark', 'cream'], default: 'dark'},
    {key: 'accentTone', label: '界面强调色', type: 'enum', tier: 'advanced', values: ['blue', 'orange'], default: 'blue'},
    {key: 'presenterTone', label: '人物示意主色', type: 'enum', tier: 'advanced', values: ['blue', 'orange'], default: 'blue'},
    {key: 'pipSize', label: '最终画中画尺寸', type: 'number', tier: 'primary', default: 480, keyframeable: true},
    {key: 'pipRightOffset', label: '距右边', type: 'number', tier: 'advanced', default: 0, keyframeable: true},
    {key: 'pipBottomOffset', label: '距底边', type: 'number', tier: 'advanced', default: 0, keyframeable: true},
    {key: 'peakRotation', label: '旋转峰值', type: 'number', tier: 'advanced', default: 23, keyframeable: true},
    {key: 'cornerRadius', label: '最终圆角', type: 'number', tier: 'advanced', default: 94, keyframeable: true},
    {key: 'backgroundZoom', label: '背景推进倍率', type: 'number', tier: 'advanced', default: 1.72, keyframeable: true},
    {key: 'motionBlurStrength', label: '运动模糊强度', type: 'number', tier: 'advanced', default: 1, keyframeable: true},
    {key: 'motionStartFrame', label: '画中画开始帧', type: 'number', tier: 'advanced', default: 13, keyframeable: true},
    {key: 'pipLockFrame', label: '画中画锁定帧', type: 'number', tier: 'advanced', default: 46, keyframeable: true},
    {key: 'backgroundZoomStartFrame', label: '背景推进开始帧', type: 'number', tier: 'advanced', default: 31, keyframeable: true},
    {key: 'backgroundZoomLockFrame', label: '背景推进锁定帧', type: 'number', tier: 'advanced', default: 55, keyframeable: true},
    {key: 'matchReferenceCadence', label: '匹配原片重复帧', type: 'boolean', tier: 'advanced', default: true},
    {key: 'showTracing', label: '显示追踪框', type: 'boolean', tier: 'advanced', default: false},
  ],
  catalog: {
    narratorPosition: '全屏人物先出现，随后锁到右下画中画',
    supportingElements: ['人物外层遮罩', '独立人物内容画布', '底层工作区', '速度驱动运动模糊'],
    animation: '全屏遮罩收缩、沿右下弧线旋转、峰值约二十三度、回正锁定后背景继续推进',
    background: '可替换录屏视频；默认品牌 espresso 工作区与奶油人物示意层',
  },
  previewSeconds: 3,
  preview: {
    version: 1,
    kind: 'opaque-scene',
    background: 'opaque',
    context: 'none',
    galleryLoop: 'once',
  },
  tagVersion: 1,
  promotedFrom: 'create-vibe-motion',
};

export default PictureInPictureSwapScene;
