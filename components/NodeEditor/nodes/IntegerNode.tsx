"use client";

import React, { memo } from "react";
import { BaseNode } from "./BaseNode";
import { useGeoStore } from "@/lib/store";

const IntegerNode = ({ id, data, selected }: { id: string, data: any, selected?: boolean }) => {
  const { params } = data;
  const updateNodeData = useGeoStore((state) => state.updateNodeData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { 
      params: { ...params, value: parseInt(e.target.value) || 0 } 
    });
  };

  return (
    <BaseNode 
      label="Integer" 
      headerColor="rgba(107, 114, 128, 0.8)" 
      outputs={[{ id: "value", label: "Value", type: "value" }]}
      selected={selected}
    >
      <div className="flex flex-col gap-1">
        <input 
          type="number" 
          step="1"
          value={params?.value ?? 0}
          onChange={handleChange}
          className="nodrag w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-green-400 font-mono outline-none focus:border-green-500/50"
        />
      </div>
    </BaseNode>
  );
};

export default memo(IntegerNode);
