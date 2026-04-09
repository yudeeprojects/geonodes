"use client";

import React from "react";
import { useGeoStore } from "@/lib/store";
import { CaretLeft, CaretRight, List, Sliders } from "@phosphor-icons/react";
import { Outliner } from "./Outliner";
import { PropertiesPanel } from "./PropertiesPanel";

export function RightSidebar() {
  const isPropertiesPanelOpen = useGeoStore((state) => state.isPropertiesPanelOpen);
  const togglePropertiesPanel = useGeoStore((state) => state.togglePropertiesPanel);
  const activeSidebarTab = useGeoStore((state) => state.activeSidebarTab);
  const setSidebarTab = useGeoStore((state) => state.setSidebarTab);

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
        title="Toggle Sidebar (N)"
      >
        {isPropertiesPanelOpen ? (
          <CaretRight size={18} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
        ) : (
          <CaretLeft size={18} weight="bold" className="group-hover:-translate-x-0.5 transition-transform" />
        )}
      </button>

      {/* Sidebar Content Stack */}
      <div className="w-80 h-full bg-black/60 backdrop-blur-3xl border-l border-white/10 flex flex-col text-white shadow-2xl">
        {/* Tab Header */}
        <div className="flex h-12 border-b border-white/5 bg-white/5 p-1 gap-1">
          <button
            onClick={() => setSidebarTab("outliner")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-all ${
              activeSidebarTab === "outliner" 
                ? "bg-white/10 text-white shadow-inner" 
                : "text-white/40 hover:bg-white/5 hover:text-white/60"
            }`}
          >
            <List size={18} weight={activeSidebarTab === "outliner" ? "bold" : "regular"} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Outliner</span>
          </button>
          
          <button
            onClick={() => setSidebarTab("properties")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-all ${
              activeSidebarTab === "properties" 
                ? "bg-white/10 text-white shadow-inner" 
                : "text-white/40 hover:bg-white/5 hover:text-white/60"
            }`}
          >
            <Sliders size={18} weight={activeSidebarTab === "properties" ? "bold" : "regular"} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Properties</span>
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-hidden relative">
          <div className={`absolute inset-0 transition-opacity duration-300 ${activeSidebarTab === "outliner" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
            <Outliner />
          </div>
          <div className={`absolute inset-0 transition-opacity duration-300 ${activeSidebarTab === "properties" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
