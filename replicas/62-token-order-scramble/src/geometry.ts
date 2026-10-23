import { lerp } from './common';
export const boxes = (f: number) => { const s = lerp(f, [0, 15, 65, 73, 81, 88], [.92, 1, 1, 1.16, 1.26, 1.3]); return [{ x: 480 - 310 * s, y: 270 - 92 * s, width: 620 * s, height: 184 * s }]; };
