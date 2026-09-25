/**
 * collage.tsx — VOX 纸雕拼贴风格件家族(2026-07-14 自对决赛场晋升:
 * 试验区 对决/对决2/第四次测试 三轮 + vox-pilot salvage,取各家最优实现缝合)。
 *
 * 语汇:做旧档案纸底(feTurbulence 纸纹+纸筋漂移)+ 半调网点 + 红套印错位(硬投影/描边幽灵层)+
 * 撕边卡/撕纸转场 + 印章砸落 + 巨型数字 + 编辑台运镜(背景不动、内容层动)+ 12fps 图形顿挫。
 *
 * 使用契约:
 * - 颜色一律 props 传入,本件不带品牌默认色(组件晋升硬要求)。风格预设 `VOX_PRESET` 供一键取用
 *   (值 = 赛场工程五色硬约束原值;非品牌 token,勿并入 theme.ts;2026-07-18 已定居风格真源
 *   ../styles.ts,本文件 re-export 保住旧引用)。
 * - 时间参数用「局部帧」(at / durationInFrames;ink 家族用秒,两家约定不混)。
 * - 确定性:随机一律 remotion `random(seed)`;帧率 `useVideoConfig()`;interpolate 全 clamp。
 * - 12fps 顿挫(`quantizeFrame`)只喂图形动画(弹入/划线/盖章);相机与视差必须吃原始 frame
 *   保持 30fps 平滑(真 VOX 做法,出处 vox-pilot 五件套②)。
 * - 素材位:`HalftoneFigure.src` / `TornCard.textureUrl` / `TearOpen.textureUrl` 是显式素材位
 *   (调用方 staticFile() 备好传入);其余全件零素材纯代码。
 * - 逻辑画布 1920×1080(kit 纪律);CollagePaper 用 viewBox 适配,其余绝对坐标按 1920 设计。
 * - 阴影里的 rgba(26,26,26,…) 是纸雕投影常量(近黑,非品牌色),可经 shadow 类 props 覆盖。
 */
import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {CLAMP as clamp} from './motion';
import {withAlpha} from './styleTokens';
import {VOX_PRESET} from '../styles';

/* ================= 色板 ================= */

export type CollagePalette = {
  /** 档案纸米 */ paper: string;
  /** 墨黑 */ ink: string;
  /** 半调灰 */ gray: string;
  /** 套印正红 */ red: string;
  /** 芥末黄 */ mustard: string;
  /** 纸白 */ white: string;
};

/** 风格预设:值已定居 ../styles.ts(风格真源,2026-07-18);此处 re-export 保住旧引用。 */
export {VOX_PRESET};

/* ================= 时间工具 ================= */

/**
 * 12fps 图形顿挫:把驱动帧量化成阶梯(动画行话 "on twos and threes")。
 * 只喂图形动画;相机/视差吃原始 frame。targetFps 常用 12。
 */
export const quantizeFrame = (frame: number, targetFps: number, fps: number): number => {
  const step = fps / Math.max(1, targetFps);
  return Math.floor(frame / step) * step;
};

/* ================= 纸底 / 质感 ================= */

/**
 * 做旧档案纸底(纯代码零素材,抄第四次测试最优实现):
 * feTurbulence 固定 seed 纸噪(染近黑颗粒)+ 斜纹纸筋 pattern 缓慢漂移 + 手绘等高线 + 内框。
 */
export const CollagePaper: React.FC<{
  palette: CollagePalette;
  /** 纸噪整体透明度 */
  grainOpacity?: number;
  /** 纸筋漂移速度 px/秒(0 = 静止) */
  fiberDriftPxPerSec?: number;
  /** 画手绘等高线 */
  contours?: boolean;
  /** 内框 inset px;null = 不画 */
  frameInset?: number | null;
  /** 同屏挂多份不同色板时防 SVG id 撞车 */
  idSuffix?: string;
}> = ({
  palette,
  grainOpacity = 0.52,
  fiberDriftPxPerSec = -2.2,
  contours = true,
  frameInset = 30,
  idSuffix = '',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drift = (frame / fps) * fiberDriftPxPerSec;
  const noiseId = `collage-paper-noise${idSuffix}`;
  const fiberId = `collage-fibers${idSuffix}`;
  return (
    <AbsoluteFill style={{backgroundColor: palette.paper, overflow: 'hidden'}}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        style={{position: 'absolute', inset: 0}}
      >
        <defs>
          <filter id={noiseId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed="17" />
            {/* 噪声染成近黑颗粒(0.102≈#1A1A1A/255;纸噪染色常量,非品牌色) */}
            <feColorMatrix values="0 0 0 0 0.102 0 0 0 0 0.102 0 0 0 0 0.102 0 0 0 .22 0" />
          </filter>
          <pattern id={fiberId} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M-8 20 L56 4 M-8 44 L56 28" stroke={palette.ink} strokeWidth="1" opacity="0.08" />
            <path d="M8 0 L3 48 M34 0 L31 48" stroke={palette.white} strokeWidth="2" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill={palette.paper} />
        <rect width="1920" height="1080" fill={`url(#${fiberId})`} transform={`translate(${drift.toFixed(2)} 0)`} />
        <rect width="1920" height="1080" filter={`url(#${noiseId})`} opacity={grainOpacity} />
        {contours && (
          <>
            <path
              d="M0 122 C360 96 660 146 982 116 S1520 82 1920 128"
              fill="none"
              stroke={palette.ink}
              strokeWidth="2"
              opacity="0.12"
            />
            <path
              d="M0 904 C410 872 760 938 1100 892 S1620 858 1920 914"
              fill="none"
              stroke={palette.white}
              strokeWidth="5"
              opacity="0.15"
            />
          </>
        )}
      </svg>
      {frameInset != null && (
        <div style={{position: 'absolute', inset: frameInset, border: `2px solid ${palette.ink}`, opacity: 0.17}} />
      )}
    </AbsoluteFill>
  );
};

/** 半调网点覆层(纯 CSS radial-gradient 平铺,零 SVG id 负担;maskImage 可做渐隐) */
export const HalftoneDots: React.FC<{
  dotColor: string;
  /** 点间距 px */
  cell?: number;
  /** 点半径 px */
  dotR?: number;
  opacity?: number;
  /** 如 'linear-gradient(90deg, #000, transparent 42%, #000)' 做带状渐隐 */
  maskImage?: string;
  style?: React.CSSProperties;
}> = ({dotColor, cell = 8, dotR = 1.2, opacity = 0.22, maskImage, style}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      opacity,
      backgroundImage: `radial-gradient(circle, ${dotColor} 0 ${dotR}px, transparent ${dotR + 0.2}px)`,
      backgroundSize: `${cell}px ${cell}px`,
      ...(maskImage ? {maskImage, WebkitMaskImage: maskImage} : null),
      ...style,
    }}
  />
);

/** 印刷颗粒覆层(程序化 data-URI:feTurbulence 噪粒 + 双点网屏,固定 seed 全片不抖;抄对决-claude) */
export const PrintGrain: React.FC<{
  dotColor?: string;
  noiseOpacity?: number;
  dotOpacity?: number;
}> = ({dotColor = '#1A1A1A', noiseOpacity = 0.13, dotOpacity = 0.05}) => {
  const layers = useMemo(() => {
    const noise = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0.55 0"/></filter><rect width="360" height="360" filter="url(#n)"/></svg>`;
    const dots = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><circle cx="3.5" cy="3.5" r="1.15" fill="${dotColor}"/><circle cx="10.5" cy="10.5" r="1.15" fill="${dotColor}"/></svg>`;
    return {
      noise: `url("data:image/svg+xml;utf8,${encodeURIComponent(noise)}")`,
      dots: `url("data:image/svg+xml;utf8,${encodeURIComponent(dots)}")`,
    };
  }, [dotColor]);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{backgroundImage: layers.noise, backgroundRepeat: 'repeat', opacity: noiseOpacity, mixBlendMode: 'multiply'}}
      />
      <AbsoluteFill
        style={{backgroundImage: layers.dots, backgroundRepeat: 'repeat', opacity: dotOpacity, mixBlendMode: 'multiply'}}
      />
    </AbsoluteFill>
  );
};

/* ================= 档案台小件 ================= */

/** 四角套准十字标(印刷套准记号,一眼档案感;默认 1920×1080 四角,可传自定位置) */
export const RegistrationMarks: React.FC<{
  palette: CollagePalette;
  positions?: ReadonlyArray<readonly [number, number]>;
  opacity?: number;
}> = ({
  palette,
  positions = [
    [76, 72],
    [1812, 72],
    [76, 1004],
    [1812, 1004],
  ],
  opacity = 1,
}) => (
  <>
    {positions.map(([left, top], i) => (
      <div key={i} style={{position: 'absolute', left, top, width: 32, height: 32, opacity}}>
        <div style={{position: 'absolute', left: 15, top: 0, width: 2, height: 32, background: palette.ink, opacity: 0.45}} />
        <div style={{position: 'absolute', left: 0, top: 15, width: 32, height: 2, background: palette.ink, opacity: 0.45}} />
        <div style={{position: 'absolute', inset: 8, border: `2px solid ${palette.red}`, borderRadius: '50%'}} />
      </div>
    ))}
  </>
);

/** 档案台顶栏:左档案名 + 右章节 chip(墨底纸字) */
export const ArchiveHeader: React.FC<{
  left: React.ReactNode;
  chip?: React.ReactNode;
  palette: CollagePalette;
  fontFamily?: string;
  style?: React.CSSProperties;
}> = ({left, chip, palette, fontFamily, style}) => (
  <div
    style={{
      position: 'absolute',
      top: 58,
      left: 92,
      right: 92,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily,
      fontWeight: 900,
      letterSpacing: 5,
      fontSize: 20,
      color: palette.ink,
      ...style,
    }}
  >
    <span>{left}</span>
    {chip != null && <span style={{background: palette.ink, color: palette.paper, padding: '8px 18px'}}>{chip}</span>}
  </div>
);

/* ================= 记号笔 ================= */

/**
 * 记号笔划线:SVG 弧线 strokeDashoffset 画入(抄 vox-pilot)。
 * stutterFps>0 时驱动帧走 12fps 顿挫(默认 12,传 0 关闭走平滑)。
 */
export const MarkerStroke: React.FC<{
  width: number;
  color: string;
  height?: number;
  startFrame?: number;
  durationInFrames?: number;
  strokeWidth?: number;
  direction?: 'horizontal' | 'diagonal';
  stutterFps?: number;
}> = ({width, color, height = 28, startFrame = 0, durationInFrames = 14, strokeWidth = 18, direction = 'horizontal', stutterFps = 12}) => {
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const frame = stutterFps > 0 ? quantizeFrame(rawFrame, stutterFps, fps) : rawFrame;
  const progress = interpolate(frame, [startFrame, startFrame + Math.max(1, durationInFrames)], [0, 1], clamp);
  const length = Math.sqrt(width * width + height * height);
  const y1 = direction === 'horizontal' ? height * 0.58 : height * 0.82;
  const y2 = direction === 'horizontal' ? height * 0.42 : height * 0.18;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}} aria-hidden>
      <path
        d={`M 4 ${y1} Q ${width * 0.45} ${height * 0.18}, ${width - 4} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - progress)}
        opacity={0.9}
      />
    </svg>
  );
};

/** 下划线扫(MarkerStroke 的细身封装) */
export const UnderlineSwipe: React.FC<{
  width: number;
  color: string;
  startFrame?: number;
  durationInFrames?: number;
  thickness?: number;
  stutterFps?: number;
}> = ({width, color, startFrame = 0, durationInFrames = 14, thickness = 15, stutterFps = 12}) => (
  <MarkerStroke
    width={width}
    height={30}
    startFrame={startFrame}
    durationInFrames={durationInFrames}
    color={color}
    strokeWidth={thickness}
    stutterFps={stutterFps}
  />
);

/* ================= 撕纸 ================= */

/** 种子锯齿多边形(clip-path;random(seed) 确定性,渲染稳定) */
const jaggedPolygon = (seed: string, wobble: number): string => {
  const pts: string[] = [];
  const N = 14;
  const rnd = (i: number, edge: string) => random(`${seed}-${edge}-${i}`) * wobble;
  for (let i = 0; i <= N; i++) pts.push(`${(i / N) * 100}% ${rnd(i, 't')}%`);
  for (let i = 1; i <= N; i++) pts.push(`${100 - rnd(i, 'r')}% ${(i / N) * 100}%`);
  for (let i = 1; i <= N; i++) pts.push(`${100 - (i / N) * 100}% ${100 - rnd(i, 'b')}%`);
  for (let i = 1; i < N; i++) pts.push(`${rnd(i, 'l')}% ${100 - (i / N) * 100}%`);
  return `polygon(${pts.join(',')})`;
};

/** 卡内静态纸噪(无纹理图时的程序化兜底) */
const cardGrainUri = (() => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="13" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="240" height="240" filter="url(#g)" opacity="0.5"/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
})();

/**
 * 撕边纸卡(抄对决2-claude,进库版去素材依赖):种子锯齿 clip-path,
 * 默认纯色 + 程序纸噪;要真纸纹传 textureUrl(素材位,与 fill multiply 混合)。
 * sticker 模式外垫一圈毛边(贴纸感)。
 */
export const TornCard: React.FC<{
  seed: string;
  /** 卡底色 */
  fill: string;
  /** 纸纹图(素材位,调用方 staticFile();与 fill multiply) */
  textureUrl?: string;
  /** 无纹理图时叠程序纸噪 */
  grain?: boolean;
  wobble?: number;
  sticker?: boolean;
  stickerColor?: string;
  /** drop-shadow 参数串;默认近黑软影(非品牌色) */
  shadow?: string;
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  seed,
  fill,
  textureUrl,
  grain = true,
  wobble = 3.2,
  sticker,
  stickerColor = '#FFFFFF',
  shadow = '6px 10px 14px rgba(26,26,26,0.35)',
  style,
  innerStyle,
  children,
}) => {
  const clip = useMemo(() => jaggedPolygon(seed, wobble), [seed, wobble]);
  const clipOuter = useMemo(() => jaggedPolygon(`${seed}-o`, wobble), [seed, wobble]);
  const bgStyle: React.CSSProperties = textureUrl
    ? {
        backgroundImage: `url(${textureUrl})`,
        backgroundSize: 'cover',
        backgroundColor: fill,
        backgroundBlendMode: 'multiply',
      }
    : grain
      ? {backgroundImage: cardGrainUri, backgroundRepeat: 'repeat', backgroundColor: fill, backgroundBlendMode: 'multiply'}
      : {backgroundColor: fill};
  const inner = (
    <div style={{...bgStyle, width: '100%', height: '100%', ...innerStyle, clipPath: clip}}>{children}</div>
  );
  return (
    <div style={{filter: `drop-shadow(${shadow})`, ...style}}>
      {sticker ? <div style={{background: stickerColor, clipPath: clipOuter, padding: 10}}>{inner}</div> : inner}
    </div>
  );
};

/**
 * 撕纸揭示转场(抄对决2-claude):整页纸从中缝撕开,左右滑出露下层。
 * 盖在旧场景之上,at 起 dur 帧内完成;t>=1 自动卸载。
 */
export const TearOpen: React.FC<{
  at?: number;
  dur?: number;
  seed?: string;
  /** 纸面色 */
  fill: string;
  /** 纸纹图(素材位,可选) */
  textureUrl?: string;
}> = ({at = 0, dur = 18, seed = 'tear', fill, textureUrl}) => {
  const frame = useCurrentFrame();
  const seam = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i <= 24; i++) pts.push(50 + (random(`${seed}-seam-${i}`) - 0.5) * 7);
    return pts;
  }, [seed]);
  const t = interpolate(frame, [at, at + Math.max(1, dur)], [0, 1], clamp);
  if (t >= 1) return null;
  const ease = 1 - Math.pow(1 - t, 3);
  const leftClip = `polygon(0% 0%, ${seam.map((x, i) => `${x}% ${(i / 24) * 100}%`).join(',')}, 0% 100%)`;
  const rightClip = `polygon(100% 0%, ${seam.map((x, i) => `${x + 1.2}% ${(i / 24) * 100}%`).join(',')}, 100% 100%)`;
  const paper: React.CSSProperties = textureUrl
    ? {backgroundImage: `url(${textureUrl})`, backgroundSize: 'cover', backgroundColor: fill, backgroundBlendMode: 'multiply'}
    : {backgroundImage: cardGrainUri, backgroundRepeat: 'repeat', backgroundColor: fill, backgroundBlendMode: 'multiply'};
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          ...paper,
          clipPath: leftClip,
          transform: `translateX(${-ease * 62}%) rotate(${-ease * 3}deg)`,
          filter: 'drop-shadow(18px 0 26px rgba(26,26,26,0.45))',
        }}
      />
      <AbsoluteFill
        style={{
          ...paper,
          clipPath: rightClip,
          transform: `translateX(${ease * 62}%) rotate(${ease * 2.4}deg)`,
          filter: 'drop-shadow(-18px 0 26px rgba(26,26,26,0.45))',
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * 撕纸条扫过转场(vox-pilot PaperWipe/TornStrips 合并):
 * mode='full' 整片撕边大纸横扫(中点盖满);mode='strips' 上下两条错拍交错扫。
 * 按 1920 逻辑画布设计,盖在镜头边界处。
 * children(仅 full):随纸同行的内容(过场词)——排在纸面内部、吃同一 transform,
 *   与纸的缓动天然绑定不脱钩(别在纸外面用 opacity 窗口近似,尾段会脱钩穿帮)。
 */
export const TornWipe: React.FC<{
  durationInFrames: number;
  color: string;
  mode?: 'full' | 'strips';
  /** strips 模式下条二的颜色(默认同 color) */
  secondColor?: string;
  direction?: 'ltr' | 'rtl';
  /** 仅 full:纸面上的随行内容(过场词);strips 模式忽略 */
  children?: React.ReactNode;
}> = ({durationInFrames, color, mode = 'full', secondColor, direction = 'ltr', children}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  if (mode === 'strips') {
    const xTop = interpolate(progress, [0, 0.46, 1], [-2400, -60, 2300], clamp);
    const xBottom = interpolate(progress, [0.06, 0.52, 1], [2400, 60, -2300], clamp);
    const strip = (x: number, top: number, height: number, c: string, rot: number): React.CSSProperties => ({
      position: 'absolute',
      left: -240,
      top,
      width: 2400,
      height,
      transform: `translate3d(${x}px, 0, 0) rotate(${rot}deg)`,
      backgroundColor: c,
      clipPath:
        'polygon(0 4%, 6% 0, 17% 3%, 30% .6%, 44% 3.4%, 58% 1%, 71% 3.2%, 85% .4%, 100% 3%, 100% 96%, 87% 100%, 73% 97%, 60% 99.4%, 45% 96.6%, 31% 99%, 15% 96.8%, 0 99.5%)',
      boxShadow: '0 14px 44px rgba(26,26,26,.3)',
    });
    return (
      <>
        <div style={strip(xTop, -60, 640, color, -1.6)} />
        <div style={strip(xBottom, 520, 660, secondColor ?? color, 1.4)} />
      </>
    );
  }
  const sign = direction === 'ltr' ? 1 : -1;
  const x = sign * interpolate(progress, [0, 0.48, 1], [-2100, 0, 2100], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: -220,
        top: -80,
        width: 2360,
        height: 1240,
        transform: `translate3d(${x}px, 0, 0) rotate(${sign * -2}deg)`,
        backgroundColor: color,
        clipPath:
          'polygon(0 2%, 7% 0, 19% 2%, 31% .4%, 46% 2.2%, 59% .6%, 73% 2%, 86% .3%, 100% 2%, 100% 98%, 88% 100%, 74% 98.3%, 61% 99.6%, 47% 98%, 30% 99.4%, 16% 98.1%, 0 100%)',
        boxShadow: '0 0 80px rgba(26,26,26,.26)',
      }}
    >
      {children != null && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

/* ================= 印章 / 大数字 ================= */

/**
 * 印章砸落(抄对决2-claude):at(局部帧)从 1.9x 硬弹簧盖下落定,
 * radial mask 做印泥深浅不匀。
 */
export const Stamp: React.FC<{
  text: React.ReactNode;
  at: number;
  color: string;
  size?: number;
  rotate?: number;
  round?: boolean;
  fontFamily?: string;
  /** 印泥不匀 mask(关掉 = 实色) */
  maskFade?: boolean;
  style?: React.CSSProperties;
}> = ({text, at, color, size = 44, rotate = -8, round, fontFamily, maskFade = true, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const s = spring({
    frame: frame - at,
    fps,
    config: {damping: 30, stiffness: 380, mass: 0.6},
    durationInFrames: 20,
  });
  const scale = 1.9 - 0.9 * s;
  const opacity = interpolate(frame - at, [0, 4], [0, 0.92], clamp);
  const mask = 'radial-gradient(circle at 30% 40%, black 55%, rgba(0,0,0,0.72) 78%, rgba(0,0,0,0.5) 100%)';
  return (
    <div
      style={{
        display: 'inline-block',
        transform: `rotate(${rotate}deg) scale(${scale})`,
        opacity,
        border: `${Math.max(4, size * 0.14)}px solid ${color}`,
        borderRadius: round ? '50%' : 8,
        padding: round ? size * 0.6 : `${size * 0.22}px ${size * 0.5}px`,
        color,
        fontFamily,
        fontWeight: 900,
        fontSize: size,
        whiteSpace: 'nowrap',
        letterSpacing: 4,
        ...(maskFade ? {maskImage: mask, WebkitMaskImage: mask} : null),
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** 巨型数字/大字套印(抄对决2-claude):身后描边幽灵层错位 = 印刷套准误差的贴纸感 */
export const BigNum: React.FC<{
  text: string;
  color: string;
  strokeColor: string;
  size?: number;
  fontFamily?: string;
  style?: React.CSSProperties;
}> = ({text, color, strokeColor, size = 300, fontFamily, style}) => (
  <div style={{position: 'relative', display: 'inline-block', lineHeight: 1, ...style}}>
    <span
      style={{
        fontFamily,
        fontWeight: 900,
        fontSize: size,
        WebkitTextStroke: `${Math.max(10, size * 0.06)}px ${strokeColor}`,
        color: 'transparent',
        position: 'absolute',
        inset: 0,
        whiteSpace: 'nowrap',
        filter: 'drop-shadow(0 14px 22px rgba(26,26,26,0.4))',
      }}
    >
      {text}
    </span>
    <span style={{fontFamily, fontWeight: 900, fontSize: size, color, position: 'relative', whiteSpace: 'nowrap'}}>
      {text}
    </span>
  </div>
);

/* ================= 入场 ================= */

export type SlamDirection = 'top' | 'bottom' | 'left' | 'right' | 'scaleDown' | 'scaleUp';

/**
 * 砸入/弹入包装(对决2-claude SlamIn + vox-pilot AnimatedLayer 融合):
 * at(局部帧)前不挂载,spring 落定后完全静置。
 * - stiff:硬弹簧(重物砸落);默认软弹簧(纸片飘落带过冲)。
 * - stutterFps>0:入场走 12fps 顿挫(图形专用;默认 0 = 平滑)。
 * - followTilt:旋转跟随(secondary motion)——入场方向决定初始倾斜,过冲时自然摆过头再回正;
 *   位移已 clamp,过冲只表现在旋转上(位移稳、姿态活,vox-pilot 研究定版)。
 */
export const SlamIn: React.FC<{
  at: number;
  from?: SlamDirection;
  distance?: number;
  rotateFrom?: number;
  rotateTo?: number;
  stiff?: boolean;
  stutterFps?: number;
  followTilt?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  at,
  from = 'scaleDown',
  distance = 420,
  rotateFrom = 0,
  rotateTo = 0,
  stiff,
  stutterFps = 0,
  followTilt = false,
  style,
  children,
}) => {
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (rawFrame < at) return null;
  const local = rawFrame - at;
  const springFrame = stutterFps > 0 ? quantizeFrame(local, stutterFps, fps) : local;
  const s = spring({
    frame: springFrame,
    fps,
    config: stiff ? {damping: 26, stiffness: 340, mass: 0.7} : {damping: 16, stiffness: 190, mass: 0.9},
    durationInFrames: 32,
  });
  let transform = '';
  if (from === 'top') transform = `translateY(${(s - 1) * distance}px)`;
  if (from === 'bottom') transform = `translateY(${(1 - s) * distance}px)`;
  if (from === 'left') transform = `translateX(${(s - 1) * distance}px)`;
  if (from === 'right') transform = `translateX(${(1 - s) * distance}px)`;
  if (from === 'scaleDown') transform = `scale(${2.2 - 1.2 * s})`;
  if (from === 'scaleUp') transform = `scale(${0.3 + 0.7 * s})`;
  const tiltBase =
    from === 'top' ? -2.4 : from === 'bottom' ? 2.4 : from === 'left' ? 1.8 : from === 'right' ? -1.8 : 1.6;
  const tilt = followTilt ? (1 - s) * tiltBase : 0;
  const rot = rotateFrom + (rotateTo - rotateFrom) * s + tilt;
  const opacity = interpolate(local, [0, 5], [0, 1], clamp);
  return <div style={{...style, opacity, transform: `${transform} rotate(${rot}deg)`}}>{children}</div>;
};

/* ================= 编辑台舞台 / 运镜 ================= */

export type CollageCameraMove = 'push' | 'pull' | 'left' | 'right' | 'up' | 'none';

/** 运镜预设起点(SceneCamera 枚举,抄对决-codex):从偏移态 settleFrames 帧 cubic-out 落定到恒等 */
const CAMERA_START: Record<Exclude<CollageCameraMove, 'none'>, {x: number; y: number; s: number}> = {
  push: {x: 0, y: 0, s: 0.84},
  pull: {x: 0, y: 0, s: 1.16},
  left: {x: 210, y: 0, s: 1},
  right: {x: -210, y: 0, s: 1},
  up: {x: 0, y: 170, s: 1},
};

/**
 * 编辑台舞台(抄对决2-codex Stage 的分层相机——四轮赛场里唯一写对的):
 * 背景(backdrop)/暗角/网点/外框全部不动,相机 transform 只加在内容层
 * → 天然视差 + 背景稳,"镜头滑过纸面"的正确观感。相机吃原始 frame(不顿挫)。
 *
 * 两种驱动(择一):
 * - move 预设:'push'|'pull'|'left'|'right'|'up',settleFrames 帧落定;
 * - 显式关键帧:zoom/panX/panY + durInFrames(线性推拉移,抄对决2-claude Cam)。
 */
export const CollageStage: React.FC<{
  palette: CollagePalette;
  /** 常驻底(默认 <CollagePaper palette={palette} />) */
  backdrop?: React.ReactNode;
  move?: CollageCameraMove;
  settleFrames?: number;
  zoom?: [number, number];
  panX?: [number, number];
  panY?: [number, number];
  durInFrames?: number;
  origin?: string;
  /** 高光+压暗的桌面光场 */
  vignette?: boolean;
  /** 半调网点带(默认关;开 = 抄对决2-codex 的左右渐隐网点) */
  halftone?: boolean;
  /** 墨色外框 + 内阴影 */
  frameBorder?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  palette,
  backdrop,
  move = 'none',
  settleFrames = 28,
  zoom = [1, 1],
  panX = [0, 0],
  panY = [0, 0],
  durInFrames,
  origin = '50% 50%',
  vignette = true,
  halftone = false,
  frameBorder = true,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  let x: number;
  let y: number;
  let s: number;
  if (move !== 'none') {
    const p = interpolate(frame, [0, Math.max(1, settleFrames)], [0, 1], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    });
    const start = CAMERA_START[move];
    x = interpolate(p, [0, 1], [start.x, 0], clamp);
    y = interpolate(p, [0, 1], [start.y, 0], clamp);
    s = interpolate(p, [0, 1], [start.s, 1], clamp);
  } else {
    const dur = Math.max(1, durInFrames ?? 1);
    x = interpolate(frame, [0, dur], panX, clamp);
    y = interpolate(frame, [0, dur], panY, clamp);
    s = interpolate(frame, [0, dur], zoom, clamp);
  }
  return (
    <AbsoluteFill style={{backgroundColor: palette.paper, overflow: 'hidden', ...style}}>
      {backdrop ?? <CollagePaper palette={palette} />}
      {vignette && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 22% 15%, ${withAlpha(palette.white, 0.22)}, transparent 26%), radial-gradient(circle at 78% 80%, ${withAlpha(palette.ink, 0.14)}, transparent 30%)`,
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
          }}
        />
      )}
      {halftone && (
        <HalftoneDots dotColor={palette.ink} maskImage="linear-gradient(90deg, #000, transparent 42%, #000)" />
      )}
      <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: origin}}>
        {children}
      </AbsoluteFill>
      {frameBorder && (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            boxShadow: `inset 0 0 130px ${withAlpha(palette.ink, 0.44)}`,
            border: `14px solid ${palette.ink}`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/* ================= 半调剪影 ================= */

/**
 * 半调剪纸 + 身后偏移剪影(抄 vox-pilot HalftoneFigure,VOX 招牌件):
 * src 是显式素材位(透明底 PNG,调用方 staticFile());剪影用 CSS mask 从同一张图生成,
 * 轮廓永远贴合素材。入场动效由调用方包 <SlamIn> 组合,本件纯静态分层。
 */
export const HalftoneFigure: React.FC<{
  /** 透明底图 URL(素材位) */
  src: string;
  width: number;
  height: number;
  strokeColor: string;
  strokeOffset?: {x: number; y: number};
  strokeOpacity?: number;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
}> = ({src, width, height, strokeColor, strokeOffset = {x: 14, y: 10}, strokeOpacity = 0.92, style, imgStyle}) => {
  const mask: React.CSSProperties = {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  };
  return (
    <div style={{position: 'relative', width, height, ...style}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${strokeOffset.x}px, ${strokeOffset.y}px)`,
          backgroundColor: strokeColor,
          opacity: strokeOpacity,
          ...mask,
        }}
      />
      <Img
        src={src}
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', ...imgStyle}}
      />
    </div>
  );
};
