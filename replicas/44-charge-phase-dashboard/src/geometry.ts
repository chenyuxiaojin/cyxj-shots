import {interpolate} from 'remotion';import data from './motion.json';import defaults from '../props.json';import profiles from './profiles.json';
export const lerp=(f:number,x:number[],y:number[])=>interpolate(f,x,y,{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export const row=(f:number)=>data[Math.max(0,Math.min(555,Math.round(f)))];
export const phase=(f:number)=>f<212?lerp(f,[65,97],[0,1]):f<421?lerp(f,[212,249],[1,2]):lerp(f,[421,480],[2,3]);
export const valueFactor=(f:number,i:number,values:number[][])=>{const a=phase(f),lo=Math.floor(a),hi=Math.ceil(a),mix=a-lo;return (values[lo]?.[i]??profiles[lo][i])/profiles[lo][i]*(1-mix)+(values[hi]?.[i]??profiles[hi][i])/profiles[hi][i]*mix};
export const percentage=(f:number,initial:number,ends:number[])=>{const v=row(f).percent;if(initial===defaults.initialPercent&&ends.every((n,i)=>n===defaults.stagePercents[i]))return v;const k=f<212?0:f<421?1:2;const a=k?defaults.stagePercents[k-1]:defaults.initialPercent,b=defaults.stagePercents[k],x=k?ends[k-1]:initial;return Math.round((x+(ends[k]-x)*(v-a)/(b-a))*10)/10};
export const shade=(hex:string,n:number)=>{const x=hex.replace('#','');return '#'+[0,2,4].map(i=>Math.round(parseInt(x.slice(i,i+2),16)*n).toString(16).padStart(2,'0')).join('')};
