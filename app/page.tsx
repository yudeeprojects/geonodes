"use client";

import dynamic from "next/dynamic";
import { Toolbar } from "@/components/Toolbar";

// Вимикаємо SSR для 3D сцени
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <div className="absolute top-5 left-5 z-10 text-white bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl">
        <h1 className="text-xl font-bold tracking-tight">GeoNodes Lab v0.2</h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Procedural Core</p>
      </div>
      
      <Toolbar />
      <Scene />
    </main>
  );
}
