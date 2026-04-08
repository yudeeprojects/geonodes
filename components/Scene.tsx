/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, Suspense, memo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  OrbitControls,
  Grid,
  Environment,
  ContactShadows,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";
import { GeoMesh } from "./GeoMesh";
import { BlenderControls } from "./BlenderControls";
import { useGeoStore } from "@/lib/store";

// Компонент для керування шарами камери під час навігації
function CameraLayerManager() {
  const { camera } = useThree();
  useEffect(() => {
    camera.layers.enable(0);
    camera.layers.enable(1);
  }, [camera]);
  return null;
}

// Мемоізований список нод для продуктивності
const NodeList = memo(({ nodes, selectedId }: { nodes: any[], selectedId: string | null }) => {
  return (
    <>
      {nodes.map((node) => (
        <GeoMesh
          key={node.id}
          data={node}
          isSelected={selectedId === node.id}
        />
      ))}
    </>
  );
});
NodeList.displayName = "NodeList";

export default function Scene() {
  const nodes = useGeoStore((state) => state.nodes);
  const selectedId = useGeoStore((state) => state.selectedId);
  const setSelectedId = useGeoStore((state) => state.setSelectedId);
  const deleteNode = useGeoStore((state) => state.deleteNode);

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

  return (
    <div className="w-full h-screen bg-black">
      <Canvas 
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ position: [5, 5, 5], fov: 50 }}
        onPointerMissed={() => {
          // Не деселектимо, якщо ми щойно закінчили Grab mode або він активний
          const state = useGeoStore.getState();
          if (!state.isGrabActive) {
            setSelectedId(null);
          }
        }}
      >
        <CameraLayerManager />
        <BlenderControls />
        
        <OrbitControls 
          makeDefault 
          mouseButtons={{
            LEFT: undefined, 
            MIDDLE: THREE.MOUSE.ROTATE,
            RIGHT: THREE.MOUSE.PAN,
          }}
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
          shadow-mapSize={[1024, 1024]}
        />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          
          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.4}
            scale={20} blur={2} far={4.5}
          />

          <Grid
            position={[0, -0.01, 0]}
            infiniteGrid
            sectionSize={1}
            sectionColor="#333"
            cellColor="#111"
            fadeDistance={30}
          />

          <NodeList nodes={nodes} selectedId={selectedId} />

          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport axisColors={["#ff4060", "#20df80", "#2fa1ff"]} labelColor="white" />
          </GizmoHelper>
        </Suspense>
      </Canvas>
    </div>
  );
}
