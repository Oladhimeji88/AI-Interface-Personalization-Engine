"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { cn } from "@/lib/utils";
import {
  Edit3,
  Copy,
  Check,
  RotateCcw,
  Palette,
  Type,
  Layers,
  Zap,
  ChevronDown,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
  Sparkles,
} from "lucide-react";

// ─── Collapsible token section ────────────────────────────────────────────────

function Section({
  title,
  icon: Icon,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: React.ElementType;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card-base overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors"
      >
        <Icon className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
        <span className="text-xs font-mono font-medium text-white/50 flex-1 text-left uppercase tracking-wider">
          {title}
        </span>
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-white/20" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-white/20" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-white/[0.05]">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Token row ────────────────────────────────────────────────────────────────

function TokenRow({
  name,
  value,
  type = "text",
  min,
  max,
  step,
  onChange,
}: {
  name: string;
  value: string | number;
  type?: "text" | "color" | "range";
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="text-[10px] font-mono text-white/25 w-40 flex-shrink-0 truncate"
        title={name}
      >
        {name}
      </span>

      {type === "color" ? (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-6 h-6 rounded-md border border-white/10 flex-shrink-0 relative overflow-hidden"
            style={{ background: String(value) }}
          >
            <input
              type="color"
              aria-label={`${name} color picker`}
              value={String(value).startsWith("#") ? String(value) : "#050508"}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>
          <input
            type="text"
            aria-label={`${name} value`}
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 min-w-0 px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-[11px] font-mono text-white/70 focus:outline-none focus:border-quantum-400/50"
          />
        </div>
      ) : type === "range" ? (
        <div className="flex items-center gap-2 flex-1">
          <input
            type="range"
            aria-label={name}
            min={min}
            max={max}
            step={step ?? 1}
            value={Number(value)}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 accent-quantum-400"
          />
          <span className="text-[11px] font-mono text-quantum-400 w-12 text-right tabular-nums flex-shrink-0">
            {value}
          </span>
        </div>
      ) : (
        <input
          type="text"
          aria-label={`${name} value`}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-[11px] font-mono text-white/70 focus:outline-none focus:border-quantum-400/50"
        />
      )}
    </div>
  );
}

// ─── Mini UI preview ──────────────────────────────────────────────────────────

function MiniPreview({ viewport, profile }: {
  viewport: "desktop" | "tablet" | "mobile";
  profile: NonNullable<ReturnType<typeof usePersonalizationStore.getState>["profile"]>;
}) {
  const sidebarW = viewport === "mobile" ? 40 : viewport === "tablet" ? 120 : 160;

  return (
    <div
      className="transition-all duration-300 ease-spring rounded-2xl border border-white/[0.08] overflow-hidden shadow-card-float mx-auto"
      style={{
        width: viewport === "mobile" ? 375 : viewport === "tablet" ? 680 : "100%",
        minHeight: 520,
        background: profile.colors.background,
      }}
    >
      <div className="flex" style={{ minHeight: 520 }}>
        {/* Sidebar */}
        <div
          className="flex-shrink-0 p-2.5 space-y-1.5"
          style={{
            width: sidebarW,
            background: profile.colors.surface,
            borderRight: `1px solid ${profile.colors.border}`,
          }}
        >
          <div className="h-6 rounded-lg mb-3" style={{ background: profile.colors.primary, opacity: 0.9 }} />
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-7 rounded-lg flex items-center gap-2 px-2"
              style={{
                background: i === 0 ? "rgba(255,255,255,0.08)" : "transparent",
                border: i === 0 ? `1px solid ${profile.colors.border}` : "1px solid transparent",
              }}
            >
              <div className="w-3 h-3 rounded flex-shrink-0" style={{ background: profile.colors.primary, opacity: 0.6 }} />
              {viewport !== "mobile" && (
                <div className="h-2 rounded-full flex-1" style={{ background: profile.colors.textMuted, opacity: 0.3 }} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-3 min-w-0">
          <div className="flex items-center justify-between">
            <div className="h-5 w-28 rounded" style={{ background: profile.colors.textMuted, opacity: 0.2 }} />
            <div className="h-7 w-20 rounded-lg" style={{ background: profile.colors.primary }} />
          </div>

          <div className={cn("grid gap-2", viewport === "mobile" ? "grid-cols-2" : "grid-cols-3")}>
            {[profile.colors.primary, profile.colors.secondary, profile.colors.accent].slice(0, viewport === "mobile" ? 2 : 3).map((color, i) => (
              <div
                key={i}
                className="h-16 rounded-xl p-2.5"
                style={{ background: profile.colors.surface, border: `1px solid ${profile.colors.border}`, borderRadius: profile.layout.cardRadius }}
              >
                <div className="h-1.5 w-8 rounded mb-2" style={{ background: color, opacity: 0.5 }} />
                <div className="h-5 w-10 rounded" style={{ background: color, opacity: 0.85 }} />
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-3"
            style={{ background: profile.colors.surface, border: `1px solid ${profile.colors.border}`, height: 90, borderRadius: profile.layout.cardRadius }}
          >
            <div className="flex items-end gap-1 h-full pb-1">
              {[60, 80, 45, 90, 65, 75, 55, 85, 70, 95, 50, 80].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h}%`,
                    background: i % 2 === 0 ? profile.colors.primary : profile.colors.secondary,
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
          </div>

          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-2 py-2 px-3 rounded-lg"
              style={{ background: profile.colors.surface, border: `1px solid ${profile.colors.border}`, borderRadius: Math.min(profile.layout.cardRadius, 10) }}
            >
              <div className="w-5 h-5 rounded" style={{ background: profile.colors.primary, opacity: 0.5 }} />
              <div className="flex-1 space-y-1">
                <div className="h-2 rounded w-3/4" style={{ background: profile.colors.textMuted, opacity: 0.3 }} />
                <div className="h-1.5 rounded w-1/2" style={{ background: profile.colors.textMuted, opacity: 0.15 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EditorPage() {
  const { setBreadcrumbs } = useUIStore();
  const { profile, updateProfile, resetToDefaults } = usePersonalizationStore();
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { label: "AIPE", href: "/" },
      { label: "Live Editor", href: "/editor" },
    ]);
  }, [setBreadcrumbs]);

  if (!profile) return null;

  const handleExportCSS = () => {
    const css = [
      `/* AIPE Design Tokens — ${new Date().toLocaleDateString()} */`,
      `:root {`,
      `  --color-primary: ${profile.colors.primary};`,
      `  --color-secondary: ${profile.colors.secondary};`,
      `  --color-accent: ${profile.colors.accent};`,
      `  --color-background: ${profile.colors.background};`,
      `  --color-surface: ${profile.colors.surface};`,
      `  --color-text: ${profile.colors.text};`,
      `  --color-text-muted: ${profile.colors.textMuted};`,
      `  --color-border: ${profile.colors.border};`,
      `  --color-success: ${profile.colors.success};`,
      `  --color-warning: ${profile.colors.warning};`,
      `  --color-error: ${profile.colors.error};`,
      `  --sidebar-width: ${profile.layout.sidebarWidth}px;`,
      `  --card-radius: ${profile.layout.cardRadius}px;`,
      `  --duration-base: ${profile.motion.transitionDuration}ms;`,
      `}`,
    ].join("\n");

    navigator.clipboard.writeText(css).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-[var(--content-max-width)] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 animate-in stagger-1">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Edit3 className="w-4 h-4 text-quantum-400" />
            <span className="section-label">Token Editor</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Live Editor</h1>
          <p className="text-sm text-white/35">
            Edit raw design tokens. Changes propagate across the interface instantly.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={resetToDefaults} className="btn-ghost text-xs">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button type="button" onClick={handleExportCSS} className="btn-secondary text-xs">
            {copied ? <Check className="w-3.5 h-3.5 text-synapse-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Export CSS"}
          </button>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-quantum-400/5 border border-quantum-400/15 mb-6 animate-in stagger-2">
        <Sparkles className="w-3.5 h-3.5 text-quantum-400 flex-shrink-0" />
        <p className="text-xs text-quantum-300/80">
          Token changes are applied instantly and persist across the session. The AI engine will continue adapting within your token overrides.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* ── Token controls ── */}
        <div className="col-span-12 lg:col-span-5 space-y-3 animate-in stagger-3">

          <Section title="Color tokens" icon={Palette}>
            {(Object.entries(profile.colors) as Array<[keyof typeof profile.colors, string]>).map(([key, val]) => (
              <TokenRow
                key={key}
                name={`--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`}
                value={val}
                type={val.startsWith("#") ? "color" : "text"}
                onChange={(v) => updateProfile({ colors: { ...profile.colors, [key]: v } })}
              />
            ))}
          </Section>

          <Section title="Layout tokens" icon={Layers}>
            <TokenRow
              name="--sidebar-width"
              value={profile.layout.sidebarWidth}
              type="range" min={180} max={360} step={4}
              onChange={(v) => updateProfile({ layout: { ...profile.layout, sidebarWidth: Number(v) } })}
            />
            <TokenRow
              name="--card-radius"
              value={profile.layout.cardRadius}
              type="range" min={0} max={32} step={2}
              onChange={(v) => updateProfile({ layout: { ...profile.layout, cardRadius: Number(v) } })}
            />
            <TokenRow
              name="--content-max-width"
              value={profile.layout.contentMaxWidth}
              type="range" min={960} max={1600} step={40}
              onChange={(v) => updateProfile({ layout: { ...profile.layout, contentMaxWidth: Number(v) } })}
            />
            <TokenRow
              name="--spacing"
              value={profile.layout.spacing}
              type="range" min={8} max={32} step={2}
              onChange={(v) => updateProfile({ layout: { ...profile.layout, spacing: Number(v) } })}
            />
          </Section>

          <Section title="Typography tokens" icon={Type}>
            <TokenRow
              name="--line-height"
              value={profile.typography.lineHeight}
              type="range" min={1.2} max={2.0} step={0.05}
              onChange={(v) => updateProfile({ typography: { ...profile.typography, lineHeight: Number(v) } })}
            />
            <TokenRow
              name="--letter-spacing"
              value={profile.typography.letterSpacing}
              type="range" min={-0.05} max={0.1} step={0.005}
              onChange={(v) => updateProfile({ typography: { ...profile.typography, letterSpacing: Number(v) } })}
            />
            <TokenRow
              name="--font-scale"
              value={profile.typography.scale}
              onChange={(v) => updateProfile({ typography: { ...profile.typography, scale: v as typeof profile.typography.scale } })}
            />
          </Section>

          <Section title="Motion tokens" icon={Zap} defaultOpen={false}>
            <TokenRow
              name="--duration-base"
              value={profile.motion.transitionDuration}
              type="range" min={0} max={600} step={20}
              onChange={(v) => updateProfile({ motion: { ...profile.motion, transitionDuration: Number(v) } })}
            />
            <TokenRow
              name="--spring-stiffness"
              value={profile.motion.springStiffness}
              type="range" min={100} max={600} step={10}
              onChange={(v) => updateProfile({ motion: { ...profile.motion, springStiffness: Number(v) } })}
            />
            <TokenRow
              name="--spring-damping"
              value={profile.motion.springDamping}
              type="range" min={10} max={60} step={2}
              onChange={(v) => updateProfile({ motion: { ...profile.motion, springDamping: Number(v) } })}
            />
          </Section>
        </div>

        {/* ── Live preview ── */}
        <div className="col-span-12 lg:col-span-7 animate-in stagger-4">
          <div className="card-base overflow-hidden">
            {/* Preview toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-display font-semibold text-white/70">Live Preview</span>
                <span className="flex items-center gap-1.5">
                  <span className="live-dot" />
                  <span className="text-[10px] font-mono text-synapse-400">LIVE</span>
                </span>
              </div>
              <div className="flex items-center gap-0.5 p-0.5 glass rounded-lg border border-white/[0.07]">
                {(["desktop", "tablet", "mobile"] as const).map((vp) => {
                  const icons = { desktop: Monitor, tablet: Tablet, mobile: Smartphone };
                  const Icon = icons[vp];
                  return (
                    <button
                      key={vp}
                      type="button"
                      onClick={() => setViewport(vp)}
                      aria-label={`${vp} preview`}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-all duration-150",
                        viewport === vp ? "bg-white/[0.1] text-white" : "text-white/25 hover:text-white/60"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:block capitalize">{vp}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview canvas */}
            <div className="p-5 bg-void-500/20 overflow-auto" style={{ minHeight: 560 }}>
              <MiniPreview viewport={viewport} profile={profile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
