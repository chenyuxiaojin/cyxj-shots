import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig,delayRender,continueRender,interpolate,interpolateColors} from 'remotion';
import defaults from '../props.json';
import labels from './labels.json';
import elements from './elements.json';
import cameras from './camera.json';
import pathTrack from './path-track.json';
export type SceneProps=typeof defaults;
const mix=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const smooth=(f:number,a:number,b:number)=>{const p=mix(f,a,b);return p*p*(3-2*p)};
const at=(f:number,rows:Record<string,number>[],key:string)=>{const a=Math.max(0,Math.min(rows.length-1,Math.floor(f))),b=Math.min(rows.length-1,a+1),p=f-a;return rows[a][key]*(1-p)+rows[b][key]*p};
const PATH='M79 267.7 L864 267.7 C925 268 925 355 864 355 L208 353 C144 354 144 433 209 434 L606 438';
const PATH_LENGTH=2120.49155;
const scratch=Array.from({length:85},(_,i)=>({x:((i*29.73)%54)-27,y:((i*17.31)%34)-17,w:.2+(i%4)*.23,h:.25+(i%3)*.22}));
const measureCache=new Map<string,{left:number;ascent:number;width:number;height:number}>();
function metrics(text:string,font:string){const key=font+':'+text;const saved=measureCache.get(key);if(saved)return saved;const ctx=document.createElement('canvas').getContext('2d')!;ctx.font=`100px ${font}`;const m=ctx.measureText(text||' ');const out={left:m.actualBoundingBoxLeft,ascent:m.actualBoundingBoxAscent,width:Math.max(1,m.actualBoundingBoxLeft+m.actualBoundingBoxRight),height:Math.max(1,m.actualBoundingBoxAscent+m.actualBoundingBoxDescent)};measureCache.set(key,out);return out;}
const FitText=({text,x,y,w,h,color,font='ReplicaSerif'}:{text:string;x:number;y:number;w:number;h:number;color:string;font?:string})=>{const m=metrics(text,font);return <g transform={`translate(${x} ${y}) scale(${w/m.width} ${h/m.height}) translate(${m.left} ${m.ascent})`}><text x={0} y={0} fontFamily={font} fontSize={100} fill={color} stroke={font==='ReplicaStamp'?color:undefined} strokeWidth={font==='ReplicaStamp'?1.2:0} paintOrder="stroke">{text}</text></g>};
export const Scene:React.FC<SceneProps>=(input)=>{
 const p={...defaults,...input};const frame=useCurrentFrame();const {durationInFrames}=useVideoConfig();const f=frame*354/Math.max(1,durationInFrames-1);
 const [ready,setReady]=useState(false);const [handle]=useState(()=>delayRender('Load editable Songti glyphs'));
 useEffect(()=>{Promise.all([['ReplicaSerif','Serif.ttf'],['ReplicaStamp','Stamp.ttf']].map(async([name,file])=>{const font=new FontFace(name,'local("Songti SC"), local("STSong"), local("Times New Roman")');try{await font.load();document.fonts.add(font)}catch{document.documentElement.style.setProperty('--replica-font-fallback','serif')}})).then(()=>setReady(true)).finally(()=>continueRender(handle));},[handle]);
 const names=[...p.row1,...p.row2,p.finalLabel];const s=at(f,cameras,'s'),tx=at(f,cameras,'tx'),ty=at(f,cameras,'ty');
 const progress=Math.min(PATH_LENGTH,at(f,pathTrack,'length'));const bgShift=-.625*f;
 return <AbsoluteFill style={{background:p.backgroundTint}}>
  <svg viewBox="0 0 960 540" width="100%" height="100%" style={{position:'absolute',inset:0}}><defs><filter id="stampSoft" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation=".34"/></filter><mask id="inkWear"><rect x="-40" y="-35" width="80" height="70" fill="white"/>{scratch.map((r,i)=><rect key={i} {...r} fill="black" opacity={.2+(i%3)*.13}/>)}</mask></defs></svg>
  <div style={{position:'absolute',width:'100%',height:'100%',overflow:'hidden',opacity:p.backgroundOpacity}}><div style={{position:'absolute',width:'100%',height:'100%',transform:`translateX(${bgShift/960*100}%)`}}><Img src={/^https?:/.test(p.background)?p.background:staticFile(p.background)} style={{position:'absolute',left:0,top:0,width:`${p.backgroundWidth/960*100}%`,height:'100%',objectFit:'fill'}}/></div></div>
  {ready&&<svg viewBox="0 0 960 540" width="100%" height="100%" style={{position:'absolute',inset:0}}><g transform={`translate(${tx} ${ty}) scale(${s})`}>
    <ellipse cx={479.5} cy={278.5} rx={435.5} ry={231.5} fill="none" stroke={p.stampColor} strokeWidth={1.05} opacity={smooth(f,225,249)*.48}/>
    <path d={PATH} pathLength={PATH_LENGTH} fill="none" stroke={p.lineColor} strokeWidth={1.35} strokeLinecap="butt" strokeLinejoin="round" strokeDasharray={`${progress} ${PATH_LENGTH+1}`} opacity={f>=8?1:0}/>
    {elements.dots.map(([x,y,start],i)=>{const growth=smooth(f,start,start+7);return <circle key={i} cx={x} cy={y} r={3.18*growth} fill={p.dotColor}/>})}
    {labels.map((l,i)=>{const opacity=smooth(f,l.start-1,l.start+5);const dy=-4*(1-smooth(f,l.start,l.lock));const color=i===11?interpolateColors(f,[296,309],[p.textColor,p.finalColor]):p.textColor;return <g key={i} opacity={opacity} transform={`translate(0 ${dy})`}><FitText text={names[i]??l.label} x={l.x} y={l.y} w={l.w} h={l.h} color={color}/>{i===8||i===9?<FitText text="、" x={l.x+l.w+1} y={l.y+30} w={10} h={10} color={color}/>:null}</g>})}
    {elements.stamps.map((e,i)=>{const opacity=smooth(f,e.start,e.start+4),q=mix(f,e.start,e.lock),scale=1+.1*Math.sin(q*Math.PI)*(1-q),dy=-4*(1-smooth(f,e.start,e.lock));return <g key={i} opacity={opacity*.94} transform={`translate(${e.x} ${e.y+dy}) rotate(${e.rotate}) scale(${scale})`}><g mask="url(#inkWear)" filter="url(#stampSoft)"><rect x={-27.25} y={-16.75} width={54.5} height={33.5} fill="none" stroke={p.stampColor} strokeWidth={1.6}/><FitText text={p.stampText} x={-25.5} y={-15} w={51} h={30} color={p.stampColor} font="ReplicaStamp"/></g></g>})}
    <g opacity={smooth(f,229,244)} transform={`translate(0 ${-8*(1-smooth(f,229,246))})`}><FitText text={p.heading} x={368} y={106} w={218} h={59} color={p.textColor}/></g>
   </g></svg>}
 </AbsoluteFill>;
};
