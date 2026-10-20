import camera from './camera.json';
export const lerp=(f:number,ks:number[],vs:number[])=>{if(f<=ks[0])return vs[0];for(let i=1;i<ks.length;i++){if(f<=ks[i]){const t=(f-ks[i-1])/(ks[i]-ks[i-1]);return vs[i-1]+(vs[i]-vs[i-1])*t;}}return vs[vs.length-1];};
export const cameraAt=(f:number)=>{const names=['a','b','c','d','x','y'] as const;return names.map(n=>lerp(f,camera.map(k=>k.f),camera.map(k=>k[n])));};
export const transformAt=(f:number)=>`matrix(${cameraAt(f).join(' ')})`;
export const elements=[
{id:'heading',x:445,y:108,width:377,height:32,startFrame:0,visibleFrame:5,lockFrame:0},
{id:'230 / first group',x:313,y:207,width:375,height:114,startFrame:0,visibleFrame:7,lockFrame:0},
{id:'790 / second group',x:609,y:290,width:374,height:114,startFrame:0,visibleFrame:12,lockFrame:0},
{id:'3060 / third group',x:372,y:452,width:537,height:143,startFrame:0,visibleFrame:22,lockFrame:0},
{id:'upper arc',x:621,y:218,width:208,height:68,startFrame:25,visibleFrame:29,lockFrame:48},
{id:'lower arc',x:499,y:330,width:228,height:199,startFrame:27,visibleFrame:31,lockFrame:48},
{id:'+243%',x:779,y:184,width:216,height:55,startFrame:25,visibleFrame:29,lockFrame:48},
{id:'+287%',x:275,y:430,width:211,height:57,startFrame:28,visibleFrame:33,lockFrame:48},
{id:'banknote upper',x:680,y:0,width:598,height:305,startFrame:0,visibleFrame:40,lockFrame:0},
{id:'banknote lower',x:0,y:415,width:590,height:302,startFrame:0,visibleFrame:45,lockFrame:0},
];

import background from './background.json';
export const backgroundAt=(f:number,side:'upper'|'lower')=>{const keys=background[side];return `matrix(${(['a','b','c','d','x','y'] as const).map(n=>lerp(f,keys.map(k=>k.f),keys.map(k=>k[n]))).join(' ')})`;};
