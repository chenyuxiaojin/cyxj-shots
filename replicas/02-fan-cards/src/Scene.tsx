import React from 'react';
import {AbsoluteFill,Img,useCurrentFrame,useVideoConfig} from 'remotion';
import {Fonts,Grid,Grain,asset,lerp,ease} from './common';
export type Props={durationSeconds:number;title:string;outlineTitle:string;english:string;background:string;introBackgroundSrc:string;cards:{title:string;subtitle:string;year:string;imageSrc:string}[]};
export const Scene:React.FC<Props>=({title,outlineTitle,english,background,introBackgroundSrc,cards})=>{
 const frame=useCurrentFrame(),{durationInFrames}=useVideoConfig();const f=frame*116/(durationInFrames-1),zoom=ease(f,44,72);const scale=1-.29*zoom;const step=16-6*zoom;const shift=lerp(f,[0,31,44],[-8,0,0]);const pivotY=2100-245*zoom;const fade=1-ease(f,98,116);
 return <AbsoluteFill style={{background,overflow:'hidden'}}><Fonts/>{introBackgroundSrc&&<Img src={asset(introBackgroundSrc)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>}
  <AbsoluteFill style={{background,clipPath:`circle(${lerp(f,[0,3,6,9,12,17],[0,340,720,1000,1150,1250])}px at 50% 50%)`}}>
   <Grid step={66} color="rgba(255,255,255,.24)"/><Grid step={13.2} color="rgba(255,255,255,.035)"/><Grain opacity={.12}/>
   <div style={{position:'absolute',inset:0,opacity:fade}}>
   {cards.map((c,i)=>{const angle=(i-(cards.length-1)/2)*step+shift;return <div key={i} style={{position:'absolute',left:960,top:pivotY,width:0,height:0,transform:`rotate(${angle}deg) scale(${scale})`,zIndex:20-i}}>
    <div style={{position:'absolute',left:-235,top:-1960,width:470,height:780,border:'3px solid #161616',borderRadius:27,boxSizing:'border-box',background:'#fafafa',overflow:'hidden'}}>
     <div style={{position:'absolute',top:30,left:8,right:8,textAlign:'center',fontFamily:'ReplicaSans, sans-serif',fontSize:48,lineHeight:1.1,whiteSpace:'nowrap'}}>{c.title}</div>
     <div style={{position:'absolute',top:92,left:5,right:5,textAlign:'center',fontFamily:'Arial',fontSize:20,color:'#aaa'}}>{c.subtitle}</div>
     <Img src={asset(c.imageSrc)} style={{position:'absolute',left:20,top:176,width:425,height:486,objectFit:'contain',mixBlendMode:'multiply'}}/>
     <div style={{position:'absolute',bottom:17,width:'100%',textAlign:'center',fontSize:20,fontFamily:'Arial',color:'#999',fontWeight:600}}>INVENTED IN {c.year}</div><Grain opacity={.08}/>
    </div>
   </div>})}
   </div>
   <div style={{position:'absolute',left:960,top:lerp(f,[44,72],[-110,190]),transform:'translateX(-50%)',opacity:ease(f,44,56)*(1-ease(f,100,116)),display:'flex',alignItems:'center',whiteSpace:'nowrap',zIndex:35}}>
    <div style={{fontFamily:'ReplicaSans, sans-serif',fontSize:140,WebkitTextStroke:'1.5px #444',color:'transparent',lineHeight:1}}>{outlineTitle}</div>
    <div><div style={{fontFamily:'ReplicaSans, sans-serif',fontSize:96,lineHeight:1.05,letterSpacing:-4}}>{title}</div><div style={{fontFamily:'Arial',fontSize:25,letterSpacing:9,textAlign:'center',marginTop:12}}>{english}</div></div>
   </div>
   <div style={{position:'absolute',left:0,right:0,top:900,bottom:0,background:`linear-gradient(transparent,${background} 50%)`,zIndex:40}}/>
  </AbsoluteFill>
 </AbsoluteFill>
};
