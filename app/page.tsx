import Scene from "@/components/Scene";
import { Toolbar } from "@/components/Toolbar";
import { PropertiesPanel } from "@/components/PropertiesPanel";

export default function Home() {
  return (
    <main className="flex h-screen w-full bg-black overflow-hidden select-none">
      {/* Ліва панель (Toolbar) - абсолютна для "Blender feel" */}
      <Toolbar />

      {/* Центральна частина (Scene) */}
      <div className="flex-1 relative">
        <Scene />
      </div>

      {/* Права панель (Properties) */}
      <div className="z-10 h-full">
        <PropertiesPanel />
      </div>
    </main>
  );
}
