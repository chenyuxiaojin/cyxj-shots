import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {Fonts,asset,lerp} from './common';
import {bandAt,referenceFrame} from './geometry';
import defaults from '../props.json';
type Props=typeof defaults;
/** The source is one traveling mask over three stationary glyphs, not three entrances. */
const Background:React.FC<{f:number,p:Props}>=({f,p})=>{
  const product=p.backgroundMode==='product-camera';
  const dissolve=product?lerp(f,[14,20],[0,1]):lerp(f,[14,25],[0,1]);
  const zoom=product?lerp(f,[14,18,20,23,26,30,36,44],[3,2.7,2.2,1.55,1.32,1.12,1.025,1]):1;
  const pivotY=285;
  return <g clipPath="url(#imageBounds)">
    <image href={asset(p.backgroundStart)} x="0" y="0" width="960" height="540" preserveAspectRatio="none"/>
    <g opacity={dissolve} transform={`translate(480 ${pivotY}) scale(${zoom}) translate(-480 ${-pivotY})`}>
      <image href={asset(p.backgroundEnd)} x="0" y="0" width="960" height="540" preserveAspectRatio="none"/>
    </g>
  </g>;
};
export const Scene:React.FC<Props>=(p)=>{
  const frame=useCurrentFrame();const {durationInFrames}=useVideoConfig();
  const f=referenceFrame(frame,durationInFrames);const band=bandAt(f,p.bandWidth,p.bandShear);
  // Songti SC 360px has ink y=-277..55 relative to the baseline.
  // A fixed baseline 380 gives the measured y=103..435, with x compression only.
  const positions=[{x:89,scaleX:.66},{x:430,scaleX:.67},{x:772,scaleX:.67}];
  const top=p.showLetterbox?54:0;const sy=p.showLetterbox?.8:1;
  return <AbsoluteFill style={{background:'#000'}}><Fonts/>
    <svg width="100%" height="100%" viewBox="0 0 960 540" style={{overflow:'hidden'}}>
      <defs><clipPath id="imageBounds"><rect width="960" height="540"/></clipPath><clipPath id="frameBounds"><rect width="960" height="540"/></clipPath><mask id="diagonalWindow" maskUnits="userSpaceOnUse" x="0" y="0" width="960" height="540"><polygon points={band.points} fill="white"/></mask><filter id="textShadow" x="-30%" y="-20%" width="160%" height="150%"><feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity=".56"/></filter></defs>
      <g clipPath="url(#frameBounds)">
        <rect width="960" height="540" fill="black"/>
        <g transform={`translate(0 ${top}) scale(1 ${sy})`}><Background f={f} p={p}/></g>
        <g mask="url(#diagonalWindow)">
          <Background f={f} p={p}/>
          {positions.map((pos,i)=><g key={i} transform={`translate(${pos.x} 0) scale(${pos.scaleX} 1)`}>
            <text x="0" y="380" fontFamily="ReplicaSerif" fontSize="360" fill={p.textColor} filter="url(#textShadow)">{p.words[i]??''}</text>
          </g>)}
        </g>
      </g>
    </svg>
  </AbsoluteFill>;
};
