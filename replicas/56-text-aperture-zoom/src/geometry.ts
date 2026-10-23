import { lerp } from "./common";
export const boxes = (f: number) => { const s = lerp(f, [0, 10, 20, 40, 60, 80, 90], [1, 1.003, 1.043, 1.337, 2.071, 3.48, 4.5]); return [{ x: 640 + (167 - 640) * s, y: 440 + (196 - 440) * s, width: 624 * s, height: 146 * s }]; };
