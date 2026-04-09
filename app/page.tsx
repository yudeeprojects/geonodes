import Scene from "@/components/Scene";
import { Toolbar } from "@/components/Toolbar";
import { PropertiesPanel } from "@/components/PropertiesPanel";

export default function Home() {
  return (
    <main className="flex h-screen w-full bg-black overflow-hidden select-none relative">
      {/* Ліва панель (Toolbar) - абсолютна для "Blender feel" */}
      <Toolbar />

      {/* Центральна частина (Scene) + Права панель (Properties) */}
      <div className="flex-1 relative overflow-hidden">
        <Scene />
        <PropertiesPanel />
      </div>
    </main>
  );
}
