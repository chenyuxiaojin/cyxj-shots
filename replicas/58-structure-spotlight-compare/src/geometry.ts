import { lerp } from "./common";
export const boxes = (f: number) => [{ x: lerp(f, [0, 2, 6, 12, 16, 28], [960, 835, 660, 530, 502, 500]), y: 115, width: 367, height: 310 }, { x: lerp(f, [21, 24, 27, 30, 34, 38], [-410, -270, -85, 46, 91, 95]), y: 115, width: 367, height: 310 }];
