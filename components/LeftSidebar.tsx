"use client";

import React from "react";
import { useGeoStore } from "@/lib/store";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Toolbar } from "./Toolbar";

export function LeftSidebar() {
  const isLeftSidebarOpen = useGeoStore((state) => state.isLeftSidebarOpen);
  const toggleLeftSidebar = useGeoStore((state) => state.toggleLeftSidebar);

  return (
    <div 
      className={`absolute top-0 left-0 h-full z-30 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isLeftSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Toggle Button (Floating Hook) */}
      <button
        onClick={toggleLeftSidebar}
        className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 w-8 h-12 bg-black/60 backdrop-blur-xl border border-l-0 border-white/10 rounded-r-xl flex items-center justify-center text-white/50 hover:text-white transition-colors group shadow-xl"
        title="Toggle Toolbar (V)"
      >
        {isLeftSidebarOpen ? (
          <CaretLeft size={18} weight="bold" className="group-hover:-translate-x-0.5 transition-transform" />
        ) : (
          <CaretRight size={18} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
        )}
      </button>

      {/* Sidebar Content Stack */}
      <div className="w-16 h-full bg-black/60 backdrop-blur-3xl border-r border-white/10 flex flex-col text-white shadow-2xl overflow-hidden">
        <Toolbar />
      </div>
    </div>
  );
}
