"use client";

import React from "react";
import { useGeoStore } from "@/lib/store";
import { X, Desktop, NavigationArrow, Cpu, PaintBrush, Gear } from "@phosphor-icons/react";

export function SettingsModal() {
  const isSettingsOpen = useGeoStore((state) => state.isSettingsOpen);
  const toggleSettings = useGeoStore((state) => state.toggleSettings);
  const orbitAroundSelection = useGeoStore((state) => state.orbitAroundSelection);
  const setOrbitAroundSelection = useGeoStore((state) => state.setOrbitAroundSelection);

  const [activeTab, setActiveTab] = React.useState('interface');

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Background overlay click to close */}
      <div className="absolute inset-0" onClick={toggleSettings} />

      <div className="relative w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <Gear size={20} weight="duotone" className="text-blue-500" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/90">Preferences</h2>
          </div>
          <button 
            onClick={toggleSettings}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 min-h-[400px]">
          {/* Sidebar Tabs */}
          <div className="w-48 border-r border-white/5 bg-black/20 p-2 flex flex-col gap-1">
             {[
               { id: 'interface', label: 'Interface', icon: PaintBrush },
               { id: 'viewport', label: 'Viewport', icon: Desktop },
               { id: 'navigation', label: 'Navigation', icon: NavigationArrow },
               { id: 'system', label: 'System', icon: Cpu },
             ].map((tab) => (
               <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                  activeTab === tab.id ? 'bg-blue-500/10 text-blue-400' : 'text-white/40 hover:bg-white/5 hover:text-white/60'
                }`}
               >
                 <tab.icon size={16} weight="duotone" />
                 {tab.label}
               </button>
             ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 space-y-8 overflow-y-auto max-h-[500px]">
             {activeTab === 'interface' && (
               <section className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Display</h3>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <span className="text-[11px] text-white/60">UI Scale</span>
                        <div className="flex items-center gap-3">
                           <input type="range" className="w-32 accent-blue-500 opacity-50 hover:opacity-100 transition-opacity" />
                           <span className="text-xs font-mono text-blue-500">1.0</span>
                        </div>
                     </div>
                  </div>
               </section>
             )}

             {activeTab === 'navigation' && (
               <section className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Orbit & Pan</h3>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between group">
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] text-white/80">Orbit around Selection</span>
                          <span className="text-[9px] text-white/20 italic">Focus camera target on selected object</span>
                        </div>
                        <button 
                          onClick={() => setOrbitAroundSelection(!orbitAroundSelection)}
                          className={`w-10 h-5 rounded-full relative transition-colors ${orbitAroundSelection ? 'bg-blue-600' : 'bg-white/10'}`}
                        >
                           <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${orbitAroundSelection ? 'left-6' : 'left-1'}`} />
                        </button>
                     </div>
                  </div>
               </section>
             )}

             {activeTab === 'system' && (
               <section className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Performance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-white/60">Anti-Aliasing (MSAA)</span>
                        <select 
                          defaultValue="High (8x)"
                          className="bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-white/80 outline-none"
                        >
                          <option>None</option>
                          <option>High (8x)</option>
                          <option>Ultra (16x)</option>
                        </select>
                    </div>
                  </div>
               </section>
             )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
           <button 
             onClick={toggleSettings}
             className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
           >
              Cancel
           </button>
           <button 
             onClick={toggleSettings}
             className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all active:scale-95"
           >
              Save Preferences
           </button>
        </div>
      </div>
    </div>
  );
}
