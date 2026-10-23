import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import defaults from '../props.json';
import { Fonts, lerp, asset } from './common';
import { Backdrop, Caption } from './Backdrop';
type Props = typeof defaults;
const pts = (a: number, r: number) => [480 + Math.cos(a) * r, 270 + Math.sin(a) * r];
const fragments = Array.from({ length: 40 }, (_, i) => { const ring = Math.floor(i / 10), k = i % 10, a = k * Math.PI / 5 + ring * .13, b = a + Math.PI / 5; const r0 = ring * 72, r1 = (ring + 1) * 72; return { points: [pts(a, r0), pts(b, r0), pts(b + .08, r1), pts(a - .06, r1)].map(p => p.join(',')).join(' '), a: (a + b) / 2, cx: 480 + Math.cos((a + b) / 2) * (r0 + r1) / 2, cy: 270 + Math.sin((a + b) / 2) * (r0 + r1) / 2, ring, i }; });
export const Scene = (p: Props) => {
    const raw = useCurrentFrame(), { durationInFrames } = useVideoConfig(), f = raw * 38 / Math.max(1, durationInFrames - 1), progress = Math.max(0, f - 25) / 13, scale = lerp(f, [26, 28, 31, 35, 38], [0, .18, .425, .80, 1]);
    return <AbsoluteFill><Fonts /><svg viewBox="0 0 960 540" width="100%" height="100%"><Backdrop color={p.background}/><defs><radialGradient id="shell" cx="36%" cy="31%" r="70%"><stop stopColor="#232725"/><stop offset=".24" stopColor="#3e413f"/><stop offset=".48" stopColor="#9d9e9a"/><stop offset=".64" stopColor="#444744"/><stop offset=".87" stopColor="#232623"/><stop offset="1" stopColor="#8c8e88"/></radialGradient><clipPath id="silhouette"><path d="M392 100H646C710 132 722 218 673 305C625 389 533 455 443 451C339 445 244 381 267 288C280 218 327 147 392 100Z"/></clipPath><g id="skin"><g clipPath="url(#silhouette)"><rect x="250" y="95" width="470" height="365" fill="url(#shell)"/><rect x="250" y="95" width="470" height="365" filter="url(#texture)" opacity=".13"/></g><path d="M392 100H646C710 132 722 218 673 305C625 389 533 455 443 451C339 445 244 381 267 288C280 218 327 147 392 100Z" fill="none" stroke="#cdd0c8" strokeOpacity=".5"/></g></defs>
    {f < 26 ? <use href="#skin"/> : fragments.map(o => { const distance = progress * (1 + progress * .65) * (120 + o.ring * 75 + (o.i % 3) * 25), dx = Math.cos(o.a) * distance, dy = Math.sin(o.a) * distance; return <g key={o.i} transform={`translate(${dx} ${dy}) rotate(${progress * ((o.i % 2 ? 1 : -1) * 95)} ${o.cx} ${o.cy})`} opacity={lerp(f, [26, 35, 42], [1, .85, 0])}><clipPath id={'fragment' + o.i}><polygon points={o.points}/></clipPath><g clipPath={`url(#fragment${o.i})`} transform={`translate(${o.cx} ${o.cy}) scale(${1 - progress * .25} ${1 - progress * ((o.i % 3) * .2)}) translate(${-o.cx} ${-o.cy})`}><use href="#skin"/></g></g>; })}
    <text x="480" y={294 - lerp(f, [26, 38], [0, 240])} textAnchor="middle" fill="transparent" stroke={p.accent} strokeWidth=".8" opacity={lerp(f, [25, 38], [.65, .08])} fontFamily="ReplicaSans,sans-serif" fontSize="112" fontWeight="700">{p.label}</text>
    {scale > 0 && <foreignObject x={480 - 339 * scale} y={269 - 201 * scale} width={678 * scale} height={402 * scale}><Img src={asset(p.image)} style={{ width: '100%', height: '100%' }}/></foreignObject>}
    {p.showCaptions && <Caption text={p.captions[f < 26 ? 0 : 1]}/>}
    </svg></AbsoluteFill>;
};
