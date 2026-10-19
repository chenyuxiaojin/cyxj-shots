import React from 'react';
import {AbsoluteFill,Img,useCurrentFrame,useVideoConfig} from 'remotion';
import defaults from '../props.json';
import tracks from './circle-tracks.json';
import {Fonts,asset,lerp} from './common';
type Props=typeof defaults;
const point=(r:number,a:number)=>[r*Math.cos(a*Math.PI/180),r*Math.sin(a*Math.PI/180)];
const arc=(r:number,a:number,b:number)=>{const p=point(r,a),q=point(r,b);return `M${p[0]} ${p[1]}A${r} ${r} 0 ${b-a>180?1:0} 1 ${q[0]} ${q[1]}`};
const sample=(rows:number[][],f:number)=>{const a=Math.max(0,Math.min(199,Math.floor(f))),b=Math.min(199,a+1),t=f-a;return rows[a].map((v,k)=>v+(rows[b][k]-v)*t)};
const Penguin=()=> <g><ellipse cy="0" rx="9" ry="12" fill="#050607"/><ellipse cy="3" rx="6.5" ry="8.5" fill="#fffaf1"/><ellipse cx="-3" cy="-5.5" rx="1.6" ry="2.7" fill="white"/><ellipse cx="3" cy="-5.5" rx="1.6" ry="2.7" fill="white"/><circle cx="-2.4" cy="-5.3" r=".75"/><circle cx="2.4" cy="-5.3" r=".75"/><path d="M-4-2Q0-5 4-2L0 1Z" fill="#f1bf30"/><path d="M-8 1Q0 5 8 1L9 5Q0 8-9 5Z" fill="#d92c2e"/><path d="M-8 10l-4 4 10-1 M8 10l4 4-10-1" fill="#dfb330"/></g>;
const Desktop=()=> <g stroke="#4b5a5c" strokeWidth="1.2"><path d="M-10-11H9V6H-10Z" fill="#d0d6d3"/><path d="M-7-8H6V2H-7Z" fill="#6b8f9d"/><path d="M-2 6V9H5L9 13H-12L-8 9H-2" fill="#b1bab8"/><path d="M-9 11H5"/></g>;
export const Scene:React.FC<Props>=(p)=>{
 const frame=useCurrentFrame(),{durationInFrames}=useVideoConfig();const f=frame/(durationInFrames-1)*199;
 const main=sample(tracks.main,f),small=sample(tracks.small,f);
 const custom=p.mainValueNumeric!==100000000||p.comparisonValueNumeric!==59100000;
 const ratio=custom?Math.min(1.6,Math.max(.35,Math.sqrt((p.comparisonValueNumeric/Math.max(1,p.mainValueNumeric))/.591))):1;small[2]*=ratio;
 const camera=lerp(f,[0,45,80,120,126,145,167,199],[1,1,1.18,1.38,1.38,1.08,1,1]);
 const titleOp=lerp(f,[16,30],[0,1]),tagOp=lerp(f,[23,35],[0,1]),dataOp=lerp(f,[25,43],[0,1]);
 const smallText=lerp(f,[160,184],[0,1]),smallTag=lerp(f,[143,160],[0,1]);
 const ring=(cx:number,cy:number,r:number,isSmall:boolean)=>{
  const scale=r/(isSmall?100.5:170.5);const sy=isSmall?smallTag:titleOp;const val=isSmall?p.comparisonValue:p.mainValue;
  const description=isSmall?p.comparisonDescription:p.mainDescription;
  const infoX=isSmall?136:195;const valSize=isSmall?41:50;
  return r>.2?<g transform={`translate(${cx} ${cy})`}>
   <circle r={r} fill="url(#circle-fill)"/>
   <g fill="none" stroke={p.textColor} strokeWidth={Math.max(.7,1.2*scale)} opacity={lerp(f,isSmall?[135,148]:[5,19],[0,1])}>
    {!isSmall?<><path d={arc(r,-39,-20)}/><path d={arc(r,20,302)}/></>:<><path d={arc(r,-116,-20)}/><path d={arc(r,16,210)}/></>}
   </g>
   <g transform={`scale(${scale})`}>
    <text x={isSmall?-105:52} y={isSmall?-60:-120} fontFamily="Arial,PingFang SC,sans-serif" fontSize={isSmall?27:31} fill="#6d8585" opacity={sy*.6}>{p.yearLabel}</text>
    <g opacity={isSmall?smallTag:tagOp}>
     <rect x={isSmall?-130:-138} y="-19" width={isSmall?73:68} height="36" fill={p.accentColor}/>
     <text x={isSmall?-93.5:-104} y="10" fill="#d1f6e8" fontFamily="Arial,PingFang SC,sans-serif" fontSize={isSmall?32:35} textAnchor="middle">{isSmall?p.comparisonLabel:p.mainLabel}</text>
    </g>
    <g fill={p.textColor} opacity={isSmall?smallText:dataOp}>
     <text x={infoX} y="-9" textAnchor="end" fontFamily="Arial,PingFang SC,sans-serif" fontSize={valSize} letterSpacing="-1.3">{val}</text>
     <text x={infoX} y="26" textAnchor="end" fontFamily="Arial,PingFang SC,sans-serif" fontSize={isSmall?22:23}>{description}</text>
     {p.showIcons&&<g transform={`translate(${infoX-description.length*(isSmall?22:21)-12} 16)`}>{isSmall?<Desktop/>:<Penguin/>}</g>}
     {!isSmall&&<text x={infoX} y="45" textAnchor="end" fontFamily="Arial,PingFang SC,sans-serif" fontSize="12.5" opacity={lerp(f,[33,48],[0,1])}>{p.mainNote}</text>}
    </g>
   </g>
  </g>:null;
 };
 return <AbsoluteFill style={{background:'#b3d7e5'}}><Fonts/>
  <div style={{position:'absolute',inset:0,transform:`scale(${camera})`,transformOrigin:'50% 51%'}}><Img src={asset(p.backgroundSrc)} style={{width:'100%',height:'100%',objectFit:'cover'}}/><div style={{position:'absolute',left:'7.29167%',top:0,width:'83.3333%',height:'85.1852%',maskImage:'linear-gradient(to bottom,black 0%,black 82%,transparent 100%)'}}><Img src={asset(p.backgroundSrc)} style={{width:'100%',height:'100%',maskImage:'linear-gradient(to right,transparent,black 4%,black 96%,transparent)'}}/></div></div>
  <svg viewBox="0 0 960 540" width="100%" height="100%" style={{position:'absolute',inset:0}}>
   <defs><radialGradient id="circle-fill"><stop stopColor={p.glowColor} stopOpacity=".67"/><stop offset=".45" stopColor={p.glowColor} stopOpacity=".29"/><stop offset="1" stopColor={p.glowColor} stopOpacity="0"/></radialGradient></defs>
   <path d={`M${480-lerp(f,[7,20],[0,480])} ${main[1]}H${480+lerp(f,[7,20],[0,480])}`} stroke={p.textColor} strokeWidth=".75" strokeDasharray="5 5" opacity=".6"/>
   {ring(main[0],main[1],main[2],false)}
   {ring(small[0],small[1],small[2],true)}
  </svg>
 </AbsoluteFill>;
};
