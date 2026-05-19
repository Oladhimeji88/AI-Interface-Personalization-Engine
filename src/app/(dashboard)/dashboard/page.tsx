"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { MetricCard } from "@/components/ui/MetricCard";
import { cn, getTimeOfDayGreeting } from "@/lib/utils";
import {
  Brain,
  Activity,
  Layers,
  TrendingUp,
  Zap,
  Eye,
  MousePointer2,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  BarChart2,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AIStatusBadge } from "@/components/ui/AIStatusBadge";

// ─── Mock data ────────────────────────────────────────────────────────────

const sessionData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  interactions: Math.floor(Math.random() * 120 + 20),
  adaptations: Math.floor(Math.random() * 8),
  cognitiveLoad: Math.random() * 100,
}));

const adaptationHistory = [
  {
    id: 1,
    field: "Layout density",
    from: "comfortable",
    to: "compact",
    reason: "Power user patterns detected",
    confidence: 0.84,
    time: "2m ago",
    type: "layout",
  },
  {
    id: 2,
    field: "Typography scale",
    from: "md",
    to: "sm",
    reason: "Focused session — maximizing info density",
    confidence: 0.76,
    time: "14m ago",
    type: "typography",
  },
  {
    id: 3,
    field: "Motion preference",
    from: "full",
    to: "reduced",
    reason: "High cognitive load detected after 90 mins",
    confidence: 0.71,
    time: "38m ago",
    type: "motion",
  },
  {
    id: 4,
    field: "Navigation style",
    from: "topbar",
    to: "sidebar",
    reason: "Keyboard-first interaction pattern",
    confidence: 0.91,
    time: "1h ago",
    type: "navigation",
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-base px-3 py-2.5 min-w-32">
      <div className="text-xs font-mono text-white/40 mb-1.5">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-3">
          <span className="text-xs text-white/60 capitalize">{p.dataKey}</span>
          <span className="text-xs font-mono font-medium" style={{ color: p.color }}>
            {Math.round(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Page Component ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const { setBreadcrumbs } = useUIStore();
  const { profile, isAdapting, recommendations, adaptProfile } =
    usePersonalizationStore();
  const [liveValue, setLiveValue] = useState(74);
  const unresolvedRecs = recommendations.filter((r) => !r.applied && !r.dismissed);

  useEffect(() => {
    setBreadcrumbs([
      { label: "AIPE", href: "/" },
      { label: "Dashboard", href: "/dashboard" },
    ]);
  }, [setBreadcrumbs]);

  // Simulate live metric
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveValue((v) => Math.max(40, Math.min(98, v + (Math.random() - 0.5) * 8)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[var(--content-max-width)] mx-auto px-6 py-8 space-y-8">

      {/* ── Hero Header ────────────────────────────────────────────── */}
      <div className="flex items-start justify-between animate-in stagger-1">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="live-dot" />
            <span className="text-xs font-mono text-synapse-400 tracking-wider uppercase">
              System Active
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-1 tracking-tight">
            {getTimeOfDayGreeting()},{" "}
            <span className="text-gradient-quantum">User</span>
          </h1>
          <p className="text-sm text-white/35 font-body">
            AI is monitoring your interface — {profile?.adaptationCount ?? 0} adaptations applied this session
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AIStatusBadge />
          <button
            onClick={() => adaptProfile()}
            disabled={isAdapting}
            className={cn(
              "btn-secondary text-sm",
              isAdapting && "opacity-50 pointer-events-none"
            )}
          >
            {isAdapting ? (
              <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
            Run Adaptation
          </button>
        </div>
      </div>

      {/* ── Key Metrics Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="AI Confidence"
          value={Math.round((profile?.aiConfidence ?? 0.5) * 100)}
          unit="%"
          delta={7}
          deltaLabel="vs last session"
          accent="quantum"
          className="animate-in stagger-1"
        />
        <MetricCard
          label="Adaptations"
          value={profile?.adaptationCount ?? 0}
          delta={3}
          deltaLabel="this session"
          accent="neural"
          className="animate-in stagger-2"
        />
        <MetricCard
          label="Cognitive Load"
          value={profile?.cognitiveLoad === "low" ? "Low" : profile?.cognitiveLoad === "high" ? "High" : "Med"}
          accent="synapse"
          live
          className="animate-in stagger-3"
        />
        <MetricCard
          label="Active Signals"
          value={liveValue}
          unit="hz"
          accent="plasma"
          live
          className="animate-in stagger-4"
        />
      </div>

      {/* ── Main Content Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-4">

        {/* Activity chart — wide */}
        <div className="col-span-12 lg:col-span-8 card-base p-5 animate-in stagger-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-display font-semibold text-white/90">
                Session Activity
              </h2>
              <p className="text-xs text-white/30 font-mono mt-0.5">
                Interactions & AI adaptations · 24h
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-quantum-400">
                <span className="w-2 h-0.5 bg-quantum-400 rounded" />
                Interactions
              </span>
              <span className="flex items-center gap-1.5 text-neural-400">
                <span className="w-2 h-0.5 bg-neural-400 rounded" />
                Adaptations
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={sessionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradInteractions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradAdaptations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="interactions"
                stroke="#0EA5E9"
                strokeWidth={1.5}
                fill="url(#gradInteractions)"
              />
              <Area
                type="monotone"
                dataKey="adaptations"
                stroke="#8B5CF6"
                strokeWidth={1.5}
                fill="url(#gradAdaptations)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Current state panel */}
        <div className="col-span-12 lg:col-span-4 space-y-3 animate-in stagger-3">
          {/* Emotional state */}
          <div className="card-base p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="section-label">Current State</span>
              <span className="live-dot" />
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Emotional", value: profile?.emotionalState ?? "neutral", color: "quantum" },
                { label: "Cognitive", value: profile?.cognitiveLoad ?? "low", color: "synapse" },
                { label: "Mode", value: profile?.productivityMode ?? "default", color: "neural" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-white/35 font-mono">{item.label}</span>
                  <span
                    className={cn(
                      "badge text-xs capitalize",
                      item.color === "quantum" && "bg-quantum-400/10 text-quantum-300 border border-quantum-400/20",
                      item.color === "synapse" && "bg-synapse-400/10 text-synapse-300 border border-synapse-400/20",
                      item.color === "neural" && "bg-neural-400/10 text-neural-300 border border-neural-400/20"
                    )}
                  >
                    {item.value.replace("-", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="card-base p-4 space-y-2.5">
            <span className="section-label">Interface Profile</span>
            {[
              { icon: Layers, label: "Density", value: profile?.layout.density ?? "comfortable" },
              { icon: Activity, label: "Motion", value: profile?.motion.preference ?? "full" },
              { icon: Eye, label: "Typography", value: profile?.typography.scale ?? "md" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <item.icon className="w-3.5 h-3.5 text-white/20" />
                <span className="text-xs text-white/40 font-mono flex-1">{item.label}</span>
                <span className="text-xs text-white/70 font-medium capitalize">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Adaptation History */}
        <div className="col-span-12 lg:col-span-7 card-base p-5 animate-in stagger-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-display font-semibold text-white/90">
                Adaptation History
              </h2>
              <p className="text-xs text-white/30 font-mono mt-0.5">
                Recent interface mutations
              </p>
            </div>
            <a
              href="/analytics"
              className="text-xs font-mono text-quantum-400 hover:text-quantum-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-2">
            {adaptationHistory.map((item, i) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl",
                  "bg-white/[0.03] border border-white/[0.05]",
                  "hover:bg-white/[0.05] hover:border-white/[0.08] transition-all duration-150",
                  `animate-in stagger-${i + 1}`
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                    item.type === "layout" && "bg-quantum-400/10",
                    item.type === "typography" && "bg-neural-400/10",
                    item.type === "motion" && "bg-synapse-400/10",
                    item.type === "navigation" && "bg-plasma-500/10"
                  )}
                >
                  {item.type === "layout" && <Layers className="w-3.5 h-3.5 text-quantum-400" />}
                  {item.type === "typography" && <Eye className="w-3.5 h-3.5 text-neural-400" />}
                  {item.type === "motion" && <Activity className="w-3.5 h-3.5 text-synapse-400" />}
                  {item.type === "navigation" && <MousePointer2 className="w-3.5 h-3.5 text-plasma-500" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-white/80">{item.field}</span>
                    <span className="text-xs font-mono text-white/20">·</span>
                    <span className="text-xs font-mono text-white/25">
                      {Math.round(item.confidence * 100)}% confidence
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-mono text-white/30 line-through">{item.from}</span>
                    <ChevronRight className="w-3 h-3 text-white/15" />
                    <span className="text-xs font-mono text-white/70">{item.to}</span>
                  </div>
                  <p className="text-xs text-white/25 truncate">{item.reason}</p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Clock className="w-3 h-3 text-white/15" />
                  <span className="text-xs font-mono text-white/20">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="col-span-12 lg:col-span-5 card-base p-5 animate-in stagger-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-display font-semibold text-white/90 flex items-center gap-2">
                AI Recommendations
                {unresolvedRecs.length > 0 && (
                  <span className="badge bg-neural-400/15 text-neural-300 border-neural-400/25">
                    {unresolvedRecs.length} new
                  </span>
                )}
              </h2>
              <p className="text-xs text-white/30 font-mono mt-0.5">
                Suggested interface improvements
              </p>
            </div>
            <Sparkles className="w-4 h-4 text-neural-400" />
          </div>

          {unresolvedRecs.length > 0 ? (
            <div className="space-y-2">
              {unresolvedRecs.slice(0, 3).map((rec, i) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl bg-neural-400/5 border border-neural-400/15 group hover:bg-neural-400/10 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-medium text-white/85">{rec.title}</span>
                    <span className="badge bg-neural-400/10 text-neural-300 border-neural-400/20 flex-shrink-0">
                      {Math.round(rec.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-white/35 mb-3 leading-relaxed">{rec.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        usePersonalizationStore.getState().applyRecommendation(rec.id)
                      }
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neural-400/20 text-neural-300 text-xs font-medium hover:bg-neural-400/30 transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Apply
                    </button>
                    <button
                      onClick={() =>
                        usePersonalizationStore.getState().dismissRecommendation(rec.id)
                      }
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 text-white/30 text-xs hover:bg-white/10 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-10 h-10 rounded-2xl bg-synapse-400/10 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5 text-synapse-400" />
              </div>
              <p className="text-sm font-medium text-white/50">All caught up</p>
              <p className="text-xs text-white/25 mt-1">
                AI is monitoring for new patterns
              </p>
            </div>
          )}
        </div>

        {/* Cognitive load timeline */}
        <div className="col-span-12 card-base p-5 animate-in stagger-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-display font-semibold text-white/90">
                Cognitive Load Timeline
              </h2>
              <p className="text-xs text-white/30 font-mono mt-0.5">
                Inferred mental load throughout the session
              </p>
            </div>
            <a
              href="/insights"
              className="flex items-center gap-1.5 text-xs font-mono text-quantum-400 hover:text-quantum-300 transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Full insights
            </a>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={sessionData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="gradLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 9, fill: "rgba(255,255,255,0.15)", fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
                interval={3}
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotoneX"
                dataKey="cognitiveLoad"
                stroke="#F97316"
                strokeWidth={1.5}
                fill="url(#gradLoad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
