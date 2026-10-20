import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import defaults from '../props.json';
import {Fonts} from './common';
type Props=typeof defaults;
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
function at(f:number,ks:number[],vs:number[]){if(f<=ks[0])return vs[0];for(let i=1;i<ks.length;i++){if(f<=ks[i])return mix(vs[i-1],vs[i],(f-ks[i-1])/(ks[i]-ks[i-1]));}return vs[vs.length-1];}
type Point=[number,number];
const top:Point[]=[[485,172],[722,218],[580,301],[321,243]];
const mask:Point[]=[[489,98],[743,139],[595,224],[315,166]];
const pt=(q:Point[],u:number,v:number):Point=>[mix(mix(q[0][0],q[1][0],u),mix(q[3][0],q[2][0],u),v),mix(mix(q[0][1],q[1][1],u),mix(q[3][1],q[2][1],u),v)];
const ps=(q:Point[])=>q.map(x=>x.join(',')).join(' ');
const strip=(q:Point[],u0:number,v0:number,u1:number,v1:number,dy=0)=>[pt(q,u0,v0),pt(q,u1,v0),pt(q,u1,v1),pt(q,u0,v1)].map(([x,y])=>[x,y+dy] as Point);
const polygon=(q:Point[],fill:string,extra:React.SVGProps<SVGPolygonElement>={})=><polygon points={ps(q)} fill={fill} {...extra}/>;
const stageKeys=[0,52,64,142,153,368,382];
const stageVals=[0,0,1,1,2,2,3];
const capKeys=[0,14,100,154,194,268,310,378,400];
function Callout({f,start,end,label,en,box,points,color,labelDelay=22}:{f:number;start:number;end:number;label:string;en:string;box:Point;points:Point[];color:string;labelDelay?:number}){
 const vis=at(f,[start,start+5,end,end+7],[0,1,1,0]);if(vis<=0)return null;
 const progress=clamp((f-start)/9),showText=clamp((f-start-labelDelay)/13),w=label.length*24+en.length*5+12;
 return <g opacity={vis}><polyline points={ps(points)} fill="none" stroke={color} strokeWidth={1.3} pathLength={1} strokeDasharray={1} strokeDashoffset={1-progress}/><rect x={points[0][0]-2.5} y={points[0][1]-2.5} width={5} height={5} fill={color}/><g clipPath={`url(#label-${start})`}><defs><clipPath id={`label-${start}`}><rect x={box[0]} y={box[1]} width={w*(1-Math.pow(1-showText,3))} height={28}/></clipPath></defs><rect x={box[0]} y={box[1]} width={w} height={28} fill={color}/><text x={box[0]+8} y={box[1]+21} fontFamily="ReplicaSerif" fontSize={24} fontWeight={900} fill="#fff">{label}</text><text x={box[0]+label.length*24+9} y={box[1]+20} fontFamily="Georgia,serif" fontSize={9} fill="#fff">{en}</text></g></g>;
}
export const Scene=(props:Props)=>{
 const p={...defaults,...props},frame=useCurrentFrame(),{durationInFrames}=useVideoConfig(),f=frame*399/(durationInFrames-1);
 const scale=at(f,[0,5,6,7,8,10,12,15,18,20,24],[0,0,.59,.655,.718,.818,.878,.938,.973,.988,1]);
 const visible=at(f,[5,8,12,18,24],[0,.4,.63,.86,1]);
 const rightStage=at(f,stageKeys,stageVals),stage=at(f,[0,62,72,145,154,370,381],stageVals),current=Math.round(stage);
 const coating=at(f,[64,68,72,84,96,101],[0,.18,.44,.77,.96,1]);
 const maskOn=at(f,[150,151,275,276],[0,1,1,0]);
 const maskX=at(f,[150,151,152,153,156,159,162,165,167,264,267,270,272,273,274,275,276],[850,600,440,286,129,56,18,4,0,0,-5,-40,-145,-350,-490,-820,-1100]);
 const maskY=at(f,[150,153,156,159,162,165,167,264,270,273,276],[65,33,18,9,5,2,0,0,-5,-36,-105]);
 const exposure=at(f,[164,166,171,177,216,224,228],[0,.75,.95,1,1,.15,0]);
 const beamBottom=at(f,[165,170,175,178],[0,165,295,324]);
 const reaction=at(f,[209,219,226],[0,.6,1]);
 const rinse=at(f,[301,309,318,326],[0,.45,.94,1]);
 const plateDepth=at(f,[301,318],[3,11]);
 const cap=capKeys.findIndex((t,i)=>f>=t&&f<(capKeys[i+1]??401)),caption=p.captions[Math.max(0,cap)];
 const bar=at(f,[0,1,2,3,4,5,6,8,10,12],[212,141,100,73,54,39,28,13,5,0]);
 const rowY=(d:number)=>Math.sign(d)*at(Math.abs(d),[0,1,2,3,4,5,6,7,8,9,10,12],[0,47,91,128,160,186,209,228,246,261,276,301]);
 const leftWords=p.processList.map((t,i)=>i>=5&&i<=8?p.stages[i-5]:t);
 return <AbsoluteFill style={{background:p.background}}><Fonts/><svg key={frame} viewBox="0 0 960 540" style={{width:'100%',height:'100%'}}>
 <defs>
 <linearGradient id="bg" x2="0" y2="1"><stop stopColor="#656666"/><stop offset=".46" stopColor={p.background}/><stop offset="1" stopColor="#262727"/></linearGradient>
 <radialGradient id="halo" cx=".5" cy="0" r=".69"><stop stopColor="#fafafa" stopOpacity=".77"/><stop offset=".55" stopColor="#dcdcdc" stopOpacity=".19"/><stop offset="1" stopColor="#aaa" stopOpacity="0"/></radialGradient>
 <linearGradient id="front" x2=".4" y2="1"><stop stopColor="#707171"/><stop offset=".4" stopColor="#626363"/><stop offset="1" stopColor="#7d7e7e"/></linearGradient>
 <linearGradient id="side" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#7a7b7b"/><stop offset=".6" stopColor="#575858"/><stop offset="1" stopColor="#767777"/></linearGradient>
 <radialGradient id="floor"><stop stopColor="#a3a3a3" stopOpacity=".25"/><stop offset="1" stopColor="#777" stopOpacity="0"/></radialGradient>
 <linearGradient id="sideFade"><stop stopColor="#ddd" stopOpacity="0"/><stop offset=".12" stopColor="#aaa" stopOpacity=".1"/><stop offset=".6" stopColor="#444" stopOpacity="0"/></linearGradient>
 <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".65 .48" numOctaves="3" seed="42"/><feColorMatrix type="saturate" values="0"/></filter>
 <filter id="blur"><feGaussianBlur stdDeviation="12"/></filter>
 <filter id="shadow"><feGaussianBlur stdDeviation="18"/></filter>
 <filter id="beamGlow" x="-60%" y="-50%" width="220%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>
 <linearGradient id="beam" x2="1" y2="0"><stop stopColor={p.exposureColor} stopOpacity=".3"/><stop offset=".12" stopColor={p.exposureColor}/><stop offset=".84" stopColor={p.exposureColor}/><stop offset="1" stopColor={p.exposureColor} stopOpacity=".25"/></linearGradient>
 <linearGradient id="topEdge" x2="0" y2="1"><stop stopColor="#ddd"/><stop offset="1" stopColor="#aaa"/></linearGradient>
 </defs>
 <rect width={960} height={540} fill="url(#bg)"/>
 {p.showSilhouette?<path d="M284 -35C284 9 276 22 275 49L267 125Q269 183 289 239L320 255L348 216L333 190L341 142L350 65L362 167L365 257H601L607 166L615 65L622 142L614 193L630 216L654 255L683 239Q701 180 700 125L687 49L681 -35Z" fill="#171819" opacity=".79"/>:<g opacity=".16" stroke="#b2d3dc" strokeWidth={1}><path d="M270 0V255M350 0V255M430 0V255M510 0V255M590 0V255M670 0V255"/><path d="M240 60H720M240 120H720M240 180H720"/></g>}
 <rect y={256} width={960} height={284} fill="#2b2c2c"/>
 <ellipse cx={459} cy={379} rx={450} ry={160} fill="url(#floor)"/>
 <path d="M0 255L960 258" stroke="#acacac" strokeWidth={1} opacity=".22"/>
 <rect width={960} height={540} filter="url(#grain)" opacity=".32" style={{mixBlendMode:'soft-light'}}/>
 <rect width={960} height={540} fill="url(#halo)"/>
 <g opacity={at(f,[12,24],[0,1])} fontFamily="ReplicaSerif" textAnchor="middle">
 {leftWords.map((t,i)=>{const y=243+rowY(i-5-stage),dist=Math.abs(i-5-stage),opacity=Math.max(.025,.31-dist*.024);return <text key={i} x={115} y={y} fontSize={at(dist,[0,1,2,3,4,5,6,7,8,10,12],[25,25,24,23,21,19,17,15,13,10,7])} fill="#c2c2c2" opacity={opacity}>{t}</text>})}
 <text x={114} y={243} fill={p.accent} opacity=".33" fontSize={17} fontFamily="ReplicaSans">{p.stageEnglish[current]}</text>
 <text x={115} y={243} fill="#fff" fontSize={24}>{p.stages[current]}</text>
 {p.stages.map((t,i)=>{const alpha=clamp(1-Math.abs(i-rightStage)*1.7)*.28;return <g key={i} opacity={alpha} fill="#d6d6d6" fontSize={148} fontWeight={900} transform="translate(826 0) scale(.84 1) translate(-826 0)">{Array.from(t).map((c,j)=><text key={j} x={826} y={236+j*157}>{c}</text>)}</g>})}
 </g>
 <g transform={`translate(520 270) scale(${Math.max(.001,scale)}) translate(-520 -270)`} opacity={visible}>
 <ellipse cx={516} cy={419} rx={234} ry={49} fill="#000" opacity=".3" filter="url(#shadow)"/>
 {polygon([[321,243],[580,301],[577,447],[327,376]],'url(#front)')}
 {polygon([[580,301],[722,218],[714,345],[577,447]],'url(#side)')}
 {polygon(top,p.topColor)}
 {polygon([[321,243],[580,301],[579,325],[322,267]],'#aeb0b0')}
 {polygon([[580,301],[722,218],[721,242],[579,325]],'#bfc1c1')}
 {coating>0?<g>{polygon(strip(top,0,0,coating,1,-4),p.coatColor)}{polygon([pt(top,0,1),pt(top,coating,1),[pt(top,coating,1)[0],pt(top,coating,1)[1]-4],[321,239]],'#5a5b5b')}{polygon([pt(top,coating,0),pt(top,coating,1),[pt(top,coating,1)[0],pt(top,coating,1)[1]-4],[pt(top,coating,0)[0],pt(top,coating,0)[1]-4]],'#686969')}</g>:null}
 {reaction>0?<g opacity={reaction*(1-rinse)}>{polygon(strip(top,0,0,1,.24,-4),p.reactedColor)}{polygon(strip(top,0,.77,1,1,-4),p.reactedColor)}</g>:null}
 {rinse>0?<g opacity={rinse}>{polygon(strip(top,0,0,1,.24),p.topColor)}{polygon(strip(top,0,.77,1,1),p.topColor)}{polygon(strip(top,.025,.24,.975,.77,-plateDepth),p.coatColor)}{polygon([pt(top,.025,.77),pt(top,.975,.77),[pt(top,.975,.77)[0],pt(top,.975,.77)[1]-plateDepth],[pt(top,.025,.77)[0],pt(top,.025,.77)[1]-plateDepth]],'#777')}{polygon([pt(top,.975,.24),pt(top,.975,.77),[pt(top,.975,.77)[0],pt(top,.975,.77)[1]-plateDepth],[pt(top,.975,.24)[0],pt(top,.975,.24)[1]-plateDepth]],'#e0e0e0')}</g>:null}
 <g opacity={maskOn} transform={`translate(${maskX} ${maskY})`}>
 {[strip(mask,0,0,1,.045),strip(mask,0,.955,1,1),strip(mask,0,0,.04,1),strip(mask,.96,0,1,1),strip(mask,.02,.38,.98,.61)].map((q,i)=><g key={i}>{polygon(q.map(([x,y])=>[x,y+4]),'#929494')}{polygon(q,'#dedfdf')}</g>)}
 </g>
 {exposure>0?<g opacity={exposure}>
 <path d={`M326 -100H724V${beamBottom-82}L580 ${beamBottom}L321 ${beamBottom-58}Z`} fill={p.exposureColor} filter="url(#beamGlow)" opacity=".9"/>
 <path d={`M326 -100H724V${beamBottom-82}L580 ${beamBottom}L321 ${beamBottom-58}Z`} fill="url(#beam)" opacity=".91" filter="url(#blur)"/>
 <g opacity={clamp((beamBottom-170)/154)}>{polygon(top,'#fff6f5',{opacity:.95,filter:'url(#beamGlow)'})}<ellipse cx={538} cy={308} rx={152} ry={45} fill="#fff5f5" opacity=".4" filter="url(#beamGlow)"/></g>
 <path d="M321 243L580 301L722 218" stroke="#fff4f4" strokeWidth={7} fill="none" filter="url(#beamGlow)"/>
 </g>:null}
 </g>
 <Callout f={f} start={28} end={137} label={p.labels[0]} en={p.labelEnglish[0]} color={p.accent} box={[162,414]} points={[[408,379],[376,379],[292,426],[282,428]]}/>
 <Callout f={f} start={68} end={143} label={p.labels[1]} en={p.labelEnglish[1]} color={p.accent} box={[798,132]} points={[[681,198],[776,143],[798,143]]}/>
 <Callout f={f} start={163} end={259} labelDelay={4} label={p.labels[2]} en={p.labelEnglish[2]} color={p.accent} box={[789,251]} points={[[733,195],[757,265],[780,265]]}/>
 <Callout f={f} start={216} end={302} label={p.labels[3]} en={p.labelEnglish[3]} color={p.accent} box={[746,292]} points={[[585,274],[711,305],[736,307]]}/>
 {bar>0?<g fill="#050505"><rect width={960} height={bar}/><rect y={540-bar} width={960} height={bar}/></g>:null}
 <g><rect x={480-caption.length*14.4-10} y={466} width={caption.length*28.8+20} height={44} rx={3} fill="#080808" opacity=".78"/><text x={480} y={501} fill="#fff" fontFamily="ReplicaTitle" fontSize={30} fontWeight={700} textAnchor="middle">{caption}</text></g>
 </svg></AbsoluteFill>;

};
