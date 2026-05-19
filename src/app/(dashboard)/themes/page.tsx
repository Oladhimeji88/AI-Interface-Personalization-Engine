"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { PersonalizationEngine } from "@/lib/ai/personalization-engine";
import { cn } from "@/lib/utils";
import { Check, Sparkles, Layers } from "lucide-react";

const PALETTES = PersonalizationEngine.getPresetPalettes();

const THEME_META: Record<string, { name: string; description: string; tag: string }> = {
  "quantum-dark": {
    name: "Quantum Dark",
    description: "Electric blue on void black. Precision-engineered for focus.",
    tag: "Default",
  },
  "neural-focus": {
    name: "Neural Focus",
    description: "Deep purple system for extended concentration sessions.",
    tag: "Focus",
  },
  "synapse-green": {
    name: "Synapse Green",
    description: "Bio-inspired emerald tones. For builders in the zone.",
    tag: "Creative",
  },
  "minimal-light": {
    name: "Minimal Light",
    description: "Crisp white canvas for presentations and review modes.",
    tag: "Light",
  },
};

export default function ThemesPage() {
  const { setBreadcrumbs } = useUIStore();
  const { profile, updateProfile } = usePersonalizationStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "AIPE", href: "/" },
      { label: "Themes", href: "/themes" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div className="animate-in stagger-1">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-neural-400" />
          <span className="section-label">Design System</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">
          Themes
        </h1>
        <p className="text-sm text-white/35">
          Pre-built palettes. AI will blend and adapt them to your context.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(PALETTES).map(([key, palette], i) => {
          const meta = THEME_META[key];
          const isActive = profile?.colors.primary === palette.primary;

          return (
            <button
              key={key}
              onClick={() => updateProfile({ colors: palette })}
              className={cn(
                "card-base p-5 text-left group transition-all duration-300",
                `animate-in stagger-${i + 1}`,
                isActive
                  ? "border-white/20 shadow-card-float"
                  : "hover:border-white/12"
              )}
            >
              {/* Preview */}
              <div
                className="h-28 rounded-xl mb-4 overflow-hidden relative border border-white/10"
                style={{ background: palette.background }}
              >
                {/* Simulated UI chrome */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1/4 border-r"
                  style={{
                    background: `rgba(255,255,255,0.03)`,
                    borderColor: palette.border,
                  }}
                />
                <div className="absolute left-1/4 top-3 right-3 space-y-2">
                  <div
                    className="h-2 rounded-full w-3/4"
                    style={{ background: palette.primary, opacity: 0.8 }}
                  />
                  <div
                    className="h-1.5 rounded-full"
                    style={{ background: palette.textMuted }}
                  />
                  <div
                    className="h-8 rounded-lg"
                    style={{ background: palette.surface, border: `1px solid ${palette.border}` }}
                  />
                  <div className="grid grid-cols-3 gap-1">
                    {[palette.primary, palette.secondary, palette.accent].map((c, j) => (
                      <div
                        key={j}
                        className="h-5 rounded-md"
                        style={{ background: c, opacity: 0.6 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Color chips */}
                <div className="absolute bottom-2.5 right-2.5 flex gap-1.5">
                  {[palette.primary, palette.secondary, palette.accent].map((c) => (
                    <div
                      key={c}
                      className="w-4 h-4 rounded-full ring-1 ring-black/20"
                      style={{ background: c }}
                    />
                  ))}
                </div>

                {isActive && (
                  <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-synapse-400 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="text-sm font-display font-semibold text-white/90">
                  {meta?.name ?? key}
                </h3>
                <span className="badge bg-white/5 text-white/30 border-white/10 text-xs flex-shrink-0">
                  {meta?.tag}
                </span>
              </div>
              <p className="text-xs text-white/35">{meta?.description}</p>
            </button>
          );
        })}
      </div>

      {/* AI note */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-quantum-400/5 border border-quantum-400/15 animate-in stagger-5">
        <Sparkles className="w-4 h-4 text-quantum-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-quantum-300 mb-0.5">AI Theme Blending</p>
          <p className="text-xs text-white/30 leading-relaxed">
            AIPE can blend between themes dynamically based on context — shifting toward warmer
            tones in the evening, cooler tones during focus sessions, and higher contrast during
            high cognitive load. Select a base theme; AI handles transitions.
          </p>
        </div>
      </div>
    </div>
  );
}
