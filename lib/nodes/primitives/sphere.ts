/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { fromBufferGeometry } from "../utils";
import { UniversalGeometry } from "@/types/geometry";

export const createSphere = (
  id: string,
  pos: [number, number, number],
  color: string,
  params: {
    radius?: number;
    widthSegments?: number;
    heightSegments?: number;
  } = {}
): UniversalGeometry => {
  const { radius = 0.7, widthSegments = 32, heightSegments = 16 } = params;
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  
  const node = fromBufferGeometry(id, geometry, pos, color, {
    primitiveType: "Sphere",
    params: { radius, widthSegments, heightSegments },
  });

  geometry.dispose();
  return node;
};
