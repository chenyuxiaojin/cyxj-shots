import rows from './motion-track.json';
import {matrix,lerp,ease} from './common';
export const micMatrix=(f:number)=>matrix(f,rows);
export const titles=(f:number,i:number,focusIndex=3)=>{const poses=[[278,78],[520,113],[278,210],[520,271]],starts=[28,24,20,17],a=ease(f,starts[i],starts[i]+17),z=ease(f,98,125);return {x:(480+(poses[i][0]-480)*a)*(1-z)+(i===focusIndex?424:120-i*80)*z,y:(290+(poses[i][1]-290)*a)*(1-z)+(i===focusIndex?154:100+i*40)*z,size:88+(146-88)*z,opacity:a*(i===focusIndex?1:1-ease(f,108,117)),blur:lerp(f,[starts[i],starts[i]+15],[7,0])}};
