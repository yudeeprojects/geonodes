/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGeoStore, meshRegistry } from "@/lib/store";

export type Constraint = "none" | "x" | "y" | "z" | "xy" | "xz" | "yz";
export type TransformMode = "move" | "scale" | "rotate";

export function useBlenderControls() {
  const { camera, mouse, raycaster, size } = useThree();
  const selectedId = useGeoStore((state) => state.selectedId);
  const updateTransform = useGeoStore((state) => state.updateTransform);
  const setIsGrabActive = useGeoStore((state) => state.setIsGrabActive);
  const setSelectionLock = useGeoStore((state) => state.setSelectionLock);

  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<TransformMode>("move");
  const [constraint, setConstraint] = useState<Constraint>("none");
  const [inputBuffer, setInputBuffer] = useState<string>("");

  const startWorldPos = useRef<THREE.Vector3>(new THREE.Vector3());
  const currentWorldTarget = useRef<THREE.Vector3>(new THREE.Vector3());
  const startScale = useRef<THREE.Vector3>(new THREE.Vector3(1, 1, 1));
  const startRotation = useRef<THREE.Euler>(new THREE.Euler());
  const movePlane = useRef<THREE.Plane>(new THREE.Plane());
  const startMouseWorldPos = useRef<THREE.Vector3>(new THREE.Vector3());
  const initialDistance = useRef<number>(1);
  const initialMouseAngle = useRef<number>(0);

  const startTransform = useCallback((newMode: TransformMode) => {
    if (!selectedId) return;
    const mesh = meshRegistry.get(selectedId);
    if (!mesh) return;

    setActive(true);
    setMode(newMode);
    setIsGrabActive(true);
    setConstraint("none");
    setInputBuffer("");
    
    mesh.getWorldPosition(startWorldPos.current);
    currentWorldTarget.current.copy(startWorldPos.current);
    startScale.current.copy(mesh.scale);
    startRotation.current.copy(mesh.rotation);
    
    if (newMode === "move") {
        mesh.position.set(0, 0, 0);
    }

    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    movePlane.current.setFromNormalAndCoplanarPoint(cameraDir, startWorldPos.current);

    raycaster.setFromCamera(mouse, camera);
    const intersect = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(movePlane.current, intersect)) {
        startMouseWorldPos.current.copy(intersect);
        const dist = intersect.distanceTo(startWorldPos.current);
        initialDistance.current = dist < 0.2 ? 1.0 : dist;

        // Для ротації: кут в екранному просторі або відносно центру
        const screenCenter = startWorldPos.current.clone().project(camera);
        initialMouseAngle.current = Math.atan2(mouse.y - screenCenter.y, mouse.x - screenCenter.x);
    } else {
        startMouseWorldPos.current.copy(startWorldPos.current);
        initialDistance.current = 1;
        initialMouseAngle.current = 0;
    }
  }, [selectedId, camera, mouse, raycaster, setIsGrabActive]);

  const confirmTransform = useCallback(() => {
    if (active && selectedId) {
        const updates: any = {};
        const mesh = meshRegistry.get(selectedId);
        
        if (mode === "move") {
          updates.position = [currentWorldTarget.current.x, currentWorldTarget.current.y, currentWorldTarget.current.z];
        } else if (mode === "scale" && mesh) {
          updates.scale = [mesh.scale.x, mesh.scale.y, mesh.scale.z];
        } else if (mode === "rotate" && mesh) {
          updates.rotation = [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z];
        }

        updateTransform(selectedId, updates);
        setSelectionLock(true);
        setTimeout(() => setSelectionLock(false), 200);
    }
    setActive(false);
    setIsGrabActive(false);
    setInputBuffer("");
  }, [active, selectedId, mode, setIsGrabActive, updateTransform, setSelectionLock]);

  const cancelTransform = useCallback(() => {
    if (active && selectedId) {
      const mesh = meshRegistry.get(selectedId);
      if (mesh) {
        mesh.position.set(0, 0, 0);
        mesh.scale.copy(startScale.current);
        mesh.rotation.copy(startRotation.current);
      }
    }
    setActive(false);
    setIsGrabActive(false);
    setInputBuffer("");
  }, [active, selectedId, setIsGrabActive]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")) return;
      const key = e.key.toLowerCase();
      if (!active) {
        if (key === "g" && selectedId) startTransform("move");
        if (key === "s" && selectedId) startTransform("scale");
        if (key === "r" && selectedId) startTransform("rotate");
        return;
      }
      if (key === "escape") cancelTransform();
      if (key === "enter") confirmTransform();
      if (key === "x" || key === "y" || key === "z") {
        setConstraint(e.shiftKey ? (key === "x" ? "yz" : key === "y" ? "xz" : "xy") : (key as Constraint));
        setInputBuffer("");
        return;
      }
      if ((e.key >= "0" && e.key <= "9") || e.key === "." || e.key === "-") {
        setInputBuffer(prev => prev + e.key);
      }
      if (e.key === "backspace") {
        setInputBuffer(prev => prev.slice(0, -1));
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (!active) return;
      if (e.button === 0) confirmTransform();
      if (e.button === 2) cancelTransform();
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [selectedId, active, startTransform, confirmTransform, cancelTransform]);

  useFrame(() => {
    if (!active || !selectedId) return;
    const mesh = meshRegistry.get(selectedId);
    if (!mesh || !mesh.parent) return;

    if (mode === "move") {
      if (inputBuffer !== "" && (constraint === "x" || constraint === "y" || constraint === "z")) {
        const val = parseFloat(inputBuffer);
        if (!isNaN(val)) {
          currentWorldTarget.current.copy(startWorldPos.current);
          if (constraint === "x") currentWorldTarget.current.x = val;
          if (constraint === "y") currentWorldTarget.current.y = val;
          if (constraint === "z") currentWorldTarget.current.z = val;
        }
      } else {
        raycaster.setFromCamera(mouse, camera);
        const currentMouseWorldPos = new THREE.Vector3();
        let targetPlane = movePlane.current;
        if (constraint === "xy" || constraint === "xz" || constraint === "yz") {
          const normal = new THREE.Vector3(constraint === "yz" ? 1 : 0, constraint === "xz" ? 1 : 0, constraint === "xy" ? 1 : 0);
          targetPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, startWorldPos.current);
        }
        if (raycaster.ray.intersectPlane(targetPlane, currentMouseWorldPos)) {
          const delta = new THREE.Vector3().subVectors(currentMouseWorldPos, startMouseWorldPos.current);
          if (constraint === "x") { delta.y = 0; delta.z = 0; }
          if (constraint === "y") { delta.x = 0; delta.z = 0; }
          if (constraint === "z") { delta.x = 0; delta.y = 0; }
          if (constraint === "xy") { delta.z = 0; }
          if (constraint === "xz") { delta.y = 0; }
          if (constraint === "yz") { delta.x = 0; }
          currentWorldTarget.current.copy(startWorldPos.current).add(delta);
        }
      }
      const localTarget = mesh.parent.worldToLocal(currentWorldTarget.current.clone());
      if (!isNaN(localTarget.x)) mesh.position.copy(localTarget);

    } else if (mode === "scale") {
      let scaleFactor = 1;
      if (inputBuffer !== "") {
        const val = parseFloat(inputBuffer);
        if (!isNaN(val)) scaleFactor = val;
      } else {
        raycaster.setFromCamera(mouse, camera);
        const currentMouseWorldPos = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(movePlane.current, currentMouseWorldPos)) {
          scaleFactor = currentMouseWorldPos.distanceTo(startWorldPos.current) / initialDistance.current;
        }
      }
      const newScale = startScale.current.clone();
      if (constraint === "none") newScale.multiplyScalar(scaleFactor);
      else if (constraint === "x") newScale.x *= scaleFactor;
      else if (constraint === "y") newScale.y *= scaleFactor;
      else if (constraint === "z") newScale.z *= scaleFactor;
      else if (constraint === "xy") { newScale.x *= scaleFactor; newScale.y *= scaleFactor; }
      else if (constraint === "xz") { newScale.x *= scaleFactor; newScale.z *= scaleFactor; }
      else if (constraint === "yz") { newScale.y *= scaleFactor; newScale.z *= scaleFactor; }
      mesh.scale.copy(newScale);

    } else if (mode === "rotate") {
      let angle = 0;
      if (inputBuffer !== "") {
        const val = parseFloat(inputBuffer);
        if (!isNaN(val)) angle = THREE.MathUtils.degToRad(val);
      } else {
        const screenCenter = startWorldPos.current.clone().project(camera);
        // Реверс кута для того, щоб об'єкт крутився "за мишкою"
        const currentAngle = Math.atan2(mouse.y - screenCenter.y, mouse.x - screenCenter.x);
        angle = (currentAngle - initialMouseAngle.current) * 2; // Коефіцієнт 2 для чутливості
      }

      if (constraint === "none") {
        // У вільному режимі Blender крутить об'єкт навколо осі погляду камери
        const cameraDir = new THREE.Vector3();
        camera.getWorldDirection(cameraDir);
        
        const qStart = new THREE.Quaternion().setFromEuler(startRotation.current);
        const qDelta = new THREE.Quaternion().setFromAxisAngle(cameraDir, -angle);
        const qFinal = qDelta.multiply(qStart);
        mesh.quaternion.copy(qFinal);
      } else {
        const newRotation = startRotation.current.clone();
        if (constraint === "x") newRotation.x += angle;
        else if (constraint === "y") newRotation.y += angle;
        else if (constraint === "z") newRotation.z += angle;
        mesh.rotation.copy(newRotation);
      }
    }
  });

  return { active, mode, constraint, inputBuffer };
}
