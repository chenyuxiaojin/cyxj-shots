import React,{useEffect,useState} from 'react';
import {interpolate,Easing,staticFile,delayRender,continueRender} from 'remotion';
export const lerp=(f:number,frames:number[],values:number[])=>interpolate(f,frames,values,{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export const ease=(f:number,a:number,z:number)=>interpolate(f,[a,z],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.38,0,.18,1)});
export const asset=(p:string)=>/^https?:/.test(p)?p:staticFile(p);
export const Fonts=()=>{const[h]=useState(()=>delayRender('optional local fonts'));useEffect(()=>{Promise.all([["ReplicaSerif", "Songti SC Regular"], ["ReplicaSans", "Alibaba PuHuiTi 2 65 Medium"], ["ReplicaTitle", "Alibaba PuHuiTi 2 75 SemiBold"]].map(async([n,p])=>{try{const f=new FontFace(n,`local("${p}")`);await f.load();document.fonts.add(f)}catch{/* Browser fallback if local font is absent. */}})).finally(()=>continueRender(h))},[h]);return null};
export const Grain=({opacity=.12}:{opacity?:number})=><svg width="960" height="540" style={{position:'absolute',inset:0,pointerEvents:'none',opacity,mixBlendMode:'multiply'}}><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="19"/></filter><rect width="960" height="540" filter="url(#grain)"/></svg>;
