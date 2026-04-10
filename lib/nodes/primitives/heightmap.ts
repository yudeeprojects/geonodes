/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { fromBufferGeometry } from "../utils";
import { UniversalGeometry } from "@/types/geometry";

export const createHeightmap = (
  id: string,
  pos: [number, number, number],
  color: string,
  params: {
    size?: number;
    segments?: number;
  } = {}
): UniversalGeometry => {
  const { size = 10, segments = 100 } = params;
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  geometry.rotateX(-Math.PI / 2); 
  const node = fromBufferGeometry(id, geometry, pos, color, {
    primitiveType: "Heightmap",
    params: { size, segments },
  });

  geometry.dispose();
  return node;
};
