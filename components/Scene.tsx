/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, Suspense, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  OrbitControls,
  Grid,
  Environment,
  ContactShadows,
  GizmoHelper,
  GizmoViewport,
  Line,
} from "@react-three/drei";
import { GeoMesh } from "./GeoMesh";
import { BlenderControls } from "./BlenderControls";
import { useGeoStore, navState, meshRegistry } from "@/lib/store";

function CameraFocusManager() {
  const selectedId = useGeoStore((state) => state.selectedId);
  const isGrabActive = useGeoStore((state) => state.isGrabActive);
  const orbitAroundSelection = useGeoStore((state) => state.orbitAroundSelection);
  const { controls } = useThree();
  const [isPointerDown, setIsPointerDown] = React.useState(false);

  useEffect(() => {
    const handleDown = () => setIsPointerDown(true);
    const handleUp = () => setIsPointerDown(false);
    
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    
    return () => {
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  useFrame(() => {
    if (!controls || !selectedId || isGrabActive || isPointerDown || !orbitAroundSelection) return;
    const mesh = meshRegistry.get(selectedId);
    if (!mesh) return;

    const targetPos = new THREE.Vector3();
    mesh.getWorldPosition(targetPos);
    
    // Smoothly interpolate the orbit target to the object's position
    (controls as any).target.lerp(targetPos, 0.1);
    (controls as any).update();
  });

  return null;
}

function CameraLayerManager() {
  const { camera } = useThree();
  useEffect(() => {
    camera.layers.enable(0);
    camera.layers.enable(1);
  }, [camera]);
  return null;
}

function SceneContent() {
  const nodes = useGeoStore((state) => state.nodes);
  const selectedId = useGeoStore((state) => state.selectedId);
  const deleteNode = useGeoStore((state) => state.deleteNode);
  const isGrabActive = useGeoStore((state) => state.isGrabActive);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedId) {
        if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")) return;
        deleteNode(selectedId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, deleteNode]);

  // Навігація через НЕ-РЕАКТИВНИЙ navState (не викликає ре-рендер)
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1 || e.button === 2) navState.isNavigating = true;
    };
    const handleMouseUp = () => {
      navState.isNavigating = false;
    };
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      <CameraLayerManager />
      <CameraFocusManager />
      <BlenderControls />
      
      <OrbitControls 
        makeDefault 
        mouseButtons={{
          LEFT: undefined, 
          MIDDLE: THREE.MOUSE.ROTATE,
          RIGHT: THREE.MOUSE.PAN,
        }}
        enabled={!isGrabActive}
        onStart={(e: any) => {
          const camera = e?.target.object as THREE.Camera;
          if (camera) camera.layers.disable(1);
        }}
        onEnd={(e: any) => {
          const camera = e?.target.object as THREE.Camera;
          if (camera) camera.layers.enable(1);
        }}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.5} 
        castShadow 
        shadow-bias={-0.0005} 
        shadow-mapSize={[1024, 1024]}
      />
      
      <Suspense fallback={null}>
        <Environment preset="city" />
        <ContactShadows 
            position={[0, -0.01, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={2} 
            far={4.5} 
            resolution={512} 
        />
        <Grid position={[0, -0.01, 0]} infiniteGrid sectionSize={1} sectionColor="#333" cellColor="#111" fadeDistance={30} />
        
        {/* X Axis (Red) */}
        <Line 
          points={[[-100, 0, 0], [100, 0, 0]]} 
          color="#ff4060" 
          lineWidth={1} 
          transparent 
          opacity={0.5} 
          position={[0, 0.001, 0]} 
        />
        
        {/* Z Axis (Blue) */}
        <Line 
          points={[[0, 0, -100], [0, 0, 100]]} 
          color="#2fa1ff" 
          lineWidth={1} 
          transparent 
          opacity={0.5} 
          position={[0, 0.001, 0]} 
        />

        {nodes.map((node) => (
          <GeoMesh key={node.id} data={node} isSelected={selectedId === node.id} />
        ))}

        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport axisColors={["#ff4060", "#20df80", "#2fa1ff"]} labelColor="white" />
        </GizmoHelper>
      </Suspense>
    </>
  );
}

export default function Scene() {
  const setSelectedId = useGeoStore((state) => state.setSelectedId);

  return (
    <div className="w-full h-full bg-black">
      <Canvas 
        shadows
        dpr={[1, 2]}
        gl={{ 
            antialias: true, 
            powerPreference: "high-performance",
            alpha: false,
            preserveDrawingBuffer: false
        }}
        camera={{ position: [5, 5, 5], fov: 45 }}
        onPointerMissed={() => {
            const state = useGeoStore.getState();
            if (!state.isGrabActive && !state.selectionLock) setSelectedId(null);
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
