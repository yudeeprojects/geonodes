/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniversalGeometry } from "@/types/geometry";
import {
  createCube,
  createSphere,
  createTorus,
  createCylinder,
} from "@/lib/nodes/primitives";

export const initialNodes: UniversalGeometry[] = [
  createCube("node-1", [-2, 0.5, -2], "#3b82f6"),
  createSphere("node-2", [2, 0.7, -2], "#ef4444"),
  createTorus("node-3", [-2, 0.7, 2], "#f1fd00"),
  createCylinder("node-4", [2, 0.5, 2], "#10b981"),
  createCube("node-5", [0, 0.5, 0], "#8b5cf6"),
];
