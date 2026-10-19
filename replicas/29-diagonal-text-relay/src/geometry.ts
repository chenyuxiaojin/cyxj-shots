import {interpolate} from 'remotion';
import tracking from './tracking.json';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const referenceFrame=(frame:number,duration:number)=>Math.min(50,Math.max(0,frame/Math.max(1,duration-1)*50));
export const bandAt=(f:number,width=354,shear=218)=>{
  const x=interpolate(f,tracking.map(k=>k.f),tracking.map(k=>k.xTopLeft),clamp);
  return {x,width,shear,points:`${x},0 ${x+width},0 ${x+width-shear},540 ${x-shear},540`};
};
export const textBoxes=[{x:98,y:103,width:215,height:332},{x:446,y:104,width:204,height:332},{x:783,y:121,width:209,height:316}];
export const boxes=(_:number)=>textBoxes;
