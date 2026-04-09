"use client";

import React from "react";
import { useGeoStore } from "@/lib/store";
import { CaretUp, CaretDown, CubeFocus, Target, Check } from "@phosphor-icons/react";

export function TopPanel() {
  const isTopPanelOpen = useGeoStore((state) => state.isTopPanelOpen);
  const toggleTopPanel = useGeoStore((state) => state.toggleTopPanel);
  const toggleSettings = useGeoStore((state) => state.toggleSettings);
  const orbitAroundSelection = useGeoStore((state) => state.orbitAroundSelection);
  const setOrbitAroundSelection = useGeoStore((state) => state.setOrbitAroundSelection);

  return (
    <div 
      className={`relative bg-black/60 backdrop-blur-3xl border-b border-white/10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col overflow-hidden ${
        isTopPanelOpen ? "h-[74px]" : "h-0 border-b-0"
      }`}
    >
      {/* Toggle Button (Center Bottom) */}
      <button
        onClick={toggleTopPanel}
        className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full px-4 py-1 bg-black/60 backdrop-blur-xl border border-t-0 border-white/10 rounded-b-xl flex items-center justify-center text-white/50 hover:text-white transition-colors group z-40 shadow-xl"
        title="Toggle Header (T)"
      >
        <div className="flex items-center gap-2 text-[9px] font-bold tracking-[0.2em] uppercase">
          {isTopPanelOpen ? (
            <CaretUp size={12} weight="bold" className="opacity-50 group-hover:-translate-y-0.5 transition-transform" />
          ) : (
            <CaretDown size={12} weight="bold" className="opacity-50 group-hover:translate-y-0.5 transition-transform" />
          )}
        </div>
      </button>

      {/* Row 1: Logo & Menu */}
      {isTopPanelOpen && (
        <div className="flex items-center justify-between px-4 h-10 border-b border-white/5">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CubeFocus size={18} weight="duotone" className="text-blue-500" />
              <span className="text-[11px] font-black uppercase tracking-tighter text-white/90">GeoNodes <span className="text-blue-500">R2</span></span>
            </div>
            
            <nav className="flex gap-4">
               {["File", "Edit", "Add", "Render", "Settings", "Help"].map((item) => (
                 <button 
                  key={item} 
                  onClick={() => item === "Settings" ? toggleSettings() : null}
                  className="text-[10px] text-white/40 hover:text-white/80 transition-colors uppercase tracking-widest font-medium"
                 >
                    {item}
                 </button>
               ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-[10px] text-white/20 font-mono tracking-tighter">
                v0.4.2-alpha
             </div>
             <div className="w-2 h-2 rounded-full bg-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.4)]" title="System Ready" />
          </div>
        </div>
      )}

      {/* Row 2: Quick Tools */}
      {isTopPanelOpen && (
        <div className="flex items-center px-4 h-8 bg-white/5 gap-4">
          <div className="flex items-center gap-1 p-0.5 bg-black/20 rounded-md border border-white/5">
            <button
               onClick={() => setOrbitAroundSelection(!orbitAroundSelection)}
               className={`flex items-center gap-2 px-1.5 py-1 rounded transition-all group ${
                 orbitAroundSelection ? 'bg-blue-500/20 text-blue-400' : 'text-white/30 hover:bg-white/5 hover:text-white/50'
               }`}
               title="Orbit around Selection"
            >
              <div className={`w-3 h-3 rounded-[3px] border flex items-center justify-center transition-colors ${
                orbitAroundSelection ? 'border-blue-400 bg-blue-400' : 'border-white/20 group-hover:border-white/40'
              }`}>
                {orbitAroundSelection && <Check size={10} weight="bold" className="text-black" />}
              </div>
              <Target size={16} weight={orbitAroundSelection ? "fill" : "regular"} />
            </button>
          </div>
          
          {/* Vertical Separator */}
          <div className="w-px h-4 bg-white/10" />
          
          {/* Static Hint/Info */}
          <div className="text-[9px] text-white/10 uppercase font-medium tracking-tight">
             Quick Access Bar
          </div>
        </div>
      )}
    </div>
  );
}
