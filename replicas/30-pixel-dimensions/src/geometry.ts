import rows from './monitor-tracks.json';
export const boxes=(f:number)=>{const r=rows[Math.max(0,Math.min(118,Math.round(f)))];return [{x:r.x,y:r.y,width:r.width,height:r.height,label:'monitor'},{x:310,y:125,width:340,height:38,label:'width'},{x:275,y:162,width:34,height:227,label:'height'},{x:578,y:186,width:241,height:57,label:'total'}]};
