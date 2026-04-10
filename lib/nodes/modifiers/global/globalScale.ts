/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniversalGeometry } from "@/types/geometry";

/**
 * GlobalScale — sets the object's world-space scale.
 * Does NOT modify vertices. Updates transform.scale in the store via userData.globalTransform.
 */
export function globalScale(
  geom: UniversalGeometry,
  params: { x?: number; y?: number; z?: number }
): UniversalGeometry {
  return {
    ...geom,
    userData: {
      ...geom.userData,
      globalTransform: {
        ...(geom.userData?.globalTransform ?? {}),
        scale: [params.x ?? 1, params.y ?? 1, params.z ?? 1] as [number, number, number],
      },
    },
  };
}
