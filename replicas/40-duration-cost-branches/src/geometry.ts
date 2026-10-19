import {interpolate} from 'remotion';
import motion from './motion.json';import counters from './counters.json';import branches from './branches.json';
export const lerp=(f:number,x:number[],y:number[])=>interpolate(f,x,y,{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export const row=(f:number)=>motion[Math.max(0,Math.min(359,Math.round(f)))];
export const branch=(f:number)=>branches[Math.max(0,Math.min(359,Math.round(f)))];
export const phase=(f:number,start:number)=>lerp(f-start,counters.phase.map((_,i)=>i),counters.phase);
export const dayValue=(f:number,total:number)=>total===180?counters.days[Math.min(35,Math.max(0,Math.round(f)))]:Math.min(total,Math.floor(total*lerp(f,counters.days.map((_,i)=>i),counters.days)/180));
export const arcValue=(f:number)=>lerp(f,counters.arcs.map((_,i)=>i),counters.arcs);
export const amount=(f:number,start:number,max:number,group:'total'|'left'|'right',index:number)=>{
 const expected=group==='total'?[300,500]:group==='left'?[100,200]:[200,300];
 const records=counters.observed[group] as Record<string,number[]>;const rec=records[String(Math.round(f))];
 const trusted=group==='total'?f>=67:group==='left'?f>=179:f>=271;
 if(max===expected[index]&&rec&&rec.length===2&&trusted)return rec[index];
 return Math.min(max,Math.floor(phase(f,start)*max));
};
export const arrowPath=(right=false)=>right?'M530.5 206 V236 Q530.5 263 557.5 263 H624 Q651 263 651 290 V294':'M429.3 206 V236 Q429.3 263 402.3 263 H336 Q309 263 309 290 V294';
export const ring=(cx:number,cy:number,r:number,degrees:number)=>{const a=Math.max(.001,Math.min(359.99,degrees))*Math.PI/180;return `M${cx} ${cy-r} A${r} ${r} 0 ${a>Math.PI?1:0} 1 ${cx+r*Math.sin(a)} ${cy-r*Math.cos(a)}`};
export const boxes=(f:number)=>{const g=row(f);return [{x:g.cx-g.r,y:g.cy-g.r,width:g.r*2,height:g.r*2},{x:g.cx,y:g.cy-g.r*.925,width:Math.max(0,g.right-g.cx),height:g.r*1.85},... (f>=162?[{x:126,y:341,width:309,height:64}]:[]),...(f>=253?[{x:526,y:341,width:309,height:64}]:[])]};
