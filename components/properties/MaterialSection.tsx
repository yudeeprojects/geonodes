import React from "react";
import { Palette } from "@phosphor-icons/react";
import { UniversalGeometry } from "@/types/geometry";
import { useGeoStore } from "@/lib/store";

interface MaterialSectionProps {
  node: UniversalGeometry;
}

export function MaterialSection({ node }: MaterialSectionProps) {
  const updateNodeSettings = useGeoStore((state) => state.updateNodeSettings);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-white/40 mb-4">
        <Palette size={16} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Material</span>
      </div>

      <div className="space-y-5">
        {/* Color */}
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-white/40 uppercase tracking-tight">Base Color</label>
          <div className="relative group">
            <input
              type="color"
              value={node.settings.color}
              onChange={(e) => updateNodeSettings(node.id, { color: e.target.value })}
              className="w-12 h-6 bg-transparent border-none cursor-pointer rounded-md overflow-hidden"
            />
            <div className="absolute inset-0 pointer-events-none rounded-md border border-white/10 group-hover:border-white/20 transition-colors" />
          </div>
        </div>

        {/* Wireframe */}
        <div className="flex items-center justify-between">
            <label className="text-[10px] text-white/40 uppercase tracking-tight">Wireframe</label>
            <button
                onClick={() => updateNodeSettings(node.id, { wireframe: !node.settings.wireframe })}
                className={`w-10 h-5 rounded-full p-1 transition-all duration-300 ${node.settings.wireframe ? 'bg-yellow-400' : 'bg-white/10'}`}
            >
                <div className={`w-3 h-3 rounded-full bg-black transition-transform duration-300 ${node.settings.wireframe ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
        </div>
      </div>
    </section>
  );
}
