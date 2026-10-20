import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Fonts} from './common';
import rawTracks from './tracks.json';
import defaults from '../props.json';
export type Props = typeof defaults;
const T = rawTracks as Record<string, number[][] | number[]>;
export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const sample=(key:string,f:number):number[]=>{const ar=T[key] as number[][];const i=Math.max(0,Math.min(443,Math.floor(f)));const j=Math.min(i+1,443);const a=ar[i],b=ar[j];return a.map((x,k)=>x+(b[k]-x)*(f-i));};
const scalar=(key:string,f:number)=>{const ar=T[key] as number[];const i=Math.max(0,Math.min(443,Math.floor(f)));return ar[i]+(ar[Math.min(i+1,443)]-ar[i])*(f-i);};
type Person={x:number;y:number;hit:number;ageStart:number;toX:number;toY:number;split:number;id:number};
export const people:Person[]=[
{x:372,y:284,hit:11,ageStart:70,toX:762,toY:197,split:178,id:0},
{x:431,y:274,hit:7,ageStart:64,toX:813,toY:186,split:180,id:1},
{x:452,y:259,hit:3,ageStart:49,toX:740,toY:172,split:184,id:2},
{x:509,y:274,hit:5,ageStart:50,toX:224,toY:203,split:182,id:3},
{x:558,y:278,hit:9,ageStart:67,toX:187,toY:190,split:179,id:4},
{x:422,y:295,hit:13,ageStart:73,toX:131,toY:206,split:176,id:5},
{x:543,y:297,hit:15,ageStart:76,toX:852,toY:209,split:177,id:6},
{x:449,y:307,hit:143,ageStart:120,toX:216,toY:225,split:167,id:7},
{x:407,y:315,hit:147,ageStart:120,toX:111,toY:228,split:169,id:8},
{x:514,y:297,hit:145,ageStart:120,toX:800,toY:209,split:171,id:9},
{x:484,y:299,hit:149,ageStart:120,toX:737,toY:211,split:168,id:10},
{x:528,y:309,hit:151,ageStart:120,toX:176,toY:224,split:170,id:11},
{x:434,y:302,hit:152,ageStart:120,toX:783,toY:241,split:172,id:12},
{x:485,y:292,hit:154,ageStart:120,toX:157,toY:226,split:174,id:13},
{x:556,y:297,hit:156,ageStart:120,toX:823,toY:232,split:166,id:14},
{x:423,y:315,hit:158,ageStart:120,toX:205,toY:242,split:173,id:15},
{x:514,y:307,hit:160,ageStart:120,toX:760,toY:238,split:175,id:16},
];
const initialY:number[][]=[[-43,47,136,226,279,266,262,264,273,284,284,284,284], [67,156,245,252,251,252,258,272,274,274,274,274,274], [170,259,245,237,237,245,259,259,259,259,259,259,259], [125,215,268,256,251,255,263,274,274,274,274,274,274], [12,101,190,278,264,258,258,265,278,278,278,278,278], [-91,-2,87,177,266,285,275,272,277,288,295,295,295], [-147,-58,31,120,209,297,283,275,275,282,297,297,297]];
export const state=(p:Person,f:number)=>{
 let y:number;
 if(p.id<7&&f<=36){const t=f/3;const i=Math.floor(t);y=initialY[p.id][i]+((initialY[p.id][Math.min(i+1,12)]??initialY[p.id][i])-initialY[p.id][i])*(t-i);}
 else if(f<p.hit)y=p.y-(p.hit-f)*29.65;
 else y=p.y-(p.id<7&&f<p.hit+15?23*Math.sin(Math.PI*(f-p.hit)/15):0);
 const q=scalar("personSplit"+p.id,f);const s=1-q*.5;
 const x=p.x+(p.toX-p.x)*q;y=y+(p.toY-y)*q;
 const velocity=(scalar("personSplit"+p.id,Math.min(443,f+1))-scalar("personSplit"+p.id,Math.max(0,f-1)))/2;const v=Math.abs((p.toX-p.x)*velocity);const blur=q>0&&q<1?Math.min(7,v*.26):f<p.hit?.35:0;
 return {x,y,s,blur,q,ground:p.y+128+(p.toY+64-(p.y+128))*q};
};
const BODY='M-17 15 Q-26 15 -26 25 L-26 69 Q-26 77 -20 77 Q-14 77 -14 70 L-14 34 L-14 119 Q-14 126 -7 126 Q0 126 0 119 L0 74 L3 74 L3 119 Q3 126 10 126 Q17 126 17 119 L17 34 L17 70 Q17 77 23 77 Q29 77 29 69 L29 25 Q29 15 18 15 Z';
const nativeToken=(type:'A'|'B',x:number,y:number,color:string)=><g transform={`translate(${x},${y})`}><circle cx={40} cy={50} r={39} fill={color} stroke="#244355" strokeWidth={2}/>{type==='A'?<path d="M40 23 L62 69 H18 Z" fill="#fff4d8"/>:<rect x={22} y={32} width={36} height={36} rx={8} fill="#fff4d8"/>}<text x={40} y={92} textAnchor="middle" fontSize={10} fill="#244355">{type}</text></g>;
export const Scene:React.FC<Props>=(input)=>{
 const p={...defaults,...input};const frame=useCurrentFrame();const {durationInFrames}=useVideoConfig();const f=frame*443/Math.max(1,durationInFrames-1);
 const header=sample('header',f);const cap=[...p.captions].reverse().find(c=>f>=c.frame)?.text??'';
 const font="'ReplicaTitle','PingFang SC','Microsoft YaHei',sans-serif";
 const sorted=[...people].sort((a,b)=>(a.id<7?a.y:a.y+10)-(b.id<7?b.y:b.y+10));
 const person=(v:Person)=>{const a=state(v,f);if(a.y<-160)return null;const age=clamp((f-v.ageStart)/15);const ap=1-Math.pow(1-age,3);return <g key={v.id} transform={`translate(${a.x} ${a.y}) scale(${a.s})`} filter={a.blur>.05?`url(#move-${v.id})`:undefined}>
  <defs><filter id={`move-${v.id}`} x="-100%" y="-20%" width="300%" height="140%"><feGaussianBlur stdDeviation={`${a.blur*1.5/a.s} ${Math.max(.1,a.blur*.10)/a.s}`}/></filter></defs>
  <g transform="translate(-4 0)" fill={p.personSide} stroke={p.outline} strokeWidth={1.5}><circle cy={0} r={12}/><path d={BODY}/></g>
  <g fill={p.personColor} stroke={p.outline} strokeWidth={1.5} strokeLinejoin="round"><circle cy={0} r={12}/><path d={BODY}/></g>
  {ap>0&&p.ages[v.id]!==''&&<g transform={`translate(-2 -27) scale(${ap})`}><path d="M-8 -5 H8 L0 9 Z" fill={p.ageColor}/><text x={0} y={-11} fill="#090909" textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={14.2}>{p.ages[v.id]}{p.ageSuffix}</text></g>}
 </g>};
 const timeline=(side:'left'|'right')=>{
  const b=sample(side+'Card',f);if(b[2]<.5||b[3]<.5)return null;
  const x=side==='left'?181:592;const ruler=x+(side==='left'?31:33);const delta=scalar(side+'Scroll',f);const baseY=316;const distance=side==='left'?186:189;const first=side==='left'?'A':'B';const second=first==='A'?'B':'A';
  const item=(type:'A'|'B',y:number,idx:number)=>{
   const ix=x+63;const label=type==='A'?p.planA:p.planB;const image=p.useNativeTokens?nativeToken(type,ix+2,y,type==='A'?'#72b7ca':'#d88f61'):<image href={staticFile(type==='A'?p.tokenA:p.tokenB)} x={ix} y={y} width={88} height={104}/>;
   return <g key={idx}><path d={`M${x+51} ${y-11} l9 -5 v10 Z`} fill="#121a1b"/><text x={x+64} y={y-6} fontFamily={font} fontWeight={800} fontSize={16.5} fill={p.accent}>{label}</text>{image}</g>;
  };
  return <g key={side}>
   <defs><clipPath id={`${side}-card`}><rect x={b[0]} y={b[1]} width={b[2]} height={b[3]} rx={4}/></clipPath></defs>
   <g clipPath={`url(#${side}-card)`}>
    <rect x={x} y={188} width={196} height={291} fill={p.cardColor}/>
    <path d={`M${ruler} 188V479`} stroke="#363636" strokeWidth={1.1}/>
    {Array.from({length:40},(_,i)=><path key={i} d={`M${ruler} ${194+i*7.75}h${i%2===0?10:5}`} stroke="#333" strokeWidth={1}/>) }
    <text x={x+14} y={286} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={30} fill="#aeaeae" stroke="#aeaeae" strokeWidth={.5}>{p.timelineLabel.split('').map((c,i)=><tspan key={i} x={x+14} y={286+i*36}>{c}</tspan>)}</text><path d={`M${x+13} 381v21m-7 -10l7 10 7 -10`} fill="none" stroke="#aeaeae" strokeWidth={5}/>
    {item(first,baseY-delta,0)}{item(second,baseY+distance-delta,1)}
   </g><rect x={b[0]} y={b[1]} width={b[2]} height={b[3]} rx={4} fill="none" stroke="#333" strokeWidth={1.2}/>
  </g>;
 };
 return <AbsoluteFill><Fonts/><svg key={`cohort-frame-${frame}`} viewBox="0 0 960 540" width="100%" height="100%" style={{background:p.background}}>
 <defs>
 <pattern id="grid" x={22} y={8} width={32.5} height={32.5} patternUnits="userSpaceOnUse"><path d="M32.5 0H0V32.5" fill="none" stroke={p.gridColor} strokeWidth={1.2} opacity={.56}/></pattern>
 <filter id="papergrain"><feTurbulence type="fractalNoise" baseFrequency=".08" numOctaves={3} seed={17}/><feColorMatrix type="saturate" values="0"/></filter>
 <radialGradient id="gridFade"><stop offset="0%" stopColor="white"/><stop offset="65%" stopColor="white" stopOpacity={.88}/><stop offset="100%" stopColor="white" stopOpacity={0}/></radialGradient><mask id="gridMask"><rect width={960} height={540} fill="url(#gridFade)"/></mask>
 <filter id="shadow" x="-100%" y="-500%" width="300%" height="1100%"><feGaussianBlur stdDeviation={7}/></filter>
 <clipPath id="headerClip"><rect x={header[0]} y={header[1]} width={header[2]} height={header[3]} rx={header[3]/2}/></clipPath>
 </defs>
 <rect width={960} height={540} fill="url(#grid)" mask="url(#gridMask)"/><rect width={960} height={540} filter="url(#papergrain)" opacity={.065}/>
 <g transform={`translate(${480+p.offsetX} ${270+p.offsetY}) scale(${p.layoutScale}) translate(-480 -270)`}>
 <rect x={header[0]} y={header[1]} width={header[2]} height={header[3]} rx={header[3]/2} fill={p.headerFill} stroke="#222" strokeWidth={1.2}/>
 <text clipPath="url(#headerClip)" x={480} y={sample("headerText",f)[0]} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={26} fill="#050505">{p.header}</text>
 {people.map(v=>{const a=state(v,f);return a.y>-250?<ellipse key={v.id} cx={a.x} cy={a.ground} rx={30*a.s} ry={7*a.s} fill="#222" opacity={.24*Math.exp(-Math.max(0,v.y-a.y)/90)} filter="url(#shadow)"/>:null;})}
 {sorted.map(person)}{timeline('left')}{timeline('right')}
 </g>
 <text x={480} y={512} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={28} fill={p.captionColor} stroke="#111111" strokeWidth={2.8} paintOrder="stroke" strokeLinejoin="round">{cap}</text>
 <path d="M44 540L65 529L71 540" fill="#fff" stroke="#c7c7c7" strokeWidth={1}/>
 </svg></AbsoluteFill>;
};
