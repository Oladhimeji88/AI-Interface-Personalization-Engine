"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Palette,
  BarChart3,
  Lightbulb,
  Edit3,
  Settings,
  Brain,
  ChevronLeft,
  Command,
  Layers,
  Sparkles,
} from "lucide-react";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { AIStatusBadge } from "@/components/ui/AIStatusBadge";
import { getTimeOfDayGreeting } from "@/lib/utils";

const NAV_ITEMS = [
  {
    group: "Core",
    items: [
      { href: "/dashboard",  label: "Dashboard",        icon: LayoutDashboard, accent: "quantum" },
      { href: "/analytics",  label: "Analytics",        icon: BarChart3,        accent: "synapse" },
      { href: "/insights",   label: "Behavior Insights", icon: Lightbulb,       accent: "plasma"  },
    ],
  },
  {
    group: "Personalization",
    items: [
      { href: "/personalize", label: "Personalize",  icon: Palette, accent: "neural"   },
      { href: "/editor",      label: "Live Editor",   icon: Edit3,   accent: "quantum"  },
      { href: "/themes",      label: "Themes",        icon: Layers,  accent: "neural"   },
    ],
  },
  {
    group: "System",
    items: [
      { href: "/settings", label: "Settings", icon: Settings, accent: "default" },
    ],
  },
] as const;

type Accent = "quantum" | "neural" | "synapse" | "plasma" | "default";

const accentIcon: Record<Accent, string> = {
  quantum: "text-quantum-400",
  neural:  "text-neural-400",
  synapse: "text-synapse-400",
  plasma:  "text-plasma-500",
  default: "text-white/45",
};

const accentActive: Record<Accent, string> = {
  quantum: "bg-quantum-400/[0.10] border-quantum-400/[0.18] text-quantum-300",
  neural:  "bg-neural-400/[0.10]  border-neural-400/[0.18]  text-neural-300",
  synapse: "bg-synapse-400/[0.10] border-synapse-400/[0.18] text-synapse-300",
  plasma:  "bg-plasma-500/[0.10]  border-plasma-500/[0.18]  text-plasma-400",
  default: "bg-white/[0.06]       border-white/[0.10]        text-white/80",
};

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, openCommandPalette } = useUIStore();
  const { recommendations } = usePersonalizationStore();
  const unresolvedRecs = recommendations.filter((r) => !r.applied && !r.dismissed);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col",
        "border-r border-white/[0.055]",
        "bg-void-100/95 backdrop-blur-xl",
        "transition-all duration-300 ease-spring",
        sidebarCollapsed ? "w-16" : "w-[var(--sidebar-width)]"
      )}
    >
      {/* ── Logo / Brand ──────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center flex-shrink-0 border-b border-white/[0.055]",
          "h-[var(--header-height)] px-4",
          sidebarCollapsed ? "justify-center px-3" : "justify-between"
        )}
      >
        <div className={cn("flex items-center gap-3", sidebarCollapsed && "justify-center")}>
          {/* Logo mark */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-quantum-400 to-neural-500 flex items-center justify-center flex-shrink-0 shadow-quantum-sm">
            <Brain className="w-4 h-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <div className="text-[13px] font-display font-bold text-white leading-tight tracking-tight">
                AIPE
              </div>
              <div className="text-[10px] font-mono text-white/22 leading-tight">
                v0.1 · beta
              </div>
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/20 hover:text-white/55 hover:bg-white/[0.05] transition-all duration-150"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── AI Status ─────────────────────────────────────────────────── */}
      {!sidebarCollapsed && (
        <div className="px-4 py-2.5 border-b border-white/[0.055]">
          <AIStatusBadge className="w-full justify-center" size="sm" />
        </div>
      )}

      {/* ── Navigation ────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {NAV_ITEMS.map((group) => (
          <div key={group.group}>
            {!sidebarCollapsed && (
              <div className="px-2 mb-2">
                <span className="section-label">{group.group}</span>
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                const accent = item.accent as Accent;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={cn(
                        "relative flex items-center gap-2.5 px-2 py-2 rounded-lg",
                        "text-[13px] font-medium transition-all duration-150 group",
                        sidebarCollapsed && "justify-center",
                        isActive
                          ? cn("border", accentActive[accent])
                          : "text-white/40 hover:text-white/72 hover:bg-white/[0.04] border border-transparent"
                      )}
                    >
                      <Icon
                        className={cn(
                          "flex-shrink-0 transition-colors duration-150",
                          sidebarCollapsed ? "w-[18px] h-[18px]" : "w-4 h-4",
                          isActive ? accentIcon[accent] : "text-current"
                        )}
                      />
                      {!sidebarCollapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}
                      {/* Unresolved recs badge */}
                      {!sidebarCollapsed &&
                        item.href === "/personalize" &&
                        unresolvedRecs.length > 0 && (
                          <span className="w-4 h-4 rounded-full bg-neural-500 text-white text-[9px] font-bold font-mono flex items-center justify-center flex-shrink-0">
                            {unresolvedRecs.length}
                          </span>
                        )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      {!sidebarCollapsed && (
        <div className="p-3 border-t border-white/[0.055] space-y-1">
          {/* Command palette shortcut */}
          <button
            type="button"
            onClick={openCommandPalette}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-lg",
              "bg-white/[0.03] border border-white/[0.06]",
              "text-[12px] text-white/22 hover:text-white/48 transition-all duration-150",
              "font-mono"
            )}
          >
            <Command className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1 text-left">Command palette</span>
            <span className="flex items-center gap-0.5">
              <kbd className="px-1 py-0.5 rounded bg-white/[0.04] border border-white/[0.07] text-[10px] leading-none">⌘</kbd>
              <kbd className="px-1 py-0.5 rounded bg-white/[0.04] border border-white/[0.07] text-[10px] leading-none">K</kbd>
            </span>
          </button>

          {/* User row */}
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neural-400 to-quantum-400 flex items-center justify-center flex-shrink-0 shadow-neural-sm">
              <span className="text-[11px] font-bold text-white">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-white/72 truncate leading-tight">
                User
              </div>
              <div className="text-[10px] font-mono text-white/25 truncate leading-tight mt-0.5">
                {getTimeOfDayGreeting()}
              </div>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-neural-400 flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Expand toggle when collapsed */}
      {sidebarCollapsed && (
        <div className="p-2 border-t border-white/[0.055]">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            className="w-full h-9 flex items-center justify-center rounded-lg text-white/20 hover:text-white/55 hover:bg-white/[0.05] transition-all duration-150"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      )}
    </aside>
  );
}
