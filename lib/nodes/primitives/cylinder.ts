/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { fromBufferGeometry } from "../utils";
import { UniversalGeometry } from "@/types/geometry";

export const createCylinder = (
  id: string,
  pos: [number, number, number],
  color: string,
  params: {
    radiusTop?: number;
    radiusBottom?: number;
    height?: number;
    radialSegments?: number;
    heightSegments?: number;
  } = {}
): UniversalGeometry => {
  const { 
    radiusTop = 0.5, 
    radiusBottom = 0.5, 
    height = 1, 
    radialSegments = 32, 
    heightSegments = 1 
  } = params;
  
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments);
  const node = fromBufferGeometry(id, geometry, pos, color, {
    primitiveType: "Cylinder",
    params: { radiusTop, radiusBottom, height, radialSegments, heightSegments },
  });

  geometry.dispose();
  return node;
};
