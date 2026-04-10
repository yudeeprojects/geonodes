/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { fromBufferGeometry } from "../utils";
import { UniversalGeometry } from "@/types/geometry";

export const createTorusKnot = (
  id: string,
  pos: [number, number, number],
  color: string,
  params: {
    radius?: number;
    tube?: number;
    tubularSegments?: number;
    radialSegments?: number;
    p?: number;
    q?: number;
  } = {}
): UniversalGeometry => {
  const { radius = 0.4, tube = 0.15, tubularSegments = 64, radialSegments = 8, p = 2, q = 3 } = params;
  const geometry = new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q);
  const node = fromBufferGeometry(id, geometry, pos, color, {
    primitiveType: "TorusKnot",
    params: { radius, tube, tubularSegments, radialSegments, p, q },
  });

  geometry.dispose();
  return node;
};
