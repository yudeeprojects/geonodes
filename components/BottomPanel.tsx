"use client";

import React, { useCallback, useRef } from "react";
import { useGeoStore } from "@/lib/store";
import { CaretUp, CaretDown, ShareNetwork, Table } from "@phosphor-icons/react";

import { NodeEditor } from "./NodeEditor/NodeEditor";

export function BottomPanel() {
  const isBottomPanelOpen = useGeoStore((state) => state.isBottomPanelOpen);
  const toggleBottomPanel = useGeoStore((state) => state.toggleBottomPanel);
  const height = useGeoStore((state) => state.bottomPanelHeight);
  const setHeight = useGeoStore((state) => state.setBottomPanelHeight);
  const activeTab = useGeoStore((state) => state.activeBottomTab);
  const setTab = useGeoStore((state) => state.setBottomTab);

  const [isResizing, setIsResizing] = React.useState(false);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    setIsResizing(true);
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, []);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const newHeight = window.innerHeight - e.clientY;
      const clampedHeight = Math.min(Math.max(newHeight, 100), window.innerHeight * 0.8);
      setHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        setIsResizing(false);
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setHeight]);

  return (
    <div 
      className={`relative bg-black/40 backdrop-blur-3xl border-t border-white/10 flex flex-col ${
        isResizing ? "" : "transition-[height] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
      } ${
        isBottomPanelOpen ? "" : "h-0 border-t-0"
      }`}
      style={{ height: isBottomPanelOpen ? height : 0 }}
    >
      {/* Resize Handle (Invisible but grabbable) */}
      {isBottomPanelOpen && (
        <div 
           onMouseDown={handleMouseDown}
           className="absolute -top-1 left-0 w-full h-2 cursor-row-resize z-[60] hover:bg-blue-500/30 transition-colors"
        />
      )}

      {/* Toggle Button (Center Top) */}
      <button
        onClick={toggleBottomPanel}
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full px-4 py-1.5 bg-black/60 backdrop-blur-xl border border-b-0 border-white/10 rounded-t-xl flex items-center justify-center text-white/50 hover:text-white transition-colors group z-40"
        title="Toggle Node Editor (B)"
      >
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
          <ShareNetwork weight="duotone" size={16} className="text-blue-400" />
          <span>Geometry Nodes</span>
          {isBottomPanelOpen ? (
            <CaretDown size={14} weight="bold" className="opacity-50 group-hover:translate-y-0.5 transition-transform" />
          ) : (
            <CaretUp size={14} weight="bold" className="opacity-50 group-hover:-translate-y-0.5 transition-transform" />
          )}
        </div>
      </button>

      {/* Panel Header/Tab Bar */}
      {isBottomPanelOpen && (
        <>
          <div className="flex items-center h-10 border-b border-white/5 bg-white/5 overflow-hidden">
            <div className="px-4 text-[9px] font-black text-white/20 uppercase tracking-[0.2em] border-r border-white/5 h-full flex items-center bg-black/20">
              Editors
            </div>
            
            <div className="flex h-full">
              <button
                onClick={() => setTab("nodes")}
                className={`flex items-center gap-2 px-6 h-full transition-all border-r border-white/5 ${
                  activeTab === "nodes" 
                    ? "bg-white/10 text-white shadow-[inset_0_2px_0_#3b82f6]" 
                    : "text-white/40 hover:bg-white/5 hover:text-white/60"
                }`}
              >
                <ShareNetwork size={16} weight={activeTab === "nodes" ? "bold" : "regular"} className={activeTab === "nodes" ? "text-blue-400" : ""} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Node Editor</span>
              </button>

              <button
                onClick={() => setTab("data")}
                className={`flex items-center gap-2 px-6 h-full transition-all border-r border-white/5 ${
                  activeTab === "data" 
                    ? "bg-white/10 text-white shadow-[inset_0_2px_0_#10b981]" 
                    : "text-white/40 hover:bg-white/5 hover:text-white/60"
                }`}
              >
                <Table size={16} weight={activeTab === "data" ? "bold" : "regular"} className={activeTab === "data" ? "text-emerald-400" : ""} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Spreadsheet</span>
              </button>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden flex flex-col">
            {activeTab === "nodes" ? (
              <NodeEditor />
            ) : (
              /* Data Spreadsheet Placeholder */
              <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
                 <div className="flex flex-col gap-2">
                    <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Geometry Attributes</h3>
                    <div className="w-full h-px bg-white/5" />
                 </div>
                 
                 <div className="flex-1 flex items-center justify-center opacity-10">
                    <div className="flex flex-col items-center gap-4">
                       <Table size={64} weight="thin" />
                       <span className="text-xs uppercase tracking-[0.3em] font-light">Attribute Data View</span>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
