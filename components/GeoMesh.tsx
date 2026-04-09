/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as THREE from "three";
import React, { useMemo, useRef, useLayoutEffect, useEffect } from "react";
import { PivotControls } from "@react-three/drei";
import { UniversalGeometry } from "@/types/geometry";
import { useGeoStore } from "@/lib/store";

interface GeoMeshProps {
  data: UniversalGeometry;
  isSelected: boolean;
}

export function GeoMesh({
  data,
  isSelected,
}: GeoMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const setMeshRef = useGeoStore((state) => state.setMeshRef);
  const setSelectedId = useGeoStore((state) => state.setSelectedId);
  const isGrabActive = useGeoStore((state) => state.isGrabActive);
  const updateTransform = useGeoStore((state) => state.updateTransform);

  // Стабільна реєстрація рефа
  useEffect(() => {
    if (meshRef.current) setMeshRef(data.id, meshRef.current);
    return () => setMeshRef(data.id, null);
  }, [data.id, setMeshRef, isGrabActive]); // Пере-реєструємо при зміні стану, на всяк випадок

  // Матриця півота (лише Позиція та Ротація)
  const pivotMatrix = useMemo(() => {
    const m = new THREE.Matrix4();
    m.compose(
      new THREE.Vector3(...data.transform.position),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(...data.transform.rotation)),
      new THREE.Vector3(1, 1, 1) // Скейл завжди тут 1
    );
    return m;
  }, [data.id, ...data.transform.position, ...data.transform.rotation]);

  if (!data.settings.visible) return null;

  return (
    <PivotControls
      key={data.id} // Стабільний ключ
      enabled={isSelected && !isGrabActive}
      visible={isSelected && !isGrabActive}
      matrix={pivotMatrix}
      autoTransform={true}
      depthTest={false}
      fixed={false}
      scale={0.7}
      onDragEnd={() => {
        if (meshRef.current) {
          const worldPos = new THREE.Vector3();
          const worldQuat = new THREE.Quaternion();
          const worldScale = new THREE.Vector3();
          meshRef.current.getWorldPosition(worldPos);
          meshRef.current.getWorldQuaternion(worldQuat);
          meshRef.current.getWorldScale(worldScale);
          const worldRot = new THREE.Euler().setFromQuaternion(worldQuat);

          updateTransform(data.id, {
            position: [worldPos.x, worldPos.y, worldPos.z],
            rotation: [worldRot.x, worldRot.y, worldRot.z],
            scale: [worldScale.x, worldScale.y, worldScale.z],
          });
        }
      }}
    >
      <mesh
        ref={meshRef}
        name={data.id}
        // ВАЖЛИВО: Під час Grab ми ігноруємо пропси, щоб BlenderControls міг рухати меш напряму
        position={isSelected && isGrabActive ? undefined : [0, 0, 0]}
        rotation={isSelected && isGrabActive ? undefined : [0, 0, 0]}
        scale={isSelected && isGrabActive ? undefined : data.transform.scale}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          if (isGrabActive) return; 
          
          setSelectedId(data.id);
          
          // PivotControls are visually overlaid but mathematically might be behind the mesh surface.
          // If we unconditionally stop propagation, the manipulators become unclickable.
          // We check all raycast intersections to see if an unnamed mesh (like a Pivot axis) was hit.
          // If so, we let the event propagate DOWN the ray to the Pivot so the user can drag it.
          const isHoveringPivot = e.intersections.some((hit) => !hit.object.name);
          
          if (!isSelected || !isHoveringPivot) {
            e.stopPropagation();
          }
        }}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position" count={data.attributes.position.length / 3}
            array={data.attributes.position} itemSize={3}
            args={[data.attributes.position, 3]}
          />
          {data.attributes.normal && (
            <bufferAttribute
              attach="attributes-normal" count={data.attributes.normal.length / 3}
              array={data.attributes.normal} itemSize={3}
              args={[data.attributes.normal, 3]}
            />
          )}
          {data.attributes.uv && (
            <bufferAttribute
              attach="attributes-uv" count={data.attributes.uv.length / 2}
              array={data.attributes.uv} itemSize={2}
              args={[data.attributes.uv, 2]}
            />
          )}
          {data.attributes.index && (
            <bufferAttribute
              attach="index" count={data.attributes.index.length}
              array={data.attributes.index} itemSize={1}
              args={[data.attributes.index, 1]}
            />
          )}
        </bufferGeometry>
        <meshStandardMaterial
          color={isSelected ? "#facc15" : data.settings.color}
          wireframe={data.settings.wireframe}
          side={THREE.DoubleSide}
          roughness={0.4}
          metalness={0.5}
          envMapIntensity={1}
        />
      </mesh>
    </PivotControls>
  );
}
