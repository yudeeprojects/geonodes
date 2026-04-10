"use client";
import React, { memo } from "react";
import { BaseNode } from "./BaseNode";
import { useGeoStore } from "@/lib/store";

const GlobalScaleNode = ({ id, data, selected }: { id: string, data: any, selected?: boolean }) => {
  const { params } = data;
  const updateNodeData = useGeoStore((state) => state.updateNodeData);
  const handleChange = (key: string, value: number) =>
    updateNodeData(id, { params: { ...params, [key]: value } });

  return (
    <BaseNode
      label="Global Scale"
      headerColor="rgba(139, 92, 246, 0.85)"
      inputs={[
        { id: "geometry", label: "Geometry", type: "geometry" },
        { id: "x", label: "Scale X", type: "value", value: params?.x ?? 1, onChange: (v) => handleChange("x", v) },
        { id: "y", label: "Scale Y", type: "value", value: params?.y ?? 1, onChange: (v) => handleChange("y", v) },
        { id: "z", label: "Scale Z", type: "value", value: params?.z ?? 1, onChange: (v) => handleChange("z", v) },
      ]}
      outputs={[{ id: "geometry", label: "Geometry", type: "geometry" }]}
      selected={selected}
    />
  );
};

export default memo(GlobalScaleNode);
