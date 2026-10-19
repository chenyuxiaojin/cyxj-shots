import tracks from './circle-tracks.json';
export const boxes=(f:number)=>{const i=Math.max(0,Math.min(199,Math.round(f)));return [tracks.main[i],tracks.small[i]].map(([x,y,r])=>({x:x-r,y:y-r,width:r*2,height:r*2}))};
