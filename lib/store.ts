/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import * as THREE from "three";
import { UniversalGeometry } from "@/types/geometry";
import { initialNodes } from "@/data/mockNodes";

// НЕ-РЕАКТИВНИЙ РЕЄСТР
export const meshRegistry = new Map<string, THREE.Mesh>();
// НЕ-РЕАКТИВНИЙ СТАН НАВІГАЦІЇ
export const navState = { isNavigating: false };

interface GeoState {
  nodes: UniversalGeometry[];
  selectedId: string | null;
  isGrabActive: boolean;
  selectionLock: boolean;
  
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

  updateNodeSettings: (
    id: string,
    settings: Partial<UniversalGeometry["settings"]>
  ) => void;

  addNode: (node: UniversalGeometry) => void;
  deleteNode: (id: string) => void;
}

export const useGeoStore = create<GeoState>((set) => ({
  nodes: initialNodes,
  selectedId: null,
  isGrabActive: false,
  selectionLock: false,

  setSelectedId: (id) => set((state) => {
    if (state.selectionLock && id === null) return state;
    return { selectedId: id };
  }),
  
  setIsGrabActive: (isGrabActive) => set({ isGrabActive }),
  setSelectionLock: (selectionLock) => set({ selectionLock }),
  
  setMeshRef: (id, ref) => {
    if (ref) meshRegistry.set(id, ref);
    else meshRegistry.delete(id);
  },

  setNodes: (nodes) => set({ nodes }),

  updateTransform: (id, transform) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id 
          ? { ...node, transform: { ...node.transform, ...transform } } 
          : node
      ),
    })),

  updateNodeSettings: (id, settings) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id 
          ? { ...node, settings: { ...node.settings, ...settings } } 
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
