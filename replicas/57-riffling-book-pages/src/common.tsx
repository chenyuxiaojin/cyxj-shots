import React, { useState, useEffect } from 'react';
import { interpolate, Easing, staticFile, delayRender, continueRender } from 'remotion';
export const lerp = (f: number, frames: number[], values: number[]) => interpolate(f, frames, values, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
export const ease = (f: number, a: number, z: number) => interpolate(f, [a, z], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.38, 0, .18, 1) });
export const asset = (s: string) => /^https?:/.test(s) ? s : staticFile(s);
export const Fonts = () => { const [h] = useState(() => delayRender('optional local fonts')); useEffect(() => { Promise.all([["ReplicaSerif", "Songti SC Regular"], ["ReplicaSans", "Alibaba PuHuiTi 2 65 Medium"], ["ReplicaTitle", "Alibaba PuHuiTi 2 75 SemiBold"]].map(async ([n, p]) => { try {
    const f = new FontFace(n, `local("${p}")`);
    await f.load();
    document.fonts.add(f);
}
catch { /* Browser fallback if local font is absent. */ } })).finally(() => continueRender(h)); }, [h]); return null; };
export const Grain = ({ opacity = .08 }: {
    opacity?: number;
}) => <svg width="960" height="540" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity, mixBlendMode: 'multiply' }}><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" seed="19"/></filter><rect width="960" height="540" filter="url(#grain)"/></svg>;
export const tracked = (f: number, rows: {
    f: number;
    [key: string]: number;
}[], key: string) => lerp(f, rows.map(r => r.f), rows.map(r => r[key]));
export const matrix = (f: number, rows: {
    f: number;
    [key: string]: number;
}[]) => { const s = tracked(f, rows, 'scale'), r = tracked(f, rows, 'rotate') * Math.PI / 180; return `matrix(${s * Math.cos(r)},${s * Math.sin(r)},${-s * Math.sin(r)},${s * Math.cos(r)},${tracked(f, rows, 'tx')},${tracked(f, rows, 'ty')})`; };
