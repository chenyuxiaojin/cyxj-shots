import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Fonts} from './common';
import data from './tracks.json';
import defaults from '../props.json';
import fontCalibration from './font-calibration.json';
const fontFit=fontCalibration as Record<string,{width:number;height:number;dx:number;dy:number}>;
type Props=typeof defaults;
type Box=number[]|null;
const tracks=data as {outer:number[][];cells:Record<string,Box[]>;photo:Box[]};
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
export const sample=(a:Box[],f:number):Box=>{const k=clamp(f,0,a.length-1),i=Math.floor(k),u=k-i,v=a[i],n=a[Math.min(a.length-1,i+1)];if(!v)return null;if(!n)return v;return v.map((x,j)=>x+(n[j]-x)*u)};
const roughPath=(x:number,y:number,w:number,h:number,seed:number)=>{
 const r=(k:number)=>Math.sin((seed+3)*91.7+k*73.1)*Math.min(.65,w/15,h/15);
 return `M${x} ${y} L${x+w*.33} ${y+r(1)} L${x+w*.68} ${y+r(2)} L${x+w} ${y} L${x+w+r(3)} ${y+h*.41} L${x+w} ${y+h} L${x+w*.57} ${y+h+r(4)} L${x+w*.21} ${y+h+r(5)} L${x} ${y+h} L${x+r(6)} ${y+h*.62} Z`;
};
export const Scene:React.FC<Props>=(p)=>{
 const frame=useCurrentFrame(),{durationInFrames}=useVideoConfig();const f=frame*179/Math.max(1,durationInFrames-1);const outer=sample(tracks.outer,f)!;const s=outer[2]/880;const photo=sample(tracks.photo,f);const caption=[...p.captions].reverse().find(c=>f>=c.startFrame)?.text??'';
 return <AbsoluteFill style={{background:p.backgroundColor}}><Fonts/><svg key={`treemap-frame-${frame}`} viewBox="0 0 960 540" width="100%" height="100%" style={{position:'absolute',inset:0}}>
  <g transform={`translate(${p.layoutOffsetX} ${p.layoutOffsetY}) translate(480 270) scale(${p.layoutScale}) translate(-480 -270)`}>
   <text x={outer[0]+1} y={outer[1]-28*s} dominantBaseline="hanging" fill={p.borderColor} fontFamily="Arial,sans-serif" fontWeight={800} fontSize={12*s}>{p.headline}</text>
   <text x={outer[0]+1} y={outer[1]-14*s} dominantBaseline="hanging" fill={p.borderColor} fontFamily="'ReplicaTitle','PingFang SC',sans-serif" fontWeight={700} fontSize={12*s}>{p.subheadline}</text>
   <rect x={outer[0]} y={outer[1]} width={outer[2]} height={outer[3]} fill={p.borderColor}/>
   {p.nodes.map((n,i)=>{const b=sample(tracks.cells[n.id]??[],f);if(!b||b[2]<.5||b[3]<.5)return null;const[x,y,w,h,tx,ty,tw,th]=b;const fit=fontFit[n.id]??{width:1,height:1,dx:0,dy:0};return <g key={n.id}>
    <path d={roughPath(x,y,w,h,i)} fill={n.color}/>
    {n.label&&tw>=3&&th>=2&&<text x={tx+tw/2+fit.dx*tw} y={ty+th/2+fit.dy*th} textAnchor="middle" dominantBaseline="central" fill={p.labelColor} fontFamily="'ReplicaTitle','PingFang SC','Microsoft YaHei',sans-serif" fontWeight={700} fontSize={th*1.12*fit.height} textLength={tw*fit.width} lengthAdjust="spacingAndGlyphs">{n.label}</text>}
   </g>})}
   {photo&&photo[2]>0&&<foreignObject x={photo[0]} y={photo[1]} width={photo[2]} height={photo[3]} style={{overflow:'hidden'}}><Img src={staticFile(p.focusImage)} style={{display:'block',width:'100%',height:'100%',objectFit:'fill'}}/></foreignObject>}
  </g>
  {p.showCaptions&&caption&&<text x={480} y={505} textAnchor="middle" dominantBaseline="central" fontFamily="'ReplicaSerif','Songti SC',serif" fontSize={26} fontWeight={900} fill="white" stroke="#777777" strokeWidth={.75} style={{filter:"drop-shadow(.5px 1px 0px rgba(0,0,0,.35))"}} paintOrder="stroke">{caption}</text>}
 </svg></AbsoluteFill>
};
