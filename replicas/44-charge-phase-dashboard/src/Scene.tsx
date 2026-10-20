import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import defaults from '../props.json';import ring from './ring.json';import curves from './curves.json';import {Fonts} from './common';import {row,lerp,phase,percentage,valueFactor,shade} from './geometry';
type Props=typeof defaults;
const Text=({x,y,size=14,sx=.68,anchor='start',children,...rest}:{x:number;y:number;size?:number;sx?:number;anchor?:'start'|'middle'|'end';children:React.ReactNode;[key:string]:unknown})=><text transform={`translate(${x} ${y}) scale(${sx} 1)`} textAnchor={anchor} fontFamily="ReplicaSerif" fontWeight={700} fontSize={size} {...rest}>{children}</text>;
const light=(hex:string)=>'rgb('+[1,3,5].map(i=>Math.round(parseInt(hex.slice(i,i+2),16)*.65+255*.35)).join(',')+')';
const format=(v:number)=>Number(v.toFixed(1)).toString();
export const Scene=(p:Props)=>{
 const frame=useCurrentFrame(),{durationInFrames}=useVideoConfig(),f=frame*555/Math.max(1,durationInFrames-1),r=row(f),q=Math.round(f),v=percentage(f,p.initialPercent,p.stagePercents),num=format(v),dx=r.phoneX-136,dy=r.phoneY-190,cx=234+dx*.5,cy=310+dy,cardDx=r.rightX-367;
 const dims=r.left,headerY=(dims[1]-82)*.87,ph=phase(f),dark=lerp(f,[65,97],[1,.27]);
 const dots=r.dots.map(d=>{const b=r.bars.find(b=>b.i===d.i),base=b?.bottom??429;return {...d,y:base-(base-d.y)*valueFactor(f,d.i,p.barProfiles)}}).sort((a,b)=>a.x-b.x);
 // Trace the native white curve separately so its leading edge retains the source timing.
 const curve=curves[q].map(([x,y])=>{const b=[...r.bars].sort((a,b)=>a.x-b.x),left=[...b].reverse().find(z=>z.x<=x)??b[0],right=b.find(z=>z.x>=x)??b[b.length-1];if(!left||!right)return {x,y};const t=right.x===left.x?0:(x-left.x)/(right.x-left.x),factor=valueFactor(f,left.i,p.barProfiles)*(1-t)+valueFactor(f,right.i,p.barProfiles)*t,base=left.bottom*(1-t)+right.bottom*t;return {x,y:base-(base-y)*factor}});
 const curvePath=curve.map((d,i)=>`${i?'L':'M'}${d.x},${d.y}`).join(' ');
 const ringData=ring[q];const finalGlow=lerp(f,[507,530],[0,1]);const barWidth=lerp(ph,[0,1,2,3],[2.2,4.35,5.8,8.8]);
 return <AbsoluteFill><Fonts/><svg key={frame} viewBox="0 0 960 540" width="100%" height="100%" style={{background:p.backgroundColor}} fill={p.textColor}>
 <defs>
  <pattern id="engineering" x={24} y={43} width={35.5} height={35.5} patternUnits="userSpaceOnUse"><path d="M35.5 0H0V35.5M0 0L35.5 35.5M0 35.5L35.5 0" fill="none" stroke="#bfc6c5" strokeWidth={.35} opacity={.04}/><path d="M-3 0H3M0-3V3" stroke="#d1d5d4" strokeWidth={.5} opacity={.12}/></pattern>
  <radialGradient id="leftShade" cx="68%" cy="75%" r="90%"><stop offset="0" stopColor="#292b2c"/><stop offset="1" stopColor={p.panelColor}/></radialGradient>
  <linearGradient id="rim"><stop stopColor="#969b99"/><stop offset=".12" stopColor="#fff"/><stop offset=".55" stopColor="#b8bbb9"/><stop offset=".82" stopColor="#9a8d72"/><stop offset="1" stopColor="#f2d4a0"/></linearGradient>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".73" numOctaves={2} seed={23}/><feColorMatrix type="saturate" values="0"/></filter>
  <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation={18}/></filter>
  <clipPath id="leftCard"><rect x={dims[0]} y={dims[1]} width={dims[2]} height={dims[3]} rx={13}/></clipPath>
  <clipPath id="rightCard"><rect x={r.rightX} y={82} width={488} height={390} rx={13}/></clipPath>
  <clipPath id="graph"><rect x={402+cardDx} y={245} width={415} height={190}/></clipPath>
  <clipPath id="phone"><rect x={141+dx} y={193+dy} width={184} height={390} rx={29}/></clipPath>
 </defs>
 <rect width={960} height={482} fill="url(#engineering)"/><rect y={482} width={960} height={58} fill="#292929" opacity={.45}/><rect width={960} height={540} filter="url(#grain)" opacity={.025} style={{mixBlendMode:'soft-light'}}/>
 <rect x={dims[0]} y={dims[1]} width={dims[2]} height={dims[3]} rx={13} fill="url(#leftShade)" stroke="#696e6b" strokeWidth={.65}/>
 <g clipPath="url(#leftCard)">
  <Text x={234} y={129+headerY} anchor="middle" size={18} sx={.7}>{p.currentLabel}</Text>
  <Text x={234} y={173+headerY} anchor="middle" size={47} sx={.74} fill={p.accentColor} stroke={p.accentColor} strokeWidth={.18}>{num}%</Text>
  <g transform={`translate(${dx} ${dy})`}><rect x={139.7} y={192} width={188} height={390} rx={30} fill="#020202" stroke="url(#rim)" strokeWidth={1.55}/><rect x={141.2} y={193.1} width={184.5} height={390} rx={28.7} fill="#000" stroke="#444948" strokeWidth={.55}/><path d="M139.7 253V270M139.7 278V309M139.7 313V346" stroke="#c7c7c5" strokeWidth={1.3}/><path d="M328.5 281V318" stroke="#f0d19e" strokeWidth={1.5}/>
   <g fontFamily="ReplicaSans" fontSize={4.5} fill="#f5f5f5"><text x={185} y={204}>{p.statusCarrier}</text><text x={235} y={204}>{p.statusTime}</text><text x={277} y={204}>{format(v)}%</text><rect x={291} y={199.6} width={10} height={3.6} rx={.5}/><path d="M302 200.5V202.5" stroke="white" strokeWidth={.7}/><path d="M208 200.5Q211 197.5 214 200.5M209 202Q211 200.2 213 202" stroke="white" fill="none" strokeWidth={.65}/>{[0,1,2,3,4].map(i=><circle key={i} cx={170+i*3} cy={201} r={1} opacity={i<3?1:.35}/>)}</g>
  </g>
  <g clipPath="url(#phone)">
   <circle cx={cx} cy={cy} r={44*p.ringScale} fill="none" stroke={shade(p.accentColor,.55)} strokeWidth={.65}/>
   {ringData.map(([lo,hi],i)=>{if(hi-lo<.25)return null;const a=i*2*Math.PI/180,b=(i*2+2.8)*Math.PI/180,rad=(hi+lo)/2*p.ringScale;return <path key={i} d={`M${cx+Math.cos(a)*rad} ${cy+Math.sin(a)*rad} A${rad} ${rad} 0 0 1 ${cx+Math.cos(b)*rad} ${cy+Math.sin(b)*rad}`} fill="none" stroke={p.accentColor} strokeWidth={(hi-lo+.25)*p.ringScale} strokeLinecap="round"/>})}
   {r.drops.map((d,i)=><ellipse key={i} cx={d.x} cy={d.y} rx={d.w/2*p.dropScale} ry={d.h/2*p.dropScale} fill={p.accentColor}/>)}
   <g transform={`translate(${cx} ${cy})`} fill={p.accentColor}><path d="M-19 -5L-21-1 -19 0 -20 4 -16 0 -17-1 -15-5Z" fill="none" stroke={p.accentColor} strokeWidth={.55}/><text x={2} y={1} textAnchor="middle" fontFamily="ReplicaTitle" fontSize={12}>{num}<tspan dx={2} fontSize={6}>%</tspan></text><text x={0} y={9} textAnchor="middle" fontFamily="ReplicaSans" fontSize={3}>{p.chargeCaption}</text></g>
  </g>
 </g>
 <rect x={r.rightX} y={82} width={488} height={390} rx={13} fill={p.panelColor} stroke="#746e5b" strokeWidth={.65}/>
 <g clipPath="url(#rightCard)"><g transform={`translate(${cardDx} 0)`}>
  <Text x={402} y={145} size={14}>{p.chartTitle}</Text><rect x={403} y={155} width={257} height={36} rx={18} fill="#363839"/><rect x={407} y={159} width={115} height={29} rx={14.5} fill="#4c4e4f"/><Text x={464} y={179} size={14} anchor="middle">{p.tabs[0]}</Text><Text x={587} y={179} size={14} anchor="middle">{p.tabs[1]}</Text>
  <Text x={402} y={219} size={14} sx={.63}>{p.usageLabel}</Text><Text x={403} y={248} size={26}>{p.usageValue}</Text><Text x={773} y={219} size={14}>{p.legend}</Text><rect x={774} y={223} width={34} height={7} rx={1.5} fill={p.accentColor}/>
 </g>
 <g clipPath="url(#graph)">
  {r.bars.map((b,j)=>{const h=(b.bottom-b.top)*valueFactor(f,b.i,p.barProfiles);return <rect key={j} x={b.x-barWidth/2} y={b.bottom-h} width={barWidth} height={h} fill={shade(b.color==='green'?p.accentColor:p.lineColor,dark)}/>})}
  {curve.length>1?<path d={curvePath} fill="none" stroke="#f1f0dd" strokeWidth={lerp(ph,[1,3],[.75,1.05])} strokeDasharray="2.7 2.4"/>:null}
  {dots.map((d,i)=><circle key={i} cx={d.x} cy={d.y} r={d.r} fill={f<240?p.accentColor:p.lineColor}/>)}
  {r.bubbles.map((b,i)=><g key={i}><polygon points={b.points.map(pt=>pt.join(',')).join(' ')} fill="#fff" stroke={f<240?shade(p.accentColor,.55):shade(p.lineColor,.7)} strokeWidth={.5}/><Text x={b.x+b.w*.5} y={b.y+b.h*.68} anchor="middle" size={b.h*.64} sx={b.stage===0?.62:.56} fill="#151515">{p.stageLabels[b.stage]}</Text></g>)}
  {f>=240?<g opacity={lerp(f,[240,255],[0,1])}><Text x={f>=480?732:lerp(f,[249,421,480],[776,776,732])} y={lerp(f,[249,421,480],[314,314,345])} size={lerp(f,[421,480],[27,46])} sx={.74} fill={p.lineColor} opacity={.07+.93*finalGlow}>{format(p.stagePercents[2])}%</Text>{finalGlow>0?<><g filter="url(#glow)" opacity={finalGlow}><ellipse cx={770} cy={330} rx={47} ry={20} fill={p.lineColor} opacity={.32}/><Text x={732} y={345} size={46} sx={.74} fill={p.lineColor}>{format(p.stagePercents[2])}%</Text></g><Text x={732} y={345} size={46} sx={.74} fill={light(p.lineColor)} opacity={finalGlow*.7}>{format(p.stagePercents[2])}%</Text></>:null}</g>:null}
 </g>
 {f<85?<g opacity={lerp(f,[65,85],[1,0])} transform={`translate(${cardDx} 0)`}>{p.axisLabels.map((s,i)=><Text key={s} x={414+i*66} y={429} size={9} anchor="middle">{s}</Text>)}</g>:null}
 </g></svg></AbsoluteFill>
};
