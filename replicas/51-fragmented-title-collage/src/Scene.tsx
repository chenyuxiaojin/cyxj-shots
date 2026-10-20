import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig,delayRender,continueRender} from 'remotion';
import measured from './measurements.json';
import glyphs from './glyphs.json';
import defaults from '../props.json';
import visibility from './visibility.json';
import brushPaths from './brush-paths.json';
export type Props=typeof defaults & {glyphMode?:string;headlineWidth?:number;accentStart?:number;accentEnd?:number;paperGrid?:boolean;};
const clamp=(v:number,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(f:number,a:number,b:number,c:number,d:number)=>c+(d-c)*clamp((f-a)/(b-a));
const poly=(coef:number[],t:number)=>coef.reduce((v,c)=>v*t+c,0);
export const camera=(f:number)=>{const t=clamp(f/155);return {scale:poly(measured.cameraCoefficients.scale,t),tx:poly(measured.cameraCoefficients.tx,t),ty:poly(measured.cameraCoefficients.ty,t)};};
export const referenceFrame=(f:number,n:number)=>f*167/Math.max(1,n-1);
const Fonts=()=>{const[h]=useState(()=>delayRender('local system fonts'));useEffect(()=>{Promise.all([document.fonts.load('20px "Songti SC"'),document.fonts.load('20px "Imperial Script"'),document.fonts.ready]).finally(()=>continueRender(h));},[h]);return null;};
const GlyphTitle=({headline,inkColor,mode,width}:{headline:string;inkColor:string;mode:string;width:number})=>{
 const chars=[...headline];const allMatch=mode==='matched'&&chars.every(c=>c in glyphs);
 if(!allMatch)return <text x={270} y={294} fill={inkColor} fontFamily="Songti SC, SimSun, serif" fontSize={200} textLength={width} lengthAdjust="spacingAndGlyphs" transform="translate(0 -58) scale(1 1.2)">{headline}</text>;
 const gs=chars.map(c=>glyphs[c as keyof typeof glyphs]);const total=gs.reduce((n,g)=>n+g.width,0);let pos=0;
 return <g transform={`translate(270 74) scale(${width/total} 1)`}>{gs.map((g,i)=>{const x=pos;pos+=g.width;return <path key={i} d={g.path} transform={`translate(${x} 0)`} fill={inkColor} fillRule="evenodd"/>;})}</g>;
};
const FictionPeople=({color}:{color:string})=><g>
 <g transform="translate(235 258)"><path d="M-10 340 L0 145 Q25 92 62 82 Q117 95 149 157 L182 323" fill="#f7f5ed" stroke={color} strokeWidth="3"/><circle cx="65" cy="37" r="46" fill="#bcbdb7"/><path d="M18 133L63 100L108 143L91 176L77 144L72 329L53 337L48 142L33 173Z" fill={color}/></g>
 <g transform="translate(873 244)"><path d="M-150 353L-30 200L24 102L104 102L163 291L202 369L20 397L-72 389" fill="#f7f5ed" stroke={color} strokeWidth="3"/><circle cx="65" cy="35" r="49" fill="#bcbdb7"/><path d="M16 123L60 95L111 119L89 161L76 141L62 349L41 349L44 139L34 165Z" fill={color}/><path d="M-166 352Q-142 318 -111 343L-130 378L-169 381Z" fill={color}/><path d="M-141 350L-128 294" stroke="#999" strokeWidth="8"/></g>
 </g>;
const FictionDesk=({color}:{color:string})=><g><path d="M0 639L600 540L1278 666L1278 770H0Z" fill={color}/><path d="M300 667L702 581L969 652L533 759Z" fill="#141a20" stroke="#677277" strokeWidth="4"/><path d="M0 410L145 430L205 748H0Z" fill="#c4ced1" stroke="#637076" strokeWidth="20"/><path d="M1260 294L1278 720H1109Z" fill="#1d242b"/></g>;
function seeded(i:number){return ((Math.sin(i*127.1+19.3)*43758.5453)%1+1)%1;}
const Brush=({f,color,start,end}:{f:number;color:string;start:number;end:number})=>{
 const prog=1-Math.pow(1-clamp((f-start)/(end-start)),2.45);const edge=652+420*prog;
 return <g clipPath="url(#brushReveal)"><defs><clipPath id="brushReveal"><rect x="645" y="230" width={Math.max(0,edge-645)} height="100"/></clipPath></defs>
 {brushPaths.map((b,i)=><path key={i} d={b.path} fill={color} opacity={b.opacity} fillRule="evenodd"/>)}{Array.from({length:45},(_,i)=><path key={`fiber-${i}`} d={`M${663+seeded(i+4)*340} ${255+seeded(i+10)*55} l${4+seeded(i+23)*39} ${seeded(i+77)*2-1}`} stroke="#f4d0a7" strokeWidth={.3+seeded(i+12)*.5} opacity=".4"/>)}
 </g>;
};
const Paper=({color,grid}:{color:string;grid:boolean})=><>
 <rect width="1278" height="720" fill={color}/><rect width="1278" height="720" fill="url(#paperShade)"/>
 {grid&&<g opacity=".63" fill="none" mask="url(#gridFade)">{Array.from({length:42},(_,i)=>{const x=70+i*35.5;return <path key={`x${i}`} d={`M${x} -120L${x-2} 900`} stroke="#bfc0bf" strokeWidth={i%5===0?2.2:1.1} opacity={i%5===0?.55:.42}/>;})}{Array.from({length:28},(_,i)=>{const y=16+i*35.5;return <path key={`y${i}`} d={`M-200 ${y}Q640 ${y+2} 1500 ${y}`} stroke="#bfc0bf" strokeWidth={i%5===2?2.2:1.1} opacity={i%5===2?.55:.42}/>;})}</g>}
 <rect width="1278" height="720" filter="url(#grain)" opacity=".05" style={{mixBlendMode:'multiply'}}/>
 </>;
export const Scene:React.FC<Props>=(incoming)=>{
 const p={...defaults,...incoming};const frame=useCurrentFrame();const {durationInFrames}=useVideoConfig();const f=referenceFrame(frame,durationInFrames);const cam=camera(f);const width=p.headlineWidth??755;
 const ref=measured.reveal;const fi=Math.floor(clamp(f,0,49));const frac=f-fi;const vals=ref[fi].map((v,i)=>f>=49?1:v+(ref[Math.min(fi+1,49)][i]-v)*frac);
 const cap=p.captions.find(c=>f>=c.start&&f<=c.end);const src=p.assetMode==='source';
 return <AbsoluteFill style={{background:p.paperColor}}><Fonts/><svg key={frame} viewBox="0 0 1278 720" width="1920" height="1080" style={{position:'absolute',inset:0}}>
 <defs>
 <linearGradient id="gridFadeGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="black"/><stop offset=".18" stopColor="white"/><stop offset="1" stopColor="white"/></linearGradient><mask id="gridFade"><rect width="1278" height="720" fill="url(#gridFadeGradient)"/></mask>
 <linearGradient id="paperShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#747471" stopOpacity=".78"/><stop offset=".22" stopColor="#fff" stopOpacity="0"/><stop offset=".58" stopColor="#8f9299" stopOpacity=".18"/><stop offset="1" stopColor="#1a1d27" stopOpacity=".24"/></linearGradient>
 <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".64" numOctaves="3" seed="11"/></filter>
 <filter id="soft"><feGaussianBlur stdDeviation="1.1"/></filter><filter id="blurShadow"><feGaussianBlur stdDeviation="3.8"/></filter>
 <filter id="maskBlur"><feGaussianBlur stdDeviation="2.3"/></filter>
 <filter id="foregroundBlur"><feGaussianBlur stdDeviation={lerp(f,0,90,7,0)}/></filter>
 <filter id="sourceBlur"><feGaussianBlur stdDeviation={lerp(f,0,65,.65,0)}/></filter>
 <linearGradient id="bottomDepth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#222839" stopOpacity="0"/><stop offset="1" stopColor="#222839" stopOpacity="1"/></linearGradient>
 <linearGradient id="lensTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#72726e" stopOpacity=".18"/><stop offset="1" stopColor="#72726e" stopOpacity="0"/></linearGradient>
 <mask id="titleReveal" maskUnits="userSpaceOnUse" x="200" y="20" width="900" height="370"><g filter="url(#maskBlur)">{visibility.frames[Math.min(60,Math.floor(f))].map((v,i)=>{const next=visibility.frames[Math.min(60,Math.floor(f)+1)][i];const alpha=f>=60?1:v+(next-v)*(f%1);return <rect key={i} x={visibility.x+i%visibility.cols*visibility.width/visibility.cols} y={visibility.y+Math.floor(i/visibility.cols)*visibility.height/visibility.rows} width={visibility.width/visibility.cols+.3} height={visibility.height/visibility.rows+.3} fill="white" opacity={alpha}/>;})}</g></mask>
 <g id="titleContent"><GlyphTitle headline={p.headline} inkColor={p.inkColor} mode={p.glyphMode??'matched'} width={width}/></g><g id="englishContent"><text x="264" y="112" fontSize="78" textLength="321" lengthAdjust="spacingAndGlyphs" fontFamily="Imperial Script, Snell Roundhand, cursive" fill={p.subtitleColor} opacity=".75">{p.subtitle}</text></g>
 </defs>
 <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.scale})`}>
 <Paper color={p.paperColor} grid={p.paperGrid!==false}/>
 {src?<g filter="url(#sourceBlur)"><image href={staticFile('media/left-person.png')} x="215" y="236" width="264" height="360"/><image href={staticFile('media/right-person.png')} x="651" y="214" width="498" height="435" /></g>:<FictionPeople color={p.inkColor}/>}
 <Brush f={f} color={p.accentColor} start={p.accentStart??68} end={p.accentEnd??126}/>
 <g opacity={lerp(f,9,30,0,1)}><use href="#englishContent" filter="url(#soft)"/></g>
 <g mask="url(#titleReveal)"><use href="#titleContent" transform="translate(4 7)" filter="url(#blurShadow)" opacity=".28"/><use href="#titleContent" filter="url(#soft)"/></g>
 {src?<image filter="url(#foregroundBlur)" href={staticFile('media/desk-foreground.png')} x="0" y="284" width="1278" height="436"/>:<FictionDesk color={p.inkColor}/>}
 {src&&<image href={staticFile('media/right-person.png')} x="651" y="214" width="498" height="435" mask="url(#handsOnly)" filter="url(#foregroundBlur)"/>}
 <defs><clipPath id="upperBody"><rect x="650" y="0" width="500" height="490"/></clipPath><linearGradient id="handFade" x1="0" y1="480" x2="0" y2="520" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="black"/><stop offset="1" stopColor="white"/></linearGradient><mask id="handsOnly"><rect x="650" y="480" width="500" height="175" fill="url(#handFade)"/></mask></defs>
 </g>
 <rect width="1278" height="150" fill="url(#lensTop)"/><rect x="0" y="450" width="1278" height="270" fill="url(#bottomDepth)" opacity={lerp(f,0,95,.44,0)}/>
 {p.showCaptions&&cap&&<text x="639" y="650" textAnchor="middle" fontFamily="PingFang SC, Arial, sans-serif" fontSize="37" textLength={cap.text.length*30} lengthAdjust="spacingAndGlyphs" fill="#fff" stroke="#202020" strokeWidth=".45" paintOrder="stroke" style={{filter:'drop-shadow(1px 2px 2px #222)'}}>{cap.text}</text>}
 </svg></AbsoluteFill>;

};
