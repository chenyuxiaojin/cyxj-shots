import camera from './camera.json';import labels from './labels.json';
export const frameCamera=(f:number)=>camera[Math.min(354,Math.max(0,Math.round(f)))];
export const boxes=(f:number)=>{const c=frameCamera(f);return labels.filter(l=>f>=l.start).map(l=>({x:l.x*c.s+c.tx,y:l.y*c.s+c.ty,width:l.w*c.s,height:l.h*c.s}));};
