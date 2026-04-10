"use client";

import React from "react";
import { useGeoStore } from "@/lib/store";
import * as PRISTINES from "@/lib/nodes";
import { 
  Cube, 
  Sphere, 
  Cylinder, 
  Triangle, 
  Circle, 
  GitDiff, 
  Square,
  Selection,
  Mountains,
  MapTrifold,
  Waveform,
  Drop,
  Shapes
} from "@phosphor-icons/react";

const PRIMITIVES = [
  { name: "Box", creator: PRISTINES.createBox, color: "#3b82f6", Icon: Cube },
  { name: "Sphere", creator: PRISTINES.createSphere, color: "#ef4444", Icon: Sphere },
  { name: "Cylinder", creator: PRISTINES.createCylinder, color: "#10b981", Icon: Cylinder },
  { name: "Cone", creator: PRISTINES.createCone, color: "#f59e0b", Icon: Triangle },
  { name: "Torus", creator: PRISTINES.createTorus, color: "#facc15", Icon: Selection },
  { name: "TorusKnot", creator: PRISTINES.createTorusKnot, color: "#8b5cf6", Icon: GitDiff },
  { name: "Plane", creator: PRISTINES.createPlane, color: "#ec4899", Icon: Square },
  { name: "Circle", creator: PRISTINES.createCircle, color: "#06b6d4", Icon: Circle },
];

const TERRAIN_TOOLS = [
  { name: "Heightmap", Icon: MapTrifold, color: "#10b981", creator: PRISTINES.createHeightmap },
  { name: "Noise", Icon: Waveform, color: "#3b82f6", creator: null },
  { name: "Erosion", Icon: Drop, color: "#ef4444", creator: null },
];

export function Toolbar() {
  const addNode = useGeoStore((state) => state.addNode);
  const setSelectedId = useGeoStore((state) => state.setSelectedId);

  const handleAdd = (creator: any, name: string, color: string) => {
    const id = `${name.toLowerCase()}-${Date.now()}`;
    const newNode = creator(id, [0, 0, 0], color);
    addNode(newNode);
    setSelectedId(id);
  };

  return (
    <div className="flex flex-col gap-4 p-1.5 bg-black/40 h-full">
      <div className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em] py-3 text-center border-b border-white/5 mb-1">
        Tools
      </div>

      {/* Category: Primitives */}
      <div className="group relative">
        <button className="w-11 h-11 flex items-center justify-center text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
          <Shapes size={22} weight="duotone" className="text-blue-400 opacity-80" />
        </button>

        {/* Submenu: Flyout to the Right */}
        <div className="absolute left-full ml-3 top-0 hidden group-hover:flex flex-col gap-1.5 p-1.5 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 before:content-[''] before:absolute before:-left-3 before:top-0 before:bottom-0 before:w-3">
          <div className="px-3 py-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest border-b border-white/5 mb-1">
            Primitives
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {PRIMITIVES.map((prim) => {
              const { Icon } = prim;
              return (
                <button
                  key={prim.name}
                  onClick={(e) => {
                      handleAdd(prim.creator, prim.name, prim.color);
                      e.currentTarget.blur();
                  }}
                  className="w-11 h-11 flex items-center justify-center text-white/70 hover:text-white bg-white/5 hover:bg-white/15 rounded-xl transition-all border border-white/5 group/tool relative"
                  title={prim.name}
                >
                  <Icon size={20} weight="duotone" style={{ color: prim.color }} className="opacity-80 group-hover/tool:opacity-100" />
                  <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-[10px] font-bold text-white rounded opacity-0 group-hover/tool:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                    {prim.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category: Terrain */}
      <div className="group relative">
        <button className="w-11 h-11 flex items-center justify-center text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
          <Mountains size={22} weight="duotone" className="text-emerald-400 opacity-80" />
        </button>

        {/* Submenu: Flyout to the Right */}
        <div className="absolute left-full ml-3 top-0 hidden group-hover:flex flex-col gap-1.5 p-1.5 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 before:content-[''] before:absolute before:-left-3 before:top-0 before:bottom-0 before:w-3">
          <div className="px-3 py-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest border-b border-white/5 mb-1">
            Terrain
          </div>
          <div className="flex flex-col gap-1.5">
            {TERRAIN_TOOLS.map((tool) => {
              const { Icon } = tool;
              return (
                <button
                  key={tool.name}
                  onClick={(e) => {
                    if (tool.creator) {
                      handleAdd(tool.creator, tool.name, tool.color);
                      e.currentTarget.blur();
                    }
                  }}
                  className={`flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/15 rounded-xl transition-all border border-white/5 group/tool ${!tool.creator && 'opacity-50 cursor-not-allowed filter grayscale'}`}
                >
                  <Icon size={18} weight="duotone" style={{ color: tool.color }} className="opacity-80 group-hover/tool:opacity-100" />
                  <span className="text-[11px] font-medium pr-4">{tool.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
