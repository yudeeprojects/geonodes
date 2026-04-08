import { UniversalGeometry } from "@/types/geometry";

export const createBaseGeo = (
  id: string,
  position: Float32Array,
): UniversalGeometry => ({
  id,
  type: "MESH",
  transform: {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  attributes: {
    position,
  },
  settings: {
    color: "#3b82f6",
    wireframe: true,
    visible: true,
    castShadow: true,
    receiveShadow: true,
    opacity: 1,
    transparent: false,
  },
  userData: {},
});
