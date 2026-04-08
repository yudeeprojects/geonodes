/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import * as THREE from "three";
import { UniversalGeometry } from "@/types/geometry";
import { initialNodes } from "@/data/mockNodes";

interface GeoState {
  nodes: UniversalGeometry[];
  selectedId: string | null;
  isGrabActive: boolean;
  selectionLock: boolean; // Блокування деселекції після Grab mode
  
  meshRefs: Map<string, THREE.Mesh>;

  // Actions
  setSelectedId: (id: string | null) => void;
  setIsGrabActive: (active: boolean) => void;
  setSelectionLock: (lock: boolean) => void;
  setMeshRef: (id: string, ref: THREE.Mesh | null) => void;
  setNodes: (nodes: UniversalGeometry[]) => void;
  
  updateTransform: (
    id: string,
    transform: Partial<{
      position: [number, number, number];
      rotation: [number, number, number];
      scale: [number, number, number];
    }>
  ) => void;

  addNode: (node: UniversalGeometry) => void;
  deleteNode: (id: string) => void;
}

export const useGeoStore = create<GeoState>((set) => ({
  nodes: initialNodes,
  selectedId: null,
  isGrabActive: false,
  selectionLock: false,
  meshRefs: new Map(),

  setSelectedId: (id) => set((state) => {
    // Якщо заблоковано - ігноруємо скидання (null), але дозволяємо зміну на інший об'єкт
    if (state.selectionLock && id === null) return state;
    return { selectedId: id };
  }),
  
  setIsGrabActive: (isGrabActive) => set({ isGrabActive }),
  setSelectionLock: (selectionLock) => set({ selectionLock }),
  
  setMeshRef: (id, ref) => set((state) => {
    const newRefs = new Map(state.meshRefs);
    if (ref) newRefs.set(id, ref);
    else newRefs.delete(id);
    return { meshRefs: newRefs };
  }),

  setNodes: (nodes) => set({ nodes }),

  updateTransform: (id, transform) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id 
          ? { ...node, transform: { ...node.transform, ...transform } } 
          : node
      ),
    })),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),
}));
