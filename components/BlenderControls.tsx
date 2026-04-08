/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGeoStore } from "@/lib/store";

type Constraint = "none" | "x" | "y" | "z" | "xy" | "xz" | "yz";

export function BlenderControls() {
  const { camera, mouse, raycaster } = useThree();
  const selectedId = useGeoStore((state) => state.selectedId);
  const nodes = useGeoStore((state) => state.nodes);
  const updateTransform = useGeoStore((state) => state.updateTransform);
  const setIsGrabActive = useGeoStore((state) => state.setIsGrabActive);
  const setSelectionLock = useGeoStore((state) => state.setSelectionLock);
  const meshRefs = useGeoStore((state) => state.meshRefs);

  const [active, setActive] = useState(false);
  const [constraint, setConstraint] = useState<Constraint>("none");

  const startWorldPos = useRef<THREE.Vector3>(new THREE.Vector3());
  const movePlane = useRef<THREE.Plane>(new THREE.Plane());
  const startMouseWorldPos = useRef<THREE.Vector3>(new THREE.Vector3());
  
  const targetMeshRef = useRef<THREE.Mesh | null>(null);

  const startGrab = useCallback(() => {
    if (!selectedId) return;
    const mesh = meshRefs.get(selectedId);
    if (!mesh) return;

    targetMeshRef.current = mesh;
    setActive(true);
    setIsGrabActive(true);
    setConstraint("none");
    
    mesh.getWorldPosition(startWorldPos.current);

    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    movePlane.current.setFromNormalAndCoplanarPoint(cameraDir, startWorldPos.current);

    raycaster.setFromCamera(mouse, camera);
    const intersect = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(movePlane.current, intersect)) {
        startMouseWorldPos.current.copy(intersect);
    } else {
        startMouseWorldPos.current.copy(startWorldPos.current);
    }
  }, [selectedId, camera, mouse, raycaster, setIsGrabActive, meshRefs]);

  const confirmGrab = useCallback(() => {
    if (active && selectedId && targetMeshRef.current) {
        const worldPos = new THREE.Vector3();
        targetMeshRef.current.getWorldPosition(worldPos);
        updateTransform(selectedId, { position: [worldPos.x, worldPos.y, worldPos.z] });

        // Включаємо "лок" на вибір, щоб клік-підтвердження не деселектив об'єкт через Canvas
        setSelectionLock(true);
        setTimeout(() => setSelectionLock(false), 200);
    }
    setActive(false);
    setIsGrabActive(false);
    targetMeshRef.current = null;
  }, [active, selectedId, setIsGrabActive, updateTransform, setSelectionLock]);

  const cancelGrab = useCallback(() => {
    if (active && selectedId && targetMeshRef.current) {
      targetMeshRef.current.position.set(0, 0, 0);
    }
    setActive(false);
    setIsGrabActive(false);
    targetMeshRef.current = null;
  }, [active, selectedId, setIsGrabActive]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")) return;
      const key = e.key.toLowerCase();

      if (!active) {
        if (key === "g" && selectedId) startGrab();
        return;
      }

      if (key === "escape") cancelGrab();
      if (key === "enter") confirmGrab();

      if (key === "x" || key === "y" || key === "z") {
        setConstraint(e.shiftKey ? (key === "x" ? "yz" : key === "y" ? "xz" : "xy") : (key as Constraint));
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!active) return;
      if (e.button === 0) confirmGrab();
      if (e.button === 2) cancelGrab();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [selectedId, active, startGrab, confirmGrab, cancelGrab]);

  useFrame(() => {
    if (!active || !selectedId || !targetMeshRef.current) return;

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

      targetMeshRef.current.position.copy(delta);
    }
  });

  return null;
}
