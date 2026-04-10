"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";

const OutputNode = ({ data }: { data: any }) => {
  return (
    <div className="min-w-[170px] bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl group hover:border-emerald-500/50 transition-all duration-300">
      {/* Header */}
      <div className="px-3 py-2 bg-emerald-500/80 flex items-center justify-between border-b border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] rounded-t-lg">
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white brightness-125">
          Group Output
        </span>
        <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/40 transition-all" />
      </div>

      {/* Body */}
      <div className="p-3 bg-gradient-to-b from-white/[0.02] to-transparent">
         <div className="text-[9px] uppercase tracking-[0.2em] text-white/10 font-black text-center py-4">
            Geometry
         </div>
      </div>

      {/* Input Handle Area */}
      <div className="relative h-9 flex items-center justify-start px-3 border-t border-white/[0.03] bg-black/20">
         <Handle
           type="target"
           position={Position.Left}
           className="!w-4 !h-4 !bg-emerald-400 !border-[3px] !border-[#1a1a1a] !left-[-8px] hover:!scale-125 hover:!bg-emerald-300 transition-all shadow-[0_0_10px_rgba(52,211,153,0.3)]"
           style={{ top: '50%', transform: 'translateY(-50%)' }}
         />
         <span className="text-[9px] uppercase font-bold text-white/30 ml-4 tracking-widest">Geometry</span>
      </div>
    </div>
  );
};

export default memo(OutputNode);
