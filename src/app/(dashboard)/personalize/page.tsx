"use client";

import { useEffect, useRef, useState } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { PersonalizationEngine } from "@/lib/ai/personalization-engine";
import { Stack, Box, Inline, Grid, Text } from "@atlaskit/primitives";
import Heading from "@atlaskit/heading";
import Button, { LoadingButton } from "@atlaskit/button";
import Toggle from "@atlaskit/toggle";
import Lozenge from "@atlaskit/lozenge";
import SectionMessage from "@atlaskit/section-message";
import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";
import { Check, RotateCcw } from "lucide-react";
import styles from "./page.module.css";

const PALETTE_PRESETS = PersonalizationEngine.getPresetPalettes();

function ColorSwatch({ color }: { color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.style.setProperty("--swatch-color", color); }, [color]);
  return <div ref={ref} className={styles.colorSwatch} />;
}

function PalettePreview({ bg, surface }: { bg: string; surface: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.style.setProperty("--p-bg", bg);
    ref.current?.style.setProperty("--p-surface", surface);
  }, [bg, surface]);
  return <div ref={ref} className={styles.palettePreview} />;
}

function PickerSwatch({ color, onChange, label }: { color: string; onChange: (v: string) => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.style.setProperty("--picker-color", color); }, [color]);
  return (
    <div ref={ref} className={styles.pickerSwatch}>
      <input type="color" value={color} onChange={(e) => onChange(e.target.value)} aria-label={label} className={styles.pickerInput} />
    </div>
  );
}

function TypographyPreview({ text, lineHeight, letterSpacing }: { text: string; lineHeight?: number; letterSpacing?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (lineHeight !== undefined)   ref.current?.style.setProperty("--preview-lh", String(lineHeight));
    if (letterSpacing !== undefined) ref.current?.style.setProperty("--preview-ls", `${letterSpacing}em`);
  }, [lineHeight, letterSpacing]);
  return <div ref={ref} className={styles.typographyPreview}>{text}</div>;
}

const FONT_SCALE_MAP: Record<string, { size: number; class: string }> = {
  xs: { size: 10, class: styles.fontScale10 },
  sm: { size: 12, class: styles.fontScale12 },
  md: { size: 15, class: styles.fontScale15 },
  lg: { size: 18, class: styles.fontScale18 },
  xl: { size: 22, class: styles.fontScale22 },
};

export default function PersonalizePage() {
  const { setBreadcrumbs } = useUIStore();
  const { profile, updateProfile, adaptProfile, isAdapting, resetToDefaults, aiSettings, updateAISettings } =
    usePersonalizationStore();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { label: "AIPE", href: "/" },
      { label: "Personalization", href: "/personalize" },
    ]);
  }, [setBreadcrumbs]);

  if (!profile) return null;

  const handleSave = () => {
    adaptProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Box padding="space.400">
      <Stack space="space.400">

        {/* ── Header ──────────────────────────────────────── */}
        <Inline spread="space-between" alignBlock="start">
          <Stack space="space.100">
            <Heading size="xlarge">Personalization</Heading>
            <Text color="color.text.subtle">
              Your interface is AI-adapted in real time. Fine-tune any dimension manually.
            </Text>
          </Stack>
          <Inline space="space.100">
            <Button appearance="subtle" iconBefore={<RotateCcw size={14} />} onClick={resetToDefaults}>
              Reset defaults
            </Button>
            <LoadingButton
              appearance="primary"
              isLoading={isAdapting}
              iconBefore={saved ? <Check size={14} /> : undefined}
              onClick={handleSave}
            >
              {saved ? "Saved!" : "Apply & Save"}
            </LoadingButton>
          </Inline>
        </Inline>

        {/* ── Tabbed sections ─────────────────────────────── */}
        <Tabs id="personalize-tabs">
          <TabList>
            <Tab>Colors</Tab>
            <Tab>Layout</Tab>
            <Tab>Typography</Tab>
            <Tab>Motion</Tab>
            <Tab>Accessibility</Tab>
            <Tab>AI Engine</Tab>
          </TabList>

          {/* Colors */}
          <TabPanel>
            <Box paddingBlockStart="space.300">
              <Stack space="space.300">

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.200">
                    <Text weight="semibold" color="color.text">Color Palette Presets</Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap="space.150">
                      {Object.entries(PALETTE_PRESETS).map(([key, palette]) => {
                        const isActive = profile.colors.primary === palette.primary;
                        return (
                          <Box
                            key={key}
                            backgroundColor={isActive ? "elevation.surface.overlay" : "elevation.surface"}
                            padding="space.200"
                            borderRadius="border.radius"
                            onClick={() => updateProfile({ colors: palette })}
                            as="button"
                          >
                            <Stack space="space.150">
                              <Inline space="space.100" alignBlock="center">
                                  <ColorSwatch color={palette.primary}   />
                                <ColorSwatch color={palette.secondary} />
                                <ColorSwatch color={palette.accent}    />
                                {isActive && <Check size={14} color="#34d399" />}
                              </Inline>
                              <PalettePreview bg={palette.background} surface={palette.surface} />
                              <Text size="small" color="color.text.subtle" weight="medium">
                                {key.replace(/-/g, " ")}
                              </Text>
                            </Stack>
                          </Box>
                        );
                      })}
                    </Grid>
                  </Stack>
                </Box>

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.200">
                    <Text weight="semibold" color="color.text">Custom Token Overrides</Text>
                    {(["primary", "secondary", "accent"] as const).map((key) => (
                      <Inline key={key} space="space.150" alignBlock="center">
                        <Text size="small" color="color.text.subtlest" weight="medium" as="span">
                          {key}
                        </Text>
                        <PickerSwatch
                          color={profile.colors[key]}
                          onChange={(v) => updateProfile({ colors: { ...profile.colors, [key]: v } })}
                          label={`${key} color picker`}
                        />
                        <Box backgroundColor="elevation.surface" padding="space.100" borderRadius="border.radius" grow="fill">
                          <input
                            type="text"
                            value={profile.colors[key]}
                            onChange={(e) => updateProfile({ colors: { ...profile.colors, [key]: e.target.value } })}
                            aria-label={`${key} hex value`}
                            className={styles.tokenInput}
                          />
                        </Box>
                      </Inline>
                    ))}
                  </Stack>
                </Box>

              </Stack>
            </Box>
          </TabPanel>

          {/* Layout */}
          <TabPanel>
            <Box paddingBlockStart="space.300">
              <Stack space="space.300">

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.200">
                    <Text weight="semibold" color="color.text">Density</Text>
                    <Grid templateColumns="repeat(3, 1fr)" gap="space.150">
                      {(["compact", "comfortable", "spacious"] as const).map((d) => {
                        const isActive = profile.layout.density === d;
                        return (
                          <Box
                            key={d}
                            backgroundColor={isActive ? "elevation.surface.overlay" : "elevation.surface"}
                            padding="space.200"
                            borderRadius="border.radius"
                            as="button"
                            onClick={() => updateProfile({ layout: { ...profile.layout, density: d } })}
                          >
                            <Stack space="space.100" alignInline="center">
                              <div className={styles.densityLines}>
                                {d === "compact" && [0,1,2,3].map((i) => <div key={i} className={styles.densityLineCompact} />)}
                                {d === "comfortable" && [0,1,2].map((i) => <div key={i} className={styles.densityLineComfortable} />)}
                                {d === "spacious" && [0,1].map((i) => <div key={i} className={styles.densityLineSpaciousSm} />)}
                              </div>
                              <Lozenge appearance={isActive ? "inprogress" : "default"}>{d}</Lozenge>
                            </Stack>
                          </Box>
                        );
                      })}
                    </Grid>
                  </Stack>
                </Box>

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.200">
                    <Text weight="semibold" color="color.text">Navigation Style</Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap="space.150">
                      {(["sidebar", "topbar", "hybrid", "minimal"] as const).map((n) => {
                        const isActive = profile.layout.navigationStyle === n;
                        return (
                          <Box
                            key={n}
                            backgroundColor={isActive ? "elevation.surface.overlay" : "elevation.surface"}
                            padding="space.200"
                            borderRadius="border.radius"
                            as="button"
                            onClick={() => updateProfile({ layout: { ...profile.layout, navigationStyle: n } })}
                          >
                            <Lozenge appearance={isActive ? "inprogress" : "default"}>{n}</Lozenge>
                          </Box>
                        );
                      })}
                    </Grid>
                  </Stack>
                </Box>

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.150">
                    <Inline spread="space-between">
                      <Text weight="semibold" color="color.text">Sidebar Width</Text>
                      <Text size="small" color="color.text.subtlest" weight="medium">{profile.layout.sidebarWidth}px</Text>
                    </Inline>
                    <input
                      type="range" min={180} max={360} aria-label="Sidebar width"
                      value={profile.layout.sidebarWidth}
                      onChange={(e) => updateProfile({ layout: { ...profile.layout, sidebarWidth: Number(e.target.value) } })}
                      className={styles.rangeInput}
                    />
                  </Stack>
                </Box>

              </Stack>
            </Box>
          </TabPanel>

          {/* Typography */}
          <TabPanel>
            <Box paddingBlockStart="space.300">
              <Stack space="space.300">

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.200">
                    <Text weight="semibold" color="color.text">Font Scale</Text>
                    <Grid templateColumns="repeat(5, 1fr)" gap="space.100">
                      {(["xs", "sm", "md", "lg", "xl"] as const).map((scale) => {
                        const isActive = profile.typography.scale === scale;
                        return (
                          <Box
                            key={scale}
                            backgroundColor={isActive ? "elevation.surface.overlay" : "elevation.surface"}
                            padding="space.200"
                            borderRadius="border.radius"
                            as="button"
                            onClick={() => updateProfile({ typography: { ...profile.typography, scale } })}
                          >
                            <Stack space="space.100" alignInline="center">
                              <div className={`${styles.fontScaleSample} ${FONT_SCALE_MAP[scale].class}`}>Aa</div>
                              <Lozenge appearance={isActive ? "inprogress" : "default"}>{scale}</Lozenge>
                            </Stack>
                          </Box>
                        );
                      })}
                    </Grid>
                  </Stack>
                </Box>

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.150">
                    <Inline spread="space-between">
                      <Text weight="semibold" color="color.text">Line Height</Text>
                      <Text size="small" color="color.text.subtlest" weight="medium">{profile.typography.lineHeight.toFixed(2)}</Text>
                    </Inline>
                    <input
                      type="range" min={1.2} max={2.0} step={0.05} aria-label="Line height"
                      value={profile.typography.lineHeight}
                      onChange={(e) => updateProfile({ typography: { ...profile.typography, lineHeight: Number(e.target.value) } })}
                      className={styles.rangeInput}
                    />
                    <TypographyPreview
                      text="The quick brown fox jumps over the lazy dog. Interface density follows cognitive patterns."
                      lineHeight={profile.typography.lineHeight}
                    />
                  </Stack>
                </Box>

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.150">
                    <Inline spread="space-between">
                      <Text weight="semibold" color="color.text">Letter Spacing</Text>
                      <Text size="small" color="color.text.subtlest" weight="medium">{profile.typography.letterSpacing.toFixed(3)}em</Text>
                    </Inline>
                    <input
                      type="range" min={-0.05} max={0.1} step={0.005} aria-label="Letter spacing"
                      value={profile.typography.letterSpacing}
                      onChange={(e) => updateProfile({ typography: { ...profile.typography, letterSpacing: Number(e.target.value) } })}
                      className={styles.rangeInput}
                    />
                    <TypographyPreview
                      text="AIPE ADAPTIVE INTERFACE ENGINE"
                      letterSpacing={profile.typography.letterSpacing}
                    />
                  </Stack>
                </Box>

              </Stack>
            </Box>
          </TabPanel>

          {/* Motion */}
          <TabPanel>
            <Box paddingBlockStart="space.300">
              <Stack space="space.300">

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.200">
                    <Text weight="semibold" color="color.text">Motion Preference</Text>
                    <Grid templateColumns="repeat(3, 1fr)" gap="space.150">
                      {(["full", "reduced", "none"] as const).map((m) => {
                        const isActive = profile.motion.preference === m;
                        return (
                          <Box
                            key={m}
                            backgroundColor={isActive ? "elevation.surface.overlay" : "elevation.surface"}
                            padding="space.200"
                            borderRadius="border.radius"
                            as="button"
                            onClick={() => updateProfile({ motion: { ...profile.motion, preference: m } })}
                          >
                            <Stack space="space.100" alignInline="center">
                              <Lozenge appearance={isActive ? "success" : "default"}>{m}</Lozenge>
                            </Stack>
                          </Box>
                        );
                      })}
                    </Grid>
                  </Stack>
                </Box>

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.150">
                    <Inline spread="space-between">
                      <Text weight="semibold" color="color.text">Transition Duration</Text>
                      <Text size="small" color="color.text.subtlest" weight="medium">{profile.motion.transitionDuration}ms</Text>
                    </Inline>
                    <input
                      type="range" min={0} max={600} step={20} aria-label="Transition duration"
                      value={profile.motion.transitionDuration}
                      onChange={(e) => updateProfile({ motion: { ...profile.motion, transitionDuration: Number(e.target.value) } })}
                      className={styles.rangeInput}
                    />
                  </Stack>
                </Box>

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.200">
                    {(["hoverEffects", "loadingAnimations", "backgroundParticles"] as const).map((key) => {
                      const labels: Record<string, string> = {
                        hoverEffects: "Hover Effects",
                        loadingAnimations: "Loading Animations",
                        backgroundParticles: "Background Particles",
                      };
                      return (
                        <Inline key={key} spread="space-between" alignBlock="center">
                          <Text color="color.text.subtle" weight="medium">{labels[key]}</Text>
                          <Toggle
                            id={key}
                            isChecked={profile.motion[key]}
                            onChange={() => updateProfile({ motion: { ...profile.motion, [key]: !profile.motion[key] } })}
                            label={labels[key]}
                          />
                        </Inline>
                      );
                    })}
                  </Stack>
                </Box>

              </Stack>
            </Box>
          </TabPanel>

          {/* Accessibility */}
          <TabPanel>
            <Box paddingBlockStart="space.300">
              <Stack space="space.300">

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.200">
                    <Text weight="semibold" color="color.text">Display &amp; Interaction</Text>
                    {([
                      { key: "highContrast",           label: "High Contrast",             desc: "Increase contrast for better visibility" },
                      { key: "largeText",               label: "Large Text",                desc: "Scale all text up for readability" },
                      { key: "reducedMotion",           label: "Reduced Motion",            desc: "Minimize all animations and transitions" },
                      { key: "screenReaderOptimized",   label: "Screen Reader Optimized",   desc: "Enhance ARIA labels and semantic structure" },
                      { key: "captions",                label: "Captions",                  desc: "Show descriptive captions on interactive elements" },
                    ] as const).map(({ key, label, desc }) => (
                      <Inline key={key} spread="space-between" alignBlock="start">
                        <Stack space="space.025">
                          <Text color="color.text.subtle" weight="medium">{label}</Text>
                          <Text size="small" color="color.text.subtlest">{desc}</Text>
                        </Stack>
                        <Toggle
                          id={key}
                          isChecked={profile.accessibility[key]}
                          onChange={() => updateProfile({ accessibility: { ...profile.accessibility, [key]: !profile.accessibility[key] } })}
                          label={label}
                        />
                      </Inline>
                    ))}
                  </Stack>
                </Box>

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.200">
                    <Text weight="semibold" color="color.text">Color Blind Mode</Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap="space.100">
                      {(["none", "protanopia", "deuteranopia", "tritanopia"] as const).map((mode) => {
                        const isActive = profile.accessibility.colorBlindMode === mode;
                        const descriptions: Record<string, string> = {
                          none: "Default color rendering",
                          protanopia: "Red-blind compensation",
                          deuteranopia: "Green-blind compensation",
                          tritanopia: "Blue-blind compensation",
                        };
                        return (
                          <Box
                            key={mode}
                            backgroundColor={isActive ? "elevation.surface.overlay" : "elevation.surface"}
                            padding="space.200"
                            borderRadius="border.radius"
                            as="button"
                            onClick={() => updateProfile({ accessibility: { ...profile.accessibility, colorBlindMode: mode } })}
                          >
                            <Stack space="space.050">
                              <Lozenge appearance={isActive ? "success" : "default"}>{mode === "none" ? "None" : mode}</Lozenge>
                              <Text size="small" color="color.text.subtlest">{descriptions[mode]}</Text>
                            </Stack>
                          </Box>
                        );
                      })}
                    </Grid>
                  </Stack>
                </Box>

              </Stack>
            </Box>
          </TabPanel>

          {/* AI Engine */}
          <TabPanel>
            <Box paddingBlockStart="space.300">
              <Stack space="space.300">

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.200">
                    <Inline space="space.150" alignBlock="center">
                      <Lozenge appearance="inprogress" isBold>AI Personalization Engine</Lozenge>
                      <Text size="small" color="color.text.subtlest">
                        {Math.round(profile.aiConfidence * 100)}% confidence · {profile.adaptationCount} adaptations
                      </Text>
                    </Inline>

                    <Stack space="space.100">
                      {[
                        { label: "Behavior Analysis",           enabled: true,  desc: "Track clicks, scrolls, and patterns" },
                        { label: "Cognitive Load Inference",    enabled: true,  desc: "Adapt UI based on detected mental load" },
                        { label: "Emotional State Adaptation",  enabled: true,  desc: "Adjust based on inferred mood" },
                        { label: "Predictive Quick Actions",    enabled: false, desc: "Suggest next actions before you need them" },
                        { label: "Cross-Session Memory",        enabled: true,  desc: "Remember preferences across sessions" },
                      ].map(({ label, enabled, desc }) => (
                        <Box key={label} backgroundColor="elevation.surface" padding="space.150" borderRadius="border.radius">
                          <Inline space="space.150" alignBlock="center">
                            <div className={enabled ? styles.statusDotActive : styles.statusDotInactive} />
                            <Stack space="space.025" grow="fill">
                              <Text size="small" weight="medium" color="color.text.subtle">{label}</Text>
                              <Text size="small" color="color.text.subtlest">{desc}</Text>
                            </Stack>
                            <Lozenge appearance={enabled ? "success" : "default"}>{enabled ? "Active" : "Off"}</Lozenge>
                          </Inline>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                </Box>

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.300">
                    <Text weight="semibold" color="color.text">Adaptation Sensitivity</Text>
                    {([
                      { label: "Response Speed",         hint: "How quickly AI reacts to behavioral changes",  key: "responseSpeed"         },
                      { label: "Confidence Threshold",   hint: "Minimum confidence before applying changes",   key: "confidenceThreshold"   },
                    ] as const).map(({ label, hint, key }) => (
                      <Stack key={key} space="space.100">
                        <Inline spread="space-between">
                          <Text size="small" weight="medium" color="color.text.subtle">{label}</Text>
                          <Text size="small" color="color.text.subtlest" weight="medium">{aiSettings[key]}%</Text>
                        </Inline>
                        <input
                          type="range" min={0} max={100} aria-label={label}
                          value={aiSettings[key]}
                          onChange={(e) => updateAISettings({ [key]: Number(e.target.value) })}
                          className={styles.rangeInput}
                        />
                        <Text size="small" color="color.text.subtlest">{hint}</Text>
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                <SectionMessage appearance="information" title="Local Processing">
                  <Text size="small">
                    All behavioral inference runs client-side. No data is transmitted to external servers.
                  </Text>
                </SectionMessage>

              </Stack>
            </Box>
          </TabPanel>
        </Tabs>

      </Stack>
    </Box>
  );
}
