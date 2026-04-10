"use client";

import React, { useMemo, useCallback, useRef, useState } from "react";
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  BackgroundVariant,
  ReactFlowProvider
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useGeoStore } from "@/lib/store";

// Node Components
import GeometryInputNode from "./InputNode";
import GeometryOutputNode from "./OutputNode";
import TransformNode from "./nodes/TransformNode";
import TranslateNode from "./nodes/TranslateNode";
import RotateNode from "./nodes/RotateNode";
import ScaleNode from "./nodes/ScaleNode";
import IntegerNode from "./nodes/IntegerNode";
import FloatNode from "./nodes/FloatNode";
import GlobalTranslateNode from "./nodes/GlobalTranslateNode";
import GlobalRotateNode from "./nodes/GlobalRotateNode";
import GlobalScaleNode from "./nodes/GlobalScaleNode";
import GlobalTransformNode from "./nodes/GlobalTransformNode";
import { AddNodeMenu } from "./AddNodeMenu";

const nodeTypes = {
  geometryInput: GeometryInputNode,
  geometryOutput: GeometryOutputNode,
  transform: TransformNode,
  translate: TranslateNode,
  rotate: RotateNode,
  scale: ScaleNode,
  integer: IntegerNode,
  float: FloatNode,
  globalTranslate: GlobalTranslateNode,
  globalRotate: GlobalRotateNode,
  globalScale: GlobalScaleNode,
  globalTransform: GlobalTransformNode,
};

function NodeEditorContent() {
  const nodes = useGeoStore((state) => state.graphNodes);
  const edges = useGeoStore((state) => state.graphEdges);
  const onNodesChange = useGeoStore((state) => state.onNodesChange);
  const onEdgesChange = useGeoStore((state) => state.onEdgesChange);
  const onConnect = useGeoStore((state) => state.onConnect);
  const onReconnect = useGeoStore((state) => state.onReconnect);
  const deleteEdge = useGeoStore((state) => state.deleteEdge);
  const syncGraphToUserData = useGeoStore((state) => state.syncGraphToUserData);

  // Always-fresh edges ref for isValidConnection
  const edgesRef = useRef(edges);
  edgesRef.current = edges;

  const edgeBeingReconnected = useRef<string | null>(null);
  
  // Context Menu State
  const [menuPosition, setMenuPosition] = useState<{ x: number, y: number, clientX: number, clientY: number } | null>(null);

  const rfStyle = useMemo(() => ({
    backgroundColor: "#111111",
    width: "100%",
    height: "100%",
  }), []);

  const defaultEdgeOptions = {
    animated: false,
    style: { stroke: "#34d399", strokeWidth: 3 }, 
    interactionWidth: 20, 
  };

  const onReconnectStart = useCallback((_: any, edge: any) => {
    edgeBeingReconnected.current = edge.id;
  }, []);

  const onReconnectSuccess = useCallback((oldEdge: any, newConnection: any) => {
    edgeBeingReconnected.current = null;
    onReconnect(oldEdge, newConnection);
  }, [onReconnect]);

  const onReconnectEnd = useCallback((event: any) => {
    if (edgeBeingReconnected.current && !event.target.closest('.react-flow__handle')) {
        deleteEdge(edgeBeingReconnected.current);
    }
    edgeBeingReconnected.current = null;
  }, [deleteEdge]);

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const containerBounds = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: event.clientX - containerBounds.left,
      y: event.clientY - containerBounds.top,
      clientX: event.clientX,
      clientY: event.clientY
    });
  }, []);

  // Prevent multiple connections to the same input handle (like Blender)
  // Use ref to always read the freshest edges and avoid stale closure
  const isValidConnection = useCallback((connection: any) => {
    const alreadyConnected = edgesRef.current.some(
      (e) => e.target === connection.target && e.targetHandle === connection.targetHandle
    );
    return !alreadyConnected;
  }, []); // no deps — always reads from ref

  return (
    <div className="flex-1 w-full h-full relative" onContextMenu={(e) => e.preventDefault()}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnectSuccess}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        onNodeDragStop={syncGraphToUserData}
        onPaneContextMenu={onPaneContextMenu}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        style={rfStyle}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        colorMode="dark"
      >
        <Background 
          color="#333" 
          gap={24} 
          size={1.5} 
          variant={BackgroundVariant.Dots} 
        />
        <Controls 
          className="!bg-black/60 !border-white/10 !fill-white/50" 
        />
        <MiniMap 
          className="!bg-black/40 !border-white/10" 
          maskColor="rgba(0,0,0,0.4)"
          nodeBorderRadius={8}
        />
        
        <AddNodeMenu position={menuPosition} onClose={() => setMenuPosition(null)} />
      </ReactFlow>

      {/* Overlay breadcrumbs/status */}
      <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2">
         <div className="bg-black/80 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] uppercase font-black tracking-widest text-white/40">
               Geometry Node Tree
            </span>
         </div>
      </div>
      
      {/* Absolute Add Button Hint */}
      <div className="absolute top-4 right-4 pointer-events-none flex items-center gap-2">
         <div className="bg-white/5 px-3 py-1.5 rounded flex items-center gap-2 border border-white/10 text-[9px] uppercase font-bold text-white/40">
            Right Click to Add Node
         </div>
      </div>
    </div>
  );
}

export function NodeEditor() {
  return (
    <ReactFlowProvider>
      <NodeEditorContent />
    </ReactFlowProvider>
  );
}
