"use client";

import { useEffect, useRef, useState } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { cn } from "@/lib/utils";
import {
  Search,
  LayoutDashboard,
  Palette,
  BarChart3,
  Brain,
  Settings,
  Lightbulb,
  Zap,
  Moon,
  Sun,
  Command,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  shortcut?: string[];
  action: () => void;
  category: "navigate" | "ai" | "settings" | "quick";
}

export function CommandPalette() {
  const { commandPaletteOpen, closeCommandPalette } = useUIStore();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: Command[] = [
    {
      id: "dashboard",
      label: "Go to Dashboard",
      description: "Main control center",
      icon: <LayoutDashboard className="w-4 h-4 text-quantum-400" />,
      shortcut: ["G", "D"],
      action: () => { router.push("/dashboard"); closeCommandPalette(); },
      category: "navigate",
    },
    {
      id: "personalize",
      label: "Open Personalization",
      description: "Adjust your interface settings",
      icon: <Palette className="w-4 h-4 text-neural-400" />,
      shortcut: ["G", "P"],
      action: () => { router.push("/personalize"); closeCommandPalette(); },
      category: "navigate",
    },
    {
      id: "analytics",
      label: "View Analytics",
      description: "Session metrics and insights",
      icon: <BarChart3 className="w-4 h-4 text-synapse-400" />,
      shortcut: ["G", "A"],
      action: () => { router.push("/analytics"); closeCommandPalette(); },
      category: "navigate",
    },
    {
      id: "ai-adapt",
      label: "Trigger AI Adaptation",
      description: "Run personalization engine now",
      icon: <Brain className="w-4 h-4 text-neural-400" />,
      shortcut: ["⌘", "⇧", "A"],
      action: () => { closeCommandPalette(); },
      category: "ai",
    },
    {
      id: "focus-mode",
      label: "Toggle Focus Mode",
      description: "Minimize distractions",
      icon: <Zap className="w-4 h-4 text-plasma-500" />,
      shortcut: ["⌘", "⇧", "F"],
      action: () => { useUIStore.getState().toggleFocusMode(); closeCommandPalette(); },
      category: "quick",
    },
    {
      id: "theme-dark",
      label: "Apply Neural Focus theme",
      description: "Purple-accented dark theme",
      icon: <Moon className="w-4 h-4 text-neural-400" />,
      action: () => { closeCommandPalette(); },
      category: "settings",
    },
    {
      id: "theme-light",
      label: "Apply Minimal Light theme",
      description: "Clean light theme",
      icon: <Sun className="w-4 h-4 text-quantum-400" />,
      action: () => { closeCommandPalette(); },
      category: "settings",
    },
    {
      id: "insights",
      label: "View Behavior Insights",
      description: "Your interaction patterns",
      icon: <Lightbulb className="w-4 h-4 text-plasma-500" />,
      shortcut: ["G", "I"],
      action: () => { router.push("/insights"); closeCommandPalette(); },
      category: "navigate",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-4 h-4 text-white/50" />,
      action: () => { router.push("/settings"); closeCommandPalette(); },
      category: "settings",
    },
  ];

  const filtered = query
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const grouped = {
    navigate: filtered.filter((c) => c.category === "navigate"),
    ai: filtered.filter((c) => c.category === "ai"),
    quick: filtered.filter((c) => c.category === "quick"),
    settings: filtered.filter((c) => c.category === "settings"),
  };

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!commandPaletteOpen) return;
      if (e.key === "Escape") closeCommandPalette();
      if (e.key === "ArrowDown") setSelected((s) => Math.min(s + 1, filtered.length - 1));
      if (e.key === "ArrowUp") setSelected((s) => Math.max(s - 1, 0));
      if (e.key === "Enter" && filtered[selected]) {
        filtered[selected].action();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [commandPaletteOpen, filtered, selected, closeCommandPalette]);

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeCommandPalette}
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl mx-4 animate-scale-in">
        <div
          className={cn(
            "w-full rounded-2xl overflow-hidden",
            "bg-void-100 border border-white/10",
            "shadow-[0_8px_64px_rgba(0,0,0,0.8),0_2px_16px_rgba(0,0,0,0.6)]"
          )}
        >
          {/* Search bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]">
            <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
              placeholder="Search commands, pages, actions…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none font-body"
            />
            <kbd className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono text-white/20 bg-white/5 border border-white/[0.07]">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto py-2">
            {Object.entries(grouped).map(([category, items]) => {
              if (!items.length) return null;
              const labels: Record<string, string> = {
                navigate: "Navigate",
                ai: "AI Engine",
                quick: "Quick Actions",
                settings: "Settings",
              };
              return (
                <div key={category}>
                  <div className="px-3 py-1.5">
                    <span className="section-label">{labels[category]}</span>
                  </div>
                  {items.map((cmd, i) => {
                    const globalIdx = filtered.indexOf(cmd);
                    return (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelected(globalIdx)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 transition-colors duration-100",
                          selected === globalIdx
                            ? "bg-white/[0.07]"
                            : "hover:bg-white/[0.04]"
                        )}
                      >
                        <div className="w-7 h-7 rounded-lg glass flex items-center justify-center flex-shrink-0 border border-white/[0.07]">
                          {cmd.icon}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-sm font-medium text-white/90">
                            {cmd.label}
                          </div>
                          {cmd.description && (
                            <div className="text-xs text-white/35 truncate">
                              {cmd.description}
                            </div>
                          )}
                        </div>
                        {cmd.shortcut && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {cmd.shortcut.map((k) => (
                              <kbd
                                key={k}
                                className="px-1.5 py-0.5 rounded text-xs font-mono text-white/30 bg-white/5 border border-white/[0.07]"
                              >
                                {k}
                              </kbd>
                            ))}
                          </div>
                        )}
                        {selected === globalIdx && (
                          <ChevronRight className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-white/30">No commands match "{query}"</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-3 text-xs font-mono text-white/20">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/[0.07]">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/[0.07]">↵</kbd>
                select
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-white/20">
              <Command className="w-3 h-3" />
              <span>K to open</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
