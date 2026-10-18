import {lerp} from './common';
export const panel=(f:number)=>({x:lerp(f,[0,30,60,90,118],[104,103,102,101,99]),y:lerp(f,[0,30,60,90,118],[55,53,51,49,48]),width:758,height:415});
export const grow=(f:number,i:number)=>i===0?lerp(f,[0,5,10,15,20,26],[0,0,.2064,.6673,.9067,1]):lerp(f,[0,33,40,45,50,55,60,65,75],[0,0,.1534,.482,.7089,.865,.9435,.984,1]);
export const boxes=(f:number)=>[panel(f),{x:345,y:403-11*grow(f,0),width:76,height:11*grow(f,0)},{x:540,y:403-202*grow(f,1),width:76,height:202*grow(f,1)}];
