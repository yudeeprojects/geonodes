"use client";

import React from "react";
import { useGeoStore } from "@/lib/store";
import * as PRISTINES from "@/lib/nodes/primitives";
import { 
  Cube, 
  Sphere, 
  Cylinder, 
  Triangle, 
  Circle, 
  GitDiff, 
  Square,
  Selection
} from "@phosphor-icons/react";

const PRIMITIVES = [
  { name: "Box", creator: PRISTINES.createBox, color: "#3b82f6", Icon: Cube },
  { name: "Sphere", creator: PRISTINES.createSphere, color: "#ef4444", Icon: Sphere },
  { name: "Cylinder", creator: PRISTINES.createCylinder, color: "#10b981", Icon: Cylinder },
  { name: "Cone", creator: PRISTINES.createCone, color: "#f59e0b", Icon: Triangle }, // Using Triangle as alternative for Cone
  { name: "Torus", creator: PRISTINES.createTorus, color: "#facc15", Icon: Selection },
  { name: "TorusKnot", creator: PRISTINES.createTorusKnot, color: "#8b5cf6", Icon: GitDiff },
  { name: "Plane", creator: PRISTINES.createPlane, color: "#ec4899", Icon: Square },
  { name: "Circle", creator: PRISTINES.createCircle, color: "#06b6d4", Icon: Circle },
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
    <div className="flex flex-col gap-1.5 p-1.5 bg-black/40 h-full">
      <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] py-3 text-center border-b border-white/5 mb-2">
        Primitives
      </div>
      {PRIMITIVES.map((prim) => {
        const { Icon } = prim;
        return (
          <button
            key={prim.name}
            onClick={(e) => {
                handleAdd(prim.creator, prim.name, prim.color);
                e.currentTarget.blur();
            }}
            className="w-11 h-11 flex items-center justify-center text-white/70 hover:text-white bg-white/5 hover:bg-white/15 rounded-xl transition-all border border-white/5 hover:border-white/10 active:scale-90 group relative"
            title={prim.name}
          >
            <Icon size={24} weight="duotone" style={{ color: prim.color }} className="opacity-80 group-hover:opacity-100" />
            
            {/* Tooltip hint */}
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-[10px] font-bold text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 z-50">
              {prim.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
