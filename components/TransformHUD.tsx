/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Html } from "@react-three/drei";
import { TransformMode, Constraint } from "@/hooks/useBlenderControls";

interface TransformHUDProps {
  active: boolean;
  mode: TransformMode;
  constraint: Constraint;
  inputBuffer: string;
}

export function TransformHUD({ active, mode, constraint, inputBuffer }: TransformHUDProps) {
  if (!active) return null;

  const modeColors: Record<TransformMode, string> = {
    move: "text-blue-400",
    scale: "text-green-400",
    rotate: "text-yellow-400",
  };

  const modeLabels: Record<TransformMode, string> = {
    move: "Move",
    scale: "Scale",
    rotate: "Rotate",
  };

  return (
    <Html fullscreen portal={undefined} style={{ pointerEvents: "none" }}>
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="px-5 py-2.5 bg-black/95 border border-white/10 rounded-full font-mono text-xs text-white flex items-center gap-5 backdrop-blur-3xl shadow-2xl transition-all duration-300">
              <span className={`font-bold uppercase tracking-wider ${modeColors[mode]}`}>
                {modeLabels[mode]}
              </span>
              
              {constraint !== "none" && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded border border-white/5">
                    <span className="text-[10px] text-white/40 font-bold uppercase">Axis:</span>
                    <span className="text-white font-bold uppercase tracking-tighter">
                        {constraint}
                    </span>
                  </div>
              )}
              
              <div className="w-px h-4 bg-white/10" />

              <div className="flex items-center gap-3">
                  {inputBuffer !== "" ? (
                      <span className="text-white bg-white/10 px-3 py-0.5 rounded border border-white/10 font-bold shadow-inner">
                          {inputBuffer}{mode === "rotate" ? "°" : ""}
                      </span>
                  ) : (
                      <span className="text-white/20 italic tracking-tight">Mouse Control</span>
                  )}
              </div>
          </div>
          
          <div className="flex gap-4 opacity-30">
            <div className="text-[7px] text-white uppercase tracking-[0.2em] font-medium">
                Confirm: <span className="text-white/60">Click / Enter</span>
            </div>
            <div className="text-[7px] text-white uppercase tracking-[0.2em] font-medium">
                Cancel: <span className="text-white/60">Esc / Right Click</span>
            </div>
          </div>
      </div>
    </Html>
  );
}
