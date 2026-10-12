import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig} from 'remotion';
import {Fonts,Grain,Grid,asset,lerp,ease} from './common';
import tracks from './tracks.json';

export type Props={durationSeconds:number;accent:string;cards:{year:string;kicker:string;headline:string;english:string;portraitSrc:string}[];summary:string};
const pose=(i:number,f:number)=>{const keys=tracks[i];return [1,2,3,4,5].map(col=>lerp(f,keys.map(k=>k[0]),keys.map(k=>k[col])))};
export const Scene:React.FC<Props>=({accent,cards,summary})=>{
 const frame=useCurrentFrame(),{durationInFrames}=useVideoConfig();const f=15+frame*301/(durationInFrames-1);
 return <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 43%,#292929 0%,#242424 44%,#090909 89%)',overflow:'hidden'}}>
  <Fonts/><Grain opacity={.19}/>
  <svg width="1278" height="720" style={{position:'absolute',inset:0}}><path d="M327 460 Q638 679 951 463" fill="none" stroke={accent} strokeWidth="3.2" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ease(f,213,246)} opacity={ease(f,213,220)}/></svg>
  {cards.slice(0,3).map((c,i)=>{const[cx,cy,w,h,r]=pose(i,f);const start=[39,65,103][i];const yearStart=[139,161,188][i];return <div key={i} style={{position:'absolute',left:cx,top:cy,width:640,height:372,transform:`translate(-50%,-50%) rotate(${r}deg) scale(${w/640},${h/372})`,opacity:ease(f,start,start+7),zIndex:i===1?3:2,filter:`blur(${lerp(f,[start,start+17],[7,0])}px)`}}>
   <div style={{position:'absolute',inset:0,borderRadius:13,overflow:'hidden',background:'linear-gradient(0deg,#999 0%,#d6d6d3 12%,#ededeb 47%,#ddd 81%,#898989 100%)',boxShadow:'0 1px 2px 2px #555,0 4px 8px #1118'}}>
    <Grid step={28} color="rgba(65,70,65,.055)"/><Grid step={7} color="rgba(70,75,70,.013)"/>
    <Img src={asset(c.portraitSrc)} style={{position:'absolute',inset:0,width:640,height:372}}/>
    <div style={{position:'absolute',left:232,top:78,height:80,width:Math.min(324,c.kicker.length*51),background:accent,transform:'rotate(-1deg)'}}/>
    <div style={{position:'absolute',left:236,top:66,fontFamily:'ReplicaSerif, Songti SC, serif',fontSize:67,lineHeight:1.4,whiteSpace:'nowrap',transform:'scaleX(.79)',transformOrigin:'left center',letterSpacing:-3,color:'#17140e'}}>{c.kicker}</div>
    <div style={{position:'absolute',left:465,top:130,fontFamily:'ReplicaSerif, Songti SC, serif',fontSize:26,letterSpacing:-2,color:'#74766e',whiteSpace:'nowrap',transform:'scaleX(.75)',transformOrigin:'left'}}>{c.english}</div>
    <div style={{position:'absolute',left:224,top:172,fontFamily:'ReplicaSerif, Songti SC, serif',fontSize:i===0?125:109,lineHeight:1,letterSpacing:-8,whiteSpace:'nowrap',transform:`scaleX(${i===0?.83:.72})`,transformOrigin:'left center',color:'#181a15'}}>{c.headline}</div>
    <svg width="640" height="372" style={{position:'absolute',inset:0}}><path d="M422 277 L609 258 M438 284 L611 267 M456 291 L613 279" stroke={accent} strokeWidth="3" opacity=".8"/></svg>
    <Grain opacity={.13}/><div style={{position:'absolute',inset:0,boxShadow:'inset 0 1px 30px #1114',borderRadius:13,border:'1px solid #ddd6'}}/>
   </div>
   <div style={{position:'absolute',left:'50%',bottom:'calc(100% + 18px)',transform:`translateX(-50%) translateY(${lerp(f,[yearStart,yearStart+13],[28,0])}px) scaleX(.74)`,opacity:ease(f,yearStart,yearStart+13),filter:`blur(${lerp(f,[yearStart,yearStart+13],[8,0])}px)`,background:accent,color:'#17120b',fontFamily:'ReplicaSerif, Songti SC, serif',fontSize:144,lineHeight:.88,padding:'0 10px 7px',letterSpacing:-9,whiteSpace:'nowrap',boxShadow:'0 0 8px #e3833655'}}>{c.year}</div>
  </div>})}
  <div style={{position:'absolute',left:640,top:lerp(f,[247,275],[566,511]),transform:'translateX(-50%) scaleX(.67)',opacity:ease(f,247,270),filter:`blur(${lerp(f,[247,275],[9,0])}px)`,background:accent,padding:'1px 8px 6px',fontFamily:'ReplicaSerif, Songti SC, serif',fontSize:62,lineHeight:1.25,whiteSpace:'nowrap',color:'#24160d',boxShadow:'0 0 7px #e38a3544'}}>{summary}</div>
 </AbsoluteFill>
};

export const Tracing=()=>{const f=15+useCurrentFrame();return <AbsoluteFill>{[0,1,2].map(i=>{const[cx,cy,w,h,r]=pose(i,f);return <div key={i} style={{position:'absolute',left:cx,top:cy,width:w,height:h,transform:`translate(-50%,-50%) rotate(${r}deg)`,border:`3px solid ${['red','cyan','yellow'][i]}`,opacity:f>tracks[i][0][0]?1:0}}/>})}</AbsoluteFill>};
