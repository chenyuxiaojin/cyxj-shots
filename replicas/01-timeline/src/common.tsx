import React, {useEffect,useState} from 'react';
import {interpolate,Easing,staticFile,delayRender,continueRender} from 'remotion';
export const lerp=(f:number,frames:number[],values:number[])=>interpolate(f,frames,values,{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export const ease=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.38,0,.18,1)});
export const asset=(p:string)=>/^https?:/.test(p)?p:staticFile(p);
export const Fonts=()=>{const[h]=useState(()=>delayRender('local fonts'));useEffect(()=>{Promise.all([['ReplicaSerif','Songti SC'],['ReplicaSans','Alibaba PuHuiTi 2.0']].map(async([n,p])=>{try {const f=new FontFace(n,`local("${p}")`);await f.load();document.fonts.add(f)} catch { /* Use the browser fallback when the optional local font is absent. */ }})).finally(()=>continueRender(h))},[h]);return null};
export const Grain=({opacity=.1}:{opacity?:number})=><svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',opacity,mixBlendMode:'soft-light'}}><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" seed="12"/></filter><rect width="100%" height="100%" filter="url(#grain)"/></svg>;
export const Grid=({color='rgba(80,80,80,.07)',step=25}:{color?:string;step?:number})=><div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(${color} 1px,transparent 1px),linear-gradient(90deg,${color} 1px,transparent 1px)`,backgroundSize:`${step}px ${step}px`,pointerEvents:'none'}}/>;
