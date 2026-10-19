import tracks from './tracks.json';
export const clamp=(x:number,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const curve=(f:number,rows:number[][])=>{if(f<=rows[0][0])return rows[0].slice(1);for(let i=1;i<rows.length;i++)if(f<=rows[i][0]){const t=(f-rows[i-1][0])/(rows[i][0]-rows[i-1][0]);return rows[i].slice(1).map((n,j)=>mix(rows[i-1][j+1],n,t));}return rows[rows.length-1].slice(1)};
export const state=(f:number)=>{
 const [scale,rotate,tx,ty,marker,axisEnd,px,py,pw,ph]=curve(f,tracks);
 const compact=clamp((694-marker)/76)*(f>130?1:0);
 const topY=curve(f,[[0,283],[254,283],[258,281],[264,270],[270,261],[276,257],[282,253],[288,252],[300,250],[312,250]])[0];
 const firstReveal=curve(f,[[68,0],[70,1],[72,5],[75,24],[80,66],[84,100],[90,135],[96,154],[100,161],[106,167],[112,168]])[0];
 const firstWidth=Math.min(firstReveal,mix(168,119,compact));
 const secondWidth=curve(f,[[134,0],[136,3],[138,10],[140,18],[144,44],[150,80],[156,101],[162,112],[168,118],[174,119]])[0];
 const lowerWidth=curve(f,[[253,0],[255,2],[258,42],[261,132],[264,237],[267,326],[270,393],[276,471],[282,518],[288,548],[294,568],[300,580],[306,586],[312,588]])[0];
 const angle=rotate*Math.PI/180;const matrix=[scale*Math.cos(angle),scale*Math.sin(angle),-scale*Math.sin(angle),scale*Math.cos(angle),tx,ty];
 return {matrix,scale,rotate,marker,axisEnd,photo:{x:px,y:py,w:pw,h:ph},topY,firstWidth,secondWidth,lowerWidth,fontSize:mix(20,16,compact),firstX:marker+3,secondX:marker+3+mix(168,119,compact)+5,annotationProgress:curve(f,[[176,0],[180,.041],[184,.30],[188,.593],[192,.775],[198,.92],[203,.96],[210,1]])[0],annotationOpacity:curve(f,[[176,0],[180,1],[248,1],[254,0]])[0]};
};
export const transformPoint=(m:number[],x:number,y:number)=>({x:m[0]*x+m[2]*y+m[4],y:m[1]*x+m[3]*y+m[5]});
export const boxes=(f:number)=>{const s=state(f),items=[{id:'title',x:44,y:24,width:380,height:94},{id:'building',x:s.photo.x,y:s.photo.y,width:s.photo.w,height:s.photo.h},{id:'wait',x:276,y:s.topY,width:Math.max(0,s.marker-280),height:33},{id:'research',x:s.firstX,y:s.topY,width:s.firstWidth,height:33},{id:'trial',x:s.secondX,y:s.topY,width:s.secondWidth,height:33},{id:'total',x:276,y:s.topY+65,width:s.lowerWidth,height:33},{id:'milestone',x:s.marker-60,y:119,width:67,height:251}];return items.filter(b=>b.width>.5).map(b=>({...b,corners:[[b.x,b.y],[b.x+b.width,b.y],[b.x+b.width,b.y+b.height],[b.x,b.y+b.height]].map(([x,y])=>transformPoint(s.matrix,x,y))}))};
