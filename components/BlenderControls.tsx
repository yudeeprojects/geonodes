/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useBlenderControls } from "@/hooks/useBlenderControls";
import { TransformHUD } from "./TransformHUD";

export function BlenderControls() {
  const { active, mode, constraint, inputBuffer } = useBlenderControls();

  return (
    <TransformHUD 
      active={active}
      mode={mode}
      constraint={constraint}
      inputBuffer={inputBuffer}
    />
  );
}
