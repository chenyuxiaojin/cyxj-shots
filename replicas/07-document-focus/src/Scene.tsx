import React from 'react';
import {AbsoluteFill,Img,useCurrentFrame,useVideoConfig} from 'remotion';
import defaults from '../props.json';
import {Fonts,Grain,lerp,ease,asset} from './common';
import {pageMatrix,lineBoxes,noteY} from './geometry';
export const Scene=(p:typeof defaults)=>{const f=15+useCurrentFrame()*154/useVideoConfig().durationInFrames;
const titleAlpha=ease(f,25,38),textAlpha=ease(f,42,61),blur=lerp(f,[15,25,38,53,65,79,80,105,110,122,168],[14,10,0,3,0,0,0,0,5,0,0]);
return <AbsoluteFill style={{background:p.paperColor}}><Fonts/><div style={{width:960,height:540,transform:'scale(2)',transformOrigin:'0 0',overflow:'hidden',position:'relative'}}>
<Img src={asset(p.backgroundSrc)} style={{position:'absolute',inset:0,width:960,height:540,objectFit:'fill'}}/>
<div style={{position:'absolute',inset:0,transform:pageMatrix(f),transformOrigin:'0 0'}}>
<svg width="960" height="540" style={{position:'absolute',inset:0,overflow:'visible'}}>
<g opacity={titleAlpha*.18} fill="#a18e34"><path d="M765 -40 L895 -40 L895 25 L826 25 L826 83 L752 83 L752 50 L800 50 L800 10 L765 10 Z"/><path d="M898 4h65v160h-65z"/></g>
<text x="196" y="104" fontFamily="ReplicaSerif,serif" fontWeight="900" fontSize="86" textLength="570" lengthAdjust="spacingAndGlyphs" fill={p.inkColor} opacity={titleAlpha*.88} style={{filter:`blur(${Math.max(.65,blur*.7)}px)`}}>{p.title}</text>
{p.highlights.map((h,j)=>{const box=lineBoxes[h.line];if(!box)return null;const text=p.lines[h.line]||'';const left=box.x+box.w*h.from/Math.max(1,text.length);const width=box.w*Math.min(h.to-h.from,text.length)/Math.max(1,text.length);const start=j===0?51:62,end=j===0?66:78,progress=lerp(f,[start,end],[0,1]);return <rect key={j} x={left-5} y={box.y+3+lerp(f,[start,end],[18,0])} width={width+8} height={box.h+1} fill={p.highlightColor} opacity={progress*.76} style={{filter:`blur(${lerp(f,[start,end],[6,2])}px)`}}/>})}
{p.lines.slice(0,5).map((line,j)=>{const box=lineBoxes[j],start=j<2?49:j<4?42:49,end=j<2?65:j<4?55:60,alpha=ease(f,start,end),lineBlur=f<80?lerp(f,[start,end],[8,.5]):Math.max(.5,blur);return <text key={j} x={box.x} y={box.y+36} fontFamily="ReplicaSerif,serif" fontSize="35" textLength={box.w} lengthAdjust="spacingAndGlyphs" fill={p.inkColor} opacity={alpha*(j===4?.23:.62)} style={{filter:`blur(${j===4?2:lineBlur}px)`}}>{line}</text>})}
</svg>
{p.showNote&&<Img src={asset(p.noteSrc)} style={{position:'absolute',left:82,top:noteY(f),width:800,height:174,objectFit:'fill',border:'5px solid rgba(254,255,210,.35)',boxShadow:'0 0 24px #f5f6bb88',filter:'blur(.5px)'}}/>}
</div><Grain opacity={.085}/><div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 24% 77%,#fff7dd38,transparent 60%)',pointerEvents:'none'}}/></div></AbsoluteFill>};
