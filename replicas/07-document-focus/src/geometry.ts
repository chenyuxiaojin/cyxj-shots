import rows from './motion-track.json';
import {matrix,lerp} from './common';
export const pageMatrix=(f:number)=>matrix(f,rows);
export const lineBoxes=[{x:122,y:157,w:713,h:43},{x:54,y:211,w:846,h:44},{x:104,y:275,w:754,h:46},{x:324,y:330,w:311,h:46},{x:44,y:392,w:870,h:43}];
export const noteY=(f:number)=>lerp(f,[126,134,142,150,158,168],[680,545,488,451,421,399]);
