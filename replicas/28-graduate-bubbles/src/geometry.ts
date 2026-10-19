import data from './tracks.json';
export const geom=(f:number,i:number)=>{const a=Math.floor(Math.max(0,Math.min(80,f))),b=Math.min(80,a+1),q=Math.max(0,Math.min(1,f-a));return data.tracks[i][a].map((n,k)=>n+(data.tracks[i][b][k]-n)*q)};
export const boxes=(f:number)=>data.tracks.map((_,i)=>{const [x,y,rx,ry]=geom(f,i);return {x:x-rx,y:y-ry,width:2*rx,height:2*ry}});
