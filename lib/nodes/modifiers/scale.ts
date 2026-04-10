/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { fromBufferGeometry, toBufferGeometry } from "../utils";
import { UniversalGeometry } from "@/types/geometry";

/**
 * Modifier: Scale Geometry
 */
export const scaleGeometry = (
  input: UniversalGeometry,
  params: { x?: number; y?: number; z?: number } = {}
): UniversalGeometry => {
  const { x = 1, y = 1, z = 1 } = params;
  
  const geometry = toBufferGeometry(input);
  geometry.scale(x, y, z);
  
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
