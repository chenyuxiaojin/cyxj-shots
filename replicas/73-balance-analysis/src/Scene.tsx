import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { Fonts } from './common';
import { geom, mix } from './geometry';
import defaults from '../props.json';
type Props = typeof defaults;
const xy = (r: number, a: number) => [r * Math.cos(a * Math.PI / 180), r * Math.sin(a * Math.PI / 180)];
const arc = (r: number, a: number, b: number, sweep = 1) => { const p = xy(r, a), q = xy(r, b); return `M${p[0]} ${p[1]}A${r} ${r} 0 ${Math.abs(b - a) > 180 ? 1 : 0} ${sweep} ${q[0]} ${q[1]}`; };
const asset = (s: string) => /^https?:/.test(s) ? s : staticFile(s);
export const Scene: React.FC<Props> = (input) => {
    const p = { ...defaults, ...input }, frame = useCurrentFrame(), { durationInFrames } = useVideoConfig();
    const f = frame * 205 / Math.max(1, durationInFrames - 1), g = geom(f), rad = g.angle * Math.PI / 180;
    const wnX = g.x + g.wx * Math.cos(rad) * g.scale, wnY = g.y + g.wx * Math.sin(rad) * g.scale, wY = wnY + 74 * g.scale;
    const bannerX = mix(f, [0, 44, 48, 54, 60, 66, 75, 84, 96, 102, 108, 112, 120, 126, 132], [480, 480, 382, 266, 215, 181, 167, 164, 164, 144, 92, 55, 6, -30, -46]);
    const bannerW = mix(f, [0, 44, 48, 54, 60, 66, 75, 84, 96, 102, 108, 112, 120, 132], [0, 0, 239, 436, 530, 600, 626, 632, 632, 709, 880, 980, 1120, 1260]);
    const bannerY = mix(f, [0, 44, 48, 54, 96, 102, 108, 112, 120, 132], [178, 178, 178, 143, 143, 111, 41, -4, -60, -88]);
    const bannerH = mix(f, [0, 48, 54, 96, 102, 108, 112, 120, 132], [132, 132, 120, 120, 134, 160, 177, 197, 206]);
    const zoom = mix(f, [96, 132], [0, 1]), brandX = mix(f, [96, 132], [178, 45]), brandY = mix(f, [96, 132], [250, 81]);
    const swing = mix(f, [188, 196, 200, 202, 204, 205], [0, 1.5, 4, 6, 10, 12]);
    const panY = g.y + mix(f, [54, 84, 96, 132], [206, 201, 201, 193]) * g.scale;
    const panW = mix(f, [96, 132], [196, 186]) * g.scale;
    const end = mix(f, [0, 30, 60, 96, 132, 186, 205], [136, 114, 96, 68, 29, -13, -38]);
    const caption = p.captions[f < 17 ? 0 : f < 100 ? 1 : f < 189 ? 2 : 3] || '';
    return <AbsoluteFill style={{ background: p.background }}><Fonts /><svg viewBox="0 0 960 540" width="100%" height="100%" style={{ fontFamily: 'ReplicaSans, sans-serif' }}>
 <defs>
  <pattern id="grid" width="32.6" height="32.6" patternUnits="userSpaceOnUse"><path d="M32.6 0H0V32.6" fill="none" stroke="#fff" strokeWidth=".7" opacity=".58"/></pattern>
  <radialGradient id="vignette"><stop offset="20%" stopColor="#fff" stopOpacity="0"/><stop offset="100%" stopColor="#fff" stopOpacity=".18"/></radialGradient>
  <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" seed="36"/><feColorMatrix type="saturate" values="0"/></filter>
  <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#626462"/><stop offset=".35" stopColor="#e4e6e4"/><stop offset=".64" stopColor="#b5b7b5"/><stop offset="1" stopColor="#666866"/></linearGradient>
  <clipPath id="banner"><rect x={bannerX} y={bannerY} width={bannerW} height={bannerH}/></clipPath>
  <path id="periodText" d={arc(107, end, end - 56, 0)}/>
 </defs>
 <rect width="960" height="540" fill="url(#grid)"/><rect width="960" height="540" fill="url(#vignette)"/>
 <rect width="960" height="540" filter="url(#paper)" opacity=".043" style={{ mixBlendMode: 'multiply' }}/>
 <g clipPath="url(#banner)"><rect x={bannerX} y={bannerY} width={bannerW} height={bannerH} fill={p.accent}/><rect x={bannerX} y={bannerY} width={bannerW} height={bannerH} fill="url(#grid)" opacity=".24"/>
 <text x={brandX} y={brandY} opacity={mix(f, [54, 66], [0, 1])} fontSize={58 + 6 * zoom} fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" letterSpacing="-1.5" fill="#f2f2ee">{p.brand}</text>
 <image href={asset(p.stacksImage)} x={640 + 390 * zoom} y={154 - 250 * zoom} width={161 * (1 + zoom * .6)} height={110 * (1 + zoom * .6)}/></g>
 <g transform={`translate(${g.x} ${g.y}) scale(${g.scale})`}>
  <path d="M0 -5C-3 -20 -13 -23 -21 -25C-35 -29 -20 -51 -12 -37C-3 -28 -3 -22 4 -26C18 -30 23 -22 7 -12Z" fill="none" stroke="#777b79" strokeWidth="1.1"/>
  <g transform={`rotate(${g.angle})`}><image href={asset(p.beamImage)} x="-44" y="-9" width="375" height="18"/></g>
  <g transform={`rotate(${swing} 0 27)`} stroke="#626865" fill="none"><path d="M-2 27L-87 206M4 27L87 206M-2 27L-38 206M4 27L39 206" strokeWidth="1.05"/>
  <ellipse cx="0" cy="27" rx="9" ry="10" strokeWidth="2.7"/><ellipse cx="0" cy="28" rx="7" ry="10" strokeWidth="1"/>
  </g><rect x="-4" y="-4" width="8" height="30" rx="4" fill="url(#metal)"/><circle cy="1" r="1.3" fill="#ededed"/><circle cy="22" r="1.2" fill="#555"/>
 </g>
 <g stroke="#535956" fill="none" strokeWidth={1.05 * g.scale}><path d={`M${wnX - 7 * g.scale} ${wnY - 1 * g.scale}Q${wnX - 8 * g.scale} ${wnY + 30 * g.scale} ${wnX} ${wY + 5 * g.scale}M${wnX + 7 * g.scale} ${wnY - 1 * g.scale}L${wnX + 2 * g.scale} ${wY + 5 * g.scale}`}/></g>
 <image href={asset(p.weightImage)} x={wnX - 16 * g.scale} y={wY - 5 * g.scale} width={32 * g.scale} height={58 * g.scale}/>
 <g opacity={mix(f, [58, 66], [0, 1])} transform={`translate(${wnX} ${wnY - 31 * g.scale}) rotate(${g.angle}) scale(${g.scale})`}>
 <rect x="-29" y="-12" width="58" height="25" fill={p.accent}/><text x="0" y="8" textAnchor="middle" fontSize="20" fontWeight="900" fill="white">{Math.min(p.weight, Math.floor(mix(f, [64, 90], [0, p.weight])))}<tspan fontSize="10">{p.unit}</tspan></text></g>
 <g transform={`translate(${g.ix} ${g.iy}) scale(${g.is})`}>
  <image href={asset(p.itemImage)} x="-87" y="-88" width="174" height="176"/>

 </g>
 <image transform={`rotate(${swing} ${g.x} ${g.y + 27 * g.scale})`} href={asset(p.panImage)} x={g.x - panW / 2} y={panY} width={panW} height={panW * 47 / 323}/>
 <g transform={`translate(${g.ix} ${g.iy}) scale(${g.is})`}>
  <g transform="translate(-5 -6)"><path d={arc(107, -90, end)} stroke={p.accent} strokeWidth="27" strokeLinecap="round" fill="none"/>
  <text fontSize="16" fill="#fff" fontWeight="700" dominantBaseline="central"><textPath href="#periodText" startOffset="5%">{p.periodLabel}</textPath></text></g>
 </g>
 <text x="470" y="369" textAnchor="middle" fontSize="21" letterSpacing="3" fontFamily="ReplicaSerif, serif" fill="#292c2b" opacity={mix(f, [0, 5, 13], [1, 1, 0])}>{p.itemLabel}</text>
 {p.labels.slice(0, 2).map((label, i) => { const a = mix(f, [133 + i * 13, 143 + i * 13], [0, 1]) * mix(f, [188, 197], [1, 0]); const y = 272 + i * 61, w = i === 0 ? 85 : 120, x = 155 - w / 2; return <g key={i} opacity={a}><rect x={x} y={y - 17} width={w} height="34" rx="17" fill={p.background} stroke="#222" strokeWidth="1.1"/><text x="155" y={y + 7} textAnchor="middle" fontSize="20" fill="#111">{label}</text><path d={`M${x + w} ${y}H${x + w + (323 - x - w) * a}`} stroke="#151515" strokeWidth="1.1"/><circle cx="323" cy={y} r="3" fill="#111"/></g>; })}
 {p.showCaptions && <text x="480" y="512" textAnchor="middle" fontSize="24" fill="#fff" stroke="#111" strokeWidth="2.4" paintOrder="stroke" fontFamily="ReplicaSans, sans-serif">{caption}</text>}
 </svg></AbsoluteFill>;
};
