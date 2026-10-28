import React from 'react';
import {AbsoluteFill,Img,useCurrentFrame,useVideoConfig} from 'remotion';
import defaults from '../props.json';
import {Fonts,Grain,asset,ease,lerp} from './common';
export const Scene=(p:typeof defaults)=>{
 const {width,durationInFrames}=useVideoConfig();const f=useCurrentFrame()*198/(durationInFrames-1);
 const enter=ease(f,0,34),x=lerp(f,[0,8,15,22,32,42,75,110,150,198],[-940,-690,-440,-310,-190,-100,-84,-85,-85,-85]);
 const turn=lerp(f,[0,25,55,100,198],[0,1.8,3.4,3.4,3.4]);const py=lerp(f,[0,25,60,100,198],[116,116,116,116,116]);
 const textOpacity=lerp(f,[0,8,135,146,153,166,198],[0,1,1,0,0,1,1]);
 const q1=ease(f,77,102),q2=ease(f,108,132);
 return <AbsoluteFill style={{background:'#151515'}}><Fonts/><div style={{position:'absolute',width:960,height:540,transform:`scale(${width/960})`,transformOrigin:'0 0',overflow:'hidden',background:'linear-gradient(#131313,#202020 65%,#141414)'}}>
 <svg width="960" height="540" style={{position:'absolute',inset:0,opacity:.22}}><text x="90" y="45" fontSize="22" fontWeight="bold" fill="#050505">Revenue with Expenses (No New Acquisition)</text><text x="90" y="85" fontSize="16" fill="#020202">▣ MRR ($) by ▣ Month for ▣ MRR @ 6% churn, ▣ MRR @ 5% churn</text><path d="M193 145 C335 233 451 273 765 357" stroke="#001011" strokeWidth="3" fill="none"/><path d="M193 145 Q455 333 821 403" stroke="#140005" strokeWidth="3" fill="none"/><path d="M193 145 Q412 354 831 450" stroke="#141600" strokeWidth="3" fill="none"/></svg>
 <div style={{position:'absolute',left:x,top:py,width:808,height:540,transform:`rotate(${turn}deg)`,transformOrigin:'0 0',background:'#c8cdcb',borderRadius:11,border:`2px solid ${p.accent}`,boxShadow:`0 0 13px ${p.accent}90,0 0 5px ${p.accent}`,overflow:'hidden'}}>
 <div style={{position:'absolute',inset:0,background:'linear-gradient(120deg,#cbd0cf,#c2c8c7 55%,#ccd0cb)',opacity:.9}}/>
 <svg width="808" height="540" style={{position:'absolute',inset:0,opacity:.23}}><filter id="paper-noise"><feTurbulence type="fractalNoise" baseFrequency=".62" numOctaves="3" seed="13"/><feColorMatrix type="saturate" values="0"/></filter><rect width="808" height="540" filter="url(#paper-noise)"/></svg>
 <Img src={asset('media/paper-grain.png')} style={{position:'absolute',inset:0,width:808,height:540,opacity:.48,mixBlendMode:'soft-light'}}/><div style={{opacity:textOpacity}}><Img src={asset('media/hand.png')} style={{position:'absolute',left:85,top:316,width:140,height:110,mixBlendMode:'multiply'}}/>
 <Img src={asset('media/pen.png')} style={{position:'absolute',left:656,top:165,width:137,height:234,mixBlendMode:'multiply'}}/>
 <div style={{position:'absolute',left:168,top:64,width:478,height:59,background:p.accent,opacity:.85,clipPath:`inset(0 ${(1-ease(f,21,40))*100}% 0 0 round 9px)`}}/>
 <div style={{position:'absolute',left:174,top:62,fontFamily:'ReplicaSerif,Songti SC,serif',fontSize:43,lineHeight:'59px',whiteSpace:'nowrap',color:'#171812',letterSpacing:-2,transform:'scaleX(.8)',transformOrigin:'0 0'}}>{p.headline}</div>
 <div style={{position:'absolute',left:118,top:128,width:190*ease(f,35,52),height:2,background:'#222'}}/>
 {p.paragraph.map((s,i)=><div key={i} style={{position:'absolute',left:68,top:145+i*36,width:715,height:35}}>{i===1&&<span style={{position:'absolute',left:16,top:3,width:215*ease(f,62,80)*lerp(f,[135,146,166,198],[1,0,0,0]),height:25,background:p.accent,opacity:.85}}/>}<svg width="715" height="36" style={{position:'relative',zIndex:1}}><text x="357" y="25" textAnchor="middle" fill="#454b48" fontFamily="ReplicaSans,Arial,sans-serif" fontWeight="400" fontSize="22" textLength={Math.min([620,660,490,620][i],s.length*16)} lengthAdjust="spacingAndGlyphs">{s}</text></svg></div>)}
 </div></div>
 {[{text:p.quoteOne,t:q1,left:430,top:79,w:418,angle:3.4,start:77},{text:p.quoteTwo,t:q2,left:463,top:209,w:470,angle:3.4,start:108}].map((q,i)=><div key={i} style={{position:'absolute',left:q.left+(1-q.t)*(i?50:10),top:q.top+(1-q.t)*(i?-80:35),width:q.w,height:103,background:p.accent,color:'#10140c',opacity:q.t,transform:`rotate(${q.angle}deg) scale(${1+(1-q.t)*.55})`,transformOrigin:'0 0',filter:`blur(${(1-q.t)*1.4}px)`,fontFamily:'ReplicaSerif,Songti SC,serif',fontSize:84,lineHeight:'100px',letterSpacing:-5,whiteSpace:'nowrap'}}><div style={{transform:`scaleX(${i?.83:.85})`,transformOrigin:'left center',padding:'0 4px'}}>{q.text}</div></div>)}
 <Grain opacity={.1}/><div style={{position:'absolute',bottom:42,left:'50%',transform:'translateX(-50%) scaleX(.8)',whiteSpace:'nowrap',fontFamily:'ReplicaSerif,Songti SC,serif',fontSize:31,color:'#fff',textShadow:'1px 1px 2px #111,-1px -1px 2px #111'}}>{p.captions[f<75?0:f<135?1:f<184?2:3]}</div>
 </div></AbsoluteFill>
};
