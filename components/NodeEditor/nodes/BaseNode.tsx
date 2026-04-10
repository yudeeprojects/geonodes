"use client";

import React, { ReactNode } from "react";
import { Handle, Position, useEdges, useNodeId } from "@xyflow/react";

interface BaseNodeProps {
  label: string;
  headerColor: string;
  inputs?: Array<{ 
    id: string; 
    label: string; 
    type: "geometry" | "value";
    value?: number;
    onChange?: (val: number) => void;
    step?: number;
  }>;
  outputs?: Array<{ id: string; label: string; type: "geometry" | "value" }>;
  children?: ReactNode;
  selected?: boolean;
}

const styles = {
  geometry: "bg-emerald-400 border-emerald-900",
  value: "bg-slate-400 border-slate-700",
};

export function BaseNode({ 
  label, 
  headerColor, 
  inputs = [], 
  outputs = [], 
  children,
  selected 
}: BaseNodeProps) {
  const nodeId = useNodeId();
  const edges = useEdges();

  // Build a set of handles that already have a connection on this node
  const connectedHandles = new Set(
    edges
      .filter((e) => e.target === nodeId && e.targetHandle)
      .map((e) => e.targetHandle as string)
  );

  return (
    <div className={`min-w-[180px] bg-[#1a1a1a] border ${selected ? 'border-yellow-400 ring-1 ring-yellow-400' : 'border-white/10'} rounded-lg shadow-2xl group transition-all duration-300`}>
      {/* Header */}
      <div 
        className="px-3 py-1.5 flex items-center justify-between border-b border-white/10 rounded-t-lg"
        style={{ backgroundColor: headerColor }}
      >
        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white brightness-110">
          {label}
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white/40 transition-all" />
      </div>

      {/* Inputs Section */}
      {inputs.length > 0 && (
        <div className="flex flex-col gap-1.5 py-2">
          {inputs.map((input) => {
            const isOccupied = connectedHandles.has(input.id);
            return (
              <div key={input.id} className="relative flex items-center justify-between px-3 h-7">
                <div className="flex items-center">
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={input.id}
                    className={`!w-3 !h-3 !border-2 !border-[#1a1a1a] !left-[-6px] ${styles[input.type]} hover:!scale-125 transition-all ${isOccupied ? '!opacity-60' : ''}`}
                  />
                  <span className={`text-[9px] uppercase font-bold ml-2 tracking-tighter ${isOccupied ? 'text-emerald-400/70' : 'text-white/40'}`}>
                    {input.label}
                  </span>
                </div>
                
                {/* Only show the manual input field when the handle is NOT connected */}
                {input.type === 'value' && input.onChange && !isOccupied && (
                  <input 
                    type="number"
                    step={input.step || 0.1}
                    value={input.value ?? 0}
                    onChange={(e) => input.onChange?.(parseFloat(e.target.value))}
                    className="nodrag w-16 bg-black/40 border border-white/5 rounded px-1.5 py-0.5 text-[9px] text-blue-400 font-mono outline-none focus:border-blue-500/50 text-right ml-2"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Body / Custom Content */}
      <div className="p-3 empty:hidden">
        {children}
      </div>

      {/* Outputs Section */}
      {outputs.length > 0 && (
        <div className="flex flex-col gap-2 py-2 bg-black/10">
          {outputs.map((output) => (
            <div key={output.id} className="relative flex items-center justify-end px-3 h-6">
              <span className="text-[9px] uppercase font-bold text-white/30 mr-2 tracking-tighter">
                {output.label}
              </span>
              <Handle
                type="source"
                position={Position.Right}
                id={output.id}
                className={`!w-3 !h-3 !border-2 !border-[#1a1a1a] !right-[-6px] ${styles[output.type]} hover:!scale-125 transition-all`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

