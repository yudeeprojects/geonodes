/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { fromBufferGeometry } from "../utils";
import { UniversalGeometry } from "@/types/geometry";

export const createCircle = (
  id: string,
  pos: [number, number, number],
  color: string,
  params: {
    radius?: number;
    segments?: number;
  } = {}
): UniversalGeometry => {
  const { radius = 0.5, segments = 32 } = params;
  const geometry = new THREE.CircleGeometry(radius, segments);
  const node = fromBufferGeometry(id, geometry, pos, color, {
    primitiveType: "Circle",
    params: { radius, segments },
  });

  geometry.dispose();
  return node;
};
