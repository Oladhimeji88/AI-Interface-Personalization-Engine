"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { PersonalizationEngine } from "@/lib/ai/personalization-engine";
import { Stack, Box, Inline, Grid, Text } from "@atlaskit/primitives";
import Heading from "@atlaskit/heading";
import Button from "@atlaskit/button";
import Lozenge from "@atlaskit/lozenge";
import SectionMessage from "@atlaskit/section-message";
import { Check, Sparkles } from "lucide-react";
import styles from "./page.module.css";

const PALETTES = PersonalizationEngine.getPresetPalettes();

const THEME_META: Record<string, { name: string; description: string; tag: string; themeClass: string; appearance: "default" | "inprogress" | "moved" | "success" | "removed" | "new" }> = {
  "quantum-dark":  { name: "Quantum Dark",  description: "Electric blue on void black. Precision-engineered for focus.",    tag: "Default",  themeClass: styles.themeQuantumDark,  appearance: "inprogress" },
  "neural-focus":  { name: "Neural Focus",  description: "Deep purple system for extended concentration sessions.",          tag: "Focus",    themeClass: styles.themeNeuralFocus,  appearance: "moved"      },
  "synapse-green": { name: "Synapse Green", description: "Bio-inspired emerald tones. For builders in the zone.",            tag: "Creative", themeClass: styles.themeSynapseGreen, appearance: "success"    },
  "minimal-light": { name: "Minimal Light", description: "Crisp white canvas for presentations and review modes.",           tag: "Light",    themeClass: styles.themeMinimalLight, appearance: "default"    },
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
    <Box padding="space.400">
      <Stack space="space.400">

        {/* ── Header ──────────────────────────────────────── */}
        <Stack space="space.150">
          <Inline space="space.100" alignBlock="center">
            <Lozenge appearance="moved" isBold>Design System</Lozenge>
          </Inline>
          <Heading size="xlarge">Themes</Heading>
          <Text color="color.text.subtle">
            Pre-built palettes. AI will blend and adapt them to your context.
          </Text>
        </Stack>

        {/* ── Theme Grid ──────────────────────────────────── */}
        <Grid templateColumns="repeat(2, 1fr)" gap="space.200">
          {Object.entries(PALETTES).map(([key, palette]) => {
            const meta = THEME_META[key];
            if (!meta) return null;
            const isActive = profile?.colors.primary === palette.primary;

            return (
              <Box
                key={key}
                backgroundColor="elevation.surface.raised"
                padding="space.300"
                borderRadius="border.radius"
              >
                <Stack space="space.200">
                  {/* Preview */}
                  <div className={`${styles.preview} ${meta.themeClass}`}>
                    <div className={styles.previewSidebar} />
                    <div className={styles.previewContent}>
                      <div className={styles.previewBar} />
                      <div className={styles.previewSubbar} />
                      <div className={styles.previewCard} />
                      <div className={styles.previewChips}>
                        <div className={styles.chipPrimary}   />
                        <div className={styles.chipSecondary} />
                        <div className={styles.chipAccent}    />
                      </div>
                    </div>
                    <div className={styles.previewSwatches}>
                      <div className={styles.swatchPrimary}   />
                      <div className={styles.swatchSecondary} />
                      <div className={styles.swatchAccent}    />
                    </div>
                    {isActive && (
                      <div className={styles.activeBadge}>
                        <Check size={12} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <Inline spread="space-between" alignBlock="start">
                    <Stack space="space.050">
                      <Text weight="semibold" color="color.text">{meta.name}</Text>
                      <Text size="small" color="color.text.subtle">{meta.description}</Text>
                    </Stack>
                    <Lozenge appearance={meta.appearance}>{meta.tag}</Lozenge>
                  </Inline>

                  <Button
                    appearance={isActive ? "primary" : "default"}
                    shouldFitContainer
                    onClick={() => updateProfile({ colors: palette })}
                    isDisabled={isActive}
                  >
                    {isActive ? "Active" : "Apply Theme"}
                  </Button>
                </Stack>
              </Box>
            );
          })}
        </Grid>

        {/* ── AI Note ─────────────────────────────────────── */}
        <SectionMessage
          appearance="information"
          title="AI Theme Blending"
          icon={() => <Sparkles size={16} />}
        >
          <Text size="small">
            AIPE can blend between themes dynamically based on context — shifting toward warmer
            tones in the evening, cooler tones during focus sessions, and higher contrast during
            high cognitive load. Select a base theme; AI handles transitions.
          </Text>
        </SectionMessage>

      </Stack>
    </Box>
  );
}
