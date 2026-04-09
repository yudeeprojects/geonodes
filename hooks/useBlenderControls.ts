/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGeoStore, meshRegistry } from "@/lib/store";
import { Constraint, TransformMode } from "./types";
import { useNumericBuffer } from "./useNumericBuffer";
import { 
  getConstrainedDelta, 
  getConstraintPlane, 
  calculateScaleConstraint, 
  calculateRotationConstraint 
} from "@/lib/utils/math";

export function useBlenderControls() {
  const { camera, mouse, raycaster } = useThree();
  const selectedId = useGeoStore((state) => state.selectedId);
  const updateTransform = useGeoStore((state) => state.updateTransform);
  const setIsGrabActive = useGeoStore((state) => state.setIsGrabActive);
  const setSelectionLock = useGeoStore((state) => state.setSelectionLock);
  const togglePropertiesPanel = useGeoStore((state) => state.togglePropertiesPanel);

  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<TransformMode>("move");
  const [constraint, setConstraint] = useState<Constraint>("none");
  const numBuffer = useNumericBuffer();

  const startWorldPos = useRef<THREE.Vector3>(new THREE.Vector3());
  const currentWorldTarget = useRef<THREE.Vector3>(new THREE.Vector3());
  const startScale = useRef<THREE.Vector3>(new THREE.Vector3(1, 1, 1));
  const startRotation = useRef<THREE.Euler>(new THREE.Euler());
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
    numBuffer.clear();
    
    mesh.getWorldPosition(startWorldPos.current);
    currentWorldTarget.current.copy(startWorldPos.current);
    startScale.current.copy(mesh.scale);
    startRotation.current.copy(mesh.rotation);
    
    if (newMode === "move") {
        mesh.position.set(0, 0, 0);
    }

    const movePlane = getConstraintPlane(startWorldPos.current, camera, "none");

    raycaster.setFromCamera(mouse, camera);
    const intersect = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(movePlane, intersect)) {
        startMouseWorldPos.current.copy(intersect);
        const dist = intersect.distanceTo(startWorldPos.current);
        initialDistance.current = dist < 0.2 ? 1.0 : dist;

        // For rotation: screen space angle
        const screenCenter = startWorldPos.current.clone().project(camera);
        initialMouseAngle.current = Math.atan2(mouse.y - screenCenter.y, mouse.x - screenCenter.x);
    } else {
        startMouseWorldPos.current.copy(startWorldPos.current);
        initialDistance.current = 1;
        initialMouseAngle.current = 0;
    }
  }, [selectedId, camera, mouse, raycaster, setIsGrabActive, numBuffer]);

  const confirmTransform = useCallback(() => {
    if (active && selectedId) {
        const updates: any = {};
        const mesh = meshRegistry.get(selectedId);
        
        if (mode === "move") {
          updates.position = [currentWorldTarget.current.x, currentWorldTarget.current.y, currentWorldTarget.current.z];
        } else if (mode === "scale" && mesh) {
          const worldScale = new THREE.Vector3();
          mesh.getWorldScale(worldScale);
          updates.scale = [worldScale.x, worldScale.y, worldScale.z];
        } else if (mode === "rotate" && mesh) {
          const worldQuat = new THREE.Quaternion();
          mesh.getWorldQuaternion(worldQuat);
          const worldRot = new THREE.Euler().setFromQuaternion(worldQuat);
          updates.rotation = [worldRot.x, worldRot.y, worldRot.z];
        }

        updateTransform(selectedId, updates);
        setSelectionLock(true);
        setTimeout(() => setSelectionLock(false), 200);
    }
    setActive(false);
    setIsGrabActive(false);
    numBuffer.clear();
  }, [active, selectedId, mode, setIsGrabActive, updateTransform, setSelectionLock, numBuffer]);

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
    numBuffer.clear();
  }, [active, selectedId, setIsGrabActive, numBuffer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")) return;
      const key = e.key.toLowerCase();
      
      if (!active) {
        if (key === "g" && selectedId) { e.preventDefault(); startTransform("move"); }
        if (key === "s" && selectedId) { e.preventDefault(); startTransform("scale"); }
        if (key === "r" && selectedId) { e.preventDefault(); startTransform("rotate"); }
        if (key === "n") { e.preventDefault(); togglePropertiesPanel(); }
        return;
      }

      if (key === "escape") {
        e.preventDefault();
        cancelTransform();
        return;
      }
      if (key === "enter") {
        e.preventDefault();
        confirmTransform();
        return;
      }
      
      if (key === "x" || key === "y" || key === "z") {
        e.preventDefault();
        setConstraint(e.shiftKey ? (key === "x" ? "yz" : key === "y" ? "xz" : "xy") : (key as Constraint));
        numBuffer.clear();
        return;
      }

      numBuffer.handleKey(e.key);
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
  }, [selectedId, active, startTransform, confirmTransform, cancelTransform, numBuffer, togglePropertiesPanel]);

  useFrame(() => {
    if (!active || !selectedId) return;
    const mesh = meshRegistry.get(selectedId);
    if (!mesh || !mesh.parent) return;

    const numVal = numBuffer.getValue();

    if (mode === "move") {
      if (numVal !== null && (constraint === "x" || constraint === "y" || constraint === "z")) {
        currentWorldTarget.current.copy(startWorldPos.current);
        if (constraint === "x") currentWorldTarget.current.x = numVal;
        if (constraint === "y") currentWorldTarget.current.y = numVal;
        if (constraint === "z") currentWorldTarget.current.z = numVal;
      } else {
        raycaster.setFromCamera(mouse, camera);
        const currentMouseWorldPos = new THREE.Vector3();
        const targetPlane = getConstraintPlane(startWorldPos.current, camera, constraint);
        
        if (raycaster.ray.intersectPlane(targetPlane, currentMouseWorldPos)) {
          const delta = getConstrainedDelta(startMouseWorldPos.current, currentMouseWorldPos, constraint);
          currentWorldTarget.current.copy(startWorldPos.current).add(delta);
        }
      }
      const localTarget = mesh.parent.worldToLocal(currentWorldTarget.current.clone());
      if (!isNaN(localTarget.x)) mesh.position.copy(localTarget);

    } else if (mode === "scale") {
      let scaleFactor = 1;
      if (numVal !== null) {
        scaleFactor = numVal;
      } else {
        raycaster.setFromCamera(mouse, camera);
        const currentMouseWorldPos = new THREE.Vector3();
        const plane = getConstraintPlane(startWorldPos.current, camera, "none");
        if (raycaster.ray.intersectPlane(plane, currentMouseWorldPos)) {
          scaleFactor = currentMouseWorldPos.distanceTo(startWorldPos.current) / initialDistance.current;
        }
      }
      mesh.scale.copy(calculateScaleConstraint(scaleFactor, startScale.current, constraint));

    } else if (mode === "rotate") {
      let angle = 0;
      if (numVal !== null) {
        angle = THREE.MathUtils.degToRad(numVal);
      } else {
        const screenCenter = startWorldPos.current.clone().project(camera);
        const currentAngle = Math.atan2(mouse.y - screenCenter.y, mouse.x - screenCenter.x);
        angle = (currentAngle - initialMouseAngle.current) * 2;
      }
      // Apply rotation math helper
      calculateRotationConstraint(angle, startRotation.current, constraint, camera, mesh);
    }
  });

  return { active, mode, constraint, inputBuffer: numBuffer.buffer };
}
