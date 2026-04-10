"use client";
import React, { memo } from "react";
import { BaseNode } from "./BaseNode";
import { useGeoStore } from "@/lib/store";

const GlobalTransformNode = ({ id, data, selected }: { id: string, data: any, selected?: boolean }) => {
  const { params } = data;
  const updateNodeData = useGeoStore((state) => state.updateNodeData);
  const handleChange = (key: string, value: number) =>
    updateNodeData(id, { params: { ...params, [key]: value } });

  return (
    <BaseNode
      label="Global Transform"
      headerColor="rgba(139, 92, 246, 0.85)"
      inputs={[
        { id: "geometry", label: "Geometry", type: "geometry" },
        { id: "tx", label: "Pos X", type: "value", value: params?.tx ?? 0, onChange: (v) => handleChange("tx", v) },
        { id: "ty", label: "Pos Y", type: "value", value: params?.ty ?? 0, onChange: (v) => handleChange("ty", v) },
        { id: "tz", label: "Pos Z", type: "value", value: params?.tz ?? 0, onChange: (v) => handleChange("tz", v) },
        { id: "rx", label: "Rot X", type: "value", value: params?.rx ?? 0, step: 0.01, onChange: (v) => handleChange("rx", v) },
        { id: "ry", label: "Rot Y", type: "value", value: params?.ry ?? 0, step: 0.01, onChange: (v) => handleChange("ry", v) },
        { id: "rz", label: "Rot Z", type: "value", value: params?.rz ?? 0, step: 0.01, onChange: (v) => handleChange("rz", v) },
        { id: "sx", label: "Scale X", type: "value", value: params?.sx ?? 1, onChange: (v) => handleChange("sx", v) },
        { id: "sy", label: "Scale Y", type: "value", value: params?.sy ?? 1, onChange: (v) => handleChange("sy", v) },
        { id: "sz", label: "Scale Z", type: "value", value: params?.sz ?? 1, onChange: (v) => handleChange("sz", v) },
      ]}
      outputs={[{ id: "geometry", label: "Geometry", type: "geometry" }]}
      selected={selected}
    />
  );
};

export default memo(GlobalTransformNode);
