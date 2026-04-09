import React from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { UniversalGeometry } from "@/types/geometry";
import { useGeoStore } from "@/lib/store";

interface VisibilitySectionProps {
  node: UniversalGeometry;
}

export function VisibilitySection({ node }: VisibilitySectionProps) {
  const updateNodeSettings = useGeoStore((state) => state.updateNodeSettings);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-white/40 mb-4">
        {node.settings.visible ? <Eye size={16} /> : <EyeSlash size={16} />}
        <span className="text-[10px] font-bold uppercase tracking-widest">Visibility</span>
      </div>

      <button
        onClick={() => updateNodeSettings(node.id, { visible: !node.settings.visible })}
        className={`w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
            node.settings.visible 
            ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
            : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20'
        }`}
      >
        {node.settings.visible ? <Eye size={14} /> : <EyeSlash size={14} />}
        {node.settings.visible ? 'Hide Element' : 'Show Element'}
      </button>
    </section>
  );
}
