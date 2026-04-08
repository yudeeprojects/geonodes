/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { UniversalGeometry } from "@/types/geometry";

// Універсальна функція для створення примітива
function createPrimitive(
  id: string,
  type: string,
  geometry: THREE.BufferGeometry,
  pos: [number, number, number],
  color: string,
): UniversalGeometry {
  // Витягуємо атрибути
  const positionAttr = geometry.getAttribute("position").array as Float32Array;
  const indexAttr = geometry.getIndex()?.array as Uint16Array;
  const normalAttr = geometry.getAttribute("normal")?.array as Float32Array;
  const uvAttr = geometry.getAttribute("uv")?.array as Float32Array;

  const node: UniversalGeometry = {
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
    userData: { primitiveType: type },
  };

  geometry.dispose(); // Звільняємо пам'ять
  return node;
}

// Конкретні ноди-генератори
export const createBox = (
  id: string,
  pos: [number, number, number],
  color: string,
) => createPrimitive(id, "Box", new THREE.BoxGeometry(1, 1, 1), pos, color);

// Залишаємо Cube як аліас для зворотної сумісності або просто перевизначаємо
export const createCube = createBox;

export const createSphere = (
  id: string,
  pos: [number, number, number],
  color: string,
) =>
  createPrimitive(
    id,
    "Sphere",
    new THREE.SphereGeometry(0.7, 16, 16),
    pos,
    color,
  );

export const createCylinder = (
  id: string,
  pos: [number, number, number],
  color: string,
) =>
  createPrimitive(
    id,
    "Cylinder",
    new THREE.CylinderGeometry(0.5, 0.5, 1, 16),
    pos,
    color,
  );

export const createCone = (
  id: string,
  pos: [number, number, number],
  color: string,
) =>
  createPrimitive(
    id,
    "Cone",
    new THREE.ConeGeometry(0.5, 1, 16),
    pos,
    color,
  );

export const createTorus = (
  id: string,
  pos: [number, number, number],
  color: string,
) =>
  createPrimitive(
    id,
    "Torus",
    new THREE.TorusGeometry(0.5, 0.2, 12, 48),
    pos,
    color,
  );

export const createTorusKnot = (
  id: string,
  pos: [number, number, number],
  color: string,
) =>
  createPrimitive(
    id,
    "TorusKnot",
    new THREE.TorusKnotGeometry(0.4, 0.15, 64, 8),
    pos,
    color,
  );

export const createPlane = (
  id: string,
  pos: [number, number, number],
  color: string,
) =>
  createPrimitive(
    id,
    "Plane",
    new THREE.PlaneGeometry(1, 1),
    pos,
    color,
  );

export const createCircle = (
  id: string,
  pos: [number, number, number],
  color: string,
) =>
  createPrimitive(
    id,
    "Circle",
    new THREE.CircleGeometry(0.5, 16),
    pos,
    color,
  );
