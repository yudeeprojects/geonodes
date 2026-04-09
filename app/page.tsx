import Scene from "@/components/Scene";
import { RightSidebar } from "@/components/RightSidebar";
import { LeftSidebar } from "@/components/LeftSidebar";
import { BottomPanel } from "@/components/BottomPanel";
import { TopPanel } from "@/components/TopPanel";
import { SettingsModal } from "@/components/SettingsModal";

export default function Home() {
  return (
    <main className="flex flex-col h-screen w-full bg-black overflow-hidden select-none relative">
      <TopPanel />

      {/* Viewport Area: Scene + Overlays */}
      <div className="flex-1 relative overflow-hidden">
        <Scene />
        <LeftSidebar />
        <RightSidebar />
      </div>

      {/* Node Editor Area */}
      <BottomPanel />

      {/* Overlays */}
      <SettingsModal />
    </main>
  );
}
