import * as THREE from "three";
import { Constraint } from "@/hooks/types";

export function getConstrainedDelta(
  startMouse: THREE.Vector3,
  currentMouse: THREE.Vector3,
  constraint: Constraint
): THREE.Vector3 {
  const delta = new THREE.Vector3().subVectors(currentMouse, startMouse);
  if (constraint === "x") { delta.y = 0; delta.z = 0; }
  if (constraint === "y") { delta.x = 0; delta.z = 0; }
  if (constraint === "z") { delta.x = 0; delta.y = 0; }
  if (constraint === "xy") { delta.z = 0; }
  if (constraint === "xz") { delta.y = 0; }
  if (constraint === "yz") { delta.x = 0; }
  return delta;
}

export function getConstraintPlane(
  startWorldPos: THREE.Vector3,
  camera: THREE.Camera,
  constraint: Constraint
): THREE.Plane {
  if (constraint === "xy" || constraint === "xz" || constraint === "yz") {
    const normal = new THREE.Vector3(
      constraint === "yz" ? 1 : 0, 
      constraint === "xz" ? 1 : 0, 
      constraint === "xy" ? 1 : 0
    );
    return new THREE.Plane().setFromNormalAndCoplanarPoint(normal, startWorldPos);
  }

  // Default to plane facing the camera
  const cameraDir = new THREE.Vector3();
  camera.getWorldDirection(cameraDir);
  return new THREE.Plane().setFromNormalAndCoplanarPoint(cameraDir, startWorldPos);
}

export function calculateScaleConstraint(
  scaleFactor: number,
  startScale: THREE.Vector3,
  constraint: Constraint
): THREE.Vector3 {
  const newScale = startScale.clone();
  if (constraint === "none") newScale.multiplyScalar(scaleFactor);
  else if (constraint === "x") newScale.x *= scaleFactor;
  else if (constraint === "y") newScale.y *= scaleFactor;
  else if (constraint === "z") newScale.z *= scaleFactor;
  else if (constraint === "xy") { newScale.x *= scaleFactor; newScale.y *= scaleFactor; }
  else if (constraint === "xz") { newScale.x *= scaleFactor; newScale.z *= scaleFactor; }
  else if (constraint === "yz") { newScale.y *= scaleFactor; newScale.z *= scaleFactor; }
  return newScale;
}

export function calculateRotationConstraint(
  angle: number,
  startRotation: THREE.Euler,
  constraint: Constraint,
  camera: THREE.Camera,
  mesh: THREE.Mesh
) {
  if (constraint === "none") {
    // Free mode: rotates around camera view axis
    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    
    const qStart = new THREE.Quaternion().setFromEuler(startRotation);
    const qDelta = new THREE.Quaternion().setFromAxisAngle(cameraDir, -angle);
    const qFinal = qDelta.multiply(qStart);
    mesh.quaternion.copy(qFinal);
  } else {
    const newRotation = startRotation.clone();
    if (constraint === "x") newRotation.x += angle;
    else if (constraint === "y") newRotation.y += angle;
    else if (constraint === "z") newRotation.z += angle;
    mesh.rotation.copy(newRotation);
  }
}
