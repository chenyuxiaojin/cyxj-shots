import {people,state,sample} from './Scene';
export const boxes=(f:number)=>[...people.map(p=>{const s=state(p,f);return {x:s.x-31*s.s,y:s.y-12*s.s,width:62*s.s,height:140*s.s,label:`P${p.id}`}}),...['header','leftCard','rightCard'].map(k=>{const b=sample(k,f);return {x:b[0],y:b[1],width:b[2],height:b[3],label:k}})];
