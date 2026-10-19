import React from 'react';
import {AbsoluteFill,Img,useCurrentFrame,useVideoConfig} from 'remotion';
import defaults from '../props.json';
import tracks from './monitor-tracks.json';
import {Fonts,asset,lerp} from './common';
export type Props=typeof defaults;
const track=(f:number,k:'x'|'y'|'width')=>lerp(f,tracks.map(r=>r.frame),tracks.map(r=>r[k]));
const stars=Array.from({length:108},(_,i)=>({x:(i*137.073+33)%960,y:(i*83.457+22)%480,r:i%7===0?.85:.35,a:.10+(i%5)*.034}));
export const Scene:React.FC<Props>=(p)=>{
 const raw=useCurrentFrame(),{durationInFrames}=useVideoConfig();const f=raw/(durationInFrames-1)*118;
 const x=track(f,'x'),y=track(f,'y'),s=track(f,'width')/358;
 const dimensions=lerp(f,[20,23,29,59,66],[0,.25,1,1,0]);
 const vertical=lerp(f,[22,25,30,59,66],[0,.25,1,1,0]);
 const dimBlur=lerp(f,[21,30,59,66],[2,0,0,2]);
 const point=lerp(f,[79,84,88],[0,1,1]);const ray=lerp(f,[80,91],[0,1]);
 const panel=lerp(f,[88,99],[0,1]);const reveal=lerp(f,[88,101],[0,1]);
 const total=Math.max(0,Math.round(p.widthPixels*p.heightPixels)).toLocaleString('en-US');
 const resultFont=Math.min(32,202/(total.length+3.3)*1.65);
 return <AbsoluteFill style={{background:p.backgroundColor}}><Fonts/>
  <svg viewBox="0 0 960 540" width="100%" height="100%" style={{fontFamily:'ReplicaSans,sans-serif'}}>
   <defs>
    <radialGradient id="top-light" cx="50%" cy="0%" rx="55%" ry="90%"><stop offset="0" stopColor="#38373b" stopOpacity=".63"/><stop offset=".75" stopColor="#111214" stopOpacity=".1"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient>
    <pattern id="bg-grid" width="21" height="21" patternUnits="userSpaceOnUse"><path d="M21 0H0V21" fill="none" stroke="#747779" strokeWidth=".5"/></pattern>
    <linearGradient id="grid-fade" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff" stopOpacity=".17"/><stop offset=".82" stopColor="#fff" stopOpacity="0"/></linearGradient>
    <mask id="grid-mask"><rect width="960" height="540" fill="url(#grid-fade)"/></mask>
    <filter id="glow" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <clipPath id="monitor-outline"><path d="M309 141H653Q661 141 661 149V405Q661 413 653 413H516Q515 421 506 423V427H543Q551 427 551 435V443Q550 452 541 452H420Q411 452 411 443V434Q411 426 420 426H455V423Q447 422 444 413H309Q300 413 300 405V149Q300 141 309 141Z"/></clipPath>
    <clipPath id="screen-outline"><rect x="336" y="177" width="290" height="193" rx="1"/></clipPath>
    <clipPath id="result-reveal"><rect x="578" y="183" width={241*reveal} height="62"/></clipPath>
   </defs>
   <rect width="960" height="540" fill="url(#top-light)"/>
   {p.showGrid&&<rect width="960" height="540" fill="url(#bg-grid)" mask="url(#grid-mask)"/>}
   {stars.map((q,i)=><circle key={i} cx={q.x} cy={q.y} r={q.r} fill="#d5d7dd" opacity={q.a}/>)}
   <g transform={`translate(${x} ${y}) scale(${s}) translate(-302 -142)`}>
    <g clipPath="url(#monitor-outline)"><image href={asset(p.monitorSrc)} x="299" y="139" width="364" height="313" preserveAspectRatio="none"/></g>
    {p.screenSrc&&<g clipPath="url(#screen-outline)"><image href={asset(p.screenSrc)} x="336" y="177" width="290" height="193" preserveAspectRatio="xMidYMid slice"/></g>}
    <g opacity={dimensions} style={{filter:`blur(${dimBlur}px)`}}>
     <g stroke={p.accentColor} fill={p.accentColor} strokeWidth="1.7" filter="url(#glow)"><path d="M339 159.4H621"/><path d="M334 159.4l8-4.3v8.6Z M627 159.4l-8-4.3v8.6Z" stroke="none"/></g>
     <rect x="430" y="142" width="102" height="33" rx="2.5" fill="#0d2a29" fillOpacity=".88" stroke={p.accentColor} strokeOpacity=".2"/>
     <text x="481" y="164" textAnchor="middle" fill="#f5ffff" fontSize="17.4" fontWeight="800" letterSpacing="1.5">{p.widthLabel}：{p.widthPixels}</text>
    </g>
    <g opacity={vertical} style={{filter:`blur(${dimBlur}px)`}}>
     <g stroke={p.accentColor} fill={p.accentColor} strokeWidth="1.7" filter="url(#glow)"><path d="M318.5 179.5V363"/><path d="M318.5 174l-4.3 8h8.6Z M318.5 369.3l-4.3-8h8.6Z" stroke="none"/></g>
     <rect x="302.9" y="220.4" width="29.6" height="107" rx="2.5" fill="#0d2a29" fillOpacity=".9" stroke={p.accentColor} strokeOpacity=".2"/>
     {[...`${p.heightLabel}：${p.heightPixels}`].map((c,i,a)=><text key={i} x="317.7" y={241+i*(a.length>5?76/(a.length-1):17)} textAnchor="middle" fill="#f5ffff" fontWeight="800" fontSize="12.3">{c}</text>)}
    </g>
   </g>
   <g opacity={point} fill="none" stroke={p.accentColor} filter="url(#glow)">
    <circle cx="480" cy="276" r={lerp(f,[80,84,88],[11,9,6])} strokeWidth="1.5"/>
    <path d="M480 276L578 214" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ray} strokeWidth="1.5"/>
   </g>
   <g opacity={panel} clipPath="url(#result-reveal)">
    <rect x="578" y="186" width="241" height="57" fill="#031918" fillOpacity=".88"/>
    <path d="M578 186H819M578 243H819" stroke={p.accentColor} strokeOpacity=".24"/>
    <path d="M578 186V243" stroke={p.accentColor} strokeWidth="4" filter="url(#glow)"/>
    <text x="597" y="223" fill={p.accentColor} fontSize={resultFont} fontWeight="700" letterSpacing="3" filter="url(#glow)">{total}<tspan fontSize="19" letterSpacing="1" dx="4">{p.unitLabel}</tspan></text>
   </g>
  </svg>
 </AbsoluteFill>;
};
