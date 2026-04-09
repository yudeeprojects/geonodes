import React from "react";
import { Cube } from "@phosphor-icons/react";
import { UniversalGeometry } from "@/types/geometry";

interface PanelHeaderProps {
  node: UniversalGeometry;
}

export function PanelHeader({ node }: PanelHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/5">
      <div className="text-yellow-400/60 transition-colors">
        <Cube size={16} weight="duotone" />
      </div>
      <div className="flex items-center gap-2">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Properties</h3>
        <div className="w-px h-2 bg-white/10" />
        <span className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">
          {node.userData.primitiveType || node.type} ({node.id.split('-')[1] || node.id})
        </span>
      </div>
    </div>
  );
}
