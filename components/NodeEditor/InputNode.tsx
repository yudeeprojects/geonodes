"use client";

import React, { memo, useCallback } from "react";
import { BaseNode } from "./nodes/BaseNode";
import { useGeoStore } from "@/lib/store";

const InputNode = ({ id, data, selected }: { id: string, data: any, selected?: boolean }) => {
  const { label, params, type } = data;
  const updateNodeData = useGeoStore((state) => state.updateNodeData);

  const handleParamChange = useCallback((key: string, value: any) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    updateNodeData(id, { 
      params: { 
        ...params, 
        [key]: numericValue 
      } 
    });
  }, [id, params, updateNodeData]);

  const getConstraints = (key: string) => {
    if (key.toLowerCase().includes('segments')) {
        return { min: 1, max: 64, step: 1 };
    }
    return { min: 0.1, max: 10, step: 0.1 };
  };

  const inputs = Object.keys(params || {}).map(key => ({
    id: key,
    label: key.replace(/([A-Z])/g, ' $1').trim(),
    type: "value" as const
  }));

  const outputs = [
    { id: "geometry", label: "Geometry", type: "geometry" as const }
  ];

  return (
    <BaseNode 
      label={label || type} 
      headerColor="rgba(59, 130, 246, 0.8)" 
      inputs={inputs} 
      outputs={outputs}
      selected={selected}
    >
      <div className="flex flex-col gap-3">
        {Object.entries(params || {}).map(([key, value]: [string, any]) => {
          const { min, max, step } = getConstraints(key);
          return (
            <div key={key} className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[8px] uppercase tracking-wider text-white/40 font-bold">
                <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-blue-400 font-mono">
                    {(value as number).toFixed(step === 1 ? 0 : 2)}
                </span>
              </div>
              <input 
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => handleParamChange(key, e.target.value)}
                className="nodrag w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          );
        })}
      </div>
    </BaseNode>
  );
};

export default memo(InputNode);
