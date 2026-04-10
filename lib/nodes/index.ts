import { createBox } from "./primitives/box";
import { createSphere } from "./primitives/sphere";
import { createCylinder } from "./primitives/cylinder";
import { createCone } from "./primitives/cone";
import { createPlane } from "./primitives/plane";
import { createCircle } from "./primitives/circle";
import { createTorus } from "./primitives/torus";
import { createTorusKnot } from "./primitives/torusKnot";
import { createHeightmap } from "./primitives/heightmap";

import { translateGeometry } from "./modifiers/translate";
import { scaleGeometry } from "./modifiers/scale";
import { rotateGeometry } from "./modifiers/rotate";
import { transformGeometry } from "./modifiers/transform";

import { globalTranslate } from "./modifiers/global/globalTranslate";
import { globalRotate } from "./modifiers/global/globalRotate";
import { globalScale } from "./modifiers/global/globalScale";
import { globalTransform } from "./modifiers/global/globalTransform";

import { integerInput } from "./inputs/integer";
import { floatInput } from "./inputs/float";

// Registry mapping node types/function names to their logic functions
export const nodeRegistry: Record<string, any> = {
  // Primitives
  "createBox": createBox,
  "createCube": createBox,
  "createSphere": createSphere,
  "createCylinder": createCylinder,
  "createCone": createCone,
  "createPlane": createPlane,
  "createCircle": createCircle,
  "createTorus": createTorus,
  "createTorusKnot": createTorusKnot,
  "createHeightmap": createHeightmap,
  
  // Local Modifiers (modify vertices in object-space)
  "translate": translateGeometry,
  "scale": scaleGeometry,
  "rotate": rotateGeometry,
  "transform": transformGeometry,
  
  // Global Modifiers (update world-space transform, pass geometry through)
  "globalTranslate": globalTranslate,
  "globalRotate": globalRotate,
  "globalScale": globalScale,
  "globalTransform": globalTransform,
  
  // Inputs
  "integer": integerInput,
  "float": floatInput
};

export {
  createBox, createSphere, createCylinder, createCone,
  createPlane, createCircle, createTorus, createTorusKnot, createHeightmap,
  translateGeometry, scaleGeometry, rotateGeometry, transformGeometry,
  globalTranslate, globalRotate, globalScale, globalTransform,
  integerInput, floatInput
};


