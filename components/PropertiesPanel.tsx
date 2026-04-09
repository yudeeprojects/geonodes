/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useGeoStore } from "@/lib/store";
import { 
  Cube, 
  ArrowsOut, 
  Palette, 
  Selection, 
  Eye, 
  EyeSlash,
  Square
} from "@phosphor-icons/react";

export function PropertiesPanel() {
  const selectedId = useGeoStore((state) => state.selectedId);
  const nodes = useGeoStore((state) => state.nodes);
  const updateTransform = useGeoStore((state) => state.updateTransform);
  const updateNodeSettings = useGeoStore((state) => state.updateNodeSettings);

  const selectedNode = nodes.find((n) => n.id === selectedId);

  if (!selectedNode) {
    return (
      <div className="w-80 h-full bg-black/40 backdrop-blur-xl border-l border-white/5 flex flex-col items-center justify-center text-white/20">
        <Selection size={48} weight="thin" />
        <p className="mt-4 text-xs tracking-widest uppercase font-medium">Select a node to edit</p>
      </div>
    );
  }

  const handleTransformChange = (axis: "x" | "y" | "z", value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    
    const newPos = [...selectedNode.transform.position];
    if (axis === "x") newPos[0] = num;
    if (axis === "y") newPos[1] = num;
    if (axis === "z") newPos[2] = num;

    updateTransform(selectedNode.id, { position: newPos as [number, number, number] });
  };

  return (
    <div className="w-80 h-full bg-black/60 backdrop-blur-2xl border-l border-white/10 flex flex-col text-white overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center text-yellow-400 border border-yellow-400/20 shadow-lg shadow-yellow-400/5">
            <Cube size={24} weight="duotone" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white/90 uppercase">{selectedNode.type}</h2>
            <p className="text-[10px] text-white/40 font-mono">{selectedNode.id}</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 p-6 space-y-8 pb-20">
        
        {/* Transform Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white/40 mb-4">
            <ArrowsOut size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Transform</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] text-white/30 uppercase tracking-tighter">Position</label>
              <div className="grid grid-cols-3 gap-2">
                {(['x', 'y', 'z'] as const).map((axis, i) => (
                  <div key={axis} className="relative group">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-white/20 group-focus-within:text-yellow-400/50 uppercase">{axis}</span>
                    <input
                      type="number"
                      value={selectedNode.transform.position[i].toFixed(2)}
                      onChange={(e) => handleTransformChange(axis, e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-6 pr-2 text-xs font-mono focus:outline-none focus:border-yellow-400/30 focus:bg-white/10 transition-all hover:bg-white/10"
                      step={0.1}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Material Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white/40 mb-4">
            <Palette size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Material</span>
          </div>

          <div className="space-y-5">
            {/* Color */}
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-white/40 uppercase tracking-tight">Base Color</label>
              <div className="relative group">
                <input
                  type="color"
                  value={selectedNode.settings.color}
                  onChange={(e) => updateNodeSettings(selectedNode.id, { color: e.target.value })}
                  className="w-12 h-6 bg-transparent border-none cursor-pointer rounded-md overflow-hidden"
                />
                <div className="absolute inset-0 pointer-events-none rounded-md border border-white/10 group-hover:border-white/20 transition-colors" />
              </div>
            </div>

            {/* Wireframe */}
            <div className="flex items-center justify-between">
                <label className="text-[10px] text-white/40 uppercase tracking-tight">Wireframe</label>
                <button
                    onClick={() => updateNodeSettings(selectedNode.id, { wireframe: !selectedNode.settings.wireframe })}
                    className={`w-10 h-5 rounded-full p-1 transition-all duration-300 ${selectedNode.settings.wireframe ? 'bg-yellow-400' : 'bg-white/10'}`}
                >
                    <div className={`w-3 h-3 rounded-full bg-black transition-transform duration-300 ${selectedNode.settings.wireframe ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>
          </div>
        </section>

        {/* Visibility Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white/40 mb-4">
            {selectedNode.settings.visible ? <Eye size={16} /> : <EyeSlash size={16} />}
            <span className="text-[10px] font-bold uppercase tracking-widest">Visibility</span>
          </div>

          <button
            onClick={() => updateNodeSettings(selectedNode.id, { visible: !selectedNode.settings.visible })}
            className={`w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                selectedNode.settings.visible 
                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20'
            }`}
          >
            {selectedNode.settings.visible ? <Eye size={14} /> : <EyeSlash size={14} />}
            {selectedNode.settings.visible ? 'Hide Element' : 'Show Element'}
          </button>
        </section>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
