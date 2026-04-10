/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { fromBufferGeometry } from "../utils";
import { UniversalGeometry } from "@/types/geometry";

export const createBox = (
  id: string,
  pos: [number, number, number],
  color: string,
  params: { 
    width?: number; 
    height?: number; 
    depth?: number; 
    segmentsX?: number; 
    segmentsY?: number; 
    segmentsZ?: number;
  } = {}
): UniversalGeometry => {
  const { 
    width = 1, 
    height = 1, 
    depth = 1, 
    segmentsX = 1, 
    segmentsY = 1, 
    segmentsZ = 1 
  } = params;
  
  const geometry = new THREE.BoxGeometry(width, height, depth, segmentsX, segmentsY, segmentsZ);
  
  const node = fromBufferGeometry(id, geometry, pos, color, {
    primitiveType: "Box",
    params: { width, height, depth, segmentsX, segmentsY, segmentsZ },
    // Graph initialization is now handled by the factory/store for consistency
  });

  geometry.dispose();
  return node;
};
