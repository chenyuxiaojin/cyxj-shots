import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Fonts,lerp} from './common';
import {geom} from './geometry';
import tracking from './tracks.json';
import defaults from '../props.json';
type Datum={label:string;value:number};
type Props=Omit<typeof defaults,'data'> & {data:Datum[]};
const baseline=[20,11,6,4,3,2,2,2,2];
const nameStarts=[13,17,21,25,29,33,37,41,45];
const sizes=[27,27,25,18.5,16,14.5,14.5,14.5,14.5];
const numbers=[56,56,56,48,48,40,40,40,40];
const numberX=[1.43,1.1,1,1.18,1.2,1.35,1.35,1.35,1.35];
const numberY=[.95,.95,.95,.96,1,.93,.93,.93,.93];
const numberDx=[0,-1.5,2.5,-.5,0,1,1,1,1];
// Measured centers and ellipse radii are kept separate from text animation.
export const Scene=(props:Props)=>{
 const frame=useCurrentFrame();const {durationInFrames}=useVideoConfig();
 const f=durationInFrames<=1?0:frame*80/(durationInFrames-1);
 const data=props.data.slice(0,9);const native=data.length===9&&data.every((d,i)=>d.value===baseline[i]);
 const rawRadii=data.map((d,i)=>tracking.final[i][2]*Math.sqrt(Math.max(.01,d.value)/baseline[i]));
 const factor=918/(2*rawRadii.reduce((a,b)=>a+b,0));
 let edge=21;
 const custom=rawRadii.map(r=>{const radius=r*factor;const cx=edge+radius;edge+=2*radius;return {cx,radius}});
 const titleY=lerp(f,[0,8,10,12,15,20,25,29,80],[-130,-108,-90,-65,-36,-9,-1,0,0]);
 return <AbsoluteFill style={{background:'#05060c'}}><Fonts/><div style={{width:960,height:540,position:'absolute',transform:'scale(2)',transformOrigin:'top left',overflow:'hidden'}}>
  <Img src={staticFile('media/background.jpg')} style={{position:'absolute',inset:0,width:960,height:540}}/>
  <div style={{position:'absolute',inset:0,background:props.backgroundTint,opacity:props.backgroundTintOpacity}}/>
  {f<7?<Img src={staticFile('media/carryover.png')} style={{position:'absolute',left:lerp(f,[0,6],[0,-185]),top:lerp(f,[0,6],[0,-155]),width:400,height:210,opacity:lerp(f,[0,5,7],[1,1,0])}}/>:null}
  <svg width="960" height="540" viewBox="0 0 960 540" style={{position:'absolute',inset:0,overflow:'visible'}}>
   <defs>
    <filter id="blue-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".78" numOctaves="2" seed="41"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="1.8" intercept="-.4"/><feFuncG type="linear" slope="1.8" intercept="-.4"/><feFuncB type="linear" slope="1.8" intercept="-.4"/></feComponentTransfer><feComposite in2="SourceAlpha" operator="in" result="grain"/><feBlend in="grain" in2="SourceGraphic" mode="soft-light"/></filter>
   </defs>
   <g transform={`translate(0 ${titleY})`} fill={props.textColor}>
    <text x="53" y="68" fontFamily="ReplicaTitle,sans-serif" fontWeight="700" fontSize="28.2" textLength={Math.min(510,props.title.length*22)} lengthAdjust="spacingAndGlyphs">{props.title}</text>
    <text x="53" y="93" fontFamily="ReplicaSans,sans-serif" fontSize="17.5" fontStyle="italic">{props.note}</text>
    <path d="M574 59.5H702" stroke={props.textColor} strokeWidth=".7" opacity=".5"/>
    <text x="721" y="65" fontFamily="ReplicaSans,sans-serif" fontSize="16.5" fontStyle="italic">{props.sourceLabel}</text>
   </g>
   {data.map((d,i)=>{
    const [mx,my,rx,ry]=geom(f,i);const target=tracking.final[i];
    const cx=native?mx:custom[i].cx+(mx-target[0]);const cy=my;
    const ratio=native?1:custom[i].radius/target[2];
    const t=f-nameStarts[i];const reveal=lerp(t,[-.5,.3],[0,1]);
    const nameScale=lerp(t,[0,1,3,7,13],[.9,1.13,1.04,1.008,1]);
    const numScale=lerp(t,[0,1,3,7,13],[.92,1.12,1.03,1.006,1]);
    const lines=d.label.split('\n');
    const nameBase=i<3?267:(lines.length>1?267:286);
    const initialNameBase=cy+2;
    const nameY=lerp(t,[0,3,7,13],[initialNameBase,nameBase+3,nameBase+.5,nameBase]);
    const numFinal=[330,330,330,336,337,330,330,330,330][i];
    const numY=lerp(t,[0,3,7,13],[cy+6,numFinal-4,numFinal-.5,numFinal]);
    // Names and values are independent editable SVG text. Their brief overlap is present in the reference.
    return <g key={i}>
     <ellipse cx={cx} cy={cy} rx={rx*ratio} ry={ry*ratio} fill={props.bubbleColor} filter="url(#blue-grain)"/>
     {reveal>0?<g fill={props.textColor} opacity={reveal}>
      <g transform={`translate(${cx} ${nameY}) scale(${nameScale})`}><text textAnchor="middle" fontFamily="ReplicaTitle,sans-serif" fontWeight="700" fontSize={sizes[i]}>{lines.map((line,j)=><tspan key={j} x="0" dy={j===0?0:sizes[i]*1.06}>{line}</tspan>)}</text></g>
      <g transform={`translate(${cx+numberDx[i]} ${numY}) scale(${numScale*numberX[i]} ${numScale*numberY[i]})`}><text textAnchor="middle" fontFamily="Bodoni 72,Times New Roman,ReplicaSerif,serif" fontWeight="700" fontSize={numbers[i]}>{d.value}</text></g>
     </g>:null}
    </g>
   })}
  </svg>
 </div></AbsoluteFill>
};
