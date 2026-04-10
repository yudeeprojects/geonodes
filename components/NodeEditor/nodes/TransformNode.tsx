"use client";

import React, { memo } from "react";
import { BaseNode } from "./BaseNode";
import { useGeoStore } from "@/lib/store";

const TransformNode = ({ id, data, selected }: { id: string, data: any, selected?: boolean }) => {
  const { params } = data;
  const updateNodeData = useGeoStore((state) => state.updateNodeData);

  const handleChange = (key: string, value: any) => {
    updateNodeData(id, { 
      params: { ...params, [key]: parseFloat(value) || 0 } 
    });
  };

  const inputs = [
    { id: "geometry", label: "Geometry", type: "geometry" as const },
    { id: "tx", label: "Translation X", type: "value" as const, value: params?.tx, onChange: (v: number) => handleChange('tx', v) },
    { id: "ty", label: "Translation Y", type: "value" as const, value: params?.ty, onChange: (v: number) => handleChange('ty', v) },
    { id: "tz", label: "Translation Z", type: "value" as const, value: params?.tz, onChange: (v: number) => handleChange('tz', v) },
    { id: "rx", label: "Rotation X", type: "value" as const, value: params?.rx, onChange: (v: number) => handleChange('rx', v) },
    { id: "ry", label: "Rotation Y", type: "value" as const, value: params?.ry, onChange: (v: number) => handleChange('ry', v) },
    { id: "rz", label: "Rotation Z", type: "value" as const, value: params?.rz, onChange: (v: number) => handleChange('rz', v) },
    { id: "sx", label: "Scale X", type: "value" as const, value: params?.sx ?? 1, onChange: (v: number) => handleChange('sx', v) },
    { id: "sy", label: "Scale Y", type: "value" as const, value: params?.sy ?? 1, onChange: (v: number) => handleChange('sy', v) },
    { id: "sz", label: "Scale Z", type: "value" as const, value: params?.sz ?? 1, onChange: (v: number) => handleChange('sz', v) },
  ];

  const outputs = [
    { id: "geometry", label: "Geometry", type: "geometry" as const }
  ];

  return (
    <BaseNode 
      label="Transform" 
      headerColor="rgba(59, 130, 246, 0.8)" 
      inputs={inputs} 
      outputs={outputs}
      selected={selected}
    />
  );
};

export default memo(TransformNode);
