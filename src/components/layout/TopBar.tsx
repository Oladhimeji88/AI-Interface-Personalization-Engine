"use client";

import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { AIStatusBadge } from "@/components/ui/AIStatusBadge";
import { cn } from "@/lib/utils";
import { Bell, MagnifyingGlass, Lightning, CaretRight } from "@/components/ui/icons";

export function TopBar() {
  const { breadcrumbs, notificationCount, openCommandPalette, focusMode } = useUIStore();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-[var(--header-height)]",
        "left-[var(--sidebar-width)]",
        "flex items-center justify-between px-6",
        "border-b border-white/[0.055]",
        "bg-void-DEFAULT/90 backdrop-blur-xl",
        "transition-all duration-300 ease-spring",
        focusMode && "opacity-0 pointer-events-none"
      )}
    >
      {/* ── Breadcrumbs ────────────────────────────────────────── */}
      <div className="flex items-center gap-1">
        {breadcrumbs.length > 0 ? (
          breadcrumbs.map((crumb, i) => (
            <div key={crumb.href} className="flex items-center gap-1">
              {i > 0 && <CaretRight size={10} weight="bold" className="text-white/15" />}
              <span
                className={cn(
                  "text-[13px]",
                  i === breadcrumbs.length - 1
                    ? "font-semibold text-white/80"
                    : "font-normal text-white/28"
                )}
              >
                {crumb.label}
              </span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2">
            <span className="live-dot" />
            <span className="text-[12px] font-mono text-white/22 tracking-wide">
              aipe.interface · active
            </span>
          </div>
        )}
      </div>

      {/* ── Actions ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <AIStatusBadge size="sm" showLabel={false} />

        {/* Search */}
        <button
          type="button"
          onClick={openCommandPalette}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg",
            "bg-white/[0.04] border border-white/[0.07]",
            "text-[12px] font-mono text-white/28 hover:text-white/55",
            "hover:bg-white/[0.06] hover:border-white/[0.10]",
            "transition-all duration-150"
          )}
        >
          <MagnifyingGlass size={13} weight="regular" />
          <span className="hidden sm:block">Search…</span>
          <kbd className="hidden sm:block px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] leading-none ml-1">
            ⌘K
          </kbd>
        </button>

        {/* Adapt */}
        <button
          type="button"
          onClick={() => usePersonalizationStore.getState().adaptProfile()}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
            "bg-quantum-400/10 border border-quantum-400/[0.18]",
            "text-[12px] font-mono font-medium text-quantum-300",
            "hover:bg-quantum-400/[0.18] hover:border-quantum-400/[0.28]",
            "transition-all duration-150"
          )}
        >
          <Lightning size={12} weight="fill" />
          <span className="hidden sm:block">Adapt</span>
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label={notificationCount > 0 ? `${notificationCount} notifications` : "Notifications"}
          className="relative w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] hover:border-white/[0.10] transition-all duration-150"
        >
          <Bell size={14} weight="regular" className="text-white/45" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neural-500 text-white text-[9px] font-bold font-mono flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
