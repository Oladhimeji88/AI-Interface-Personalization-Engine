"use client";

import { useEffect, useRef, useState } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { Stack, Box, Inline, Text } from "@atlaskit/primitives";
import Heading from "@atlaskit/heading";
import Button from "@atlaskit/button";
import Lozenge from "@atlaskit/lozenge";
import SectionMessage from "@atlaskit/section-message";
import {
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
} from "lucide-react";
import styles from "./page.module.css";

// ─── Collapsible section ─────────────────────────────────────────────────────

function Section({
  title,
  icon: Icon,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: React.FC<{ size?: number; className?: string }>;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.sectionCard}>
      <button type="button" onClick={() => setOpen((o) => !o)} className={styles.sectionHeader}>
        <Icon size={14} className={styles.sectionIcon} />
        <span className={styles.sectionTitle}>{title}</span>
        {open
          ? <ChevronDown size={14} className={styles.sectionChevron} />
          : <ChevronRight size={14} className={styles.sectionChevron} />
        }
      </button>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  );
}

// ─── Token row ───────────────────────────────────────────────────────────────

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
  const swatchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (type === "color") {
      swatchRef.current?.style.setProperty("--swatch-color", String(value));
    }
  }, [type, value]);

  return (
    <div className={styles.tokenRow}>
      <span className={styles.tokenName} title={name}>{name}</span>

      {type === "color" ? (
        <div className={styles.colorInputGroup}>
          <div ref={swatchRef} className={styles.colorSwatchWrap}>
            <input
              type="color"
              aria-label={`${name} color picker`}
              value={String(value).startsWith("#") ? String(value) : "#050508"}
              onChange={(e) => onChange(e.target.value)}
              className={styles.colorPickerInput}
            />
          </div>
          <input
            type="text"
            aria-label={`${name} value`}
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
            className={styles.tokenTextInput}
          />
        </div>
      ) : type === "range" ? (
        <div className={styles.rangeWrap}>
          <input
            type="range"
            aria-label={name}
            min={min}
            max={max}
            step={step ?? 1}
            value={Number(value)}
            onChange={(e) => onChange(e.target.value)}
            className={styles.rangeInput}
          />
          <span className={styles.rangeValue}>{value}</span>
        </div>
      ) : (
        <input
          type="text"
          aria-label={`${name} value`}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className={styles.tokenTextInput}
        />
      )}
    </div>
  );
}

// ─── Mini UI preview ─────────────────────────────────────────────────────────

const BAR_HEIGHTS = [60, 80, 45, 90, 65, 75, 55, 85, 70, 95, 50, 80] as const;
type BarHeight = (typeof BAR_HEIGHTS)[number];

const barHeightClass: Record<BarHeight, string> = {
  45: styles.barH45, 50: styles.barH50, 55: styles.barH55,
  60: styles.barH60, 65: styles.barH65, 70: styles.barH70,
  75: styles.barH75, 80: styles.barH80, 85: styles.barH85,
  90: styles.barH90, 95: styles.barH95,
};

const shellClass:    Record<string, string> = { desktop: styles.shellDesktop,   tablet: styles.shellTablet,   mobile: styles.shellMobile   };
const sidebarClass:  Record<string, string> = { desktop: styles.sidebarDesktop, tablet: styles.sidebarTablet, mobile: styles.sidebarMobile  };
const cardGridClass: Record<string, string> = { desktop: styles.cardGridDesktop, tablet: styles.cardGridDesktop, mobile: styles.cardGridMobile };
const accentClasses = [styles.accentPrimary, styles.accentSecondary, styles.accentAccent];

function MiniPreview({
  viewport,
  profile,
}: {
  viewport: "desktop" | "tablet" | "mobile";
  profile: NonNullable<ReturnType<typeof usePersonalizationStore.getState>["profile"]>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty("--preview-bg",        profile.colors.background);
    el.style.setProperty("--preview-surface",   profile.colors.surface);
    el.style.setProperty("--preview-border",    profile.colors.border);
    el.style.setProperty("--preview-primary",   profile.colors.primary);
    el.style.setProperty("--preview-secondary", profile.colors.secondary);
    el.style.setProperty("--preview-accent",    profile.colors.accent);
    el.style.setProperty("--preview-text-muted", profile.colors.textMuted);
    el.style.setProperty("--preview-radius",    `${profile.layout.cardRadius}px`);
    el.style.setProperty("--preview-radius-sm", `${Math.min(profile.layout.cardRadius, 10)}px`);
  }, [
    profile.colors.background, profile.colors.surface, profile.colors.border,
    profile.colors.primary,    profile.colors.secondary, profile.colors.accent,
    profile.colors.textMuted,  profile.layout.cardRadius,
  ]);

  const colorsToShow = viewport === "mobile" ? 2 : 3;

  return (
    <div ref={containerRef} className={`${styles.previewShell} ${shellClass[viewport]}`}>
      <div className={styles.previewInner}>

        {/* Sidebar */}
        <div className={`${styles.previewSidebar} ${sidebarClass[viewport]}`}>
          <div className={styles.sidebarLogo} />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`${styles.navItem} ${i === 0 ? styles.navItemActive : styles.navItemInactive}`}>
              <div className={styles.navIcon} />
              {viewport !== "mobile" && <div className={styles.navText} />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className={styles.previewContent}>
          <div className={styles.contentHeaderRow}>
            <div className={styles.contentTitleBar} />
            <div className={styles.contentActionBtn} />
          </div>

          <div className={`${styles.cardGrid} ${cardGridClass[viewport]}`}>
            {accentClasses.slice(0, colorsToShow).map((accentClass, i) => (
              <div key={i} className={styles.card}>
                <div className={`${styles.cardAccentBar} ${accentClass}`} />
                <div className={`${styles.cardAccentValue} ${accentClass}`} />
              </div>
            ))}
          </div>

          <div className={styles.chartCard}>
            <div className={styles.chartBars}>
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className={`${styles.chartBar} ${barHeightClass[h]} ${i % 2 === 0 ? styles.barPrimary : styles.barSecondary}`}
                />
              ))}
            </div>
          </div>

          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.listItem}>
              <div className={styles.listItemIcon} />
              <div className={styles.listItemLines}>
                <div className={styles.listItemLine1} />
                <div className={styles.listItemLine2} />
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

  const viewportIcons = { desktop: Monitor, tablet: Tablet, mobile: Smartphone };

  return (
    <Box padding="space.400">
      <Stack space="space.400">

        {/* ── Header ──────────────────────────────────────── */}
        <Inline spread="space-between" alignBlock="start">
          <Stack space="space.150">
            <Inline space="space.100" alignBlock="center">
              <Lozenge appearance="inprogress" isBold>Token Editor</Lozenge>
            </Inline>
            <Heading size="xlarge">Live Editor</Heading>
            <Text color="color.text.subtle">
              Edit raw design tokens. Changes propagate across the interface instantly.
            </Text>
          </Stack>
          <Inline space="space.100">
            <Button
              appearance="subtle"
              onClick={() => resetToDefaults()}
              iconBefore={() => <RotateCcw size={14} />}
            >
              Reset
            </Button>
            <Button
              appearance="default"
              onClick={handleExportCSS}
              iconBefore={() => copied ? <Check size={14} /> : <Copy size={14} />}
            >
              {copied ? "Copied!" : "Export CSS"}
            </Button>
          </Inline>
        </Inline>

        {/* ── Info bar ────────────────────────────────────── */}
        <SectionMessage appearance="information" title="Live token propagation">
          <Text size="small">
            Token changes are applied instantly and persist across the session.
            The AI engine will continue adapting within your token overrides.
          </Text>
        </SectionMessage>

        {/* ── Editor grid ─────────────────────────────────── */}
        <div className={styles.editorGrid}>

          {/* Token controls */}
          <div className={styles.tokenPanel}>
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

          {/* Live preview */}
          <div className={styles.previewCard}>
            <div className={styles.previewToolbar}>
              <div className={styles.previewToolbarLeft}>
                <Text weight="semibold" color="color.text.subtle" size="small">Live Preview</Text>
                <div className={styles.liveIndicator}>
                  <div className={styles.liveDot} />
                  <span className={styles.liveLabelText}>LIVE</span>
                </div>
              </div>
              <div className={styles.viewportSwitcher}>
                {(["desktop", "tablet", "mobile"] as const).map((vp) => {
                  const Icon = viewportIcons[vp];
                  return (
                    <button
                      key={vp}
                      type="button"
                      onClick={() => setViewport(vp)}
                      aria-label={`${vp} preview`}
                      className={viewport === vp ? styles.viewportBtnActive : styles.viewportBtn}
                    >
                      <Icon size={14} />
                      <span className={styles.viewportBtnLabel}>{vp}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.previewCanvas}>
              <MiniPreview viewport={viewport} profile={profile} />
            </div>
          </div>

        </div>
      </Stack>
    </Box>
  );
}
