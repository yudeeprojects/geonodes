/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { fromBufferGeometry } from "../utils";
import { UniversalGeometry } from "@/types/geometry";

export const createCone = (
  id: string,
  pos: [number, number, number],
  color: string,
  params: {
    radius?: number;
    height?: number;
    radialSegments?: number;
    heightSegments?: number;
  } = {}
): UniversalGeometry => {
  const { radius = 0.5, height = 1, radialSegments = 32, heightSegments = 1 } = params;
  const geometry = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments);
  const node = fromBufferGeometry(id, geometry, pos, color, {
    primitiveType: "Cone",
    params: { radius, height, radialSegments, heightSegments },
  });

  geometry.dispose();
  return node;
};
