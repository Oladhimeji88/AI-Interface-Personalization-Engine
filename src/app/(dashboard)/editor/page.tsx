"use client";

import { useEffect, useState, useCallback } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { PersonalizationEngine } from "@/lib/ai/personalization-engine";
import { cn } from "@/lib/utils";
import {
  Edit3,
  Eye,
  Code2,
  RefreshCcw,
  Copy,
  Check,
  Layers,
  Palette,
  Type,
  Zap,
  ChevronDown,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";

type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORT_SIZES: Record<Viewport, { width: string; label: string }> = {
  desktop: { width: "100%", label: "Desktop" },
  tablet: { width: "768px", label: "Tablet" },
  mobile: { width: "375px", label: "Mobile" },
};

const TOKEN_GROUPS = [
  {
    label: "Colors",
    icon: Palette,
    tokens: [
      { name: "--color-primary", value: "#0EA5E9", type: "color" },
      { name: "--color-secondary", value: "#8B5CF6", type: "color" },
      { name: "--color-accent", value: "#10B981", type: "color" },
      { name: "--color-background", value: "#050508", type: "color" },
      { name: "--color-surface", value: "rgba(255,255,255,0.04)", type: "text" },
      { name: "--color-border", value: "rgba(255,255,255,0.08)", type: "text" },
    ],
  },
  {
    label: "Layout",
    icon: Layers,
    tokens: [
      { name: "--sidebar-width", value: "260px", type: "text" },
      { name: "--header-height", value: "56px", type: "text" },
      { name: "--card-radius", value: "12px", type: "text" },
      { name: "--content-max-width", value: "1280px", type: "text" },
    ],
  },
  {
    label: "Typography",
    icon: Type,
    tokens: [
      { name: "--text-base", value: "0.9375rem", type: "text" },
      { name: "--text-lg", value: "1.0625rem", type: "text" },
      { name: "--text-xl", value: "1.25rem", type: "text" },
    ],
  },
  {
    label: "Motion",
    icon: Zap,
    tokens: [
      { name: "--duration-base", value: "220ms", type: "text" },
      { name: "--duration-fast", value: "120ms", type: "text" },
      { name: "--duration-slow", value: "380ms", type: "text" },
      { name: "--ease-spring", value: "cubic-bezier(0.16, 1, 0.3, 1)", type: "text" },
    ],
  },
];

export default function EditorPage() {
  const { setBreadcrumbs } = useUIStore();
  const { profile, updateProfile } = usePersonalizationStore();
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [activeGroup, setActiveGroup] = useState(0);
  const [tokens, setTokens] = useState(TOKEN_GROUPS);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { label: "AIPE", href: "/" },
      { label: "Live Editor", href: "/editor" },
    ]);
  }, [setBreadcrumbs]);

  // Sync profile colors into token editor
  useEffect(() => {
    if (!profile) return;
    setTokens((prev) =>
      prev.map((group) => ({
        ...group,
        tokens: group.tokens.map((t) => {
          if (t.name === "--color-primary") return { ...t, value: profile.colors.primary };
          if (t.name === "--color-secondary") return { ...t, value: profile.colors.secondary };
          if (t.name === "--color-accent") return { ...t, value: profile.colors.accent };
          if (t.name === "--color-background") return { ...t, value: profile.colors.background };
          if (t.name === "--sidebar-width") return { ...t, value: `${profile.layout.sidebarWidth}px` };
          if (t.name === "--duration-base") return { ...t, value: `${profile.motion.transitionDuration}ms` };
          return t;
        }),
      }))
    );
  }, [profile]);

  const handleTokenChange = useCallback(
    (groupIdx: number, tokenIdx: number, value: string) => {
      setTokens((prev) => {
        const updated = structuredClone(prev);
        updated[groupIdx].tokens[tokenIdx].value = value;
        return updated;
      });

      // Apply to DOM immediately
      const token = tokens[groupIdx].tokens[tokenIdx];
      document.documentElement.style.setProperty(token.name, value);
    },
    [tokens]
  );

  const generateCSSOutput = () => {
    const lines = tokens
      .flatMap((g) => g.tokens)
      .map((t) => `  ${t.name}: ${t.value};`);
    return `:root {\n${lines.join("\n")}\n}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateCSSOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-var(--header-height))] overflow-hidden">
      {/* ── Token Panel ───────────────────────────────── */}
      <div className="w-72 flex-shrink-0 border-r border-white/[0.06] flex flex-col bg-void-50/50">
        {/* Panel header */}
        <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-display font-semibold text-white/90">Token Editor</h2>
            <p className="text-xs font-mono text-white/25 mt-0.5">Live CSS variable override</p>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setShowCode((s) => !s)}
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                showCode ? "bg-quantum-400/20 text-quantum-400" : "btn-ghost"
              )}
              title="Toggle code view"
            >
              <Code2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleCopy} className="btn-ghost w-7 h-7 p-0" title="Copy CSS">
              {copied ? (
                <Check className="w-3.5 h-3.5 text-synapse-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {showCode ? (
          /* Code view */
          <div className="flex-1 overflow-auto p-3">
            <pre className="text-xs font-mono text-synapse-300 leading-relaxed whitespace-pre-wrap">
              {generateCSSOutput()}
            </pre>
          </div>
        ) : (
          /* Visual token groups */
          <div className="flex-1 overflow-y-auto py-2">
            {tokens.map((group, gIdx) => {
              const Icon = group.icon;
              const isOpen = activeGroup === gIdx;
              return (
                <div key={group.label}>
                  <button
                    onClick={() => setActiveGroup(isOpen ? -1 : gIdx)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/[0.04] transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 text-white/30" />
                    <span className="text-xs font-medium text-white/60 flex-1 text-left">
                      {group.label}
                    </span>
                    {isOpen ? (
                      <ChevronDown className="w-3 h-3 text-white/20" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-white/20" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="pb-2 space-y-1">
                      {group.tokens.map((token, tIdx) => (
                        <div key={token.name} className="px-4 py-2">
                          <div className="text-[10px] font-mono text-white/25 mb-1.5 truncate">
                            {token.name}
                          </div>
                          <div className="flex items-center gap-2">
                            {token.type === "color" && (
                              <div
                                className="w-6 h-6 rounded-md border border-white/10 flex-shrink-0 cursor-pointer"
                                style={{ background: token.value }}
                                onClick={() => {
                                  const input = document.getElementById(
                                    `color-${gIdx}-${tIdx}`
                                  ) as HTMLInputElement;
                                  input?.click();
                                }}
                              >
                                <input
                                  id={`color-${gIdx}-${tIdx}`}
                                  type="color"
                                  value={token.value.startsWith("#") ? token.value : "#000000"}
                                  onChange={(e) => handleTokenChange(gIdx, tIdx, e.target.value)}
                                  className="opacity-0 w-0 h-0"
                                />
                              </div>
                            )}
                            <input
                              type="text"
                              value={token.value}
                              onChange={(e) => handleTokenChange(gIdx, tIdx, e.target.value)}
                              className="input-base text-[10px] font-mono py-1.5 flex-1"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Reset strip */}
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={() => {
              const defaults = PersonalizationEngine.createDefaultProfile("user-001");
              updateProfile({ colors: defaults.colors });
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all duration-150"
          >
            <RefreshCcw className="w-3 h-3" />
            Reset to defaults
          </button>
        </div>
      </div>

      {/* ── Preview Panel ──────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="h-12 border-b border-white/[0.06] flex items-center justify-between px-4 bg-void-50/30">
          <div className="flex items-center gap-1 p-0.5 glass rounded-lg border border-white/[0.07]">
            {(["desktop", "tablet", "mobile"] as const).map((vp) => {
              const icons = { desktop: Monitor, tablet: Tablet, mobile: Smartphone };
              const Icon = icons[vp];
              return (
                <button
                  key={vp}
                  onClick={() => setViewport(vp)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-all duration-150",
                    viewport === vp
                      ? "bg-white/[0.1] text-white"
                      : "text-white/25 hover:text-white/60"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:block capitalize">{vp}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/20">
              {VIEWPORT_SIZES[viewport].width}
            </span>
            <div className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1.5 text-xs font-mono text-synapse-400">
              <span className="live-dot" />
              Live preview
            </span>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-auto bg-void-500/30 flex items-start justify-center p-6">
          <div
            className="transition-all duration-300 ease-spring bg-void-DEFAULT rounded-2xl border border-white/[0.06] overflow-hidden shadow-card-float"
            style={{ width: VIEWPORT_SIZES[viewport].width, minHeight: "600px" }}
          >
            {/* Mini dashboard preview */}
            <div className="flex h-full" style={{ minHeight: "600px" }}>
              {/* Mini sidebar */}
              <div
                className="flex-shrink-0 border-r border-white/[0.06] p-3 space-y-2"
                style={{
                  width: viewport === "mobile" ? "48px" : "160px",
                  background: "var(--color-surface)",
                }}
              >
                <div
                  className="h-6 rounded-lg"
                  style={{ background: "var(--color-primary)", opacity: 0.8 }}
                />
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-7 rounded-lg flex items-center gap-2 px-2"
                    style={{
                      background: i === 0 ? "rgba(255,255,255,0.08)" : "transparent",
                      border: i === 0 ? "1px solid var(--color-border)" : "1px solid transparent",
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded flex-shrink-0"
                      style={{ background: "var(--color-primary)", opacity: 0.6 }}
                    />
                    {viewport !== "mobile" && (
                      <div
                        className="h-2 rounded-full flex-1"
                        style={{ background: "var(--color-text-muted)", opacity: 0.3 }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Mini content */}
              <div className="flex-1 p-4 space-y-3">
                {/* Header bar */}
                <div className="flex items-center justify-between">
                  <div
                    className="h-5 w-32 rounded"
                    style={{ background: "var(--color-text-muted)", opacity: 0.2 }}
                  />
                  <div
                    className="h-7 w-20 rounded-lg"
                    style={{ background: "var(--color-primary)", opacity: 0.8 }}
                  />
                </div>

                {/* Metric cards */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "var(--color-primary)",
                    "var(--color-secondary)",
                    "var(--color-accent)",
                  ].map((color, i) => (
                    <div
                      key={i}
                      className="h-16 rounded-xl p-2"
                      style={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <div
                        className="h-1.5 w-8 rounded mb-1.5"
                        style={{ background: `${color}`, opacity: 0.4 }}
                      />
                      <div
                        className="h-5 w-12 rounded"
                        style={{ background: `${color}`, opacity: 0.7 }}
                      />
                    </div>
                  ))}
                </div>

                {/* Chart area */}
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    height: "100px",
                  }}
                >
                  <div className="flex items-end gap-1 h-full pb-2">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${30 + Math.random() * 70}%`,
                          background: i % 3 === 0
                            ? "var(--color-primary)"
                            : "var(--color-secondary)",
                          opacity: 0.5 + Math.random() * 0.4,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* List items */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 py-2 px-3 rounded-lg"
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded"
                      style={{ background: "var(--color-primary)", opacity: 0.5 }}
                    />
                    <div className="flex-1 space-y-1">
                      <div
                        className="h-2 rounded w-3/4"
                        style={{ background: "var(--color-text-muted)", opacity: 0.3 }}
                      />
                      <div
                        className="h-1.5 rounded w-1/2"
                        style={{ background: "var(--color-text-muted)", opacity: 0.15 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
