"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { Stack, Box, Inline, Grid, Text } from "@atlaskit/primitives";
import Heading from "@atlaskit/heading";
import Lozenge from "@atlaskit/lozenge";
import SectionMessage from "@atlaskit/section-message";
import { Brain, TrendingUp, Zap, Eye, Activity, Sparkles } from "lucide-react";
import styles from "./page.module.css";

const INSIGHT_CARDS = [
  {
    category: "Productivity Pattern",
    title: "You enter deep work at 9–11am",
    description: "Your keyboard usage spikes 340% and error rate drops to near-zero during these hours. AIPE now pre-configures compact density and muted notifications automatically at 8:55am.",
    impact: "high" as const,
    icon: Brain,
    color: "quantum" as const,
    stat: "340%",
    statLabel: "keyboard spike",
    actionable: "Schedule deep work blocks to capitalize on this window.",
  },
  {
    category: "Fatigue Signal",
    title: "Cognitive load peaks after 90-min sessions",
    description: "Error rate increases 2.3x and click velocity drops by 40% after extended sessions without breaks. Interface complexity is automatically reduced when this threshold is crossed.",
    impact: "high" as const,
    icon: Activity,
    color: "plasma" as const,
    stat: "2.3×",
    statLabel: "error increase",
    actionable: "Consider a 5-minute break trigger after 90 minutes.",
  },
  {
    category: "Power User Signal",
    title: "You rely heavily on keyboard navigation",
    description: "74% of your navigation events come from keyboard shortcuts rather than mouse clicks. You're in the top 8% of keyboard-first users. AIPE has elevated your shortcut suggestions.",
    impact: "medium" as const,
    icon: Zap,
    color: "synapse" as const,
    stat: "74%",
    statLabel: "keyboard nav",
    actionable: "Enable chord shortcuts for your most-used flows.",
  },
  {
    category: "Attention Pattern",
    title: "Dashboard widgets — bottom-right ignored",
    description: "Attention heatmap analysis shows zero dwell time on bottom-right widgets for 14+ sessions. AIPE will propose a layout reorganization to move high-value content into your attention zone.",
    impact: "medium" as const,
    icon: Eye,
    color: "neural" as const,
    stat: "14",
    statLabel: "sessions ignored",
    actionable: "Reorganize layout to surface high-value content.",
  },
  {
    category: "Session Pattern",
    title: "You start exploratory, shift to focused",
    description: "The first 15 minutes of each session shows wide navigation (5+ sections). After that, you settle into 1–2 focused areas. AIPE now delays sidebar collapse to support early exploration.",
    impact: "low" as const,
    icon: TrendingUp,
    color: "quantum" as const,
    stat: "15m",
    statLabel: "exploration phase",
    actionable: "Breadcrumb navigation is temporarily expanded during this window.",
  },
];

const impactAppearance: Record<string, "removed" | "moved" | "inprogress"> = {
  high:   "removed",
  medium: "moved",
  low:    "inprogress",
};

const iconClassMap: Record<string, string> = {
  quantum: styles.iconQuantum,
  neural:  styles.iconNeural,
  synapse: styles.iconSynapse,
  plasma:  styles.iconPlasma,
};

const statClassMap: Record<string, string> = {
  quantum: styles.statValueQuantum,
  neural:  styles.statValueNeural,
  synapse: styles.statValueSynapse,
  plasma:  styles.statValuePlasma,
};

export default function InsightsPage() {
  const { setBreadcrumbs } = useUIStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "AIPE", href: "/" },
      { label: "Behavior Insights", href: "/insights" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <Box padding="space.400">
      <Stack space="space.400">

        {/* ── Header ──────────────────────────────────────── */}
        <Stack space="space.150">
          <Inline space="space.100" alignBlock="center">
            <Lozenge appearance="moved" isBold>AI-Generated</Lozenge>
          </Inline>
          <Heading size="xlarge">Behavior Insights</Heading>
          <Text color="color.text.subtle">
            AIPE has detected {INSIGHT_CARDS.length} behavioral patterns across your sessions.
            These insights drive real-time interface adaptations.
          </Text>
        </Stack>

        {/* ── Summary stats ───────────────────────────────── */}
        <Grid templateColumns="repeat(3, 1fr)" gap="space.200">
          {[
            { label: "Patterns Detected",   value: "5",  colorClass: styles.statValueQuantum },
            { label: "High Impact",          value: "2",  colorClass: styles.statValuePlasma  },
            { label: "Applied Adaptations",  value: "14", colorClass: styles.statValueSynapse },
          ].map(({ label, value, colorClass }) => (
            <Box key={label} backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
              <Stack space="space.050" alignInline="center">
                <span className={colorClass}>{value}</span>
                <Text size="small" color="color.text.subtlest" align="center">{label}</Text>
              </Stack>
            </Box>
          ))}
        </Grid>

        {/* ── Insight cards ───────────────────────────────── */}
        <Stack space="space.200">
          {INSIGHT_CARDS.map((insight) => {
            const Icon = insight.icon;
            return (
              <Box
                key={insight.title}
                backgroundColor="elevation.surface.raised"
                padding="space.300"
                borderRadius="border.radius"
              >
                <Inline space="space.300" alignBlock="start">
                  {/* Stat */}
                  <Stack space="space.050" alignInline="end">
                    <span className={statClassMap[insight.color]}>{insight.stat}</span>
                    <span className={styles.statLabel}>{insight.statLabel}</span>
                  </Stack>

                  <div className={styles.divider} />

                  {/* Content */}
                  <Stack space="space.200" grow="fill">
                    <Inline space="space.100" alignBlock="center">
                      <Text size="small" color="color.text.subtlest" weight="medium">
                        {insight.category}
                      </Text>
                      <Lozenge appearance={impactAppearance[insight.impact]}>
                        {insight.impact} impact
                      </Lozenge>
                    </Inline>

                    <Text weight="semibold" color="color.text">{insight.title}</Text>
                    <Text size="small" color="color.text.subtle">{insight.description}</Text>

                    <div className={styles.actionTip}>
                      <Sparkles size={12} className={styles.actionTipIcon} />
                      <Text size="small" color="color.text.subtle">{insight.actionable}</Text>
                    </div>
                  </Stack>

                  {/* Icon */}
                  <div className={iconClassMap[insight.color]}>
                    <Icon size={16} />
                  </div>
                </Inline>
              </Box>
            );
          })}
        </Stack>

        {/* ── AI Note ─────────────────────────────────────── */}
        <SectionMessage
          appearance="information"
          title="How AIPE generates insights"
        >
          <Text size="small">
            Insights are generated by correlating thousands of behavioral signals across sessions.
            Pattern confidence requires a minimum of 3 sessions before surfacing. All analysis
            happens locally — no behavioral data is transmitted externally.
          </Text>
        </SectionMessage>

      </Stack>
    </Box>
  );
}
