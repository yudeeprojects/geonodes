"use client";

import React, { useCallback, useRef } from "react";
import { useGeoStore } from "@/lib/store";
import { CaretUp, CaretDown, ShareNetwork } from "@phosphor-icons/react";

export function BottomPanel() {
  const isBottomPanelOpen = useGeoStore((state) => state.isBottomPanelOpen);
  const toggleBottomPanel = useGeoStore((state) => state.toggleBottomPanel);
  const height = useGeoStore((state) => state.bottomPanelHeight);
  const setHeight = useGeoStore((state) => state.setBottomPanelHeight);

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
          <div className="flex items-center gap-4 px-4 h-10 border-b border-white/5 bg-white/5">
            <div className="text-[11px] font-medium text-white/40 uppercase tracking-widest">Editor</div>
            <div className="px-3 py-1 bg-white/10 rounded text-[11px] text-white/90 font-medium">Node Editor</div>
          </div>

          {/* Flow Area Placeholder */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center group">
             {/* Grid background pattern */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
             
             <div className="flex flex-col items-center gap-3 opacity-20 group-hover:opacity-40 transition-opacity">
                <ShareNetwork size={48} weight="thin" />
                <span className="text-xs tracking-tighter uppercase font-light">React Flow Area coming soon</span>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
