import React from 'react';
import {AbsoluteFill,Img,useCurrentFrame,useVideoConfig} from 'remotion';
import {Fonts,Grain,asset,lerp,ease} from './common';
export type Props={durationSeconds:number;query:string;productName:string;englishName:string;supplier:string;model:string;startPrice:number;endPrice:number;currency:string;imageSrc:string;glow:string};
export const Scene:React.FC<Props>=(p)=>{
 const frame=useCurrentFrame(),{durationInFrames}=useVideoConfig();const f=frame*176/(durationInFrames-1);const move=ease(f,45,72);const panel=ease(f,49,72);const typing=Math.ceil(lerp(f,[17,39],[0,p.query.length]));const data=ease(f,68,89);
 const price=Math.round(lerp(f,[75,80,93,100,108,123,138],[0,p.startPrice,p.startPrice+.265306*(p.endPrice-p.startPrice),p.startPrice+.367347*(p.endPrice-p.startPrice),p.startPrice+.510204*(p.endPrice-p.startPrice),p.startPrice+.755102*(p.endPrice-p.startPrice),p.endPrice])/2500)*2500;
 const shadow=`0 0 2px #fff,inset 0 0 3px #d4e4ff,0 0 12px ${p.glow},0 0 30px ${p.glow}60`;
 return <AbsoluteFill style={{background:'radial-gradient(ellipse at 30% 60%,#0c1722 0%,#030909 55%,#020503 100%)',overflow:'hidden',fontFamily:'ReplicaSerif, Songti SC, serif',color:'#ddd'}}><Fonts/>
  <svg width="960" height="540" style={{position:'absolute',inset:0,opacity:.48}}><defs><pattern id="mesh" width="8" height="8" patternTransform="rotate(28)" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#52626b" opacity=".4"/><circle cx="6" cy="6" r=".65" fill="#37627a" opacity=".4"/></pattern></defs><rect width="960" height="540" fill="url(#mesh)"/>{Array.from({length:90},(_,i)=><circle key={i} cx={(i*197.3)%960} cy={(i*i*19.7)%540} r={i%6===0?1.2:.6} fill="#447082" opacity={.13+(i%4)*.06}/>)}</svg><Grain opacity={.12}/>
  <div style={{position:'absolute',left:lerp(f,[45,58,72],[235,181,150]),top:lerp(f,[45,58,72],[202,83,45]),transform:`scale(${lerp(f,[45,58,72],[1.45,1.09,1])})`,transformOrigin:'top left',width:343,height:52,borderRadius:32,border:'1px solid #91a8bf',boxShadow:shadow,opacity:ease(f,0,14),background:'linear-gradient(110deg,#0a0e10ef,#0d1214dc)'}}>
   <div style={{position:'absolute',left:30,top:9,fontSize:24,whiteSpace:'nowrap'}}>搜索：{p.query.slice(0,typing)}</div>
   <svg width="28" height="28" viewBox="0 0 28 28" style={{position:'absolute',right:28,top:11}}><circle cx="12" cy="12" r="8" fill="none" stroke="#eee" strokeWidth="1.6"/><path d="M18 18L25 25" stroke="#eee" strokeWidth="1.7"/></svg>
  </div>
  <div style={{position:'absolute',left:150,top:lerp(f,[49,58,72],[180,140,112]),width:620,height:350,borderRadius:52,border:'1px solid #8ea3b5',boxShadow:shadow,background:`rgba(3,6,7,${ease(f,65,88)*.88})`,opacity:panel,overflow:'hidden'}}>
   <div style={{opacity:data}}>
    <div style={{position:'absolute',left:54,top:32,fontSize:24,whiteSpace:'nowrap'}}>搜索结果：<span style={{textShadow:'0 0 7px white'}}>1家供应商</span></div>
    <div style={{position:'absolute',left:56,top:65,fontSize:16,whiteSpace:'nowrap'}}>SEARCH RESULTS: 1 SUPPLIER</div>
    <div style={{position:'absolute',left:425,top:22,width:140,height:73,borderRadius:42,boxShadow:`inset 0 0 14px ${p.glow}45,2px 0 2px #9caeb266,4px 0 12px ${p.glow}50`,textAlign:'center',fontSize:22,lineHeight:1.5}}>{p.supplier}<div>已认证供应商</div></div>
    <div style={{position:'absolute',left:305,right:10,top:104,height:1,background:'#59606066'}}/>
    <div style={{position:'absolute',left:32,top:98,width:228,height:220,borderRadius:58,background:'radial-gradient(at 40% 50%,#152026,#10151be0)',boxShadow:`inset -2px -1px 2px #a6bbc475,5px 0 20px ${p.glow}40`,opacity:ease(f,63,84)}}>
     <Img src={asset(p.imageSrc)} style={{position:'absolute',left:64,top:17,width:105,height:186,objectFit:'contain',mixBlendMode:'screen'}}/>
    </div>
    <div style={{position:'absolute',left:329,top:113,fontSize:24}}>{p.productName}</div>
    <div style={{position:'absolute',left:329,top:143,fontSize:16,whiteSpace:'nowrap'}}>{p.englishName}</div>
    <div style={{position:'absolute',left:329,top:191,fontSize:23}}>型号：　{p.model}</div>
    <div style={{position:'absolute',left:329,top:225,fontSize:18}}>MODEL:　 {p.model}</div>
    <div style={{position:'absolute',left:329,right:22,top:254,height:1,background:'#4b555566'}}/>
    <div style={{position:'absolute',left:329,top:267,fontSize:27,whiteSpace:'nowrap',opacity:ease(f,73,90)}}>标价: <span style={{display:'inline-block',transform:'scaleX(.73)',transformOrigin:'left center',fontSize:49,letterSpacing:-2,color:'#fafafa',textShadow:'0 0 5px #ffffff55'}}>{p.currency}{price.toFixed(2)}</span></div>
   </div>
  </div>
 </AbsoluteFill>
};
