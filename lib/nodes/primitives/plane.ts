/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { fromBufferGeometry } from "../utils";
import { UniversalGeometry } from "@/types/geometry";

export const createPlane = (
  id: string,
  pos: [number, number, number],
  color: string,
  params: {
    width?: number;
    height?: number;
    widthSegments?: number;
    heightSegments?: number;
  } = {}
): UniversalGeometry => {
  const { width = 1, height = 1, widthSegments = 1, heightSegments = 1 } = params;
  const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
  const node = fromBufferGeometry(id, geometry, pos, color, {
    primitiveType: "Plane",
    params: { width, height, widthSegments, heightSegments },
  });

  geometry.dispose();
  return node;
};
