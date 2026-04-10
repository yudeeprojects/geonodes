/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniversalGeometry } from "@/types/geometry";
import {
  createBox,
} from "@/lib/nodes";

export const initialNodes: UniversalGeometry[] = [
  createBox("cube-default", [0, 0, 0], "#93c5fd", { width: 1, height: 1, depth: 1, segmentsX: 1, segmentsY: 1, segmentsZ: 1 }),
];
