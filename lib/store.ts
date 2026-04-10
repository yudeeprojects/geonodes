/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import * as THREE from "three";
import { UniversalGeometry } from "@/types/geometry";
import { initialNodes } from "@/data/mockNodes";
import { 
  Connection, 
  Edge, 
  EdgeChange, 
  Node, 
  NodeChange, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges,
  reconnectEdge
} from "@xyflow/react";
import { nodeRegistry } from "@/lib/nodes";

// НЕ-РЕАКТИВНИЙ РЕЄСТР
export const meshRegistry = new Map<string, THREE.Mesh>();
// НЕ-РЕАКТИВНИЙ СТАН НАВІГАЦІЇ
export const navState = { isNavigating: false };

interface GeoState {
  nodes: UniversalGeometry[];
  selectedId: string | null;
  
  // React Flow State (Current Active Graph)
  graphNodes: Node[];
  graphEdges: Edge[];
  
  isGrabActive: boolean;
  selectionLock: boolean;
  isPropertiesPanelOpen: boolean;
  isBottomPanelOpen: boolean;
  isLeftSidebarOpen: boolean;
  isTopPanelOpen: boolean;
  isSettingsOpen: boolean;
  activeSidebarTab: "outliner" | "properties";
  activeBottomTab: "nodes" | "data";
  bottomPanelHeight: number;
  orbitAroundSelection: boolean;
  showManipulators: boolean;
  
  // Actions
  setSelectedId: (id: string | null) => void;
  setIsGrabActive: (active: boolean) => void;
  setSelectionLock: (lock: boolean) => void;
  togglePropertiesPanel: () => void;
  toggleBottomPanel: () => void;
  toggleLeftSidebar: () => void;
  toggleTopPanel: () => void;
  toggleSettings: () => void;
  setOrbitAroundSelection: (orbit: boolean) => void;
  setShowManipulators: (show: boolean) => void;
  setBottomPanelHeight: (height: number) => void;
  setSidebarTab: (tab: "outliner" | "properties") => void;
  setBottomTab: (tab: "nodes" | "data") => void;
  setMeshRef: (id: string, ref: THREE.Mesh | null) => void;
  setNodes: (nodes: UniversalGeometry[]) => void;
  
  // React Flow Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onReconnect: (oldEdge: Edge, newConnection: Connection) => void;
  deleteEdge: (edgeId: string) => void;
  addGraphNode: (type: string, functionName: string, position: { x: number, y: number }) => void;
  setGraph: (nodes: Node[], edges: Edge[]) => void;
  syncGraphToUserData: () => void;
  
  // Logic Actions
  updateNodeData: (nodeId: string, newData: any) => void;
  recomputeGeometry: (id: string) => void;

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

export const useGeoStore = create<GeoState>((set, get) => ({
  nodes: initialNodes,
  selectedId: null,
  graphNodes: [],
  graphEdges: [],
  
  isGrabActive: false,
  selectionLock: false,
  isPropertiesPanelOpen: true,
  isBottomPanelOpen: true,
  isLeftSidebarOpen: true,
  isTopPanelOpen: true,
  isSettingsOpen: false,
  activeSidebarTab: "properties",
  activeBottomTab: "nodes",
  bottomPanelHeight: 320,
  orbitAroundSelection: true,
  showManipulators: true,

  setSelectedId: (id) => {
    const state = get();
    if (state.selectionLock && id === null) return;

    const selectedNode = state.nodes.find(n => n.id === id);
    
    set({ 
      selectedId: id,
      activeSidebarTab: id ? "properties" : state.activeSidebarTab 
    });

    if (selectedNode) {
      const savedGraph = selectedNode.userData.graph;
      if (savedGraph) {
        set({ 
          graphNodes: savedGraph.nodes || [],
          graphEdges: savedGraph.edges || []
        });
      } else {
        set({ graphNodes: [], graphEdges: [] });
      }
    } else {
      set({ graphNodes: [], graphEdges: [] });
    }
  },
  
  setIsGrabActive: (isGrabActive) => set({ isGrabActive }),
  setSelectionLock: (selectionLock) => set({ selectionLock }),
  togglePropertiesPanel: () => set((state) => ({ isPropertiesPanelOpen: !state.isPropertiesPanelOpen })),
  toggleBottomPanel: () => set((state) => ({ isBottomPanelOpen: !state.isBottomPanelOpen })),
  toggleLeftSidebar: () => set((state) => ({ isLeftSidebarOpen: !state.isLeftSidebarOpen })),
  toggleTopPanel: () => set((state) => ({ isTopPanelOpen: !state.isTopPanelOpen })),
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  setOrbitAroundSelection: (orbitAroundSelection) => set({ orbitAroundSelection }),
  setShowManipulators: (showManipulators) => set({ showManipulators }),
  setBottomPanelHeight: (height) => set({ bottomPanelHeight: height }),
  setSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  setBottomTab: (tab) => set({ activeBottomTab: tab }),
  
  setMeshRef: (id, ref) => {
    if (ref) meshRegistry.set(id, ref);
    else meshRegistry.delete(id);
  },

  setNodes: (nodes) => set({ nodes }),

  onNodesChange: (changes) => {
    const { graphNodes } = get();
    set({ graphNodes: applyNodeChanges(changes, graphNodes) });
  },

  onEdgesChange: (changes) => {
    const { graphEdges, selectedId } = get();
    const newEdges = applyEdgeChanges(changes, graphEdges);
    set({ graphEdges: newEdges });
    
    if (selectedId) {
      get().syncGraphToUserData();
      get().recomputeGeometry(selectedId);
    }
  },

  onConnect: (connection) => {
    const { graphEdges, selectedId } = get();
    
    // Normalize null vs undefined for targetHandle comparison.
    // Default graph edges may have targetHandle=undefined, but new connections arrive with null.
    const th = connection.targetHandle ?? null;
    
    // Remove any existing edge going to the same target handle (Blender-style: replace old with new)
    const filteredEdges = graphEdges.filter(
      (e) => !(e.target === connection.target && (e.targetHandle ?? null) === th)
    );

    const newEdges = addEdge(connection, filteredEdges);
    set({ graphEdges: newEdges });
    
    if (selectedId) {
      get().syncGraphToUserData();
      get().recomputeGeometry(selectedId);
    }
  },

  onReconnect: (oldEdge, newConnection) => {
    const { graphEdges, selectedId } = get();
    const newEdges = reconnectEdge(oldEdge, newConnection, graphEdges);
    set({ graphEdges: newEdges });

    if (selectedId) {
        get().syncGraphToUserData();
        get().recomputeGeometry(selectedId);
    }
  },

  deleteEdge: (edgeId) => {
    const { graphEdges, selectedId } = get();
    const newEdges = graphEdges.filter(e => e.id !== edgeId);
    set({ graphEdges: newEdges });

    if (selectedId) {
      get().syncGraphToUserData();
      get().recomputeGeometry(selectedId);
    }
  },

  addGraphNode: (type, functionName, position) => {
    const { graphNodes, selectedId } = get();
    if (!selectedId) return;

    const newNodeId = `${type}-${Date.now()}`;
    const newNodeData: any = {
       label: type.charAt(0).toUpperCase() + type.slice(1),
       type: type,
       functionName: functionName,
       params: {}
    };

    if (type === 'integer' || type === 'float') {
        newNodeData.params = { value: 0 };
    }

    const newNode: Node = {
      id: newNodeId,
      type: type,
      position: position,
      data: newNodeData
    };

    set({ graphNodes: [...graphNodes, newNode] });
    get().syncGraphToUserData();
    get().recomputeGeometry(selectedId);
  },

  syncGraphToUserData: () => {
    const { selectedId, graphNodes, graphEdges } = get();
    if (!selectedId) return;

    set((state) => ({
      nodes: state.nodes.map(n => 
        n.id === selectedId 
          ? { ...n, userData: { ...n.userData, graph: { nodes: graphNodes, edges: graphEdges } } }
          : n
      )
    }));
  },

  setGraph: (nodes, edges) => {
     set({ graphNodes: nodes, graphEdges: edges });
     get().syncGraphToUserData();
  },

  updateNodeData: (nodeId, newData) => {
    const { graphNodes, selectedId } = get();
    const newGraphNodes = graphNodes.map(node => 
      node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
    );
    
    set({ graphNodes: newGraphNodes });

    if (selectedId) {
      set((state) => ({
        nodes: state.nodes.map(n => 
          n.id === selectedId 
            ? { ...n, userData: { ...n.userData, graph: { ...n.userData.graph, nodes: newGraphNodes } } }
            : n
        )
      }));
      get().recomputeGeometry(selectedId);
    }
  },

  // THE RECURSIVE ENGINE: Executes the graph by following edges
  recomputeGeometry: (id) => {
    const state = get();
    const targetNode = state.nodes.find(n => n.id === id);
    if (!targetNode || !targetNode.userData.graph) return;

    const graph = targetNode.userData.graph;
    
    // Internal recursive processor
    const evaluate = (nodeId: string): any => {
      const node = graph.nodes.find((n: any) => n.id === nodeId);
      if (!node) return null;

      const incomingEdges = graph.edges.filter((e: any) => e.target === nodeId);
      const inputs: Record<string, any> = {};

      // Resolve all incoming connections
      incomingEdges.forEach((edge: any) => {
        // We use targetHandle to know WHICH parameter to provide
        const paramName = edge.targetHandle || "geometry"; 
        inputs[paramName] = evaluate(edge.source);
      });

      const { functionName, params } = node.data;
      const logicFn = nodeRegistry[functionName];

      if (typeof logicFn === 'function') {
        const isModifier = ["transform", "translate", "rotate", "scale",
          "globalTranslate", "globalRotate", "globalScale", "globalTransform"
        ].includes(functionName);
        
        if (isModifier) {
           const inputGeom = inputs["geometry"];
           if (!inputGeom) return null; // No point in modifying nothing
           return logicFn(inputGeom, { ...params, ...inputs });
        }
        
        // For primitives, they usually don't have geo inputs, just params
        if (functionName.startsWith("create")) {
           return logicFn(id, targetNode.transform.position, targetNode.settings.color, { ...params, ...inputs });
        }

        // For inputs (Integer/Float), they just return their value or modified value
        return logicFn({ ...params, ...inputs });
      }

      // Default fallback
      if (node.type === 'geometryOutput') {
         return inputs["geometry"] || null;
      }
      
      return params?.value !== undefined ? params.value : null;
    };

    // 1. Find Output node and start evaluation
    const outputNode = graph.nodes.find((n: any) => n.type === 'geometryOutput');
    if (!outputNode) return;

    const resultGeom = evaluate(outputNode.id);

    // 2. Apply global transform if any Global modifier nodes are in the graph
    if (resultGeom?.userData?.globalTransform) {
      const gt = resultGeom.userData.globalTransform;
      const updates: Partial<{ position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] }> = {};
      if (gt.position) updates.position = gt.position;
      if (gt.rotation) updates.rotation = gt.rotation;
      if (gt.scale) updates.scale = gt.scale;
      if (Object.keys(updates).length > 0) {
        set((state) => ({
          nodes: state.nodes.map(n =>
            n.id === id ? { ...n, transform: { ...n.transform, ...updates } } : n
          )
        }));
      }
    }

    // 3. Update the actual 3D object vertex attributes
    if (resultGeom && resultGeom.attributes) {
      set((state) => ({
        nodes: state.nodes.map(n => 
          n.id === id 
            ? { 
                ...n, 
                attributes: resultGeom.attributes,
                userData: { 
                  ...n.userData, 
                  params: resultGeom.userData?.params,
                  geomRevision: (n.userData.geomRevision || 0) + 1
                } 
              } 
            : n
        )
      }));
    } else {
      // Clear geometry if nothing is connected
      set((state) => ({
        nodes: state.nodes.map(n => 
          n.id === id 
            ? { ...n, attributes: { position: new Float32Array(0) } } 
            : n
        )
      }));
    }
  },

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

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
      graphNodes: state.selectedId === id ? [] : state.graphNodes,
      graphEdges: state.selectedId === id ? [] : state.graphEdges,
    })),
}));
