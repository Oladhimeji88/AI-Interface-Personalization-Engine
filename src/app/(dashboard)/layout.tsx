"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ToastRenderer } from "@/components/ui/ToastRenderer";
import { useUIStore } from "@/lib/store/ui.store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toggleCommandPalette, sidebarCollapsed, focusMode } = useUIStore();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleCommandPalette();
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "f") {
        e.preventDefault();
        useUIStore.getState().toggleFocusMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCommandPalette]);

  return (
    <div className="min-h-screen bg-void-50">
      {/* Subtle background depth */}
      <div className="fixed inset-0 bg-mesh-gradient pointer-events-none" />
      <div className="fixed inset-0 dot-grid opacity-20 pointer-events-none" />

      <Sidebar />
      <TopBar />

      <main
        className={cn(
          "relative z-10 transition-all duration-300 ease-spring",
          sidebarCollapsed ? "pl-16" : "pl-[var(--sidebar-width)]",
          "pt-[var(--header-height)]",
          "min-h-screen",
          focusMode && "pl-0"
        )}
      >
        <div className="page-enter">{children}</div>
      </main>

      <CommandPalette />
      <ToastRenderer />
    </div>
  );
}
