/* eslint-disable @typescript-eslint/no-explicit-any */

export interface UniversalGeometry {
  id: string;
  type: "MESH" | "INSTANCES" | "POINTS" | "CURVE";

  transform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };

  attributes: {
    position: Float32Array;
    index?: Uint16Array;
    normal?: Float32Array;
    uv?: Float32Array;
    instanceMatrix?: Float32Array;
    [key: string]: Float32Array | Uint16Array | undefined;
  };

  settings: {
    color: string;
    wireframe: boolean;
    visible: boolean;
    castShadow: boolean;
    receiveShadow: boolean;
    opacity: number;
    transparent: boolean;
  };

  userData: {
    [key: string]: any;
  };
}
