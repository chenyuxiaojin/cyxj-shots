import React from 'react';
import {AbsoluteFill,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import defaults from '../props.json';
import {lerp,transformAt,backgroundAt} from './geometry';
import {numberFont,growthFont,textFont} from './Fonts';
type Props=typeof defaults;
const clamp=(x:number)=>Math.min(1,Math.max(0,x));
const opacityAt=(f:number,start:number,end:number)=>clamp((f-start)/(end-start));
const roughArc=(type:number)=>{const pts:number[][]=[];for(let i=0;i<=120;i++){const t=i/120,u=1-t;const x=type===0?u*u*623+2*u*t*750+t*t*827:u*u*u*723+3*u*u*t*604+3*u*t*t*474+t*t*t*506;const y=type===0?u*u*235+2*u*t*188+t*t*282:u*u*u*339+3*u*u*t*294+3*u*t*t*425+t*t*t*525;pts.push([x+.34*Math.sin(i*7.23),y+.34*Math.cos(i*4.76)]);}return pts.map((p,i)=>(i?'L':'M')+p.join(' ')).join(' ');};
const Ticket=({side,color}:{side:'top'|'bottom',color:string})=><g transform={side==='top'?'translate(745 -215) rotate(27)':'translate(-210 320) rotate(27)'}><rect width="750" height="255" rx="12" fill="#e9efea" stroke={color} strokeWidth="7"/><rect x="16" y="17" width="717" height="221" rx="7" fill="none" stroke={color} strokeWidth="2"/><path d="M80 18V236M670 18V236" stroke={color} strokeDasharray="3 4"/><text x="120" y="82" fontFamily={textFont} fontSize="29" fill={color}>小岛设计 · 样张</text><text x="120" y="155" fontFamily={numberFont} fontSize="70" fill={color}>STUDIO / 03</text><text x="120" y="205" fontFamily={textFont} fontSize="19" fill={color}>创作记录 / FICTIONAL DEMO</text>{Array.from({length:28},(_,i)=><rect key={i} x={510+i*4} y="105" width={i%3===0?3:1} height="95" fill={color}/>)}</g>;
export const Scene=(props:Props)=>{
 const p={...defaults,...props};const frame=useCurrentFrame();const {durationInFrames}=useVideoConfig();const f=frame/(durationInFrames-1)*113;
 const focus=lerp(f,[0,7,12,18,26,35,60,61,63,66,70,75,113],[7,7,3.2,1.5,.6,.45,.45,5.6,4.7,3.7,2.2,.7,.65]);
 const density=lerp(f,[0,7,12,18,24,30,36,113],[.12,.22,.4,.62,.84,.95,1,1]);
 const arcs=opacityAt(f,25,43),growth1=opacityAt(f,25,44),growth2=opacityAt(f,29,48);
 const arcBlur=lerp(f,[25,30,38,45,113],[6,3,1.3,.6,.6]);
 const headingBlur=lerp(f,[0,24,42,61,73,113],[1.8,1.1,1.7,1.7,.65,.55]);
 const captions=p.captions.find(c=>f>=c.from&&f<c.to)?.text??'';
 const bank=p.assetMode==='banknotes';
 const flare=lerp(f,[0,2,3,4,7,10,14,17,19],[0,.7,0,.85,.9,.85,.7,.35,0]);
 const white=(f<1.9||f>=2.9&&f<3.9)?1:lerp(f,[2,4,8,12,18],[.38,.2,.1,0,0]);
 return <AbsoluteFill style={{backgroundColor:p.paper}}>
 <svg key={Math.floor(f)} viewBox="0 0 1278 720" preserveAspectRatio="none" style={{width:'100%',height:'100%'}}>
 <defs>
  <linearGradient id="paper"><stop stopColor="#e1e0da"/><stop offset=".65" stopColor={p.paper}/><stop offset="1" stopColor={p.paper}/></linearGradient>
  <linearGradient id="vignette" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#33352d" stopOpacity=".36"/><stop offset=".20" stopColor="#33352d" stopOpacity="0"/><stop offset=".74" stopColor="#33352d" stopOpacity="0"/><stop offset="1" stopColor="#242620" stopOpacity=".32"/></linearGradient>
  <linearGradient id="edges"><stop stopColor="#262823" stopOpacity=".36"/><stop offset=".008" stopColor="#262823" stopOpacity="0"/><stop offset=".992" stopColor="#262823" stopOpacity="0"/><stop offset="1" stopColor="#262823" stopOpacity=".36"/></linearGradient>
  <radialGradient id="redLeak"><stop stopColor="#ffb6a3" stopOpacity=".94"/><stop offset=".63" stopColor="#ff978b" stopOpacity=".7"/><stop offset=".82" stopColor="#ff7e8d" stopOpacity=".6"/><stop offset="1" stopColor="#ff747f" stopOpacity="0"/></radialGradient>
  <linearGradient id="limeLeak"><stop stopColor="#f8ffc9" stopOpacity="0"/><stop offset=".45" stopColor="#efffc2" stopOpacity=".9"/><stop offset="1" stopColor="#ffff9c" stopOpacity="1"/></linearGradient>
  <filter id="noise"><feTurbulence baseFrequency=".72" numOctaves="3" seed="5" type="fractalNoise"/><feColorMatrix type="saturate" values="0"/></filter>
  <filter id="focus" x="-30%" y="-40%" width="160%" height="180%"><feGaussianBlur stdDeviation={focus}/></filter>
  <filter id="arcblur"><feGaussianBlur stdDeviation={arcBlur}/></filter>
  <filter id="headingBlur"><feGaussianBlur stdDeviation={headingBlur}/></filter>
  <filter id="lowerFocus"><feGaussianBlur stdDeviation=".65 1.1"/></filter>
  <filter id="decorationBlur"><feGaussianBlur stdDeviation="2"/></filter><filter id="lowerLabelBlur"><feGaussianBlur stdDeviation={lerp(f,[0,45,60,61,75,113],[3.7,3.7,3.3,1.2,.65,.65])}/></filter><filter id="growthBlur"><feTurbulence baseFrequency=".16" numOctaves="2" seed="16" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.9"/><feGaussianBlur stdDeviation={Math.max(.85,arcBlur)}/></filter><filter id="bankBlur"><feGaussianBlur stdDeviation=".4"/></filter>
  <filter id="captionShadow"><feDropShadow dx="1.2" dy="2" stdDeviation=".8" floodColor="#171813" floodOpacity=".9"/></filter>
 </defs>
 <rect width="1278" height="720" fill="url(#paper)"/><rect width="1278" height="720" fill="url(#vignette)"/>
 <g filter="url(#focus)" opacity={density}>
  <g filter="url(#bankBlur)"><g transform={backgroundAt(f,'upper')}>{bank?<image href={staticFile(p.upperSrc)} x="680" y="0" width="598" height="305"/>:<Ticket side="top" color={p.accent}/>}</g><g transform={backgroundAt(f,'lower')}>{bank?<image href={staticFile(p.lowerSrc)} x="0" y="415" width="590" height="302"/>:<Ticket side="bottom" color={p.accent}/>}</g></g>
  <g transform={transformAt(f)}>
  <g transform={`translate(0 ${lerp(f,[0,60,75,113],[40,40,10,0])})`} opacity=".09" filter="url(#decorationBlur)" fill="#a3a6a0" stroke="#eeeee6" strokeWidth="7"><rect x="130" y="474" width="220" height="47" rx="3" transform="rotate(-37 130 474)"/><rect x="1022" y="275" width="128" height="28" rx="3" transform="rotate(48 1022 275)"/></g>
  <text x="445" y="135" fontFamily={textFont} fontWeight="300" fontSize="34" textLength="375" lengthAdjust="spacingAndGlyphs" fill={p.ink} opacity=".62" filter="url(#headingBlur)">{p.heading}</text>
  <g fill={p.ink}>
   <text x="438" y="317" fontFamily={numberFont} fontWeight="700" fontSize="152" textLength="168" lengthAdjust="spacingAndGlyphs">{p.values[0]}</text>
   <text x="724" y="399" fontFamily={numberFont} fontWeight="700" fontSize="152" textLength="171" lengthAdjust="spacingAndGlyphs">{p.values[1]}</text>
   <g filter="url(#lowerFocus)"><text x="523" y="590" fontFamily={numberFont} fontWeight="700" fontSize="192" textLength="276" lengthAdjust="spacingAndGlyphs">{p.values[2]}</text></g>
   {[[313,317,101,0],[609,399,95,1],[372,590,127,2]].map(([x,y,w,i])=><text key={i} x={x} y={y} filter={i===2?"url(#lowerLabelBlur)":undefined} fontFamily={textFont} fontWeight="300" fontSize={i===2?48:42} textLength={w} lengthAdjust="spacingAndGlyphs" opacity=".87">{p.labels[i]}</text>)}
   {[[604,317,82,0],[893,399,89,1],[799,590,109,2]].map(([x,y,w,i])=><text key={i} x={x} y={y} filter={i===2?"url(#lowerLabelBlur)":undefined} fontFamily={textFont} fontWeight="300" fontSize={i===2?49:41} textLength={w} lengthAdjust="spacingAndGlyphs" opacity=".87">{p.unit}</text>)}
  </g>
  <g transform={`translate(0 ${lerp(f,[0,25,30,36,42,48,113],[72,72,40,18,4,0,0])})`}>
  <g stroke={p.accent} fill="none" strokeWidth="4.0" strokeLinecap="round" filter="url(#arcblur)" opacity={arcs}><path d={roughArc(0)}/><path d={roughArc(1)}/></g>
  <g fill={p.accent} fontFamily={growthFont} stroke={p.accent} strokeWidth=".5" filter="url(#growthBlur)" opacity=".84">
   {[[779,235,growth1,0],[275,484,growth2,1]].map(([x,y,o,i])=><g key={i} opacity={o*.78}><text x={x} y={y} fontSize="62" textLength={p.growth[i].endsWith('%')?170:214} lengthAdjust="spacingAndGlyphs">{p.growth[i].replace(/%$/,'')}</text>{p.growth[i].endsWith('%')&&<text x={x+171} y={y-6} fontSize="52" textLength="43" lengthAdjust="spacingAndGlyphs">%</text>}</g>)}
  </g></g>
 </g></g>
 
 <rect width="1278" height="720" fill="url(#edges)"/>
 <rect width="1278" height="720" filter="url(#noise)" opacity=".021" style={{mixBlendMode:'multiply'}}/>
 <g opacity={flare}><ellipse cx={lerp(f,[2,6,11,17],[300,250,700,1430])} cy="350" rx="650" ry="700" fill="url(#redLeak)"/><rect x={lerp(f,[2,7,13,18],[400,520,1100,1300])} y="0" width="900" height="720" fill="url(#limeLeak)"/></g>
 <rect width="1278" height="720" fill="white" opacity={white}/>
 {p.showCaptions&&captions&&<text x="639" y="648" textAnchor="middle" fontFamily={textFont} fontSize="44" fontWeight="400" textLength={captions.length*33.5} lengthAdjust="spacingAndGlyphs" fill="white" stroke="#31342b" strokeWidth=".65" paintOrder="stroke" filter="url(#captionShadow)">{captions}</text>}
 </svg></AbsoluteFill>;
};
