import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import defaults from '../props.json';
import tracks from './tracks.json';
import {Fonts,lerp} from './common';
export type Props=typeof defaults;
const at=(f:number)=>tracks[Math.max(0,Math.min(201,Math.round(f)))];
const unit=(f:number,a:number,b:number)=>lerp(f,[a,b],[0,1]);
const Mark=({x,y,s,color,cross,progress=1}:{x:number;y:number;s:number;color:string;cross:boolean;progress?:number})=><g transform={`translate(${x} ${y}) scale(${s/48})`} fill="none" stroke={color} strokeWidth={3.6} strokeLinejoin="miter"><rect x="1.8" y="1.8" width="44.4" height="44.4"/>{cross?<><path d="M10.5 37.5L37.5 10.5" pathLength={1} strokeDasharray="1" strokeDashoffset={1-Math.min(1,progress*2)}/><path d="M10.5 10.5L37.5 37.5" pathLength={1} strokeDasharray="1" strokeDashoffset={1-Math.max(0,progress*2-1)}/></>:<path d="M10 26L20 35L37 13" pathLength={1} strokeDasharray="1" strokeDashoffset={1-progress}/>}</g>;
export const Scene=(input:Props)=>{
 const p={...defaults,...input};const frame=useCurrentFrame();const {durationInFrames}=useVideoConfig();const f=frame*201/(durationInFrames-1);const d=at(f);const h=d.header;const idx=Math.max(0,Math.min(3,Math.round(p.failedIndex)));const q=d.failure;
 const startY=tracks[110].rows[idx].y;const pathProgress=Math.min(1,Math.max(0,(878-q.y)/(878-280)));const fx=q.x,fy=idx===3?q.y:f<=110?d.rows[idx].y:f<133?startY+(280-startY)*pathProgress:q.y,fs=q.s;
 const caption=p.captions.find(c=>f>=c.start&&f<=c.end);const captionW=caption?caption.text.length*60+32:0;
 const endX=lerp(f,[189,195,201],[360,335,260]);
 const endY=lerp(f,[150,189,195,201],[944,950,926,860]);
 const titleOpacity=1-unit(f,106,112);const titleScale=1;
 return <AbsoluteFill style={{background:p.background}}><Fonts/><svg key={frame} viewBox="0 0 720 1280" width="720" height="1280" style={{position:'absolute',inset:0}}>
 <defs><clipPath id="paper"><rect x={h?.x??0} y={h?.y??0} width={h?.w??0} height={h?.h??0}/></clipPath></defs>
 {d.rows.map((r,i)=>{const isFailed=i===idx;const x=isFailed?fx:r.x;const y=isFailed?fy:r.y;const s=isFailed?fs:r.s;const reveal=unit(f,[17,13,16,17][i],[21,23,24,25][i]);const label=p.items[i]??'';const scale=isFailed&&f>110?lerp(f,[110,123],[1.04,1.10]):s/48;return <g key={i} opacity={r.opacity*(isFailed?1:1-unit(f,121,122))}>
 <Mark x={x} y={y} s={s} color={p.ink} cross={isFailed} progress={isFailed?unit(f,37+i*6,49+i*6):unit(f,43+i*6,49+i*6)}/>
 <text x={x+(isFailed&&f>110?lerp(f,[110,123],[89,126]):86*scale)} y={y+36*scale} fill={p.ink} fontFamily="Arial,Helvetica,sans-serif" fontSize={48*scale} opacity={isFailed?1-unit(f,122,125):1}>{label.substring(0,Math.ceil(label.length*reveal))}</text>
 </g>})}
 {h&&<><rect x={h.x} y={h.y} width={h.w} height={h.h} fill={p.paper}/><g opacity={titleOpacity} clipPath="url(#paper)"><text x={f<100?h.w-388+28:lerp(f,[100,114],[28,112])} y={f<100?166:lerp(f,[100,114],[166,178])} fontFamily="Arial,Helvetica,sans-serif" fontStyle="italic" fontWeight={700} fontSize={74*titleScale} textLength={Math.min(330,p.heading.length*31.4)*titleScale} lengthAdjust="spacingAndGlyphs" fill={p.background}>{p.heading}</text></g></>}
 {f>119&&<g clipPath="url(#paper)" opacity={unit(f,123,128)}><Mark x={fx} y={fy} s={fs} color={p.background} cross progress={1}/></g>}
 {f>=146&&<g fill={p.ink} textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif"><text x={endX} y={endY} fontSize={36} opacity={unit(f,146,156)}>{p.conclusionTop.substring(0,Math.ceil(p.conclusionTop.length*unit(f,146,152)))}</text><text x={endX} y={endY+61} fontSize={52} fontWeight={700} opacity={unit(f,157,170)}>{p.conclusionMain.substring(0,Math.ceil(p.conclusionMain.length*unit(f,157,174)))}</text></g>}
 {d.edge&&<polygon points={`720,${d.edge[1]} 720,1280 ${d.edge[0]},1280`} fill={p.exitColor}/>}
 {p.showCaptions&&caption&&<g><rect x={360-captionW/2} y={960} width={captionW} height={88} rx={22} fill={p.captionBackground}/><text x={360} y={1026} fontFamily="ReplicaTitle,PingFang SC,Arial,sans-serif" fontSize={58} fontWeight={900} stroke={p.captionColor} strokeWidth={1.5} paintOrder="stroke" textAnchor="middle" fill={p.captionColor}>{caption.text}</text></g>}
 </svg></AbsoluteFill>;
};
