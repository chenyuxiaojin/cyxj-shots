import {CARD_W,CARD_H,cardPose,introPose,haloPose} from './motion';
export const boxes=(f:number)=>{const poses=f<38?[introPose(f)]:Array.from({length:7},(_,c)=>cardPose(c,f));return poses.map(p=>({x:p[0],y:p[1],width:CARD_W,height:CARD_H,rx:13,transform:`rotate(${p[2]} ${p[0]} ${p[1]})`}));};
export {haloPose};
