"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { Stack, Box, Inline, Grid, Text } from "@atlaskit/primitives";
import Heading from "@atlaskit/heading";
import Button, { LoadingButton } from "@atlaskit/button";
import Lozenge from "@atlaskit/lozenge";
import Badge from "@atlaskit/badge";
import Spinner from "@atlaskit/spinner";
import { getTimeOfDayGreeting } from "@/lib/utils";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const sessionData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  interactions: Math.floor(Math.random() * 120 + 20),
  adaptations: Math.floor(Math.random() * 8),
  cognitiveLoad: Math.random() * 100,
}));

const adaptationHistory = [
  { id: 1, field: "Layout density",   from: "comfortable", to: "compact",  reason: "Power user patterns detected",              confidence: 0.84, time: "2m ago",  type: "layout"     },
  { id: 2, field: "Typography scale", from: "md",          to: "sm",       reason: "Focused session — maximising info density", confidence: 0.76, time: "14m ago", type: "typography" },
  { id: 3, field: "Motion",           from: "full",        to: "reduced",  reason: "High cognitive load after 90 min",          confidence: 0.71, time: "38m ago", type: "motion"     },
  { id: 4, field: "Navigation style", from: "topbar",      to: "sidebar",  reason: "Keyboard-first interaction pattern",        confidence: 0.91, time: "1h ago",  type: "navigation" },
];

const C = { quantum: "#4F80FF", neural: "#A78BFA", plasma: "#F59E0B" };

const typeAppearance: Record<string, "inprogress" | "success" | "moved" | "new"> = {
  layout:     "inprogress",
  typography: "new",
  motion:     "success",
  navigation: "moved",
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-base" style={{ padding: "8px 12px", minWidth: 128 }}>
      <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--ds-text-subtlest)", marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 11 }}>
          <span style={{ color: "var(--ds-text-subtle)", textTransform: "capitalize" }}>{p.dataKey}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: p.color }}>{Math.round(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { setBreadcrumbs } = useUIStore();
  const { profile, isAdapting, recommendations, adaptProfile } = usePersonalizationStore();
  const [liveValue, setLiveValue] = useState(74);
  const unresolvedRecs = recommendations.filter((r) => !r.applied && !r.dismissed);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Omega", href: "/" },
      { label: "Dashboard", href: "/dashboard" },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    const id = setInterval(() => {
      setLiveValue((v) => Math.max(40, Math.min(98, v + (Math.random() - 0.5) * 8)));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const metrics = [
    { label: "AI Confidence",  value: `${Math.round((profile?.aiConfidence ?? 0.5) * 100)}%`, appearance: "inprogress" as const },
    { label: "Adaptations",    value: String(profile?.adaptationCount ?? 0),                  appearance: "success" as const },
    { label: "Cognitive Load", value: profile?.cognitiveLoad === "high" ? "High" : profile?.cognitiveLoad === "low" ? "Low" : "Med", appearance: "moved" as const },
    { label: "Active Signals", value: `${liveValue} hz`,                                      appearance: "new" as const },
  ];

  return (
    <Box padding="space.400">
      <Stack space="space.400">

        {/* ── Hero ──────────────────────────────────────────── */}
        <Inline spread="space-between" alignBlock="start">
          <Stack space="space.100">
            <Inline space="space.100" alignBlock="center">
              <span className="live-dot" />
              <Text size="small" color="color.text.subtlest" weight="medium">
                System Active
              </Text>
            </Inline>
            <Heading size="xlarge">
              {getTimeOfDayGreeting()},{" "}
              <span className="text-gradient-quantum">User</span>
            </Heading>
            <Text color="color.text.subtle">
              AI is monitoring your interface —{" "}
              <Text weight="semibold" color="color.text">
                {profile?.adaptationCount ?? 0} adaptations
              </Text>
              {" "}applied this session
            </Text>
          </Stack>
          <LoadingButton
            appearance="primary"
            isLoading={isAdapting}
            onClick={() => adaptProfile()}
          >
            Run Adaptation
          </LoadingButton>
        </Inline>

        {/* ── Metric Row ──────────────────────────────────── */}
        <Grid templateColumns="repeat(4, 1fr)" gap="space.200">
          {metrics.map(({ label, value, appearance }) => (
            <Box
              key={label}
              backgroundColor="elevation.surface.raised"
              padding="space.300"
              borderRadius="border.radius"
            >
              <Stack space="space.100">
                <Text size="small" color="color.text.subtlest" weight="medium">{label}</Text>
                <Inline space="space.100" alignBlock="center">
                  <Text size="large" weight="bold" color="color.text">{value}</Text>
                  <Lozenge appearance={appearance} isBold>live</Lozenge>
                </Inline>
              </Stack>
            </Box>
          ))}
        </Grid>

        {/* ── Main Grid ────────────────────────────────────── */}
        <Grid templateColumns="8fr 4fr" gap="space.200">

          {/* Session chart */}
          <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
            <Stack space="space.300">
              <Inline spread="space-between" alignBlock="center">
                <Stack space="space.050">
                  <Text weight="semibold" color="color.text">Session Activity</Text>
                  <Text size="small" color="color.text.subtlest">Interactions & AI adaptations · 24h</Text>
                </Stack>
                <Inline space="space.200">
                  <Text size="small" color="color.text.subtlest">
                    <span style={{ display: "inline-block", width: 10, height: 2, background: C.quantum, borderRadius: 2, marginRight: 4, verticalAlign: "middle" }} />
                    Interactions
                  </Text>
                  <Text size="small" color="color.text.subtlest">
                    <span style={{ display: "inline-block", width: 10, height: 2, background: C.neural, borderRadius: 2, marginRight: 4, verticalAlign: "middle" }} />
                    Adaptations
                  </Text>
                </Inline>
              </Inline>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={sessionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gInteractions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={C.quantum} stopOpacity={0.22} />
                      <stop offset="100%" stopColor={C.quantum} stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="gAdaptations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={C.neural} stopOpacity={0.28} />
                      <stop offset="100%" stopColor={C.neural} stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "var(--ds-text-subtlest)", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--ds-text-subtlest)", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="interactions" stroke={C.quantum} strokeWidth={1.5} fill="url(#gInteractions)" />
                  <Area type="monotone" dataKey="adaptations"  stroke={C.neural}  strokeWidth={1.5} fill="url(#gAdaptations)"  />
                </AreaChart>
              </ResponsiveContainer>
            </Stack>
          </Box>

          {/* State panels */}
          <Stack space="space.200">
            <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
              <Stack space="space.200">
                <Inline spread="space-between" alignBlock="center">
                  <Text size="small" weight="semibold" color="color.text.subtlest">Current State</Text>
                  <span className="live-dot" />
                </Inline>
                {[
                  { label: "Emotional", value: profile?.emotionalState  ?? "neutral",  appearance: "inprogress" as const },
                  { label: "Cognitive", value: profile?.cognitiveLoad   ?? "low",      appearance: "success" as const },
                  { label: "Mode",      value: profile?.productivityMode ?? "default",  appearance: "new" as const },
                ].map(({ label, value, appearance }) => (
                  <Inline key={label} spread="space-between" alignBlock="center">
                    <Text size="small" color="color.text.subtlest">{label}</Text>
                    <Lozenge appearance={appearance}>{value.replace("-", " ")}</Lozenge>
                  </Inline>
                ))}
              </Stack>
            </Box>

            <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
              <Stack space="space.200">
                <Text size="small" weight="semibold" color="color.text.subtlest">Interface Profile</Text>
                {[
                  { label: "Density",    value: profile?.layout.density    ?? "comfortable" },
                  { label: "Motion",     value: profile?.motion.preference ?? "full"        },
                  { label: "Typography", value: profile?.typography.scale  ?? "md"          },
                ].map(({ label, value }) => (
                  <Inline key={label} spread="space-between" alignBlock="center">
                    <Text size="small" color="color.text.subtle">{label}</Text>
                    <Text size="small" weight="medium" color="color.text">{value}</Text>
                  </Inline>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Grid>

        {/* ── Bottom Grid ──────────────────────────────────── */}
        <Grid templateColumns="7fr 5fr" gap="space.200">

          {/* Adaptation history */}
          <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
            <Stack space="space.300">
              <Inline spread="space-between" alignBlock="center">
                <Stack space="space.025">
                  <Text weight="semibold" color="color.text">Adaptation History</Text>
                  <Text size="small" color="color.text.subtlest">Recent interface mutations</Text>
                </Stack>
                <Button appearance="link" href="/analytics">View all</Button>
              </Inline>
              <Stack space="space.100">
                {adaptationHistory.map((item) => (
                  <Box
                    key={item.id}
                    backgroundColor="elevation.surface.overlay"
                    padding="space.200"
                    borderRadius="border.radius"
                  >
                    <Inline spread="space-between" alignBlock="start">
                      <Stack space="space.050">
                        <Inline space="space.100" alignBlock="center">
                          <Text weight="semibold" color="color.text" size="small">{item.field}</Text>
                          <Lozenge appearance={typeAppearance[item.type] ?? "default"}>
                            {Math.round(item.confidence * 100)}% conf.
                          </Lozenge>
                        </Inline>
                        <Inline space="space.075" alignBlock="center">
                          <Text size="small" color="color.text.subtlest">{item.from}</Text>
                          <Text size="small" color="color.text.subtlest">→</Text>
                          <Text size="small" color="color.text.subtle">{item.to}</Text>
                        </Inline>
                        <Text size="small" color="color.text.subtlest">{item.reason}</Text>
                      </Stack>
                      <Text size="small" color="color.text.subtlest">{item.time}</Text>
                    </Inline>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Box>

          {/* AI Recommendations */}
          <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
            <Stack space="space.300">
              <Inline spread="space-between" alignBlock="center">
                <Stack space="space.025">
                  <Inline space="space.100" alignBlock="center">
                    <Text weight="semibold" color="color.text">AI Recommendations</Text>
                    {unresolvedRecs.length > 0 && (
                      <Badge appearance="primary">{unresolvedRecs.length}</Badge>
                    )}
                  </Inline>
                  <Text size="small" color="color.text.subtlest">Suggested improvements</Text>
                </Stack>
              </Inline>

              {unresolvedRecs.length > 0 ? (
                <Stack space="space.100">
                  {unresolvedRecs.slice(0, 3).map((rec) => (
                    <Box
                      key={rec.id}
                      backgroundColor="elevation.surface.overlay"
                      padding="space.200"
                      borderRadius="border.radius"
                    >
                      <Stack space="space.150">
                        <Inline spread="space-between" alignBlock="start">
                          <Text weight="semibold" color="color.text" size="small">{rec.title}</Text>
                          <Badge appearance="primary">{Math.round(rec.confidence * 100)}%</Badge>
                        </Inline>
                        <Text size="small" color="color.text.subtle">{rec.description}</Text>
                        <Inline space="space.100">
                          <Button
                            appearance="primary"
                            spacing="compact"
                            onClick={() => usePersonalizationStore.getState().applyRecommendation(rec.id)}
                          >
                            Apply
                          </Button>
                          <Button
                            appearance="subtle"
                            spacing="compact"
                            onClick={() => usePersonalizationStore.getState().dismissRecommendation(rec.id)}
                          >
                            Dismiss
                          </Button>
                        </Inline>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box padding="space.400" textAlign="center">
                  <Stack space="space.100" alignInline="center">
                    <Lozenge appearance="success" isBold>All caught up</Lozenge>
                    <Text size="small" color="color.text.subtlest">AI is monitoring for new patterns</Text>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>
        </Grid>

        {/* ── Cognitive Load Timeline ───────────────────────── */}
        <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
          <Stack space="space.300">
            <Inline spread="space-between" alignBlock="center">
              <Stack space="space.025">
                <Text weight="semibold" color="color.text">Cognitive Load Timeline</Text>
                <Text size="small" color="color.text.subtlest">Inferred mental load throughout the session</Text>
              </Stack>
              <Button appearance="link" href="/insights">Full insights</Button>
            </Inline>
            <ResponsiveContainer width="100%" height={112}>
              <AreaChart data={sessionData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="gLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={C.plasma} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={C.plasma} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "var(--ds-text-subtlest)", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} interval={3} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotoneX" dataKey="cognitiveLoad" stroke={C.plasma} strokeWidth={1.5} fill="url(#gLoad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Stack>
        </Box>

      </Stack>
    </Box>
  );
}
