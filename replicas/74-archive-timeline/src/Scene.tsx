import React from 'react';
import {AbsoluteFill,Img,useCurrentFrame,useVideoConfig} from 'remotion';
import defaults from '../props.json';
import {Fonts,Grain,asset,ease,lerp} from './common';
export const Scene=(p:typeof defaults)=>{
 const {width,durationInFrames}=useVideoConfig();const f=useCurrentFrame()*103/(durationInFrames-1);
 const x=lerp(f,[0,5,10,16,23,30,37,45,53,62,103],[1010,820,675,580,526,500,445,398,379,375,375]);
 const label=ease(f,32,43);const caption=f<7?p.captionIntro:f<29?p.captionMiddle:p.caption;
 return <AbsoluteFill style={{background:'#e3e6dc'}}><Fonts/><div style={{position:'absolute',width:960,height:540,transform:`scale(${width/960})`,transformOrigin:'0 0',overflow:'hidden',background:'radial-gradient(ellipse at 52% 53%,#e7efeb 10%,#e4e8df 50%,#d4cfc0 110%)'}}>
 <Img src={asset('media/keyboard-top.png')} style={{position:'absolute',left:0,top:0,width:330,height:114,opacity:.9}}/>
 <Img src={asset('media/keyboard-bottom.png')} style={{position:'absolute',left:640,top:428,width:320,height:42,opacity:.7}}/>
 <div style={{position:'absolute',left:0,top:90,width:120,height:450,opacity:.025,fontFamily:'Georgia',fontSize:8,lineHeight:1.5,overflow:'hidden',transform:'rotate(-1deg)'}}>{Array.from({length:34},(_,i)=><div key={i}>Industrial design / archive<br/>history of the personal computer</div>)}</div>
 <div style={{position:'absolute',right:18,top:70,width:130,opacity:.025,fontSize:8,lineHeight:1.5}}>Industrial Design Archive<br/>{Array.from({length:8},()=> 'Design history and development ').join(' ')}</div>
 <Img src={asset('media/portrait.png')} style={{position:'absolute',left:23,top:76,width:210,height:189,opacity:ease(f,10,24)*.88,mixBlendMode:'multiply'}}/>
 <div style={{position:'absolute',left:x-660,top:157,color:p.accent,opacity:.38,fontSize:42,fontWeight:700,fontFamily:'Georgia'}}>{p.firstYear}</div>
 <div style={{position:'absolute',left:x-385,top:157,color:p.accent,opacity:.38,fontSize:42,fontWeight:700,fontFamily:'Georgia'}}>{p.previousYear}</div>
 <div style={{position:'absolute',left:x-105,top:109,color:'transparent',background:`linear-gradient(${p.accent} 40%,${p.accent}18 90%)`,backgroundClip:'text',WebkitBackgroundClip:'text',WebkitTextStroke:`.25px ${p.accent}`,opacity:.85,fontSize:105,fontWeight:700,letterSpacing:-5,lineHeight:1,fontFamily:'Times New Roman,serif'}}>{p.year}</div>
 <svg width="960" height="540" style={{position:'absolute',inset:0}}><path d={`M${x-139},154 l13,14 -13,14z`} fill={p.accent} opacity=".75"/><path d="M0 208 C220 207 370 210 550 208 S800 209 960 208" fill="none" stroke="#313b32" strokeWidth="1.7"/></svg>
 <div style={{position:'absolute',left:x+497,top:157,color:p.accent,opacity:.3,fontSize:48,fontWeight:700,fontFamily:'Georgia'}}>{p.nextYear}</div>
 <div style={{position:'absolute',left:512,top:164,width:216,height:36,opacity:label,transform:`translateX(${(1-label)*100}px) rotate(-.4deg) scale(${.85+.15*label})`,clipPath:'polygon(0 12%,6% 3%,22% 7%,44% 4%,65% 8%,83% 4%,95% 8%,100% 18%,99% 88%,96% 96%,60% 95%,41% 100%,18% 93%,3% 98%)',background:p.accent,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'ReplicaSerif,Songti SC,serif',fontWeight:900,fontSize:20,color:'#171d14'}}>{p.label}</div>
 {p.cards.map((c,i)=>{const start=50+i*8;const t=ease(f,start,start+13);const y=i%2?300:234;return <div key={i} style={{position:'absolute',left:[47,190,336,483,629,776][i],top:y,width:[139,140,140,141,143,143][i],height:i%2?168:169,opacity:lerp(f,[start,start+4],[0,1]),transformOrigin:'center top',transform:`perspective(700px) rotateX(${(1-t)*78}deg) scaleY(${.24+.76*t})`,filter:`blur(${(1-t)*2}px) drop-shadow(2px 3px 2px #594b3d30)`}}><Img src={asset(c.imageSrc)} style={{width:'100%',height:'100%'}}/></div>})}
 <Grain opacity={.12}/><div style={{position:'absolute',left:0,top:0,width:960,height:540,boxShadow:'inset 0 0 7px #63553465',pointerEvents:'none'}}/>
 <div style={{position:'absolute',bottom:20,left:'50%',transform:'translateX(-50%)',whiteSpace:'nowrap',padding:'3px 12px 5px',borderRadius:5,background:'#252c25a8',color:'#fff',fontFamily:'ReplicaTitle,Arial,sans-serif',fontSize:32,lineHeight:1.3,fontWeight:800}}>{caption}</div>
 </div></AbsoluteFill>
};
