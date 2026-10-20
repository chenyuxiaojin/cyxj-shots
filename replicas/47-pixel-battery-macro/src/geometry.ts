import tracks from './tracks.json';
export const clamp=(x:number,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const state=(f:number,start=1,end=32,threshold=20,motion=1)=>{const i=Math.min(65,Math.max(0,Math.floor(f+1e-6))),t=tracks.values[i],value=Math.round(start+(end-start)*(t-1)/31),mat=tracks.camera[i];return{value,fillWidth:clamp(Math.ceil(value/5)*12,0,240),colorState:value>threshold?'high':'low',matrix:[1+(mat[0][0]-1)*motion,mat[1][0]*motion,mat[0][1]*motion,1+(mat[1][1]-1)*motion,mat[0][2]*motion,mat[1][2]*motion]}};
export const plane=[1,.16,-.22,1,425,220];
export const point=(x:number,y:number)=>[425+x-.22*y,220+.16*x+y];
export const boxes=(f:number)=>[{id:'numeric',x:70,y:170,width:300,height:145},{id:'battery',x:399,y:216,width:333,height:168},{id:'bolt',x:760,y:280,width:82,height:100}];
