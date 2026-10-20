import tracks from './tracks.json';
export const sample=(f:number,rows:number[][],column:number)=>{if(f<=rows[0][0])return rows[0][column];for(let i=1;i<rows.length;i++){if(f<=rows[i][0]){const a=rows[i-1],b=rows[i],t=(f-a[0])/(b[0]-a[0]);return a[column]+(b[column]-a[column])*t;}}return rows[rows.length-1][column];};
export const keys=(f:number,fs:number[],vs:number[])=>sample(f,fs.map((n,i)=>[n,vs[i]]),1);
const heights=[[0,112],[2,144],[4,168],[6,188],[8,202],[10,216],[12,225],[14,235],[16,242],[18,248],[20,254],[24,262],[28,266],[32,267],[193,267]];
const extension=[[0,0],[61,0],[62,1],[63,5.6],[64,13.7],[65,26],[66,40.9],[67,61.3],[68,85.6],[69,112.9],[70,139.3],[71,158.2],[72,173],[73,184.4],[74,193.9],[75,200],[76,206.1],[77,209.8],[78,213.4],[79,215.5],[80,216.8],[82,217],[193,217]];
export const camera=(f:number)=>({x:sample(f,tracks.camera,1),y:sample(f,tracks.camera,2),s:sample(f,tracks.camera,3),h:sample(f,heights,1),extension:sample(f,extension,1)});
export const wordPose=(f:number,i:number,alternate=false)=>{const j=i%9,age=f-tracks.wordStarts[j],rows=tracks.words[j],x=sample(f,rows,1),y=sample(f,rows,2);return {x:alternate?(j%3-1)*73:x,y:alternate?Math.floor(j/3)*53-99:y,w:tracks.wordWidths[j],s:age<0?0:keys(age,[0,1,2,3,4,5,6,8,10,12,14,16],[.08,.22,.5,.75,1,1.17,1.24,1.19,1.07,.98,.98,1]),start:tracks.wordStarts[j]};};
export const methodPose=(f:number,i:number)=>({x:-233,y:sample(f,tracks.methods[i],1)-.3,opacity:f>=tracks.methodStarts[i]?1:0,start:tracks.methodStarts[i]});
export const pillPose=(f:number)=>({x:sample(f,tracks.pill,1),y:sample(f,tracks.pill,2),r:sample(f,tracks.pill,3)});
