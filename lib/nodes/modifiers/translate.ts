/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { fromBufferGeometry, toBufferGeometry } from "../utils";
import { UniversalGeometry } from "@/types/geometry";

/**
 * Modifier: Translate (Move) Geometry
 */
export const translateGeometry = (
  input: UniversalGeometry,
  params: { x?: number; y?: number; z?: number } = {}
): UniversalGeometry => {
  const { x = 0, y = 0, z = 0 } = params;
  
  const geometry = toBufferGeometry(input);
  geometry.translate(x, y, z);
  
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
