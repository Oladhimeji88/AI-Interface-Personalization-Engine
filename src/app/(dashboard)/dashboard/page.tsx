"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { MetricCard } from "@/components/ui/MetricCard";
import { cn, getTimeOfDayGreeting } from "@/lib/utils";
import {
  Brain, Pulse, Stack, Lightning, Eye, Cursor, Clock, Sparkle,
  CaretRight, ArrowUpRight, ChartBar, CheckCircle, ArrowCounterClockwise,
} from "@/components/ui/icons";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { AIStatusBadge } from "@/components/ui/AIStatusBadge";

// ── Mock data ─────────────────────────────────────────────────────────────────
const sessionData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  interactions: Math.floor(Math.random() * 120 + 20),
  adaptations:  Math.floor(Math.random() * 8),
  cognitiveLoad: Math.random() * 100,
}));

const adaptationHistory = [
  { id: 1, field: "Layout density",   from: "comfortable", to: "compact",  reason: "Power user patterns detected",              confidence: 0.84, time: "2m ago",  type: "layout"     },
  { id: 2, field: "Typography scale", from: "md",          to: "sm",       reason: "Focused session — maximising info density", confidence: 0.76, time: "14m ago", type: "typography" },
  { id: 3, field: "Motion",           from: "full",        to: "reduced",  reason: "High cognitive load after 90 min",          confidence: 0.71, time: "38m ago", type: "motion"     },
  { id: 4, field: "Navigation style", from: "topbar",      to: "sidebar",  reason: "Keyboard-first interaction pattern",        confidence: 0.91, time: "1h ago",  type: "navigation" },
];

// Palette constants — kept in sync with tailwind.config quantum/neural/plasma values
const C = { quantum: "#4F80FF", neural: "#A78BFA", plasma: "#F59E0B" };

// Map data keys to Tailwind color classes (avoids inline style={})
const tooltipColorMap: Record<string, string> = {
  interactions:  "text-quantum-400",
  adaptations:   "text-neural-400",
  cognitiveLoad: "text-plasma-500",
};

// Type → icon + colors
const typeConfig: Record<string, { Icon: any; weight: any; color: string; bg: string }> = {
  layout:     { Icon: Stack,   weight: "bold",    color: "text-quantum-400", bg: "bg-quantum-400/10" },
  typography: { Icon: Eye,     weight: "bold",    color: "text-neural-400",  bg: "bg-neural-400/10"  },
  motion:     { Icon: Pulse,   weight: "bold",    color: "text-synapse-400", bg: "bg-synapse-400/10" },
  navigation: { Icon: Cursor,  weight: "bold",    color: "text-plasma-500",  bg: "bg-plasma-500/10"  },
};

const tickStyle = { fontSize: 10, fill: "rgba(255,255,255,0.20)", fontFamily: "JetBrains Mono" };

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-base px-3 py-2.5 min-w-[128px]">
      <div className="text-[11px] font-mono text-white/35 mb-1.5">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="text-[11px] text-white/55 capitalize">{p.dataKey}</span>
          <span className={cn("text-[11px] font-mono font-semibold", tooltipColorMap[p.dataKey] ?? "text-white/70")}>
            {Math.round(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { setBreadcrumbs } = useUIStore();
  const { profile, isAdapting, recommendations, adaptProfile } = usePersonalizationStore();
  const [liveValue, setLiveValue] = useState(74);
  const unresolvedRecs = recommendations.filter((r) => !r.applied && !r.dismissed);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Omega",     href: "/" },
      { label: "Dashboard", href: "/dashboard" },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    const id = setInterval(() => {
      setLiveValue((v) => Math.max(40, Math.min(98, v + (Math.random() - 0.5) * 8)));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-[var(--content-max-width)] mx-auto px-8 py-8 space-y-8">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between animate-in stagger-1">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="live-dot" />
            <span className="text-[11px] font-mono text-synapse-400 tracking-widest uppercase">
              System Active
            </span>
          </div>
          <h1 className="text-[2rem] font-display font-bold text-white mb-1.5 tracking-tight leading-tight">
            {getTimeOfDayGreeting()},{" "}
            <span className="text-gradient-quantum">User</span>
          </h1>
          <p className="text-sm text-white/40">
            AI is monitoring your interface —{" "}
            <span className="text-white/65 font-medium">
              {profile?.adaptationCount ?? 0} adaptations
            </span>{" "}
            applied this session
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AIStatusBadge />
          <button
            type="button"
            onClick={() => adaptProfile()}
            disabled={isAdapting}
            className={cn("btn-secondary", isAdapting && "opacity-50 pointer-events-none")}
          >
            {isAdapting
              ? <ArrowCounterClockwise size={14} weight="bold" className="animate-spin" />
              : <Lightning size={14} weight="fill" />}
            Run Adaptation
          </button>
        </div>
      </div>

      {/* ── Metric Row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="AI Confidence"  value={Math.round((profile?.aiConfidence ?? 0.5) * 100)} unit="%" delta={7} deltaLabel="vs last session" accent="quantum" className="animate-in stagger-1" />
        <MetricCard label="Adaptations"    value={profile?.adaptationCount ?? 0} delta={3} deltaLabel="this session" accent="neural" className="animate-in stagger-2" />
        <MetricCard label="Cognitive Load" value={profile?.cognitiveLoad === "low" ? "Low" : profile?.cognitiveLoad === "high" ? "High" : "Med"} accent="synapse" live className="animate-in stagger-3" />
        <MetricCard label="Active Signals" value={liveValue} unit="hz" accent="plasma" live className="animate-in stagger-4" />
      </div>

      {/* ── Main Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-4">

        {/* Session activity chart */}
        <div className="col-span-12 lg:col-span-8 card-base p-6 animate-in stagger-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[13px] font-semibold text-white/88">Session Activity</h2>
              <p className="text-[11px] font-mono text-white/30 mt-0.5">Interactions & AI adaptations · 24h</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-quantum-400">
                <span className="w-3 h-0.5 rounded-full bg-quantum-400 inline-block" />
                Interactions
              </span>
              <span className="flex items-center gap-1.5 text-neural-400">
                <span className="w-3 h-0.5 rounded-full bg-neural-400 inline-block" />
                Adaptations
              </span>
            </div>
          </div>
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
              <XAxis dataKey="hour" tick={tickStyle} axisLine={false} tickLine={false} interval={4} />
              <YAxis                tick={tickStyle} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="interactions" stroke={C.quantum} strokeWidth={1.5} fill="url(#gInteractions)" />
              <Area type="monotone" dataKey="adaptations"  stroke={C.neural}  strokeWidth={1.5} fill="url(#gAdaptations)"  />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* State / profile panels */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 animate-in stagger-3">

          <div className="card-base p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="section-label">Current State</span>
              <span className="live-dot" />
            </div>
            <div className="space-y-3">
              {[
                { label: "Emotional", value: profile?.emotionalState  ?? "neutral", color: "quantum" },
                { label: "Cognitive", value: profile?.cognitiveLoad   ?? "low",     color: "synapse" },
                { label: "Mode",      value: profile?.productivityMode ?? "default", color: "neural"  },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-[12px] text-white/35 font-mono">{item.label}</span>
                  <span className={cn(
                    "badge capitalize text-[11px]",
                    item.color === "quantum" && "bg-quantum-400/10 text-quantum-300 border border-quantum-400/20",
                    item.color === "synapse" && "bg-synapse-400/10 text-synapse-300 border border-synapse-400/20",
                    item.color === "neural"  && "bg-neural-400/10  text-neural-300  border border-neural-400/20"
                  )}>
                    {item.value.replace("-", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-base p-5">
            <div className="mb-4"><span className="section-label">Interface Profile</span></div>
            <div className="space-y-3">
              {[
                { Icon: Stack,  label: "Density",    value: profile?.layout.density    ?? "comfortable" },
                { Icon: Pulse,  label: "Motion",     value: profile?.motion.preference ?? "full"        },
                { Icon: Eye,    label: "Typography", value: profile?.typography.scale  ?? "md"          },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon size={14} weight="regular" className="text-white/22 flex-shrink-0" />
                  <span className="text-[12px] text-white/38 font-mono flex-1">{label}</span>
                  <span className="text-[12px] text-white/70 font-medium capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Adaptation history */}
        <div className="col-span-12 lg:col-span-7 card-base p-6 animate-in stagger-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[13px] font-semibold text-white/88">Adaptation History</h2>
              <p className="text-[11px] font-mono text-white/30 mt-0.5">Recent interface mutations</p>
            </div>
            <a href="/analytics" className="flex items-center gap-1 text-[11px] font-mono text-quantum-400 hover:text-quantum-300 transition-colors">
              View all <ArrowUpRight size={12} weight="bold" />
            </a>
          </div>

          <div className="space-y-2">
            {adaptationHistory.map((item, i) => {
              const cfg = typeConfig[item.type] ?? typeConfig.layout;
              const { Icon } = cfg;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg",
                    "bg-white/[0.025] border border-white/[0.05]",
                    "hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-150",
                    `animate-in stagger-${i + 1}`
                  )}
                >
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", cfg.bg)}>
                    <Icon size={14} weight={cfg.weight} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[12px] font-semibold text-white/80">{item.field}</span>
                      <span className="text-[11px] font-mono text-white/22">{Math.round(item.confidence * 100)}% conf.</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[11px] font-mono text-white/28 line-through">{item.from}</span>
                      <CaretRight size={10} weight="bold" className="text-white/15" />
                      <span className="text-[11px] font-mono text-white/68">{item.to}</span>
                    </div>
                    <p className="text-[11px] text-white/25 truncate">{item.reason}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 text-white/18">
                    <Clock size={11} weight="regular" />
                    <span className="text-[10px] font-mono">{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="col-span-12 lg:col-span-5 card-base p-6 animate-in stagger-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[13px] font-semibold text-white/88 flex items-center gap-2">
                AI Recommendations
                {unresolvedRecs.length > 0 && (
                  <span className="badge bg-neural-400/12 text-neural-300 border border-neural-400/22 text-[10px]">
                    {unresolvedRecs.length} new
                  </span>
                )}
              </h2>
              <p className="text-[11px] font-mono text-white/30 mt-0.5">Suggested interface improvements</p>
            </div>
            <Sparkle size={16} weight="duotone" className="text-neural-400" />
          </div>

          {unresolvedRecs.length > 0 ? (
            <div className="space-y-2">
              {unresolvedRecs.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-lg bg-neural-400/[0.05] border border-neural-400/[0.12] hover:bg-neural-400/[0.09] transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[12px] font-semibold text-white/82">{rec.title}</span>
                    <span className="badge bg-neural-400/10 text-neural-300 border border-neural-400/18 text-[10px] flex-shrink-0">
                      {Math.round(rec.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-[11px] text-white/35 mb-3 leading-relaxed">{rec.description}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => usePersonalizationStore.getState().applyRecommendation(rec.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neural-400/18 text-neural-300 text-[11px] font-medium hover:bg-neural-400/28 transition-colors"
                    >
                      <CheckCircle size={12} weight="fill" /> Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => usePersonalizationStore.getState().dismissRecommendation(rec.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/28 text-[11px] hover:bg-white/[0.08] transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-10 h-10 rounded-xl bg-synapse-400/10 border border-synapse-400/15 flex items-center justify-center mb-3">
                <CheckCircle size={20} weight="duotone" className="text-synapse-400" />
              </div>
              <p className="text-sm font-semibold text-white/48">All caught up</p>
              <p className="text-[11px] text-white/25 mt-1">AI is monitoring for new patterns</p>
            </div>
          )}
        </div>

        {/* Cognitive load timeline */}
        <div className="col-span-12 card-base p-6 animate-in stagger-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[13px] font-semibold text-white/88">Cognitive Load Timeline</h2>
              <p className="text-[11px] font-mono text-white/30 mt-0.5">Inferred mental load throughout the session</p>
            </div>
            <a href="/insights" className="flex items-center gap-1.5 text-[11px] font-mono text-quantum-400 hover:text-quantum-300 transition-colors">
              <ChartBar size={13} weight="regular" /> Full insights
            </a>
          </div>
          <ResponsiveContainer width="100%" height={112}>
            <AreaChart data={sessionData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="gLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.plasma} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={C.plasma} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tick={{ ...tickStyle, fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotoneX" dataKey="cognitiveLoad" stroke={C.plasma} strokeWidth={1.5} fill="url(#gLoad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
