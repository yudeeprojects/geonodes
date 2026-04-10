"use client";

import React, { memo } from "react";
import { BaseNode } from "./BaseNode";
import { useGeoStore } from "@/lib/store";

const RotateNode = ({ id, data, selected }: { id: string, data: any, selected?: boolean }) => {
  const { params } = data;
  const updateNodeData = useGeoStore((state) => state.updateNodeData);

  const handleChange = (key: string, value: number) => {
    updateNodeData(id, { params: { ...params, [key]: value } });
  };

  return (
    <BaseNode 
      label="Rotate" 
      headerColor="rgba(59, 130, 246, 0.8)" 
      inputs={[
        { id: "geometry", label: "Geometry", type: "geometry" },
        { id: "x", label: "X Angle", type: "value", value: params?.x ?? 0, onChange: (v) => handleChange('x', v) },
        { id: "y", label: "Y Angle", type: "value", value: params?.y ?? 0, onChange: (v) => handleChange('y', v) },
        { id: "z", label: "Z Angle", type: "value", value: params?.z ?? 0, onChange: (v) => handleChange('z', v) },
      ]} 
      outputs={[{ id: "geometry", label: "Geometry", type: "geometry" }]}
      selected={selected}
    />
  );
};

export default memo(RotateNode);
