/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useGeoStore } from "@/lib/store";
import { Selection, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { PanelHeader } from "./properties/PanelHeader";
import { TransformSection } from "./properties/TransformSection";
import { MaterialSection } from "./properties/MaterialSection";
import { VisibilitySection } from "./properties/VisibilitySection";

export function PropertiesPanel() {
  const selectedId = useGeoStore((state) => state.selectedId);
  const nodes = useGeoStore((state) => state.nodes);
  const isPropertiesPanelOpen = useGeoStore((state) => state.isPropertiesPanelOpen);
  const togglePropertiesPanel = useGeoStore((state) => state.togglePropertiesPanel);

  const selectedNode = nodes.find((n) => n.id === selectedId);

  return (
    <div 
      className={`absolute top-0 right-0 h-full z-30 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isPropertiesPanelOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Toggle Button (Floating Hook) */}
      <button
        onClick={togglePropertiesPanel}
        className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 w-8 h-12 bg-black/60 backdrop-blur-xl border border-r-0 border-white/10 rounded-l-xl flex items-center justify-center text-white/50 hover:text-white transition-colors group"
        title="Toggle Properties Panel (N)"
      >
        {isPropertiesPanelOpen ? (
          <CaretRight size={18} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
        ) : (
          <CaretLeft size={18} weight="bold" className="group-hover:-translate-x-0.5 transition-transform" />
        )}
      </button>

      <div className="w-80 h-full bg-black/60 backdrop-blur-3xl border-l border-white/10 flex flex-col text-white overflow-hidden shadow-2xl">
        {!selectedNode ? (
          <div className="flex-1 flex flex-col items-center justify-center text-white/20 p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5">
                <Selection size={40} weight="thin" />
            </div>
            <p className="text-sm tracking-widest uppercase font-bold text-white/40">No Selection</p>
            <p className="mt-2 text-[10px] text-white/20 leading-relaxed uppercase tracking-tighter">Select a node in the scene to adjust its properties</p>
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
