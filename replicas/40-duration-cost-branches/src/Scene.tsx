import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import defaults from '../props.json';import {Fonts} from './common';
import {row,branch,lerp,phase,dayValue,arcValue,amount,arrowPath,ring} from './geometry';
type Props=typeof defaults;
const serif='ReplicaSans';const bold='ReplicaTitle';
const Arrow=({f,right,color}:{f:number;right:boolean;color:string})=>{
 const g=row(f),b=branch(f),s=g.r/51.423,tx=g.cx-345.529*s,ty=g.cy-158.016*s,delay=right?91:0;
 const grow=right?b.rightArea:b.leftArea;
 const head=lerp(f-delay,[178,180,182,185,188,191,193],[0,4,16,34,48,53,54]);
 const cx=right?651:309;
 return <g fill={color} transform={`translate(${tx} ${ty}) scale(${s})`}><g><path d={arrowPath(right)} stroke={color} strokeWidth={28} fill="none" pathLength={1} strokeDasharray={`${grow} 1`} strokeLinecap="butt"/></g>{head>0?<path d={`M${cx-head/2} 293 H${cx+head/2} L${cx} ${293+head*.63}Z`}/>:null}</g>
};
const CostBranch=({f,right,p}:{f:number;right:boolean;p:Props})=>{
 const b=branch(f),start=right?253:162;if(f<start)return null;
 const x=right?526.5:126.5,dx=right?b.rightX:b.leftX,top=right?b.rightBarTop:b.leftBarTop,bottom=right?b.rightBarBottom:b.leftBarBottom;
 const lo=amount(f,right?250:159,right?p.rightLow:p.leftLow,right?'right':'left',0),hi=amount(f,right?250:159,right?p.rightHigh:p.leftHigh,right?'right':'left',1);
 const percent=right?p.rightPercent:p.leftPercent,arc=right?p.rightArcDegrees:p.leftArcDegrees;
 const gauge=right?b.rightGauge:b.leftGauge;
 return <g><clipPath id={right?'rightClip':'leftClip'}><rect x={x+9.5} y={330} width={310} height={100}/></clipPath><g clipPath={`url(#${right?'rightClip':'leftClip'})`} opacity={f<(right?256:165)?0:1}><g transform={`translate(${x+dx} 0)`}>
  <text x={55} y={374} textAnchor="middle" fontFamily={bold} fontSize={44} fill={p.accentColor}>{lo}</text>
  <text x={98} y={374} fontFamily={bold} fontSize={16}>{p.costUnit}</text>
  <text x={121} y={366} fontFamily={bold} fontSize={27}>~</text>
  <text x={181} y={374} textAnchor="middle" fontFamily={bold} fontSize={44} fill={p.accentColor}>{hi}</text>
  <text x={225} y={374} fontFamily={bold} fontSize={16}>{p.costUnit}</text>
  <text x={right?21:29} y={403} fontFamily={bold} fontSize={17} letterSpacing={2}>{right?p.rightLabel:p.leftLabel}</text>
  {gauge>0?<path d={ring(280.5,372,22,arc*gauge)} stroke={p.percentColor} strokeWidth={10} fill="none"/>:null}
  <text x={280.5} y={375} textAnchor="middle" fontFamily={bold} fontSize={14}>{percent}%</text>
  <text x={280.5} y={arc>180?414:402} textAnchor="middle" fontFamily={bold} fontSize={14} fill={p.percentColor}>{p.percentLabel}</text>
 </g></g><rect x={x} y={top} width={9.5} height={Math.max(0,bottom-top)} fill={p.textColor}/></g>
};
export const Scene=(p:Props)=>{
 const frame=useCurrentFrame(),{durationInFrames}=useVideoConfig(),f=frame*359/Math.max(1,durationInFrames-1),g=row(f),s=g.r/76.771;
 const baseCenter=lerp(f,[49,65,70,75,80,90],[543.5,543.5,543.5,544.5,548,551.5]);
 const center=f<162?baseCenter:g.cx+(551.5-297.493)*s;
 const totalLow=amount(f,50,p.totalLow,'total',0),totalHigh=amount(f,50,p.totalHigh,'total',1);
 const introOpacity=lerp(f,[48,56,70],[1,.8,0]);
 return <AbsoluteFill><Fonts/><svg viewBox="0 0 960 540" width="100%" height="100%" style={{background:p.backgroundColor}} fill={p.textColor}>
  <defs>
   <pattern id="grid" width={33} height={33} patternUnits="userSpaceOnUse" x={20} y={7}><path d="M33 0H0V33" fill="none" stroke="#fff" strokeWidth={.8} opacity={.85}/></pattern>
   <radialGradient id="edge"><stop offset="0" stopColor="white" stopOpacity={0}/><stop offset=".65" stopColor="white" stopOpacity={0}/><stop offset="1" stopColor={p.backgroundColor} stopOpacity={1}/></radialGradient>
   <filter id="paper"><feTurbulence baseFrequency=".71 .47" numOctaves={3} seed={15} type="fractalNoise"/><feColorMatrix type="saturate" values="0"/></filter>
   <clipPath id="capsuleClip"><rect x={g.cx} y={g.cy-g.r*.925} width={Math.max(0,g.right-g.cx)} height={g.r*1.85} rx={g.r*.25}/></clipPath>
  </defs>
  <rect width={960} height={540} fill="url(#grid)"/><rect width={960} height={540} fill="url(#edge)"/><rect width={960} height={540} filter="url(#paper)" opacity={.035} style={{mixBlendMode:'multiply'}}/>
  {f>=168?<Arrow f={f} right={false} color={p.arrowColor}/>:null}{f>=259?<Arrow f={f} right color={p.arrowColor}/>:null}
  {f>=49?<g><rect x={g.cx} y={g.cy-g.r*.925} width={Math.max(0,g.right-g.cx)} height={g.r*1.85} rx={g.r*.25} fill={p.capsuleColor} stroke="#353535" strokeWidth={.8}/><g clipPath="url(#capsuleClip)"><g transform={`translate(${center} ${g.cy}) scale(${s})`}>
   <text x={0} y={-30} textAnchor="middle" fontFamily={bold} fontSize={18}>{p.totalLabel}</text>
   <text x={-87} y={39} textAnchor="middle" fontFamily={bold} fontSize={48} fill={p.accentColor}>{totalLow}</text>
   <text x={-43} y={39} fontFamily={bold} fontSize={19}>{p.costUnit}</text><text x={0} y={31} fontFamily={bold} fontSize={29}>~</text>
   <text x={96} y={39} textAnchor="middle" fontFamily={bold} fontSize={48} fill={p.accentColor}>{totalHigh}</text><text x={140} y={39} fontFamily={bold} fontSize={19}>{p.costUnit}</text>
  </g></g></g>:null}
  <circle cx={g.cx} cy={g.cy} r={g.r} fill="#fff" stroke="#444" strokeWidth={.65}/><path d={ring(g.cx,g.cy,g.r+2*s,arcValue(f))} fill="none" stroke="#8b8e8d" strokeWidth={4*s}/>
  <g transform={`translate(${g.cx} ${g.cy+lerp(f,[0,5,10,15,25],[-6.8,-3.5,-2.2,-1.5,0])}) scale(${s})`}>
   <text x={0} y={8} textAnchor="middle" fontFamily={serif} fontSize={40}>{dayValue(f,p.days)}</text>
   <text x={-38} y={8} textAnchor="middle" fontFamily={serif} fontSize={11}>{p.dayPrefix}</text><text x={40} y={8} textAnchor="middle" fontFamily={serif} fontSize={11}>{p.dayUnit}</text>
   <text x={0} y={25} textAnchor="middle" fontFamily={serif} fontSize={10} fill={p.accentColor}>{p.dayLabel}</text>
  </g>
  {introOpacity>0?<text x={g.cx} y={f<49?444:g.cy+175*(g.r/121.394)} textAnchor="middle" fontFamily={serif} fontSize={f<49?18:18*(g.r/121.394)} opacity={introOpacity}>{p.introLabel}</text>:null}
  <CostBranch f={f} right={false} p={p}/><CostBranch f={f} right p={p}/>
 </svg></AbsoluteFill>
};
