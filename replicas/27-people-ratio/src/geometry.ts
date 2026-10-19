import data from './tracks.json';
import camera from './camera.json';
export const clamp=(x:number,a=0,b=1)=>Math.min(b,Math.max(a,x));
export const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const curve=(f:number,ks:number[][]):number[]=>{if(f<=ks[0][0])return ks[0].slice(1);for(let i=1;i<ks.length;i++){if(f<=ks[i][0]){const p=(f-ks[i-1][0])/(ks[i][0]-ks[i-1][0]);return ks[i].slice(1).map((v,k)=>mix(ks[i-1][k+1],v,p))}}return ks[ks.length-1].slice(1)};
export const cameraAt=(f:number)=>f<90?[mix(0,-2,clamp((f-58)/32)),mix(0,2,clamp((f-58)/32))]:curve(f,camera);
export const tracks=data;
export const pose=(t:typeof data[number],f:number)=>{const ks=t.keys;const first=ks[0],last=ks[ks.length-1];if(f<first[0]){const d=first[0]-f,n=ks[1]||first;return {x:first[1]-(n[1]-first[1])*d,y:first[2]-(n[2]-first[2])*d,brightness:first[3],opacity:clamp(1-d/2)}}if(f>last[0]){const n=ks[ks.length-2]||last,d=f-last[0];return {x:last[1]+(last[1]-n[1])*d,y:last[2]+(last[2]-n[2])*d,brightness:last[3],opacity:1}}const [x,y,brightness]=curve(f,ks);return {x,y,brightness,opacity:1}};
export const boxes=(f:number)=>[0,1].map(group=>{const pts=tracks.filter(t=>t.group===group).map(t=>pose(t,f)).filter(t=>t.opacity>.5);if(!pts.length)return{x:0,y:0,width:0,height:0};const x=Math.min(...pts.map(t=>t.x))-20,y=Math.min(...pts.map(t=>t.y))-13;return{x,y,width:Math.max(...pts.map(t=>t.x))+20-x,height:Math.max(...pts.map(t=>t.y))+13-y}});
