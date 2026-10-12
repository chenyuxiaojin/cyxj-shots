import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {Fonts,lerp,ease} from './common';
import tracks from './tracks.json';
export type Props={durationSeconds:number;processorLabel:string;tokens:string[];accentColor:string;background:string;showPositions:boolean;connections:number[][];connectionsSecond:number[][];showShadow:boolean};
export const pose=(f:number)=>{const a=tracks[Math.floor(Math.max(0,Math.min(311,f)))],z=tracks[Math.ceil(Math.max(0,Math.min(311,f)))];const t=f-Math.floor(f);return {x:a.x+(z.x-a.x)*t,y:a.y+(z.y-a.y)*t,w:a.w+(z.w-a.w)*t,gold:a.gold}};
export const Scene:React.FC<Props>=p=>{
 const frame=useCurrentFrame(),{durationInFrames}=useVideoConfig();const f=frame*311/(durationInFrames-1);const t=pose(f),s=t.w/126;const canonical=[70,70,94,50,76,51,71];const raw=p.tokens.map((v,i)=>p.tokens.length===7?canonical[i]:Math.max(46,v.length*25+17));const k=530/(raw.reduce((a,v)=>a+v,0)+10*(raw.length-1));const widths=raw.map(v=>v*k);let accum=10;const xs=widths.map(w=>{const x=accum;accum+=w+10*k;return x});const centers=xs.map((x,i)=>x+widths[i]/2);
 const rowX=lerp(f,[8,18,23,35],[126,126,188,226]);const rowW=lerp(f,[8,12,16,23,35],[0,216,371,478,550]);const panelShow=ease(f,8,14);const textShow=ease(f,14,25);
 const firstArcs=ease(f,173,184)*(1-ease(f,204,213));const secondArcs=ease(f,226,235)*(1-ease(f,245,263));const bigArcs=ease(f,267,283)*(1-ease(f,293,307));
 const pulse=f<197?ease(f,197,203):f<221?(1-ease(f,211,219)):f<245?ease(f,239,245):f<260?(1-ease(f,254,260)):ease(f,282,290);
 return <AbsoluteFill style={{background:p.background}}><Fonts/><div style={{position:'absolute',width:960,height:540,transform:'scale(2)',transformOrigin:'top left',overflow:'hidden',background:p.background,fontFamily:'ReplicaSans,sans-serif'}}>
 <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 74%,#d3d0c840 81%,#181916b0 100%)'}}/>
 <svg width="960" height="540" style={{position:'absolute',inset:0}}><g transform={`translate(${t.x},${t.y}) scale(${s})`}>
 {p.showShadow&&<rect x="5" y="5" width="126" height="126" fill="#47453e" opacity=".1"/>}<rect x="0" y="0" width="126" height="126" fill={p.background} stroke="#242420" strokeWidth="2"/>
 <text x="63" y="-12" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="27" textAnchor="middle" fill="#22231f">{p.processorLabel}</text>
 <rect x="-1.5" y="26" width="3" height="32" fill={p.accentColor} opacity={ease(f,44,51)}/>
 {Array.from({length:4},(_,i)=>{const gold=Math.min(1,t.gold[i]*1.7);return <g key={i}><rect x={20+i%2*45} y={20+Math.floor(i/2)*45} width="39" height="39" fill="#23241f"/><rect x={20+i%2*45} y={20+Math.floor(i/2)*45} width="39" height="39" fill={p.accentColor} opacity={gold}/><text x={39.5+i%2*45} y={44+Math.floor(i/2)*45} textAnchor="middle" fontFamily="Arial" fontSize="11" fontWeight="600" fill={gold>.5?'#574714':'#fff'}>C{i+1}</text></g>})}
 <line x1="155" x2="196" y1="63" y2="63" stroke="#22231f" strokeWidth="2.5" opacity={ease(f,22,29)}/>
 <g transform={`translate(${rowX},0)`} opacity={panelShow}>
 {p.showShadow&&<rect x="5" y="5" width={rowW} height="126" fill="#47453e" opacity=".1"/>}<rect x="0" y="0" width={rowW} height="126" fill={p.background} stroke="#242420" strokeWidth="2"/>
 <defs><clipPath id="rowClip"><rect x="0" y="-200" width={rowW} height="326"/></clipPath></defs>
 <g clipPath="url(#rowClip)">
 {p.tokens.map((word,i)=>{const a=48+i*4;const bounce=lerp(f,[a,a+4,a+8],[0,-19,0]);const grow=lerp(f,[a,a+4,a+8],[1,1.15,1]);const y=39+bounce;return <g key={i} opacity={textShow}><g transform={`translate(${centers[i]},${y+24}) scale(${grow}) translate(${-widths[i]/2},-24)`}><rect width={widths[i]} height="48" fill={p.background} stroke="#22231f" strokeWidth="2"/><rect width={widths[i]} height="48" fill={p.accentColor} opacity={pulse*(.16+(i===2||i===4?.12:0))}/><circle cx="5" cy="5" r="1.5" fill="#22231f"/><text x={widths[i]/2} y="32" textAnchor="middle" fontSize={Math.min(22,widths[i]/Math.max(1,word.length)*.88)} fill="#1f211c">{word}</text></g>{p.showPositions&&<g opacity={ease(f,a,a+5)}><circle cx={centers[i]} cy="99" r="6.5" fill="none" stroke="#33332c" strokeWidth=".8"/><text x={centers[i]} y="103" textAnchor="middle" fontSize="11" fill="#292a25">{i+1}</text></g>}</g>})}
 {[{links:p.connections,alpha:firstArcs},{links:p.connections,alpha:secondArcs},{links:p.connectionsSecond,alpha:bigArcs}].map((group,j)=><g key={j} opacity={group.alpha}>{group.links.map(([a,z],i)=>{if(a>=centers.length||z>=centers.length)return null;const x1=centers[a],x2=centers[z],r=Math.abs(x2-x1)/2;return <path key={i} d={`M${x1} 39 A${r} ${r} 0 0 1 ${x2} 39`} fill="none" stroke="#7c7c75" strokeWidth="1.2" opacity={ease(f,j===2?267+i:173+i,j===2?279+i:182+i)}/>})}</g>)}
 </g></g></g></svg></div></AbsoluteFill>
};
