import measurements from './measurements.json';
export type Point = [number,number];
export type Quad = [Point,Point,Point,Point];
export type GeometryOptions={layerCount:number;depthSpacing:number;perspective:number;stackStartFrame:number;stackEndFrame:number};
export const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const sample=(f:number)=>{const k=clamp(f,0,120),a=measurements[Math.floor(k)],b=measurements[Math.min(120,Math.floor(k)+1)],t=k-Math.floor(k);return {quad:a.quad.map((p,i)=>p.map((v,j)=>mix(v,b.quad[i][j],t))) as Quad,depth:a.depth.map((v,i)=>mix(v,b.depth[i],t)),shellOpacity:mix(a.shellOpacity,b.shellOpacity,t),labelOpacity:mix(a.labelOpacity,b.labelOpacity,t)};};
/** Unit square -> measured quadrilateral. CSS and Trace share the same projective map. */
export const homography=(q:Quad)=>{const [[x0,y0],[x1,y1],[x2,y2],[x3,y3]]=q;const dx1=x1-x2,dx2=x3-x2,dx3=x0-x1+x2-x3,dy1=y1-y2,dy2=y3-y2,dy3=y0-y1+y2-y3,den=dx1*dy2-dx2*dy1;const g=(dx3*dy2-dx2*dy3)/den,h=(dx1*dy3-dx3*dy1)/den;return [x1-x0+g*x1,x3-x0+h*x3,x0,y1-y0+g*y1,y3-y0+h*y3,y0,g,h,1];};
export const cssMatrix=(q:Quad,w=614,h=410)=>{const m=homography(q);return `matrix3d(${[m[0]/w,m[3]/w,0,m[6]/w,m[1]/h,m[4]/h,0,m[7]/h,0,0,1,0,m[2],m[5],0,1].join(',')})`;};
const center=(q:Quad):Point=>[q.reduce((n,p)=>n+p[0],0)/4,q.reduce((n,p)=>n+p[1],0)/4];
const endCenter=center(sample(120).quad);
const depthFrame=(f:number,start:number,end:number)=>{start=clamp(start,0,90);end=clamp(end,start+5,115);if(f<start)return start?f*19/start:19;if(f<=end)return 19+(f-start)*46/(end-start);return 65+(f-end)*55/(120-end);};
export const geometryAt=(f:number,o:GeometryOptions)=>{const state=sample(f);const measured=state.quad,c=center(measured),p=clamp(o.perspective,0,1.8);const w=((measured[1][0]-measured[0][0])+(measured[2][0]-measured[3][0]))/2,h=((measured[3][1]-measured[0][1])+(measured[2][1]-measured[1][1]))/2;const flat:Quad=[[c[0]-w/2,c[1]-h/2],[c[0]+w/2,c[1]-h/2],[c[0]+w/2,c[1]+h/2],[c[0]-w/2,c[1]+h/2]];const front=flat.map((xy,i)=>xy.map((v,j)=>mix(v,measured[i][j],p))) as Quad;const H=homography(front);const V=[91.7060453+(c[0]-endCenter[0])*.06024124,37.2103846+(c[1]-endCenter[1])*.06024124,.06024124*p];const df=depthFrame(f,o.stackStartFrame,o.stackEndFrame);const dep=sample(df).depth;const n=Math.round(clamp(o.layerCount,1,12));const layers=Array.from({length:n},(_,i)=>{const d=i===0?0:(i<6?dep[i-1]:i*sample(df-1.5*(i-1)).depth[0])*clamp(o.depthSpacing,.2,2);const quad=[[0,0],[1,0],[1,1],[0,1]].map(([u,v])=>{const z=H[6]*u+H[7]*v+H[8]+V[2]*d;return [(H[0]*u+H[1]*v+H[2]+V[0]*d)/z,(H[3]*u+H[4]*v+H[5]+V[1]*d)/z] as Point;}) as Quad;return {index:i,depth:d,quad};});return {...state,front,center:c,layers};};
