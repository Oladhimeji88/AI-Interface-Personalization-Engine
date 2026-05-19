"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { MetricCard } from "@/components/ui/MetricCard";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  TrendingUp,
  Users,
  Clock,
  Activity,
  MousePointer2,
  Keyboard,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

const weekData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
  day,
  sessions: Math.floor(Math.random() * 8 + 2),
  adaptations: Math.floor(Math.random() * 15 + 3),
  focusTime: Math.floor(Math.random() * 180 + 30),
}));

const radarData = [
  { metric: "Keyboard Use", value: 82 },
  { metric: "Click Accuracy", value: 91 },
  { metric: "Flow State", value: 67 },
  { metric: "Shortcut Use", value: 74 },
  { metric: "Feature Depth", value: 58 },
  { metric: "Consistency", value: 79 },
];

const heatmapData = Array.from({ length: 7 * 24 }, (_, i) => ({
  day: Math.floor(i / 24),
  hour: i % 24,
  value: Math.random() > 0.6 ? Math.floor(Math.random() * 100) : 0,
}));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-base px-3 py-2.5 min-w-28">
      <div className="text-xs font-mono text-white/40 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-3">
          <span className="text-xs text-white/50 capitalize">{p.dataKey}</span>
          <span className="text-xs font-mono font-medium" style={{ color: p.color }}>
            {Math.round(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const { setBreadcrumbs } = useUIStore();
  const [activeTab, setActiveTab] = useState<"overview" | "behavior" | "ai">("overview");

  useEffect(() => {
    setBreadcrumbs([
      { label: "AIPE", href: "/" },
      { label: "Analytics", href: "/analytics" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="max-w-[var(--content-max-width)] mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between animate-in stagger-1">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">
            Analytics
          </h1>
          <p className="text-sm text-white/35">
            Session metrics, behavioral patterns, and AI adaptation history
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 glass rounded-xl border border-white/[0.07]">
          {(["overview", "behavior", "ai"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-150",
                activeTab === tab
                  ? "bg-white/[0.1] text-white"
                  : "text-white/30 hover:text-white/60"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in stagger-2">
        <MetricCard label="Total Sessions" value="47" delta={12} deltaLabel="this week" accent="quantum" />
        <MetricCard label="Avg Session" value="34" unit="min" delta={5} deltaLabel="vs last week" accent="neural" />
        <MetricCard label="AI Adaptations" value="183" delta={24} deltaLabel="this week" accent="synapse" live />
        <MetricCard label="Power Score" value="78" unit="%" delta={3} deltaLabel="improvement" accent="plasma" />
      </div>

      {/* Weekly chart */}
      <div className="grid grid-cols-12 gap-4 animate-in stagger-3">
        <div className="col-span-12 lg:col-span-8 card-base p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-display font-semibold text-white/90">Weekly Overview</h2>
              <p className="text-xs text-white/30 font-mono mt-0.5">Sessions & adaptations per day</p>
            </div>
            <span className="badge bg-quantum-400/10 text-quantum-300 border-quantum-400/20 text-xs">
              7-day view
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData} barGap={4} margin={{ left: -20 }}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sessions" fill="#0EA5E9" opacity={0.8} radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Bar dataKey="adaptations" fill="#8B5CF6" opacity={0.8} radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Behavior radar */}
        <div className="col-span-12 lg:col-span-4 card-base p-5">
          <h2 className="text-sm font-display font-semibold text-white/90 mb-1">Behavior Profile</h2>
          <p className="text-xs text-white/30 font-mono mb-3">Interaction quality metrics</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fontSize: 9, fill: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono" }}
              />
              <Radar
                dataKey="value"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.15}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap — simplified */}
      <div className="card-base p-5 animate-in stagger-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-display font-semibold text-white/90">Activity Heatmap</h2>
            <p className="text-xs text-white/30 font-mono mt-0.5">Hour of day × Day of week</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-white/25">
            <div className="w-3 h-3 rounded-sm bg-quantum-400/20" />
            <span>Low</span>
            <div className="w-3 h-3 rounded-sm bg-quantum-400/60" />
            <span>Medium</span>
            <div className="w-3 h-3 rounded-sm bg-quantum-400" />
            <span>High</span>
          </div>
        </div>
        <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(24, 1fr)" }}>
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={hour} className="space-y-1">
              <div className="text-center text-[8px] font-mono text-white/15 h-3">
                {hour % 6 === 0 ? hour : ""}
              </div>
              {Array.from({ length: 7 }, (_, day) => {
                const entry = heatmapData.find((d) => d.day === day && d.hour === hour);
                const v = entry?.value ?? 0;
                return (
                  <div
                    key={day}
                    className="h-4 rounded-sm transition-all duration-150 hover:scale-110 cursor-default"
                    style={{
                      background: v > 0
                        ? `rgba(14,165,233,${v / 100 * 0.8 + 0.1})`
                        : "rgba(255,255,255,0.03)",
                    }}
                    title={`${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][day]} ${hour}:00 — ${v} interactions`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Interaction breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in stagger-5">
        {[
          { icon: MousePointer2, label: "Click Events", value: "2,847", sub: "+18% vs last week", color: "quantum" },
          { icon: Keyboard, label: "Keystrokes", value: "14,302", sub: "65 WPM average", color: "neural" },
          { icon: Activity, label: "Scroll Distance", value: "18.4m", sub: "Total this week", color: "synapse" },
        ].map((item) => (
          <div key={item.label} className="card-base p-4 flex items-center gap-4">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0",
                item.color === "quantum" && "bg-quantum-400/10 border-quantum-400/20 text-quantum-400",
                item.color === "neural" && "bg-neural-400/10 border-neural-400/20 text-neural-400",
                item.color === "synapse" && "bg-synapse-400/10 border-synapse-400/20 text-synapse-400"
              )}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-display font-bold text-white tabular-nums">{item.value}</div>
              <div className="text-xs font-mono text-white/30">{item.label}</div>
              <div className="text-xs text-white/20">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
