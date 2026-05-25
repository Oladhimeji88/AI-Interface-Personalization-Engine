"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { PersonalizationEngine } from "@/lib/ai/personalization-engine";
import { cn } from "@/lib/utils";
import {
  Palette,
  Layers,
  Type,
  Zap,
  Eye,
  Brain,
  Check,
  RotateCcw,
  Sparkles,
  ChevronRight,
  RefreshCcw,
  Keyboard,
} from "lucide-react";

const PALETTE_PRESETS = PersonalizationEngine.getPresetPalettes();

const SECTIONS = [
  { id: "colors", label: "Colors", icon: Palette },
  { id: "layout", label: "Layout", icon: Layers },
  { id: "typography", label: "Typography", icon: Type },
  { id: "motion", label: "Motion", icon: Zap },
  { id: "accessibility", label: "Accessibility", icon: Eye },
  { id: "ai", label: "AI Engine", icon: Brain },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

// ─── Shared Toggle ────────────────────────────────────────────────────────────

function Toggle({ on, onToggle, label = "Toggle" }: { on: boolean; onToggle: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      aria-pressed={on ? "true" : "false"}
      className={cn(
        "relative w-10 h-[22px] rounded-full transition-all duration-200 flex-shrink-0",
        on ? "bg-synapse-400" : "bg-white/10"
      )}
    >
      <div
        className={cn(
          "absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all duration-200",
          on ? "left-[22px]" : "left-[3px]"
        )}
      />
    </button>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PersonalizePage() {
  const { setBreadcrumbs } = useUIStore();
  const {
    profile,
    updateProfile,
    adaptProfile,
    isAdapting,
    resetToDefaults,
    aiSettings,
    updateAISettings,
  } = usePersonalizationStore();
  const [activeSection, setActiveSection] = useState<SectionId>("colors");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { label: "AIPE", href: "/" },
      { label: "Personalization", href: "/personalize" },
    ]);
  }, [setBreadcrumbs]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-in stagger-1">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">
            Personalization
          </h1>
          <p className="text-sm text-white/35">
            Your interface is AI-adapted in real time. Fine-tune any dimension manually.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={resetToDefaults} className="btn-ghost text-xs">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset defaults
          </button>
          <button
            onClick={() => { adaptProfile(); handleSave(); }}
            disabled={isAdapting}
            className="btn-primary text-sm"
          >
            {isAdapting ? (
              <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
            ) : saved ? (
              <Check className="w-3.5 h-3.5 text-synapse-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {saved ? "Saved!" : "Apply & Save"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Section nav */}
        <div className="col-span-12 md:col-span-3 animate-in stagger-2">
          <nav className="space-y-0.5 sticky top-[calc(var(--header-height)+2rem)]">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm",
                    "transition-all duration-150 text-left",
                    activeSection === s.id
                      ? "bg-white/[0.08] text-white border border-white/10"
                      : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{s.label}</span>
                  {activeSection === s.id && (
                    <ChevronRight className="w-3.5 h-3.5 text-white/30 ml-auto" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="col-span-12 md:col-span-9 animate-in stagger-3">

          {/* ── Colors ────────────────────────────────────── */}
          {activeSection === "colors" && (
            <div className="space-y-5">
              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">
                  Color Palette Presets
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(PALETTE_PRESETS).map(([key, palette]) => {
                    const isActive = profile.colors.primary === palette.primary;
                    return (
                      <button
                        key={key}
                        onClick={() => updateProfile({ colors: palette })}
                        className={cn(
                          "p-4 rounded-xl border transition-all duration-200 text-left",
                          isActive
                            ? "border-white/20 bg-white/[0.08]"
                            : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          {[palette.primary, palette.secondary, palette.accent].map((c) => (
                            <div
                              key={c}
                              className="w-5 h-5 rounded-full flex-shrink-0 ring-1 ring-black/20"
                              style={{ background: c }}
                            />
                          ))}
                          {isActive && (
                            <Check className="w-3.5 h-3.5 text-synapse-400 ml-auto" />
                          )}
                        </div>
                        <div
                          className="h-12 rounded-lg mb-2 border border-white/10"
                          style={{
                            background: `linear-gradient(135deg, ${palette.background} 0%, ${palette.surface} 100%)`,
                          }}
                        />
                        <p className="text-xs font-mono text-white/60 capitalize">
                          {key.replace(/-/g, " ")}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">
                  Custom Token Overrides
                </h3>
                <div className="space-y-3">
                  {(["primary", "secondary", "accent"] as const).map((key) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-xs font-mono text-white/40 w-20 capitalize">{key}</span>
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className="w-7 h-7 rounded-lg border border-white/10 flex-shrink-0 cursor-pointer overflow-hidden relative"
                          style={{ background: profile.colors[key] }}
                        >
                          <input
                            type="color"
                            value={profile.colors[key]}
                            onChange={(e) =>
                              updateProfile({ colors: { ...profile.colors, [key]: e.target.value } })
                            }
                            aria-label={`${key} color picker`}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </div>
                        <input
                          type="text"
                          value={profile.colors[key]}
                          onChange={(e) =>
                            updateProfile({ colors: { ...profile.colors, [key]: e.target.value } })
                          }
                          aria-label={`${key} hex value`}
                          className="input-base text-xs font-mono flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Layout ────────────────────────────────────── */}
          {activeSection === "layout" && (
            <div className="space-y-4">
              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">Density</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(["compact", "comfortable", "spacious"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => updateProfile({ layout: { ...profile.layout, density: d } })}
                      className={cn(
                        "p-4 rounded-xl border text-center transition-all duration-200",
                        profile.layout.density === d
                          ? "border-quantum-400/40 bg-quantum-400/10 text-quantum-300"
                          : "border-white/[0.06] bg-white/[0.03] text-white/50 hover:bg-white/[0.06]"
                      )}
                    >
                      <div className="flex flex-col gap-1 mb-2 mx-auto w-fit">
                        {d === "compact" && [0, 1, 2, 3].map((i) => (
                          <div key={i} className="h-0.5 w-10 bg-current rounded opacity-60" />
                        ))}
                        {d === "comfortable" && [0, 1, 2].map((i) => (
                          <div key={i} className="h-1 w-10 bg-current rounded opacity-60" />
                        ))}
                        {d === "spacious" && [0, 1].map((i) => (
                          <div key={i} className="h-1.5 w-10 bg-current rounded opacity-60" />
                        ))}
                      </div>
                      <span className="text-xs font-medium capitalize">{d}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">Navigation Style</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(["sidebar", "topbar", "hybrid", "minimal"] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => updateProfile({ layout: { ...profile.layout, navigationStyle: n } })}
                      className={cn(
                        "p-3.5 rounded-xl border text-left transition-all duration-200",
                        profile.layout.navigationStyle === n
                          ? "border-quantum-400/40 bg-quantum-400/10"
                          : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]"
                      )}
                    >
                      <span className={cn("text-xs font-medium capitalize", profile.layout.navigationStyle === n ? "text-quantum-300" : "text-white/50")}>
                        {n}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">Sidebar Width</h3>
                <div className="space-y-2">
                  <input
                    type="range" min={180} max={360}
                    aria-label="Sidebar width"
                    value={profile.layout.sidebarWidth}
                    onChange={(e) =>
                      updateProfile({ layout: { ...profile.layout, sidebarWidth: Number(e.target.value) } })
                    }
                    className="w-full accent-quantum-400"
                  />
                  <div className="flex justify-between text-xs font-mono text-white/25">
                    <span>180px</span>
                    <span className="text-quantum-400">{profile.layout.sidebarWidth}px</span>
                    <span>360px</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Typography ────────────────────────────────── */}
          {activeSection === "typography" && (
            <div className="space-y-4">
              {/* Font Scale */}
              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">Font Scale</h3>
                <div className="grid grid-cols-5 gap-2">
                  {(["xs", "sm", "md", "lg", "xl"] as const).map((scale) => {
                    const sizes: Record<string, number> = { xs: 10, sm: 12, md: 15, lg: 18, xl: 22 };
                    return (
                      <button
                        key={scale}
                        onClick={() => updateProfile({ typography: { ...profile.typography, scale } })}
                        className={cn(
                          "p-3 rounded-xl border text-center transition-all duration-200",
                          profile.typography.scale === scale
                            ? "border-quantum-400/40 bg-quantum-400/10 text-quantum-300"
                            : "border-white/[0.06] bg-white/[0.03] text-white/50 hover:bg-white/[0.06]"
                        )}
                      >
                        <div
                          className="font-display font-bold mb-1.5 leading-none"
                          style={{ fontSize: sizes[scale] }}
                        >
                          Aa
                        </div>
                        <span className="text-xs font-mono">{scale}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Display Font */}
              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">Display Font</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Syne", className: "font-display", label: "Syne" },
                    { name: "Barlow Condensed", className: "font-numeric", label: "Barlow Condensed" },
                  ].map((font) => {
                    const active = profile.typography.displayFont === font.name;
                    return (
                      <button
                        key={font.name}
                        onClick={() => updateProfile({ typography: { ...profile.typography, displayFont: font.name } })}
                        className={cn(
                          "p-4 rounded-xl border text-left transition-all duration-200",
                          active
                            ? "border-quantum-400/40 bg-quantum-400/10"
                            : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]"
                        )}
                      >
                        <div className={cn("text-xl font-bold mb-1", font.className, active ? "text-quantum-300" : "text-white/60")}>
                          AIPE
                        </div>
                        <span className="text-xs font-mono text-white/30">{font.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Line Height */}
              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">Line Height</h3>
                <div className="space-y-3">
                  <input
                    type="range" min={1.2} max={2.0} step={0.05}
                    aria-label="Line height"
                    value={profile.typography.lineHeight}
                    onChange={(e) =>
                      updateProfile({ typography: { ...profile.typography, lineHeight: Number(e.target.value) } })
                    }
                    className="w-full accent-quantum-400"
                  />
                  <div className="flex justify-between text-xs font-mono text-white/25">
                    <span>Tight 1.2</span>
                    <span className="text-quantum-400">{profile.typography.lineHeight.toFixed(2)}</span>
                    <span>Loose 2.0</span>
                  </div>
                  <p
                    className="text-xs text-white/30 border border-white/[0.06] rounded-lg px-3 py-2 bg-white/[0.02]"
                    style={{ lineHeight: profile.typography.lineHeight }}
                  >
                    The quick brown fox jumps over the lazy dog. Interface density follows cognitive patterns.
                  </p>
                </div>
              </div>

              {/* Letter Spacing */}
              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">Letter Spacing</h3>
                <div className="space-y-3">
                  <input
                    type="range" min={-0.05} max={0.1} step={0.005}
                    aria-label="Letter spacing"
                    value={profile.typography.letterSpacing}
                    onChange={(e) =>
                      updateProfile({ typography: { ...profile.typography, letterSpacing: Number(e.target.value) } })
                    }
                    className="w-full accent-quantum-400"
                  />
                  <div className="flex justify-between text-xs font-mono text-white/25">
                    <span>Tight</span>
                    <span className="text-quantum-400">{profile.typography.letterSpacing.toFixed(3)}em</span>
                    <span>Wide</span>
                  </div>
                  <p
                    className="text-xs text-white/30 border border-white/[0.06] rounded-lg px-3 py-2 bg-white/[0.02] font-mono"
                    style={{ letterSpacing: `${profile.typography.letterSpacing}em` }}
                  >
                    AIPE ADAPTIVE INTERFACE ENGINE
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Motion ────────────────────────────────────── */}
          {activeSection === "motion" && (
            <div className="space-y-4">
              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">Motion Preference</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(["full", "reduced", "none"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => updateProfile({ motion: { ...profile.motion, preference: m } })}
                      className={cn(
                        "p-4 rounded-xl border text-center transition-all duration-200",
                        profile.motion.preference === m
                          ? "border-synapse-400/40 bg-synapse-400/10 text-synapse-300"
                          : "border-white/[0.06] bg-white/[0.03] text-white/50 hover:bg-white/[0.06]"
                      )}
                    >
                      <Zap className={cn("w-5 h-5 mx-auto mb-2", m === "none" && "opacity-20", m === "reduced" && "opacity-60")} />
                      <span className="text-xs font-medium capitalize">{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">Transition Duration</h3>
                <div className="space-y-2">
                  <input
                    type="range" min={0} max={600} step={20}
                    aria-label="Transition duration"
                    value={profile.motion.transitionDuration}
                    onChange={(e) =>
                      updateProfile({ motion: { ...profile.motion, transitionDuration: Number(e.target.value) } })
                    }
                    className="w-full accent-synapse-400"
                  />
                  <div className="flex justify-between text-xs font-mono text-white/25">
                    <span>0ms</span>
                    <span className="text-synapse-400">{profile.motion.transitionDuration}ms</span>
                    <span>600ms</span>
                  </div>
                </div>
              </div>

              <div className="card-base p-5 space-y-4">
                {(["hoverEffects", "loadingAnimations", "backgroundParticles"] as const).map((key) => {
                  const labels: Record<string, string> = {
                    hoverEffects: "Hover Effects",
                    loadingAnimations: "Loading Animations",
                    backgroundParticles: "Background Particles",
                  };
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-white/60 font-medium">{labels[key]}</span>
                      <Toggle
                        on={profile.motion[key]}
                        label={labels[key]}
                        onToggle={() =>
                          updateProfile({ motion: { ...profile.motion, [key]: !profile.motion[key] } })
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Accessibility ─────────────────────────────── */}
          {activeSection === "accessibility" && (
            <div className="space-y-4">
              {/* Display & Interaction toggles */}
              <div className="card-base p-5 space-y-4">
                <h3 className="text-sm font-display font-semibold text-white/90">Display & Interaction</h3>
                {([
                  { key: "highContrast", label: "High Contrast", desc: "Increase contrast for better visibility" },
                  { key: "largeText", label: "Large Text", desc: "Scale all text up for readability" },
                  { key: "reducedMotion", label: "Reduced Motion", desc: "Minimize all animations and transitions" },
                  { key: "screenReaderOptimized", label: "Screen Reader Optimized", desc: "Enhance ARIA labels and semantic structure" },
                  { key: "captions", label: "Captions", desc: "Show descriptive captions on interactive elements" },
                ] as const).map(({ key, label, desc }) => (
                  <div key={key} className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-white/70 font-medium">{label}</div>
                      <div className="text-xs text-white/25 mt-0.5">{desc}</div>
                    </div>
                    <Toggle
                      on={profile.accessibility[key]}
                      label={label}
                      onToggle={() =>
                        updateProfile({ accessibility: { ...profile.accessibility, [key]: !profile.accessibility[key] } })
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Focus Ring */}
              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">Focus Ring Style</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(["default", "thick", "glow"] as const).map((ring) => {
                    const active = profile.accessibility.focusRing === ring;
                    return (
                      <button
                        key={ring}
                        onClick={() => updateProfile({ accessibility: { ...profile.accessibility, focusRing: ring } })}
                        className={cn(
                          "p-4 rounded-xl border text-center transition-all duration-200",
                          active
                            ? "border-quantum-400/40 bg-quantum-400/10 text-quantum-300"
                            : "border-white/[0.06] bg-white/[0.03] text-white/50 hover:bg-white/[0.06]"
                        )}
                      >
                        <div
                          className={cn(
                            "w-7 h-7 rounded-lg mx-auto mb-2",
                            ring === "default" && "border-2 border-white/40",
                            ring === "thick" && "border-4 border-white/60",
                            ring === "glow" && "border-2 border-quantum-400 shadow-quantum-sm"
                          )}
                        />
                        <span className="text-xs font-medium capitalize">{ring}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Keyboard Navigation */}
              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">Keyboard Navigation</h3>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { mode: "standard", desc: "Tab and arrow key navigation" },
                    { mode: "enhanced", desc: "Chord sequences and vim-style shortcuts" },
                  ] as const).map(({ mode, desc }) => {
                    const active = profile.accessibility.keyboardNavigation === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() =>
                          updateProfile({ accessibility: { ...profile.accessibility, keyboardNavigation: mode } })
                        }
                        className={cn(
                          "p-4 rounded-xl border text-left transition-all duration-200",
                          active
                            ? "border-quantum-400/40 bg-quantum-400/10"
                            : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <Keyboard className={cn("w-3.5 h-3.5", active ? "text-quantum-400" : "text-white/30")} />
                          <span className={cn("text-xs font-medium capitalize", active ? "text-quantum-300" : "text-white/60")}>
                            {mode}
                          </span>
                        </div>
                        <p className="text-xs text-white/25">{desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Blind Mode */}
              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">Color Blind Mode</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(["none", "protanopia", "deuteranopia", "tritanopia"] as const).map((mode) => {
                    const active = profile.accessibility.colorBlindMode === mode;
                    const descriptions: Record<string, string> = {
                      none: "Default color rendering",
                      protanopia: "Red-blind compensation",
                      deuteranopia: "Green-blind compensation",
                      tritanopia: "Blue-blind compensation",
                    };
                    return (
                      <button
                        key={mode}
                        onClick={() =>
                          updateProfile({ accessibility: { ...profile.accessibility, colorBlindMode: mode } })
                        }
                        className={cn(
                          "p-3.5 rounded-xl border text-left transition-all duration-200",
                          active
                            ? "border-synapse-400/40 bg-synapse-400/10"
                            : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]"
                        )}
                      >
                        <span className={cn("text-xs font-semibold capitalize block mb-0.5", active ? "text-synapse-300" : "text-white/60")}>
                          {mode === "none" ? "None" : mode}
                        </span>
                        <span className="text-xs text-white/20">{descriptions[mode]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── AI Engine ─────────────────────────────────── */}
          {activeSection === "ai" && (
            <div className="space-y-4">
              <div className="card-base p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-quantum-400/20 to-neural-400/20 flex items-center justify-center border border-neural-400/20">
                    <Brain className="w-5 h-5 text-neural-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-semibold text-white/90">
                      AI Personalization Engine
                    </h3>
                    <p className="text-xs text-white/30">
                      Confidence: {Math.round(profile.aiConfidence * 100)}% · {profile.adaptationCount} total adaptations
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { label: "Behavior Analysis", enabled: true, description: "Track clicks, scrolls, and patterns" },
                    { label: "Cognitive Load Inference", enabled: true, description: "Adapt UI based on detected mental load" },
                    { label: "Emotional State Adaptation", enabled: true, description: "Adjust based on inferred mood" },
                    { label: "Predictive Quick Actions", enabled: false, description: "Suggest next actions before you need them" },
                    { label: "Cross-Session Memory", enabled: true, description: "Remember preferences across sessions" },
                  ].map((feature) => (
                    <div
                      key={feature.label}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                    >
                      <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", feature.enabled ? "bg-synapse-400" : "bg-white/10")} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white/70">{feature.label}</div>
                        <div className="text-xs text-white/25">{feature.description}</div>
                      </div>
                      <span className={cn("badge text-xs", feature.enabled ? "bg-synapse-400/10 text-synapse-300 border-synapse-400/20" : "bg-white/5 text-white/25 border-white/10")}>
                        {feature.enabled ? "Active" : "Disabled"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">
                  Adaptation Sensitivity
                </h3>
                <div className="space-y-5">
                  {([
                    { label: "Response Speed", hint: "How quickly AI reacts to behavioral changes", key: "responseSpeed" },
                    { label: "Confidence Threshold", hint: "Minimum confidence before applying changes", key: "confidenceThreshold" },
                  ] as const).map(({ label, hint, key }) => (
                    <div key={key} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-white/60">{label}</label>
                        <span className="text-xs font-mono text-neural-400">{aiSettings[key]}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        aria-label={label}
                        value={aiSettings[key]}
                        onChange={(e) => updateAISettings({ [key]: Number(e.target.value) })}
                        className="w-full accent-neural-400"
                      />
                      <p className="text-xs text-white/20">{hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
