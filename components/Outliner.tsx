"use client";

import React from "react";
import { useGeoStore } from "@/lib/store";
import { 
  Cube, 
  Sphere, 
  Cylinder, 
  Triangle, 
  Selection, 
  GitDiff, 
  Square, 
  Circle,
  Eye,
  EyeSlash,
  Trash,
  List
} from "@phosphor-icons/react";

const ICON_MAP: Record<string, any> = {
  Box: Cube,
  Sphere: Sphere,
  Cylinder: Cylinder,
  Cone: Triangle,
  Torus: Selection,
  TorusKnot: GitDiff,
  Plane: Square,
  Circle: Circle,
};

export function Outliner() {
  const nodes = useGeoStore((state) => state.nodes);
  const selectedId = useGeoStore((state) => state.selectedId);
  const setSelectedId = useGeoStore((state) => state.setSelectedId);
  const updateNodeSettings = useGeoStore((state) => state.updateNodeSettings);
  const deleteNode = useGeoStore((state) => state.deleteNode);

  return (
    <div className="flex flex-col h-full bg-black/20 border-b border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/5">
        <List size={16} className="text-white/40" />
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Outliner</h3>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
        {nodes.length === 0 ? (
          <div className="h-20 flex flex-col items-center justify-center text-white/10 uppercase text-[9px] tracking-widest font-bold">
            Empty Scene
          </div>
        ) : (
          nodes.map((node) => {
            const Icon = ICON_MAP[node.userData.primitiveType] || Cube;
            const isSelected = selectedId === node.id;
            const isVisible = node.settings.visible;

            return (
              <div 
                key={node.id}
                onClick={() => setSelectedId(node.id)}
                className={`group flex items-center justify-between gap-2 px-2 py-1 rounded-md transition-all cursor-pointer ${
                  isSelected 
                    ? "bg-yellow-400/20 shadow-lg shadow-yellow-400/5 border border-yellow-400/20" 
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`p-1 rounded ${isSelected ? "text-yellow-400" : "text-white/30 group-hover:text-white/60"}`}>
                    <Icon size={14} weight="duotone" />
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[10px] font-bold truncate ${isSelected ? "text-white" : "text-white/70"}`}>
                      {node.userData.primitiveType || node.type}
                    </span>
                    <span className="text-[7px] font-mono text-white/10 truncate uppercase">
                        {node.id.split('-')[1] || node.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Visibility Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateNodeSettings(node.id, { visible: !isVisible });
                    }}
                    className={`p-1 rounded transition-colors ${
                      isVisible ? "text-white/40 hover:text-white" : "text-yellow-400 hover:text-yellow-300"
                    }`}
                    title={isVisible ? "Hide Obj" : "Show Obj"}
                  >
                    {isVisible ? <Eye size={12} /> : <EyeSlash size={12} />}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                    className="p-1.5 rounded-md text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    title="Delete Obj"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
