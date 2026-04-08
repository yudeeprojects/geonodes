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
  const setSelectedId = useGeoStore((state) => state.setSelectedId);
  const isGrabActive = useGeoStore((state) => state.isGrabActive);
  const updateTransform = useGeoStore((state) => state.updateTransform);
  const setMeshRef = useGeoStore((state) => state.setMeshRef);

  // Реєструємо меш у сторі (завжди, незалежно від стану)
  useEffect(() => {
    if (meshRef.current) {
        setMeshRef(data.id, meshRef.current);
    }
  }, [data.id, setMeshRef]);

  // Стабільна матриця для ініціалізації PivotControls
  const matrix = useMemo(() => {
    const m = new THREE.Matrix4();
    m.compose(
      new THREE.Vector3(...data.transform.position),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(...data.transform.rotation)),
      new THREE.Vector3(...data.transform.scale)
    );
    return m;
  }, [data.id, ...data.transform.position, ...data.transform.rotation, ...data.transform.scale]);

  // Шари маніпуляторів
  useLayoutEffect(() => {
    if (isSelected && meshRef.current) {
      const pivotInternalGroup = meshRef.current.parent;
      if (pivotInternalGroup && pivotInternalGroup !== meshRef.current.parent.parent) { 
        pivotInternalGroup.traverse((obj: THREE.Object3D) => {
          if (obj !== meshRef.current) obj.layers.set(1);
          else obj.layers.set(0);
        });
      }
    }
  }, [isSelected]); 

  if (!data.settings.visible) return null;

  return (
    <PivotControls
      key={data.id}
      visible={isSelected && !isGrabActive}
      matrix={matrix}
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
        // ВАЖЛИВО: Під час Grab mode ми прибираємо пропси позиції, 
        // щоб BlenderControls міг вільно рухати об'єкт через реф.
        position={isGrabActive ? undefined : [0, 0, 0]}
        rotation={isGrabActive ? undefined : [0, 0, 0]}
        scale={isGrabActive ? undefined : [1, 1, 1]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(data.id);
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
          roughness={0.5}
          metalness={0}
          envMapIntensity={1}
        />
      </mesh>
    </PivotControls>
  );
}
