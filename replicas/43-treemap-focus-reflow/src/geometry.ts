import data from './tracks.json';
import {sample} from './Scene';
export const boxes=(f:number)=>Object.entries(data.cells).flatMap(([id,a])=>{const b=sample(a,f);return b?[{x:b[0],y:b[1],width:b[2],height:b[3],label:id}]:[]});
