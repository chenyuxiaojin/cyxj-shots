import {continueRender,delayRender} from 'remotion';
// Font bytes are never bundled. The renderer uses an installed face, or a system fallback.
const handle=delayRender('Load optional installed typefaces');
if(typeof document!=='undefined'){
 Promise.allSettled([
  new FontFace('ReplicaDIN','local("BebasNeue-Regular"), local("Bebas Neue")',{weight:'700'}).load(),
  new FontFace('ReplicaElite','local("Lora-BoldItalic"), local("Lora Bold Italic")').load(),
 ]).then(loaded=>{for(const r of loaded){if(r.status==='fulfilled')document.fonts.add(r.value);}continueRender(handle);});
}else{continueRender(handle);}
export const numberFont='ReplicaDIN, "Bebas Neue", "DIN Condensed", "Arial Narrow", "Liberation Sans Narrow", sans-serif';
export const growthFont='ReplicaElite, "Lora", "Georgia", serif';
export const textFont='"PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif';
