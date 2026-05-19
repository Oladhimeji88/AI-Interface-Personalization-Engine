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

export default function PersonalizePage() {
  const { setBreadcrumbs } = useUIStore();
  const { profile, updateProfile, adaptProfile, isAdapting, resetToDefaults } =
    usePersonalizationStore();
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
          <button
            onClick={resetToDefaults}
            className="btn-ghost text-xs"
          >
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

          {/* ── Colors ─────────────────────────────────────── */}
          {activeSection === "colors" && (
            <div className="space-y-5">
              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">
                  Color Palette Presets
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(PALETTE_PRESETS).map(([key, palette]) => {
                    const isActive =
                      profile.colors.primary === palette.primary;
                    return (
                      <button
                        key={key}
                        onClick={() =>
                          updateProfile({ colors: palette })
                        }
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

              {/* Custom color tokens */}
              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">
                  Custom Token Overrides
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Primary", key: "primary" as const },
                    { label: "Secondary", key: "secondary" as const },
                    { label: "Accent", key: "accent" as const },
                  ].map(({ label, key }) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-xs font-mono text-white/40 w-20">
                        {label}
                      </span>
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className="w-7 h-7 rounded-lg border border-white/10 flex-shrink-0 cursor-pointer"
                          style={{ background: profile.colors[key] }}
                        />
                        <input
                          type="text"
                          value={profile.colors[key]}
                          onChange={(e) =>
                            updateProfile({
                              colors: { ...profile.colors, [key]: e.target.value },
                            })
                          }
                          className="input-base text-xs font-mono flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Layout ─────────────────────────────────────── */}
          {activeSection === "layout" && (
            <div className="space-y-4">
              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">
                  Density
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {(["compact", "comfortable", "spacious"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() =>
                        updateProfile({
                          layout: { ...profile.layout, density: d },
                        })
                      }
                      className={cn(
                        "p-4 rounded-xl border text-center transition-all duration-200",
                        profile.layout.density === d
                          ? "border-quantum-400/40 bg-quantum-400/10 text-quantum-300"
                          : "border-white/[0.06] bg-white/[0.03] text-white/50 hover:bg-white/[0.06]"
                      )}
                    >
                      <div className="flex flex-col gap-1 mb-2 mx-auto w-fit">
                        {d === "compact" &&
                          [4, 4, 4, 4].map((_, i) => (
                            <div key={i} className="h-0.5 w-10 bg-current rounded opacity-60" />
                          ))}
                        {d === "comfortable" &&
                          [4, 3, 4].map((_, i) => (
                            <div key={i} className="h-1 w-10 bg-current rounded opacity-60" />
                          ))}
                        {d === "spacious" &&
                          [3, 3].map((_, i) => (
                            <div key={i} className="h-1.5 w-10 bg-current rounded opacity-60" />
                          ))}
                      </div>
                      <span className="text-xs font-medium capitalize">{d}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">
                  Navigation Style
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {(["sidebar", "topbar", "hybrid", "minimal"] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() =>
                        updateProfile({
                          layout: { ...profile.layout, navigationStyle: n },
                        })
                      }
                      className={cn(
                        "p-3.5 rounded-xl border text-left transition-all duration-200",
                        profile.layout.navigationStyle === n
                          ? "border-quantum-400/40 bg-quantum-400/10"
                          : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]"
                      )}
                    >
                      <span
                        className={cn(
                          "text-xs font-medium capitalize",
                          profile.layout.navigationStyle === n
                            ? "text-quantum-300"
                            : "text-white/50"
                        )}
                      >
                        {n}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">
                  Sidebar Width
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={180}
                    max={360}
                    value={profile.layout.sidebarWidth}
                    onChange={(e) =>
                      updateProfile({
                        layout: { ...profile.layout, sidebarWidth: Number(e.target.value) },
                      })
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

          {/* ── Motion ─────────────────────────────────────── */}
          {activeSection === "motion" && (
            <div className="space-y-4">
              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">
                  Motion Preference
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {(["full", "reduced", "none"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() =>
                        updateProfile({
                          motion: { ...profile.motion, preference: m },
                        })
                      }
                      className={cn(
                        "p-4 rounded-xl border text-center transition-all duration-200",
                        profile.motion.preference === m
                          ? "border-synapse-400/40 bg-synapse-400/10 text-synapse-300"
                          : "border-white/[0.06] bg-white/[0.03] text-white/50 hover:bg-white/[0.06]"
                      )}
                    >
                      <Zap
                        className={cn(
                          "w-5 h-5 mx-auto mb-2",
                          m === "none" && "opacity-20",
                          m === "reduced" && "opacity-60"
                        )}
                      />
                      <span className="text-xs font-medium capitalize">{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-base p-5">
                <h3 className="text-sm font-display font-semibold text-white/90 mb-4">
                  Transition Duration
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={0}
                    max={600}
                    step={20}
                    value={profile.motion.transitionDuration}
                    onChange={(e) =>
                      updateProfile({
                        motion: { ...profile.motion, transitionDuration: Number(e.target.value) },
                      })
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

              {/* Toggles */}
              <div className="card-base p-5 space-y-4">
                {[
                  { label: "Hover Effects", key: "hoverEffects" as const },
                  { label: "Loading Animations", key: "loadingAnimations" as const },
                  { label: "Background Particles", key: "backgroundParticles" as const },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-white/60 font-medium">{label}</span>
                    <button
                      onClick={() =>
                        updateProfile({
                          motion: { ...profile.motion, [key]: !profile.motion[key] },
                        })
                      }
                      className={cn(
                        "w-10 h-5.5 rounded-full transition-all duration-200 relative",
                        profile.motion[key]
                          ? "bg-synapse-400"
                          : "bg-white/10"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200",
                          profile.motion[key] ? "left-5" : "left-0.5"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── AI Engine ──────────────────────────────────── */}
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
                      Confidence: {Math.round((profile.aiConfidence) * 100)}% · {profile.adaptationCount} total adaptations
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
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
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full flex-shrink-0",
                          feature.enabled ? "bg-synapse-400" : "bg-white/10"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white/70">{feature.label}</div>
                        <div className="text-xs text-white/25">{feature.description}</div>
                      </div>
                      <span
                        className={cn(
                          "badge text-xs",
                          feature.enabled
                            ? "bg-synapse-400/10 text-synapse-300 border-synapse-400/20"
                            : "bg-white/5 text-white/25 border-white/10"
                        )}
                      >
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
                <div className="space-y-4">
                  {[
                    { label: "Response Speed", hint: "How quickly AI reacts to behavioral changes" },
                    { label: "Confidence Threshold", hint: "Minimum confidence before applying changes" },
                  ].map(({ label, hint }) => (
                    <div key={label} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-white/60">{label}</label>
                        <span className="text-xs font-mono text-white/25">75%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        defaultValue={75}
                        className="w-full accent-neural-400"
                      />
                      <p className="text-xs text-white/20">{hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other sections */}
          {(activeSection === "typography" || activeSection === "accessibility") && (
            <div className="card-base p-8 text-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                {activeSection === "typography" ? (
                  <Type className="w-5 h-5 text-white/30" />
                ) : (
                  <Eye className="w-5 h-5 text-white/30" />
                )}
              </div>
              <p className="text-sm font-medium text-white/40">
                {activeSection === "typography" ? "Typography" : "Accessibility"} controls
              </p>
              <p className="text-xs text-white/20 mt-1">
                AI manages these adaptively. Manual overrides coming soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
