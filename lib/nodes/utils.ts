/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { UniversalGeometry } from "@/types/geometry";

/**
 * Creates a UniversalGeometry object from a Three.js BufferGeometry.
 * Does NOT dispose of the geometry, as it might be used elsewhere.
 */
export function fromBufferGeometry(
  id: string,
  geometry: THREE.BufferGeometry,
  pos: [number, number, number],
  color: string,
  userData: any = {}
): UniversalGeometry {
  const positionAttr = geometry.getAttribute("position").array as Float32Array;
  const indexAttr = geometry.getIndex()?.array as Uint16Array;
  const normalAttr = geometry.getAttribute("normal")?.array as Float32Array;
  const uvAttr = geometry.getAttribute("uv")?.array as Float32Array;

  // Auto-generate default node graph for primitives if not provided
  if (userData.primitiveType && !userData.graph) {
    const inputNodeId = `input-${id}`;
    const outputNodeId = `output-${id}`;
    
    userData.graph = {
      nodes: [
        {
          id: inputNodeId,
          type: "geometryInput",
          position: { x: 50, y: 100 },
          data: { 
            label: userData.primitiveType, 
            params: userData.params || {}, 
            type: userData.primitiveType,
            functionName: `create${userData.primitiveType}`
          },
        },
        {
          id: outputNodeId,
          type: "geometryOutput",
          position: { x: 400, y: 100 },
          data: { 
            label: "Output Geometry",
          },
        }
      ],
      edges: [
        {
          id: `edge-${id}`,
          source: inputNodeId,
          target: outputNodeId,
        }
      ]
    };
  }

  return {
    id,
    type: "MESH",
    transform: {
      position: pos,
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
    attributes: {
      position: positionAttr,
      index: indexAttr,
      normal: normalAttr,
      uv: uvAttr,
    },
    settings: {
      color: color,
      wireframe: false,
      visible: true,
      castShadow: true,
      receiveShadow: true,
      opacity: 1,
      transparent: false,
    },
    userData: userData,
  };
}

/**
 * Converts UniversalGeometry attributes back into a Three.js BufferGeometry for processing.
 */
export function toBufferGeometry(geom: UniversalGeometry): THREE.BufferGeometry {
  const buffer = new THREE.BufferGeometry();
  
  if (geom.attributes.position) {
    buffer.setAttribute("position", new THREE.BufferAttribute(new Float32Array(geom.attributes.position), 3));
  }
  
  if (geom.attributes.index) {
    buffer.setIndex(new THREE.BufferAttribute(new Uint16Array(geom.attributes.index), 1));
  }
  
  if (geom.attributes.normal) {
    buffer.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(geom.attributes.normal), 3));
  }

  if (geom.attributes.uv) {
    buffer.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(geom.attributes.uv), 2));
  }

  return buffer;
}
