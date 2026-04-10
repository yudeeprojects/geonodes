"use client";
import React, { memo } from "react";
import { BaseNode } from "./BaseNode";
import { useGeoStore } from "@/lib/store";

const GlobalRotateNode = ({ id, data, selected }: { id: string, data: any, selected?: boolean }) => {
  const { params } = data;
  const updateNodeData = useGeoStore((state) => state.updateNodeData);
  const handleChange = (key: string, value: number) =>
    updateNodeData(id, { params: { ...params, [key]: value } });

  return (
    <BaseNode
      label="Global Rotate"
      headerColor="rgba(139, 92, 246, 0.85)"
      inputs={[
        { id: "geometry", label: "Geometry", type: "geometry" },
        { id: "x", label: "X (rad)", type: "value", value: params?.x ?? 0, step: 0.01, onChange: (v) => handleChange("x", v) },
        { id: "y", label: "Y (rad)", type: "value", value: params?.y ?? 0, step: 0.01, onChange: (v) => handleChange("y", v) },
        { id: "z", label: "Z (rad)", type: "value", value: params?.z ?? 0, step: 0.01, onChange: (v) => handleChange("z", v) },
      ]}
      outputs={[{ id: "geometry", label: "Geometry", type: "geometry" }]}
      selected={selected}
    />
  );
};

export default memo(GlobalRotateNode);
