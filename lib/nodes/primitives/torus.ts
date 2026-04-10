/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { fromBufferGeometry } from "../utils";
import { UniversalGeometry } from "@/types/geometry";

export const createTorus = (
  id: string,
  pos: [number, number, number],
  color: string,
  params: {
    radius?: number;
    tube?: number;
    radialSegments?: number;
    tubularSegments?: number;
  } = {}
): UniversalGeometry => {
  const { radius = 0.5, tube = 0.2, radialSegments = 16, tubularSegments = 100 } = params;
  const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
  const node = fromBufferGeometry(id, geometry, pos, color, {
    primitiveType: "Torus",
    params: { radius, tube, radialSegments, tubularSegments },
  });

  geometry.dispose();
  return node;
};
