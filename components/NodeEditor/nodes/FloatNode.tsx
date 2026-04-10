"use client";

import React, { memo } from "react";
import { BaseNode } from "./BaseNode";
import { useGeoStore } from "@/lib/store";

const FloatNode = ({ id, data, selected }: { id: string, data: any, selected?: boolean }) => {
  const { params } = data;
  const updateNodeData = useGeoStore((state) => state.updateNodeData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { 
      params: { ...params, value: parseFloat(e.target.value) || 0 } 
    });
  };

  return (
    <BaseNode 
      label="Float" 
      headerColor="rgba(156, 163, 175, 0.8)" 
      outputs={[{ id: "value", label: "Value", type: "value" }]}
      selected={selected}
    >
      <div className="flex flex-col gap-1">
        <input 
          type="number" 
          step="0.1"
          value={params?.value ?? 0}
          onChange={handleChange}
          className="nodrag w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-blue-400 font-mono outline-none focus:border-blue-500/50"
        />
      </div>
    </BaseNode>
  );
};

export default memo(FloatNode);
