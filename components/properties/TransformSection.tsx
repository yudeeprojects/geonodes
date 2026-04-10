import React from "react";
import { ArrowsOut } from "@phosphor-icons/react";
import { UniversalGeometry } from "@/types/geometry";
import { useGeoStore } from "@/lib/store";

interface TransformSectionProps {
  node: UniversalGeometry;
}

export function TransformSection({ node }: TransformSectionProps) {
  const updateTransform = useGeoStore((state) => state.updateTransform);

  const handleValueChange = (
    type: "position" | "rotation" | "scale",
    axis: number,
    value: string
  ) => {
    let num = parseFloat(value);
    if (isNaN(num)) return;
    
    const currentValues = [...(node.transform as any)[type]];
    
    // For rotation, we convert degrees from UI to radians for state
    if (type === "rotation") {
        currentValues[axis] = (num * Math.PI) / 180;
    } else {
        currentValues[axis] = num;
    }

    updateTransform(node.id, { [type]: currentValues as [number, number, number] });
  };

  const renderInputs = (type: "position" | "rotation" | "scale", label: string) => {
    const values = (node.transform as any)[type];
    
    return (
      <div className="space-y-2">
        <label className="text-[10px] text-white/30 uppercase tracking-tighter">{label}</label>
        <div className="grid grid-cols-3 gap-2">
          {(['x', 'y', 'z'] as const).map((axis, i) => {
            // Display rotation in degrees
            const displayValue = type === "rotation" 
                ? (values[i] * 180 / Math.PI) 
                : values[i];

            return (
                <div key={`${type}-${axis}`} className="relative group">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-white/20 group-focus-within:text-blue-400 uppercase">{axis}</span>
                  <input
                    type="number"
                    value={displayValue.toFixed(2)}
                    onChange={(e) => handleValueChange(type, i, e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-6 pr-2 text-xs font-mono focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all hover:bg-white/10"
                    step={type === "scale" ? 0.1 : 1}
                  />
                </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-white/40 mb-4">
        <ArrowsOut size={16} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Object Transform</span>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {renderInputs("position", "Position")}
        {renderInputs("rotation", "Rotation (Deg)")}
        {renderInputs("scale", "Scale")}
      </div>
    </section>
  );
}
