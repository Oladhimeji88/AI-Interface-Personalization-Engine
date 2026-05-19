"use client";

import { Bell, Search, Zap, ChevronRight } from "lucide-react";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { AIStatusBadge } from "@/components/ui/AIStatusBadge";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { breadcrumbs, notificationCount, openCommandPalette, focusMode } =
    useUIStore();
  const { profile } = usePersonalizationStore();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-[var(--header-height)]",
        "left-[var(--sidebar-width)]",
        "flex items-center justify-between px-6",
        "border-b border-white/[0.06] bg-void-DEFAULT/80 backdrop-blur-xl",
        "transition-all duration-300 ease-spring",
        focusMode && "opacity-0 pointer-events-none"
      )}
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5">
        {breadcrumbs.length > 0 ? (
          breadcrumbs.map((crumb, i) => (
            <div key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="w-3 h-3 text-white/15" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  i === breadcrumbs.length - 1
                    ? "text-white/80"
                    : "text-white/30"
                )}
              >
                {crumb.label}
              </span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-synapse-400 animate-pulse" />
            <span className="text-sm font-mono text-white/25">
              aipe.interface — active
            </span>
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* AI adaptation indicator */}
        <AIStatusBadge size="sm" showLabel={false} />

        {/* Search */}
        <button
          onClick={openCommandPalette}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg",
            "glass border border-white/[0.07]",
            "text-xs text-white/30 hover:text-white/60",
            "transition-all duration-150 font-mono"
          )}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:block">Search…</span>
          <span className="hidden sm:flex items-center gap-0.5 ml-1">
            <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/[0.07] text-[10px]">⌘K</kbd>
          </span>
        </button>

        {/* AI Adapt trigger */}
        <button
          onClick={() =>
            usePersonalizationStore.getState().adaptProfile()
          }
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
            "bg-neural-400/10 border border-neural-400/20",
            "text-xs font-mono font-medium text-neural-300",
            "hover:bg-neural-400/20 transition-all duration-150"
          )}
        >
          <Zap className="w-3 h-3" />
          <span className="hidden sm:block">Adapt</span>
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center glass border border-white/[0.07] hover:bg-white/[0.08] transition-all duration-150">
          <Bell className="w-3.5 h-3.5 text-white/50" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neural-400 text-white text-[9px] font-bold font-mono flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
