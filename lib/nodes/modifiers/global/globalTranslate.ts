/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniversalGeometry } from "@/types/geometry";

/**
 * GlobalTranslate — sets the object's world-space position.
 * Does NOT modify vertices. Updates transform.position in the store via userData.globalTransform.
 */
export function globalTranslate(
  geom: UniversalGeometry,
  params: { x?: number; y?: number; z?: number }
): UniversalGeometry {
  return {
    ...geom,
    userData: {
      ...geom.userData,
      globalTransform: {
        ...(geom.userData?.globalTransform ?? {}),
        position: [params.x ?? 0, params.y ?? 0, params.z ?? 0] as [number, number, number],
      },
    },
  };
}
