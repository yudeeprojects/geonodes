/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniversalGeometry } from "@/types/geometry";

/**
 * GlobalRotate — sets the object's world-space rotation (in radians).
 * Does NOT modify vertices. Updates transform.rotation in the store via userData.globalTransform.
 */
export function globalRotate(
  geom: UniversalGeometry,
  params: { x?: number; y?: number; z?: number }
): UniversalGeometry {
  return {
    ...geom,
    userData: {
      ...geom.userData,
      globalTransform: {
        ...(geom.userData?.globalTransform ?? {}),
        rotation: [params.x ?? 0, params.y ?? 0, params.z ?? 0] as [number, number, number],
      },
    },
  };
}
