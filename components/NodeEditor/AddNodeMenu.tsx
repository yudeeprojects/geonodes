"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useGeoStore } from "@/lib/store";
import { useReactFlow } from "@xyflow/react";

interface AddNodeMenuProps {
  position: { x: number; y: number; clientX: number; clientY: number } | null;
  onClose: () => void;
}

const MENU_ITEMS = [
  {
    category: "Local Modifiers",
    color: "text-blue-400",
    icon: "⬡",
    items: [
      { label: "Transform", type: "transform", fn: "transform" },
      { label: "Translate", type: "translate", fn: "translate" },
      { label: "Rotate", type: "rotate", fn: "rotate" },
      { label: "Scale", type: "scale", fn: "scale" },
    ]
  },
  {
    category: "Global Modifiers",
    color: "text-purple-400",
    icon: "🌍",
    items: [
      { label: "Global Transform", type: "globalTransform", fn: "globalTransform" },
      { label: "Global Translate", type: "globalTranslate", fn: "globalTranslate" },
      { label: "Global Rotate", type: "globalRotate", fn: "globalRotate" },
      { label: "Global Scale", type: "globalScale", fn: "globalScale" },
    ]
  },
  {
    category: "Inputs",
    color: "text-emerald-400",
    icon: "#",
    items: [
      { label: "Float", type: "float", fn: "float" },
      { label: "Integer", type: "integer", fn: "integer" },
    ]
  }
];

const MENU_WIDTH = 192; // w-48
const SUBMENU_WIDTH = 180;
const ITEM_HEIGHT = 36;
const HEADER_HEIGHT = 40;

export function AddNodeMenu({ position, onClose }: AddNodeMenuProps) {
  const addGraphNode = useGeoStore((state) => state.addGraphNode);
  const { screenToFlowPosition } = useReactFlow();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (position) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [position, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (position) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, onClose]);

  if (!position) return null;

  const handleAddNode = (type: string, fnName: string) => {
    const flowPos = screenToFlowPosition({ x: position.clientX, y: position.clientY });
    addGraphNode(type, fnName, flowPos);
    onClose();
  };

  // Smart position: prevent clipping at bottom/right of viewport
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const menuItemCount = MENU_ITEMS.length;
  const menuHeight = HEADER_HEIGHT + menuItemCount * ITEM_HEIGHT + 16;

  // Adjust vertically — push up if would clip bottom
  let top = position.y;
  if (top + menuHeight > vh - 8) {
    top = Math.max(8, vh - menuHeight - 8);
  }

  // Adjust horizontally
  let left = position.x;
  if (left + MENU_WIDTH > vw - 8) {
    left = vw - MENU_WIDTH - 8;
  }

  // Determine which side the submenu opens
  const submenuOnLeft = left + MENU_WIDTH + SUBMENU_WIDTH > vw - 8;

  return (
    <div
      ref={menuRef}
      className="absolute bg-[#141414]/98 backdrop-blur-2xl border border-white/15 rounded-xl shadow-[0_8px_60px_rgba(0,0,0,0.9)]"
      style={{
        top,
        left,
        width: MENU_WIDTH,
        zIndex: 999999,
      }}
    >
      {/* Header */}
      <div className="px-3 py-2.5 bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-emerald-500/10 border-b border-white/10 rounded-t-xl flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/60">
          Add Node
        </span>
      </div>

      {/* Category rows with flyout submenus */}
      <div className="py-1.5 flex flex-col">
        {MENU_ITEMS.map((group) => {
          const isActive = activeCategory === group.category;
          return (
            <div
              key={group.category}
              className="relative"
              onMouseEnter={() => setActiveCategory(group.category)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              {/* Category row */}
              <div
                className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-all duration-150 ${
                  isActive ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm leading-none">{group.icon}</span>
                  <span className={`text-[10px] font-bold tracking-wide ${isActive ? group.color : "text-white/60"}`}>
                    {group.category}
                  </span>
                </div>
                <svg
                  className={`w-2.5 h-2.5 transition-colors ${isActive ? group.color : "text-white/20"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Flyout submenu */}
              {isActive && (
                <div
                  className="absolute top-0 bg-[#141414]/98 backdrop-blur-2xl border border-white/15 rounded-xl shadow-[0_8px_60px_rgba(0,0,0,0.9)] py-1.5"
                  style={{
                    width: SUBMENU_WIDTH,
                    zIndex: 999999,
                    ...(submenuOnLeft
                      ? { right: MENU_WIDTH + 4 }
                      : { left: MENU_WIDTH + 4 }),
                  }}
                >
                  {/* Submenu header */}
                  <div className={`px-3 pb-1.5 pt-1 text-[8px] font-black uppercase tracking-[0.2em] border-b border-white/5 mb-1 ${group.color}`}>
                    {group.category}
                  </div>
                  {group.items.map((item) => (
                    <button
                      key={item.label}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleAddNode(item.type, item.fn);
                      }}
                      className="w-full text-left px-3 py-2 text-[11px] text-white/75 hover:text-white hover:bg-white/[0.08] transition-colors flex items-center gap-2"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        group.color === "text-blue-400" ? "bg-blue-400/60" :
                        group.color === "text-purple-400" ? "bg-purple-400/60" : "bg-emerald-400/60"
                      }`} />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
