import React from "react";
import { Cube } from "@phosphor-icons/react";
import { UniversalGeometry } from "@/types/geometry";

interface PanelHeaderProps {
  node: UniversalGeometry;
}

export function PanelHeader({ node }: PanelHeaderProps) {
  return (
    <div className="p-6 border-b border-white/5 bg-gradient-to-br from-white/10 to-transparent">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center text-yellow-400 border border-yellow-400/20 shadow-lg shadow-yellow-400/5">
          <Cube size={24} weight="duotone" />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-tight text-white/90 uppercase">{node.type}</h2>
          <p className="text-[10px] text-white/40 font-mono tracking-tighter">{node.id}</p>
        </div>
      </div>
    </div>
  );
}
