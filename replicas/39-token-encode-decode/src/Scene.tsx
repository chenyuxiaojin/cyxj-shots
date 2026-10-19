import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {Fonts} from './common';
import {at,curve,mix,cameraAt,cardAt,encodeWidth,decodeWidth} from './geometry';
import tracks from './tracks.json';
import defaults from '../props.json';

type Token={text:string;id:string};
type Props=typeof defaults;
const sans="'PingFang SC','Microsoft YaHei','ReplicaSans',sans-serif";
const serif="'ReplicaSerif','Songti SC','SimSun',serif";
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const table=(a:number[][],f:number,start:number,index:number)=>{const t=Math.max(0,Math.min(a.length-1,f-start)),i=Math.floor(t),j=Math.max(0,Math.min(a[0].length-1,index));return a[i][j]+(a[Math.min(a.length-1,i+1)][j]-a[i][j])*(t-i)};
const idx=(j:number,n:number,sourceN:number)=>Math.round(j/Math.max(1,n-1)*(sourceN-1));
const rounded=(v:number)=>Math.round(v*1000)/1000;
const typedCount=(f:number,n:number,fs:number[])=>Math.min(n,Math.floor((fs.filter(t=>f>=t).length/9)*n+1e-6));
const layoutTokens=(tokens:Token[],panelWidth:number)=>{
 const clean=tokens.length?tokens:[{text:'示例',id:'1'}];const n=clean.reduce((a,t)=>a+Array.from(t.text).length,0);const step=(panelWidth-19)/Math.max(1,n);const total=step*n-7;let pos=480-total/2;let charIndex=0;
 return clean.map((t,gi)=>{const cs=Array.from(t.text),w=step*cs.length-7,left=pos,cx=left+w/2;pos+=w+7;return {...t,gi,left,width:w,cx,chars:cs.map((ch,j)=>({ch,index:charIndex++,x:cs.length===1?cx:left+19.5+j*(w-39)/(cs.length-1)}))}})
};
const Line=({points,progress=1,color,opacity=1}:{points:number[][];progress?:number;color:string;opacity?:number})=>{
 const lens=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));const total=lens.reduce((a,b)=>a+b,0);let remain=total*clamp(progress);const path=[points[0]];let angle=0;
 for(let i=0;i<lens.length;i++){const p=points[i],q=points[i+1],t=Math.min(1,remain/lens[i]);if(t<=0)break;path.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]);angle=Math.atan2(q[1]-p[1],q[0]-p[0])*180/Math.PI;remain-=lens[i];if(remain<=0)break}
 const end=path[path.length-1];return progress<=0?null:<g opacity={opacity}><polyline points={path.map(p=>p.map(rounded).join(',')).join(' ')} stroke={color} fill="none" strokeWidth={.8}/><path d="M0 0 L-6 -3 L-6 3 Z" fill={color} transform={`translate(${end[0]} ${end[1]}) rotate(${angle})`}/></g>
};
const Plate=({x,y,w,h,r=18,fill}:{x:number;y:number;w:number;h:number;r?:number;fill:string})=><g><rect x={x} y={y} width={w} height={h} rx={r} fill={fill} filter="url(#raised)"/><rect x={x+.5} y={y+.5} width={w-1} height={h-1} rx={r-.5} fill="none" stroke="url(#bevel)" strokeWidth={1.1}/></g>;
const Person=({x,y,color}:{x:number;y:number;color:string})=><g transform={`translate(${x} ${y})`} fill={color} stroke={color} strokeLinecap="round"><circle cy={-16} r={4.6} stroke="none"/><path d="M-3 -7 L3 -7 L4 6 L-4 6 Z"/><path d="M-3 -7 L-10 3 M3 -7 L10 3" fill="none" strokeWidth={5}/><path d="M-2 5 L-2 19 M3 5 L3 19" fill="none" strokeWidth={4.2}/></g>;
const Atom=({x,y,color}:{x:number;y:number;color:string})=><g transform={`translate(${x} ${y})`} stroke={color} fill="none" strokeWidth={1.1}><ellipse rx={19} ry={7} transform="rotate(-25)"/><ellipse rx={19} ry={7} transform="rotate(35)"/><ellipse rx={19} ry={7} transform="rotate(95)"/><circle cx={2} cy={-18.5} r={1.8} fill={color}/><text x={0} y={1} dominantBaseline="central" textAnchor="middle" fontSize={11} stroke="none" fill={color} fontFamily={sans}>AI</text></g>;
const Char=({x,y,text,opacity=1,fill,color}:{x:number;y:number;text:string;opacity?:number;fill:string;color:string})=><g opacity={clamp(opacity)}><rect x={x-15} y={y-15} width={30} height={30} rx={6} fill={fill} stroke="#f5f5f3" strokeWidth={1.2} filter="url(#tokenShadow)"/><text x={x} y={y+.4} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={18} fontFamily={sans}>{text}</text></g>;
const GroupHighlight=({x,y,w,opacity,color}:{x:number;y:number;w:number;opacity:number;color:string})=><g opacity={clamp(opacity)}><rect x={x} y={y-18} width={w} height={36} rx={4.3} fill={color} filter="url(#rough)"/><rect x={x+.5} y={y-17.3} width={w-1} height={34.6} rx={4} fill="none" stroke={color} strokeWidth={1}/></g>;

export const Scene:React.FC<Props>=(p)=>{
 const frame=useCurrentFrame(),{durationInFrames}=useVideoConfig();const f=frame*557/Math.max(1,durationInFrames-1);const cy=cameraAt(f),cardY=cardAt(f);const w=p.panelWidth;const scaleW=w/397;const humanX=480-p.nodeSeparation/2,modelX=480+p.nodeSeparation/2;
 const groupsIn=layoutTokens(p.inputTokens,w),groupsOut=layoutTokens(p.outputTokens,w);const charsIn=groupsIn.flatMap(g=>g.chars),charsOut=groupsOut.flatMap(g=>g.chars);const nIn=charsIn.length;const ew=encodeWidth(f)*scaleW,dw=decodeWidth(f)*scaleW;
 const left=480-w/2, right=480+w/2;const inStr=Array.from(p.inputText),outStr=Array.from(p.outputText);const inTyped=typedCount(f,inStr.length,[34,35,36,37,39,40,42,44,51]),outTyped=typedCount(f,outStr.length,[415,416,417,418,420,421,423,425,432]);
 const currentCaption=[...p.captions].reverse().find(c=>f>=c.startFrame)?.text??'';
 const encLift=curve(f,[156,159,162,165,168,171,174,177,180,184],[100.5,99.5,97.5,93.5,88.5,84.5,81.5,80.5,79.5,79.5]);
 return <AbsoluteFill style={{background:p.backgroundColor}}><Fonts/><svg viewBox="0 0 960 540" width="100%" height="100%" style={{position:'absolute',inset:0}}>
 <defs>
  <filter id="raised" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx={2} dy={3} stdDeviation={2.5} floodColor="#222" floodOpacity={.35}/><feDropShadow dx={-2} dy={-2} stdDeviation={1.8} floodColor="white" floodOpacity={.23}/></filter>
  <filter id="tokenShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx={.6} dy={1} stdDeviation={1.3} floodColor="#666" floodOpacity={.22}/></filter>
  <linearGradient id="bevel" x1="0" y1="0" x2="1" y2="1"><stop stopColor="white" stopOpacity={.32}/><stop offset={.55} stopColor="white" stopOpacity={.13}/><stop offset={1} stopColor="#666" stopOpacity={.22}/></linearGradient>
  <linearGradient id="backingShade" x1="0" y1="0" x2="1" y2=".25"><stop stopColor="#888" stopOpacity={.5}/><stop offset={.14} stopColor="#9c9c9c" stopOpacity={.2}/><stop offset={1} stopColor="#b8b8b8" stopOpacity={.3}/></linearGradient>
  <pattern id="hatch" width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(34)"><path d="M1 0 L1 7" stroke="white" strokeWidth={1.1} opacity={.12}/></pattern>
  <filter id="backBlur"><feGaussianBlur stdDeviation={29}/></filter>
  <filter id="rough" x="-10%" y="-20%" width="120%" height="140%"><feTurbulence type="fractalNoise" baseFrequency={.16} numOctaves={2} seed={19} result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale={1.7} xChannelSelector="R" yChannelSelector="G"/></filter>
  <linearGradient id="bgColumn"><stop stopColor="white" stopOpacity={0}/><stop offset={.47} stopColor="white" stopOpacity={.14}/><stop offset={1} stopColor="white" stopOpacity={0}/></linearGradient>
  <radialGradient id="bgLift" cx="20%" cy="0%" r="70%"><stop stopColor="white" stopOpacity={.16}/><stop offset={1} stopColor="white" stopOpacity={0}/></radialGradient>
 </defs>
 <rect width={960} height={540} fill="url(#bgLift)"/>
 <g filter="url(#backBlur)" opacity={.3}><path d="M80 -80 L150 -80 L335 600 L258 600 Z" fill="url(#bgColumn)"/><path d="M260 -80 L310 -80 L441 600 L383 600 Z" fill="url(#bgColumn)"/><path d="M560 -60 L610 -60 L540 600 L485 600 Z" fill="url(#bgColumn)"/></g>
 <g transform={`translate(${p.layoutOffsetX} ${p.layoutOffsetY}) translate(480 270) scale(${p.layoutScale}) translate(-480 -270)`}>
 <g transform={`translate(0 ${cy})`}>
  <rect x={385} y={80} width={190} height={320} rx={29} fill={p.cardColor}/><rect x={385} y={80} width={190} height={320} rx={29} fill="url(#backingShade)"/><rect x={385} y={80} width={190} height={320} rx={29} fill="url(#hatch)"/><rect x={385.5} y={80.5} width={189} height={319} rx={28.5} fill="none" stroke="url(#bevel)" strokeWidth={1.6}/>
  <text x={480} y={58} dominantBaseline="central" textAnchor="middle" fill={p.lineColor} fontSize={16} fontFamily={sans}>{p.encodeLabel}</text><text x={480} y={422} dominantBaseline="central" textAnchor="middle" fill={p.lineColor} fontSize={16} fontFamily={sans}>{p.decodeLabel}</text>
  {[{x:humanX,label:p.humanLabel,kind:'person'},{x:modelX,label:p.modelLabel,kind:'atom'}].map(n=><g key={n.kind}><Plate x={n.x-42.5} y={200} w={85} h={85} r={16} fill={p.cardColor}/><text x={n.x} y={180} textAnchor="middle" dominantBaseline="central" fill={p.textColor} fontSize={12} fontFamily={sans}>{n.label}</text><path d={`M${n.x-15} 190 H${n.x+15}`} fill="none" stroke={p.lineColor} strokeWidth={.65} opacity={.55}/>{n.kind==='person'?<Person x={n.x} y={242.5} color={p.accentColor}/>:<Atom x={n.x} y={242.5} color={p.accentColor}/>}</g>)}
  <Line points={[[humanX+64,231],[361,231]]} color={p.lineColor}/><Line points={[[361,251],[humanX+64,251]]} color={p.lineColor}/><Line points={[[598,231],[modelX-66,231]]} color={p.lineColor}/><Line points={[[modelX-66,251],[598,251]]} color={p.lineColor}/>
  <g fill="none" stroke={p.lineColor} strokeWidth={.8} opacity={.88}><rect x={480-ew/2} y={-122.5} width={Math.max(.3,ew)} height={103} rx={Math.min(20,ew/2)}/><rect x={480-ew/2} y={-12} width={Math.max(.3,ew)} height={38} rx={Math.min(19,ew/2)}/>{dw>0&&<><rect x={480-dw/2} y={441.5} width={dw} height={103} rx={Math.min(20,dw/2)}/><rect x={480-dw/2} y={553} width={dw} height={38} rx={Math.min(19,dw/2)}/></>}</g>
  <Line points={[[humanX-2,158],[humanX-2,7],[left-8,7]]} progress={curve(f,[23,30,36,43],[0,.58,.9,1])} color={p.lineColor}/>
  <Line points={[[right+15,-48],[modelX,-48],[modelX,160]]} progress={curve(f,[178,181,184,188,192,195,200,205,210,215],[0,.104,.370,.661,.800,.870,.939,.978,.996,1])} color={p.lineColor}/>
  <Line points={[[modelX+3,310],[modelX+3,469],[right+11,469]]} progress={f<255?0:f>=289?1:at(tracks.modelOutputLine,f-255)} color={p.lineColor}/>
  <Line points={[[left-14,570],[humanX,570],[humanX,317]]} progress={f<445?0:f>=488?1:at(tracks.humanReturnLine,f-445)} color={p.lineColor}/>
  {f>=32&&<text x={left+19} y={7} dominantBaseline="central" fill={p.textColor} fontSize={15} fontFamily={sans}>{inStr.slice(0,inTyped).join('')}{tracks.inputCursor[Math.round(f)]?p.cursorGlyph:''}</text>}
  {groupsIn.map((g,gi)=>{const sourceGroup=idx(gi,groupsIn.length,5);const green=f<116?0:f<136?table(tracks.encodeHighlight,f,116,sourceGroup):1;const hy=encLift-171.28;return <GroupHighlight key={gi} x={g.left} y={hy} w={g.width} opacity={green} color={p.accentColor}/>})}
  {groupsIn.flatMap(g=>g.chars.map(c=>{const si=idx(c.index,nIn,9);const y=f<60?140:f<220?table(tracks.encodeCharY,f,60,si):79.5;const alpha=f<60?0:f<110?table(tracks.encodeCharAlpha,f,60,si):1;const preX=left+31+(w-62)*c.index/Math.max(1,nIn-1);const x=preX+(c.x-preX)*mix(f,120,136);return <Char key={`in-${c.index}`} x={x} y={y-171.28} text={c.ch} opacity={alpha} fill={p.cardColor} color={p.textColor}/>}))}
  {groupsIn.map((g,gi)=>{const si=idx(gi,groupsIn.length,5),alpha=f<162?0:f<186?table(tracks.encodeIdAlpha,f,162,si):1;const y=f<162?139:f<186?table(tracks.encodeIdY,f,162,si):124;return <g key={gi}>{gi>0&&<path d={`M${g.left-3.5} -60 L${g.left-3.5} -31`} fill="none" stroke={p.lineColor} strokeWidth={.7} opacity={mix(f,166,172)}/>}<text x={g.cx} y={y-171.28} textAnchor="middle" dominantBaseline="central" fill={p.textColor} fontSize={16} fontFamily="Arial,sans-serif" fontStyle="italic" opacity={alpha}>#{g.id}#</text></g>})}
  {groupsOut.map((g,gi)=>{const si=idx(gi,groupsOut.length,5),alpha=f<295?0:f<321?table(tracks.decodeIdAlpha,f,295,si):1;return <g key={gi}>{gi>0&&<path d={`M${g.left-3.5} 456 L${g.left-3.5} 486`} fill="none" stroke={p.lineColor} strokeWidth={.7} opacity={mix(f,298,301)}/>}<text x={g.cx} y={470.15} textAnchor="middle" dominantBaseline="central" fill={p.textColor} fontSize={16} fontFamily="Arial,sans-serif" fontStyle="italic" opacity={alpha}>#{g.id}#</text></g>})}
  {groupsOut.map((g,gi)=>{const si=idx(gi,groupsOut.length,5),enter=346+si*5.2;const green=f<345?0:f<=430?table(tracks.decodeHighlight,f,345,si):0;const alpha=mix(f,enter,enter+2);return <g key={gi}><GroupHighlight x={g.left} y={513.5} w={g.width} opacity={green} color={p.accentColor}/>{g.chars.map(c=><Char key={c.index} x={c.x} y={513.5} text={c.ch} opacity={alpha} fill={p.cardColor} color={p.textColor}/>)}</g>})}
  {f>=413&&<text x={left+19} y={572} dominantBaseline="central" fill={p.textColor} fontSize={15} fontFamily={sans}>{outStr.slice(0,outTyped).join('')}{tracks.outputCursor[Math.round(f)]?p.cursorGlyph:''}</text>}
 </g>
 <Plate x={385} y={cardY} w={190} h={190} r={28} fill={p.cardColor}/>
 <text x={480} y={cardY+88} textAnchor="middle" dominantBaseline="central" fill={p.textColor} fontSize={21} fontFamily={sans}>{p.processorLabel}</text><text x={480} y={cardY+108} textAnchor="middle" dominantBaseline="central" fill={p.textColor} fontSize={11} fontFamily="Arial,sans-serif">{p.processorSubtitle}</text>
 </g>
 {p.showCaptions&&<text x={480} y={504} textAnchor="middle" dominantBaseline="central" fontFamily={serif} fontWeight={900} fontSize={27} fill="#fff" stroke="#1c1c1c" strokeWidth={.8} paintOrder="stroke" style={{filter:'drop-shadow(1px 1px 0px rgba(0,0,0,.55))'}}>{currentCaption}</text>}
 </svg></AbsoluteFill>
};
