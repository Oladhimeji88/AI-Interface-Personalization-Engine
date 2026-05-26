"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { Stack, Box, Inline, Grid, Text } from "@atlaskit/primitives";
import Heading from "@atlaskit/heading";
import Lozenge from "@atlaskit/lozenge";
import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { MousePointer2, Keyboard, Activity } from "lucide-react";
import styles from "./page.module.css";

const weekData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
  day,
  sessions: Math.floor(Math.random() * 8 + 2),
  adaptations: Math.floor(Math.random() * 15 + 3),
  focusTime: Math.floor(Math.random() * 180 + 30),
}));

const radarData = [
  { metric: "Keyboard Use",   value: 82 },
  { metric: "Click Accuracy", value: 91 },
  { metric: "Flow State",     value: 67 },
  { metric: "Shortcut Use",   value: 74 },
  { metric: "Feature Depth",  value: 58 },
  { metric: "Consistency",    value: 79 },
];

const heatmapData = Array.from({ length: 7 * 24 }, (_, i) => ({
  day:   Math.floor(i / 24),
  hour:  i % 24,
  value: Math.random() > 0.6 ? Math.floor(Math.random() * 100) : 0,
}));

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const tickProps = {
  fontSize: 10,
  fill: "var(--ds-text-subtlest)",
  fontFamily: "var(--font-mono)",
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className={styles.tooltipRow}>
          <span className={styles.tooltipKey}>{p.dataKey}</span>
          <span className={styles.tooltipVal} style={{ color: p.color }}>{Math.round(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const statItems = [
  { Icon: MousePointer2, label: "Click Events",     value: "2,847",  sub: "+18% vs last week", iconClass: styles.statIconQuantum },
  { Icon: Keyboard,      label: "Keystrokes",       value: "14,302", sub: "65 WPM average",    iconClass: styles.statIconNeural  },
  { Icon: Activity,      label: "Scroll Distance",  value: "18.4m",  sub: "Total this week",   iconClass: styles.statIconSynapse },
];

export default function AnalyticsPage() {
  const { setBreadcrumbs } = useUIStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "AIPE", href: "/" },
      { label: "Analytics", href: "/analytics" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <Box padding="space.400">
      <Stack space="space.400">

        {/* ── Header ──────────────────────────────────────── */}
        <Stack space="space.100">
          <Heading size="xlarge">Analytics</Heading>
          <Text color="color.text.subtle">
            Session metrics, behavioral patterns, and AI adaptation history
          </Text>
        </Stack>

        {/* ── Metric Row ──────────────────────────────────── */}
        <Grid templateColumns="repeat(4, 1fr)" gap="space.200">
          {[
            { label: "Total Sessions", value: "47",  appearance: "inprogress" as const, note: "+12 this week" },
            { label: "Avg Session",    value: "34m", appearance: "new" as const,        note: "+5 vs last week" },
            { label: "AI Adaptations", value: "183", appearance: "success" as const,    note: "+24 this week" },
            { label: "Power Score",    value: "78%", appearance: "moved" as const,      note: "+3 improvement" },
          ].map(({ label, value, appearance, note }) => (
            <Box key={label} backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
              <Stack space="space.100">
                <Text size="small" color="color.text.subtlest" weight="medium">{label}</Text>
                <Inline space="space.100" alignBlock="center">
                  <Text size="large" weight="bold" color="color.text">{value}</Text>
                  <Lozenge appearance={appearance}>{note}</Lozenge>
                </Inline>
              </Stack>
            </Box>
          ))}
        </Grid>

        {/* ── Tabs ────────────────────────────────────────── */}
        <Tabs id="analytics-tabs">
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Behavior</Tab>
            <Tab>AI Engine</Tab>
          </TabList>

          {/* Overview */}
          <TabPanel>
            <Box paddingBlockStart="space.300">
              <Grid templateColumns="8fr 4fr" gap="space.200">
                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.300">
                    <Inline spread="space-between" alignBlock="center">
                      <Stack space="space.025">
                        <Text weight="semibold" color="color.text">Weekly Overview</Text>
                        <Text size="small" color="color.text.subtlest">Sessions &amp; adaptations per day</Text>
                      </Stack>
                      <Lozenge appearance="inprogress">7-day view</Lozenge>
                    </Inline>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={weekData} barGap={4} margin={{ left: -20 }}>
                        <XAxis dataKey="day" tick={tickProps} axisLine={false} tickLine={false} />
                        <YAxis tick={tickProps} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="sessions"    fill="#4F80FF" opacity={0.85} radius={[4,4,0,0]} maxBarSize={24} />
                        <Bar dataKey="adaptations" fill="#A78BFA" opacity={0.85} radius={[4,4,0,0]} maxBarSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Stack>
                </Box>

                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.200">
                    <Text weight="semibold" color="color.text">Behavior Profile</Text>
                    <Text size="small" color="color.text.subtlest">Interaction quality metrics</Text>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="var(--ds-border)" />
                        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: "var(--ds-text-subtlest)", fontFamily: "var(--font-mono)" }} />
                        <Radar dataKey="value" stroke="#A78BFA" fill="#A78BFA" fillOpacity={0.15} strokeWidth={1.5} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Stack>
                </Box>
              </Grid>
            </Box>
          </TabPanel>

          {/* Behavior */}
          <TabPanel>
            <Box paddingBlockStart="space.300">
              <Stack space="space.300">
                {/* Activity Heatmap */}
                <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                  <Stack space="space.300">
                    <Inline spread="space-between" alignBlock="center">
                      <Stack space="space.025">
                        <Text weight="semibold" color="color.text">Activity Heatmap</Text>
                        <Text size="small" color="color.text.subtlest">Hour of day × Day of week</Text>
                      </Stack>
                      <Inline space="space.100" alignBlock="center">
                        <span className={`${styles.legendDot} ${styles.swatchLow}`} />
                        <Text size="small" color="color.text.subtlest">Low</Text>
                        <span className={`${styles.legendDot} ${styles.swatchMed}`} />
                        <Text size="small" color="color.text.subtlest">Medium</Text>
                        <span className={`${styles.legendDot} ${styles.swatchHigh}`} />
                        <Text size="small" color="color.text.subtlest">High</Text>
                      </Inline>
                    </Inline>
                    <div className={styles.heatmapGrid}>
                      {Array.from({ length: 24 }, (_, hour) => (
                        <div key={hour} className={styles.heatmapCol}>
                          <div className={styles.heatmapHour}>{hour % 6 === 0 ? hour : ""}</div>
                          {Array.from({ length: 7 }, (_, day) => {
                            const entry = heatmapData.find((d) => d.day === day && d.hour === hour);
                            const v = entry?.value ?? 0;
                            const cellClass = v === 0
                              ? styles.heatmapCellEmpty
                              : v < 33
                              ? styles.heatmapCellLow
                              : v < 66
                              ? styles.heatmapCellMed
                              : styles.heatmapCellHigh;
                            return (
                              <div
                                key={day}
                                className={`${styles.heatmapCell} ${cellClass}`}
                                title={`${DAYS[day]} ${hour}:00 — ${v} interactions`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </Stack>
                </Box>

                {/* Interaction breakdown */}
                <Grid templateColumns="repeat(3, 1fr)" gap="space.200">
                  {statItems.map(({ Icon, label, value, sub, iconClass }) => (
                    <Box key={label} backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
                      <Inline space="space.200" alignBlock="center">
                        <div className={iconClass}>
                          <Icon size={20} />
                        </div>
                        <Stack space="space.050">
                          <Text size="large" weight="bold" color="color.text">{value}</Text>
                          <Text size="small" weight="medium" color="color.text.subtle">{label}</Text>
                          <Text size="small" color="color.text.subtlest">{sub}</Text>
                        </Stack>
                      </Inline>
                    </Box>
                  ))}
                </Grid>
              </Stack>
            </Box>
          </TabPanel>

          {/* AI Engine */}
          <TabPanel>
            <Box paddingBlockStart="space.300">
              <Box backgroundColor="elevation.surface.raised" padding="space.400" borderRadius="border.radius">
                <Stack space="space.200" alignInline="center">
                  <Lozenge appearance="inprogress" isBold>AI Engine Analytics</Lozenge>
                  <Text color="color.text.subtle">Detailed AI adaptation metrics coming soon</Text>
                </Stack>
              </Box>
            </Box>
          </TabPanel>
        </Tabs>

      </Stack>
    </Box>
  );
}
