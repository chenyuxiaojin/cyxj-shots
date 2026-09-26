import React, {useId} from 'react';
import model from './star-grid-reference.json';

/** Reference palette belongs to this grayscale replica, not the host brand theme. */
export type StarGridProps = {
  frame?: number; fps?: number; videoWidth?: number; videoHeight?: number;
  motionSeconds?: number; turns?: number; starScale?: number;
  starColor?: string; baseColor?: string; glowColor?: string; gridColor?: string;
  gridSpacing?: number; gridLineWidth?: number; gridOpacity?: number; glowStrength?: number;
  shadowOpacity?: number; shadowBlur?: number; shadowOffset?: number;
  topX?: number; topY?: number; bottomX?: number; bottomY?: number;
  showStars?: boolean; showGrid?: boolean; showBaseFill?: boolean;
  traceOnly?: boolean;
};

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));
const finite = (x: number, fallback: number) => Number.isFinite(x) ? x : fallback;

/** Invert x(t) first: the measured motion is cubic-bezier(.3,0,.3,1). */
const progressAt = (progress: number): number => {
  const p = clamp(progress, 0, 1);
  let lo = 0; let hi = 1;
  for (let i = 0; i < 22; i++) {
    const t = (lo + hi) / 2;
    const x = 0.9 * (1-t) * t + t*t*t;
    if (x < p) lo = t; else hi = t;
  }
  const t = (lo + hi) / 2;
  return p === 0 ? 0 : p === 1 ? 1 : 3*t*t - 2*t*t*t;
};

export const StarGridBackdrop: React.FC<StarGridProps> = ({
  frame = 0, fps = 30, videoWidth = 720, videoHeight = 1280,
  motionSeconds = 10, turns = 2, starScale = 1,
  starColor = '#151515', baseColor = '#323232', glowColor = '#c7c7c7', gridColor = '#000000',
  gridSpacing = 92.5, gridLineWidth = 1, gridOpacity = 1, glowStrength = 1,
  shadowOpacity = 0.57, shadowBlur = 17, shadowOffset = 25,
  topX = 0.895833, topY = 0.059063, bottomX = 0.088333, bottomY = 0.928125,
  showStars = true, showGrid = true, showBaseFill = true, traceOnly = false,
}) => {
  // useId only namespaces SVG definitions; motion depends exclusively on frame.
  const id = useId().replace(/:/g, '');
  const w = Math.max(1, finite(videoWidth, 720));
  const h = Math.max(1, finite(videoHeight, 1280));
  const s = Math.min(w/720, h/1280);
  const spacing = clamp(finite(gridSpacing, 92.5), 30, 250) * s;
  const rotation = 360 * finite(turns, 2) * progressAt(Math.max(0, frame) / Math.max(1, finite(motionSeconds, 10) * Math.max(1, fps)));
  const stars = [
    {x: w*clamp(topX,-0.5,1.5), y: h*clamp(topY,-0.5,1.5), r: 30+rotation},
    {x: w*clamp(bottomX,-0.5,1.5), y: h*clamp(bottomY,-0.5,1.5), r: 3.2+rotation},
  ];
  const radius = 800*s;
  return <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} style={{display:'block', overflow:'hidden'}} aria-label="灰阶菱格与旋转六角星芒">
    <defs>
      <radialGradient id={`${id}-glow`} gradientUnits="userSpaceOnUse" cx={w/2} cy={h/2} r={radius} gradientTransform={`translate(0 ${h/2}) scale(1 ${578.3/589.8}) translate(0 ${-h/2})`}>
        {Array.from({length:25}, (_,i) => {
          const distance = i/24;
          const alpha = Math.exp(-((distance*800/589.8)**1.57));
          return <stop key={i} offset={distance} stopColor={glowColor} stopOpacity={clamp(alpha*glowStrength,0,1)}/>;
        })}
      </radialGradient>
      <radialGradient id={`${id}-grid-fade`}>
        <stop offset="0" stopColor="white"/>
        <stop offset=".37" stopColor="white" stopOpacity="1"/>
        <stop offset=".55" stopColor="white" stopOpacity=".75"/>
        <stop offset=".75" stopColor="white" stopOpacity=".27"/>
        <stop offset=".9" stopColor="white" stopOpacity=".04"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
      </radialGradient>
      <mask id={`${id}-grid-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
        <ellipse cx={w/2} cy={h/2} rx={490*s} ry={500*s} fill={`url(#${id}-grid-fade)`}/>
      </mask>
      <pattern id={`${id}-grid`} width={spacing} height={spacing} patternUnits="userSpaceOnUse" x={w/2} y={h/2}>
        <path d={`M 0 0 L ${spacing} ${spacing} M 0 ${spacing} L ${spacing} 0`} fill="none" stroke={gridColor} strokeWidth={clamp(finite(gridLineWidth,1),.4,3)*s}/>
      </pattern>
      <filter id={`${id}-drop`} filterUnits="userSpaceOnUse" x={-320*s} y={-320*s} width={w+640*s} height={h+640*s} colorInterpolationFilters="sRGB">
        <feDropShadow dx={clamp(shadowOffset,-80,80)*s} dy={clamp(shadowOffset,-80,80)*s} stdDeviation={clamp(shadowBlur,0,70)*s} floodColor={starColor} floodOpacity={clamp(shadowOpacity,0,1)}/>
      </filter>
    </defs>
    {!traceOnly && showBaseFill ? <><rect width={w} height={h} fill={baseColor}/><rect width={w} height={h} fill={`url(#${id}-glow)`}/></> : null}
    {!traceOnly && showGrid ? <rect width={w} height={h} fill={`url(#${id}-grid)`} mask={`url(#${id}-grid-mask)`} opacity={clamp(gridOpacity,0,1)}/> : null}
    {showStars && stars.map((star,index) => <g key={index} filter={traceOnly ? undefined : `url(#${id}-drop)`}>
      <path d={model.starPath} transform={`translate(${star.x} ${star.y}) rotate(${star.r}) scale(${clamp(starScale,.1,3)*s})`} fill={traceOnly ? 'none' : starColor} stroke={traceOnly ? (index===0?'#ff4444':'#00eaff') : undefined} strokeWidth={traceOnly ? 2/s : undefined}/>
      {traceOnly ? <circle cx={star.x} cy={star.y} r={5*s} fill={index===0?'#ff4444':'#00eaff'}/> : null}
    </g>)}
  </svg>;
};
