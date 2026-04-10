/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { fromBufferGeometry, toBufferGeometry } from "../utils";
import { UniversalGeometry } from "@/types/geometry";

/**
 * Modifier: Rotate Geometry
 * Angles are in Radians internally for Three.js
 */
export const rotateGeometry = (
  input: UniversalGeometry,
  params: { x?: number; y?: number; z?: number } = {}
): UniversalGeometry => {
  const { x = 0, y = 0, z = 0 } = params;
  
  const geometry = toBufferGeometry(input);
  geometry.rotateX(x);
  geometry.rotateY(y);
  geometry.rotateZ(z);
  
  const result = fromBufferGeometry(
    input.id, 
    geometry, 
    input.transform.position, 
    input.settings.color, 
    input.userData
  );

  geometry.dispose();
  return result;
};
