import tracks from './tracks.json';
export const at=(a:number[],f:number)=>{const k=Math.max(0,Math.min(a.length-1,f)),i=Math.floor(k);return a[i]+(a[Math.min(a.length-1,i+1)]-a[i])*(k-i)};
export const mix=(f:number,a:number,z:number)=>Math.max(0,Math.min(1,(f-a)/(z-a)));
export const curve=(f:number,fs:number[],vs:number[])=>{if(f<=fs[0])return vs[0];for(let i=1;i<fs.length;i++)if(f<=fs[i])return vs[i-1]+(vs[i]-vs[i-1])*(f-fs[i-1])/(fs[i]-fs[i-1]);return vs[vs.length-1]};
export const cameraAt=(f:number)=>at(tracks.cameraY,f);
export const cardAt=(f:number)=>at(tracks.cardTop,f);
export const encodeWidth=(f:number)=>curve(f,[0,3,6,9,12,15,18,21,24,27,30,33,36,39,42,45],[1,7,17,37,69,119,185,259,313,347,373,385,392,395,397,397]);
export const decodeWidth=(f:number)=>at(tracks.decodePanelWidth,f-250);
export const boxes=(f:number)=>{const c=cameraAt(f);return [
{x:203,y:200+c,width:85,height:85,label:'人类卡'},
{x:385,y:80+c,width:190,height:320,label:'编码/解码背板'},
{x:385,y:cardAt(f),width:190,height:190,label:'分词器前卡'},
{x:673,y:200+c,width:85,height:85,label:'模型卡'},
{x:480-encodeWidth(f)/2,y:-122.5+c,width:encodeWidth(f),height:103,label:'输入 Token 容器'},
{x:480-encodeWidth(f)/2,y:-12+c,width:encodeWidth(f),height:38,label:'输入文字槽'},
{x:480-decodeWidth(f)/2,y:441.5+c,width:decodeWidth(f),height:103,label:'输出 Token 容器'},
{x:480-decodeWidth(f)/2,y:553+c,width:decodeWidth(f),height:38,label:'输出文字槽'},
]};
