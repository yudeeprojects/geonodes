/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { fromBufferGeometry, toBufferGeometry } from "../utils";
import { UniversalGeometry } from "@/types/geometry";

/**
 * Modifier: Universal Transform Geometry
 * Combines Translation, Rotation and Scale in one atomic operation
 */
export const transformGeometry = (
  input: UniversalGeometry,
  params: { 
    tx?: number; ty?: number; tz?: number;
    rx?: number; ry?: number; rz?: number;
    sx?: number; sy?: number; sz?: number;
  } = {}
): UniversalGeometry => {
  const { 
    tx = 0, ty = 0, tz = 0, 
    rx = 0, ry = 0, rz = 0, 
    sx = 1, sy = 1, sz = 1 
  } = params;
  
  const geometry = toBufferGeometry(input);
  
  // Apply transformations in a consistent order: Scale -> Rotate -> Translate
  geometry.scale(sx, sy, sz);
  geometry.rotateX(rx);
  geometry.rotateY(ry);
  geometry.rotateZ(rz);
  geometry.translate(tx, ty, tz);
  
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
