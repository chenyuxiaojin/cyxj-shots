import { lerp } from './common';
export const boxes = (f: number) => [{ x: lerp(f, [0, 8, 14], [315, 328, 333]), y: lerp(f, [0, 8, 14], [30, 72, 80]), width: 290, height: 290 }, { x: lerp(f, [0, 14, 60, 70, 74], [302, 318, 318, 622, 960]), y: 318, width: 340, height: 137 }, { x: 438, y: lerp(f, [76, 85, 94], [550, 362, 315]), width: 82, height: 150 }];
