/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useGeoStore } from "@/lib/store";
import { Selection } from "@phosphor-icons/react";
import { PanelHeader } from "./properties/PanelHeader";
import { TransformSection } from "./properties/TransformSection";
import { MaterialSection } from "./properties/MaterialSection";
import { VisibilitySection } from "./properties/VisibilitySection";

export function PropertiesPanel() {
  const selectedId = useGeoStore((state) => state.selectedId);
  const nodes = useGeoStore((state) => state.nodes);

  const selectedNode = nodes.find((n) => n.id === selectedId);

  return (
    <div className="flex flex-col h-full text-white overflow-hidden">
        {!selectedNode ? (
          <div className="flex-1 flex flex-col items-center justify-center text-white/20 p-8 text-center bg-white/5 m-3 rounded-2xl border border-white/5">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5">
                <Selection size={32} weight="thin" />
            </div>
            <p className="text-[9px] tracking-widest uppercase font-bold text-white/40 leading-relaxed">
                Select a node in the scene to adjust its properties
            </p>
          </div>
        ) : (
          <>
            <PanelHeader node={selectedNode} />

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-20">
              <TransformSection node={selectedNode} />
              <MaterialSection node={selectedNode} />
              <VisibilitySection node={selectedNode} />
            </div>
          </>
        )}
    </div>
  );
}
