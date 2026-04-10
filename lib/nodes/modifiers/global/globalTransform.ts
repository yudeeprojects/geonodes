/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniversalGeometry } from "@/types/geometry";

/**
 * GlobalTransform — sets world-space position, rotation AND scale simultaneously.
 * Does NOT modify vertices. Updates all three transform fields via userData.globalTransform.
 */
export function globalTransform(
  geom: UniversalGeometry,
  params: {
    tx?: number; ty?: number; tz?: number;
    rx?: number; ry?: number; rz?: number;
    sx?: number; sy?: number; sz?: number;
  }
): UniversalGeometry {
  return {
    ...geom,
    userData: {
      ...geom.userData,
      globalTransform: {
        position: [params.tx ?? 0, params.ty ?? 0, params.tz ?? 0] as [number, number, number],
        rotation: [params.rx ?? 0, params.ry ?? 0, params.rz ?? 0] as [number, number, number],
        scale: [params.sx ?? 1, params.sy ?? 1, params.sz ?? 1] as [number, number, number],
      },
    },
  };
}
