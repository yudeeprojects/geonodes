import React from "react";
import { ArrowsOut } from "@phosphor-icons/react";
import { UniversalGeometry } from "@/types/geometry";
import { useGeoStore } from "@/lib/store";

interface TransformSectionProps {
  node: UniversalGeometry;
}

export function TransformSection({ node }: TransformSectionProps) {
  const updateTransform = useGeoStore((state) => state.updateTransform);

  const handleTransformChange = (axis: "x" | "y" | "z", value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    
    const newPos = [...node.transform.position];
    if (axis === "x") newPos[0] = num;
    if (axis === "y") newPos[1] = num;
    if (axis === "z") newPos[2] = num;

    updateTransform(node.id, { position: newPos as [number, number, number] });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-white/40 mb-4">
        <ArrowsOut size={16} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Transform</span>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] text-white/30 uppercase tracking-tighter">Position</label>
          <div className="grid grid-cols-3 gap-2">
            {(['x', 'y', 'z'] as const).map((axis, i) => (
              <div key={axis} className="relative group">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-white/20 group-focus-within:text-yellow-400/50 uppercase">{axis}</span>
                <input
                  type="number"
                  value={node.transform.position[i].toFixed(2)}
                  onChange={(e) => handleTransformChange(axis, e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-6 pr-2 text-xs font-mono focus:outline-none focus:border-yellow-400/30 focus:bg-white/10 transition-all hover:bg-white/10"
                  step={0.1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
