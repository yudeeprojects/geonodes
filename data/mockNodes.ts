/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniversalGeometry } from "@/types/geometry";
import {
  createCube,
  createSphere,
  createTorus,
  createCylinder,
} from "@/lib/nodes/primitives";

export const initialNodes: UniversalGeometry[] = [
  createCube("cube-default", [0, 0, 0], "#93c5fd"),
];
