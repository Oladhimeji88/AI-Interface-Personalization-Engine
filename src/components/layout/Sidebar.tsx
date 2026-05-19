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
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, accent: "quantum" },
      { href: "/analytics", label: "Analytics", icon: BarChart3, accent: "synapse" },
      { href: "/insights", label: "Behavior Insights", icon: Lightbulb, accent: "plasma" },
    ],
  },
  {
    group: "Personalization",
    items: [
      { href: "/personalize", label: "Personalize", icon: Palette, accent: "neural" },
      { href: "/editor", label: "Live Editor", icon: Edit3, accent: "quantum" },
      { href: "/themes", label: "Themes", icon: Layers, accent: "neural" },
    ],
  },
  {
    group: "System",
    items: [
      { href: "/settings", label: "Settings", icon: Settings, accent: "default" },
    ],
  },
] as const;

const accentClasses = {
  quantum: "text-quantum-400 bg-quantum-400/10 border-quantum-400/20",
  neural: "text-neural-400 bg-neural-400/10 border-neural-400/20",
  synapse: "text-synapse-400 bg-synapse-400/10 border-synapse-400/20",
  plasma: "text-plasma-500 bg-plasma-500/10 border-plasma-500/20",
  default: "text-white/50 bg-white/5 border-white/10",
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
        "border-r border-white/[0.06] bg-void-DEFAULT/90",
        "backdrop-blur-xl transition-all duration-300 ease-spring",
        sidebarCollapsed ? "w-16" : "w-[var(--sidebar-width)]"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center border-b border-white/[0.06] flex-shrink-0",
          "h-[var(--header-height)]",
          sidebarCollapsed ? "px-3 justify-center" : "px-4 justify-between"
        )}
      >
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-quantum-400 to-neural-400 flex items-center justify-center flex-shrink-0">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <div className="text-xs font-display font-bold text-white leading-tight tracking-tight">
                AIPE
              </div>
              <div className="text-[10px] font-mono text-white/25 leading-tight">
                v0.1.0 — beta
              </div>
            </div>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-quantum-400 to-neural-400 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-white" />
          </div>
        )}
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="w-6 h-6 rounded-md flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/5 transition-all duration-150"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* AI Status */}
      {!sidebarCollapsed && (
        <div className="px-3 py-2.5 border-b border-white/[0.06]">
          <AIStatusBadge className="w-full justify-center" size="sm" />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
        {NAV_ITEMS.map((group) => (
          <div key={group.group}>
            {!sidebarCollapsed && (
              <div className="px-2 mb-1.5">
                <span className="section-label text-[10px]">{group.group}</span>
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-2 py-2 rounded-lg",
                        "text-sm font-medium transition-all duration-150 group",
                        isActive
                          ? cn("bg-white/[0.07] border border-white/[0.09]", accentClasses[item.accent])
                          : "text-white/40 hover:text-white/80 hover:bg-white/[0.05]",
                        sidebarCollapsed && "justify-center"
                      )}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon
                        className={cn(
                          "flex-shrink-0 transition-colors duration-150",
                          sidebarCollapsed ? "w-5 h-5" : "w-4 h-4",
                          isActive
                            ? accentClasses[item.accent].split(" ")[0]
                            : "text-current"
                        )}
                      />
                      {!sidebarCollapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}
                      {!sidebarCollapsed &&
                        item.href === "/personalize" &&
                        unresolvedRecs.length > 0 && (
                          <span className="w-4 h-4 rounded-full bg-neural-400 text-white text-[9px] font-bold font-mono flex items-center justify-center flex-shrink-0">
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

      {/* Command palette trigger */}
      {!sidebarCollapsed && (
        <div className="p-3 border-t border-white/[0.06] space-y-2">
          <button
            onClick={openCommandPalette}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-lg",
              "glass border border-white/[0.07]",
              "text-xs text-white/25 hover:text-white/50 transition-all duration-150",
              "font-mono group"
            )}
          >
            <Command className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Command palette</span>
            <span className="flex items-center gap-0.5">
              <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/[0.07] text-[10px]">⌘</kbd>
              <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/[0.07] text-[10px]">K</kbd>
            </span>
          </button>

          {/* User */}
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neural-400 to-quantum-400 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white/70 truncate">User</div>
              <div className="text-[10px] font-mono text-white/25 truncate">{getTimeOfDayGreeting()}</div>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-neural-400 flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Collapse toggle when collapsed */}
      {sidebarCollapsed && (
        <div className="p-2 border-t border-white/[0.06]">
          <button
            onClick={toggleSidebar}
            className="w-full h-9 flex items-center justify-center rounded-lg text-white/20 hover:text-white/60 hover:bg-white/5 transition-all duration-150"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      )}
    </aside>
  );
}
