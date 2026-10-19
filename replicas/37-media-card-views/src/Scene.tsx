import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig,interpolate,interpolateColors} from 'remotion';
import defaults from '../props.json';import tracks from './tracks.json';import {Fonts,Grain} from './common';
export type SceneProps=typeof defaults;
const lerp=(f:number,frames:number[],values:number[])=>interpolate(f,frames,values,{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const u=(f:number,a:number,b:number)=>lerp(f,[a,b],[0,1]);const path=(a:number[][])=>a.map((p,i)=>(i?'L':'M')+p.join(' ')).join(' ')+'Z';
const Brick=({f,box,color,label}:{f:number;box:number[];color:string;label:string})=>{
 const yaw=lerp(f,[17,24,29,41,57,63],[-.57,-.29,-.08,.2,.29,.29]),pitch=.37;
 const P=(x:number,y:number,z:number)=>{const xx=x*Math.cos(yaw)+z*Math.sin(yaw),zz=z*Math.cos(yaw)-x*Math.sin(yaw);return [xx,y*Math.cos(pitch)+zz*Math.sin(pitch)]};
 const face=(a:number[][])=>a.map(v=>P(v[0],v[1],v[2]));
 const top=face([[-65,-40,-40],[65,-40,-40],[65,-40,40],[-65,-40,40]]),front=face([[-65,-40,40],[65,-40,40],[65,40,40],[-65,40,40]]),left=face([[-65,-40,-40],[-65,-40,40],[-65,40,40],[-65,40,-40]]),right=face([[65,-40,40],[65,-40,-40],[65,40,-40],[65,40,40]]);
 const studs=[[-32,-20],[32,-20],[-32,20],[32,20]].sort((a,b)=>(a[1]*Math.cos(yaw)-a[0]*Math.sin(yaw))-(b[1]*Math.cos(yaw)-b[0]*Math.sin(yaw))).map(([x,z])=>{const circle=(y:number)=>Array.from({length:48},(_,i)=>{const t=i/48*Math.PI*2;return P(x+18*Math.cos(t),y,z+18*Math.sin(t))});return {upper:circle(-51),lower:circle(-40)}});
 const all=[...top,...front,...left,...right,...studs.flatMap(s=>[...s.upper,...s.lower])],minx=Math.min(...all.map(v=>v[0])),maxx=Math.max(...all.map(v=>v[0])),miny=Math.min(...all.map(v=>v[1])),maxy=Math.max(...all.map(v=>v[1]));
 const a=P(0,0,40),b=P(1,0,40),c=P(0,1,40),dark=interpolateColors(.33,[0,1],[color,'#21052e']),bright=interpolateColors(.18,[0,1],[color,'#ffffff']);
 return <g transform={`translate(${box[0]} ${box[1]}) scale(${box[2]/(maxx-minx)} ${box[3]/(maxy-miny)}) translate(${-minx} ${-miny})`} filter="url(#objectGlow)">
  <defs><linearGradient id="brickFront" x2="0" y2="1"><stop stopColor={color}/><stop offset="1" stopColor={dark}/></linearGradient><linearGradient id="studSide" x2=".7" y2="1"><stop stopColor={bright}/><stop offset="1" stopColor={color}/></linearGradient></defs>
  <path d={path(yaw>0?left:right)} fill={dark}/><path d={path(front)} fill="url(#brickFront)"/><path d={path(top)} fill={bright}/>
  {studs.map((s,i)=><g key={i}><path d={path([...s.upper,...s.lower.slice().reverse()])} fill="url(#studSide)"/><path d={path(s.lower)} fill="url(#studSide)"/><path d={path(s.upper)} fill={interpolateColors(.27,[0,1],[color,'#ffffff'])}/></g>)}
  <g transform={`matrix(${b[0]-a[0]} ${b[1]-a[1]} ${c[0]-a[0]} ${c[1]-a[1]} ${a[0]} ${a[1]})`}><text x={0} y={12} textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight={700} fontSize={18} fill="white" filter="url(#textGlow)">{label}</text></g>
 </g>
};
export const Scene:React.FC<SceneProps>=(input)=>{
 const p={...defaults,...input},frame=useCurrentFrame(),{durationInFrames}=useVideoConfig(),f=frame*207/Math.max(1,durationInFrames-1),a=tracks[Math.floor(f)],b=tracks[Math.min(207,Math.ceil(f))],z=f-Math.floor(f),at=(k:'x'|'y'|'s'|'progress')=>a[k]*(1-z)+b[k]*z;
 const cardX=at('x'),cardY=at('y'),s=at('s'),block=(a.block??[410,174,158,124]).map((v,i)=>v*(1-z)+(b.block??[410,174,158,124])[i]*z),progress=Math.max(0,Math.min(1,at('progress')/.601*p.endProgress));
 const count=Math.round(lerp(f,[28,29,34,39,89,94,99,104,169,174,184,189,194,199,204,206],[0,663,2240,4562,27784,30106,32428,34751,64359,66681,71325,73647,75969,78292,80614,81775])/81775*p.finalViews);
 const bgY=lerp(f,[0,9,29,63],[270,40,-50,-120]),captionWidth=u(f,34,69)*456;
 return <AbsoluteFill style={{background:p.backgroundColor}}><Fonts/><svg viewBox="0 0 960 540" width="100%" height="100%">
  <defs>
   <radialGradient id="fog"><stop stopColor={p.glowColor} stopOpacity=".8"/><stop offset=".55" stopColor={p.glowColor} stopOpacity=".4"/><stop offset="1" stopColor={p.glowColor} stopOpacity="0"/></radialGradient><radialGradient id="lightFog"><stop stopColor="#d2bfd7" stopOpacity=".43"/><stop offset="1" stopColor={p.glowColor} stopOpacity="0"/></radialGradient>
   <linearGradient id="cardFill" x2="0" y2="1"><stop stopColor={p.cardColor} stopOpacity=".74"/><stop offset=".65" stopColor={interpolateColors(.48,[0,1],[p.cardColor,p.backgroundColor])} stopOpacity=".89"/><stop offset="1" stopColor="#0c041a" stopOpacity=".98"/></linearGradient>
   <filter id="cardGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
   <filter id="objectGlow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur in="SourceGraphic" stdDeviation="4"/><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .2 0"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge><feGaussianBlur stdDeviation=".6"/></filter>
   <filter id="textGlow" x="-25%" y="-80%" width="150%" height="260%"><feGaussianBlur stdDeviation="2.2"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="barGlow" x="-10%" y="-300%" width="120%" height="700%"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
   <clipPath id="captionReveal"><rect x={65} y={210} width={captionWidth} height={39}/></clipPath><clipPath id="cardClip"><rect x={cardX} y={cardY} width={586*s} height={327*s} rx={14*s}/></clipPath>
  </defs>
  <g transform={`translate(0 ${bgY})`}><ellipse cx={480} cy={15} rx={730} ry={300} fill="url(#fog)"/><ellipse cx={35} cy={50} rx={470} ry={230} fill="url(#lightFog)"/><ellipse cx={925} cy={50} rx={470} ry={230} fill="url(#lightFog)"/><ellipse cx={480} cy={-110} rx={540} ry={220} fill="url(#fog)"/></g>
  <g transform={`translate(${cardX} ${cardY}) scale(${s})`}><rect x={0} y={0} width={586} height={327} rx={14} fill={p.cardColor} opacity={.2} filter="url(#cardGlow)"/><rect x={0} y={0} width={586} height={327} rx={14} fill="url(#cardFill)" stroke={interpolateColors(.2,[0,1],[p.cardColor,'#ffffff'])} strokeOpacity={.6} strokeWidth={1.7}/></g>
  <g clipPath="url(#cardClip)" opacity={u(f,16,19)}>{p.showBrick&&<Brick f={f} box={block} color={p.brickColor} label={p.brickLabel}/>}</g>
  <g transform={`translate(${cardX} ${cardY}) scale(${s})`}><g clipPath="url(#captionReveal)"><text x={293} y={230} textAnchor="middle" fontSize={17.1} fontFamily="Arial,sans-serif" textLength={Math.min(430,p.caption.length*8.2)} lengthAdjust="spacingAndGlyphs" fill={p.textColor} opacity={.93} filter="url(#textGlow)">{p.caption}</text></g>
   <g opacity={u(f,15,19)}><rect x={12} y={284.8} width={562} height={7.1} fill="#bdb1ca" opacity={.53}/><rect x={12} y={284.8} width={562*progress} height={7.1} fill={p.textColor} filter="url(#barGlow)"/><path d="M15 303 L15 319 L29 311 Z" fill="#e4d9ed" opacity=".49"/></g>
   <text x={584} y={353} textAnchor="end" fontSize={22} fontWeight={700} fontFamily="Arial,sans-serif" fill={p.textColor} opacity={u(f,28,33)} filter="url(#textGlow)">{count.toLocaleString('en-US')} {p.viewUnit}</text>
  </g>
 </svg><Grain opacity={.025}/></AbsoluteFill>
};
