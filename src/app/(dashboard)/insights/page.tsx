"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { cn } from "@/lib/utils";
import {
  Lightbulb,
  Brain,
  TrendingUp,
  Clock,
  Zap,
  Eye,
  Activity,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const INSIGHT_CARDS = [
  {
    category: "Productivity Pattern",
    title: "You enter deep work at 9–11am",
    description:
      "Your keyboard usage spikes 340% and error rate drops to near-zero during these hours. AIPE now pre-configures compact density and muted notifications automatically at 8:55am.",
    impact: "high",
    icon: Brain,
    color: "quantum",
    stat: "340%",
    statLabel: "keyboard spike",
    actionable: "Schedule deep work blocks to capitalize on this window.",
  },
  {
    category: "Fatigue Signal",
    title: "Cognitive load peaks after 90-min sessions",
    description:
      "Error rate increases 2.3x and click velocity drops by 40% after extended sessions without breaks. Interface complexity is automatically reduced when this threshold is crossed.",
    impact: "high",
    icon: Activity,
    color: "plasma",
    stat: "2.3×",
    statLabel: "error increase",
    actionable: "Consider a 5-minute break trigger after 90 minutes.",
  },
  {
    category: "Power User Signal",
    title: "You rely heavily on keyboard navigation",
    description:
      "74% of your navigation events come from keyboard shortcuts rather than mouse clicks. You're in the top 8% of keyboard-first users. AIPE has elevated your shortcut suggestions.",
    impact: "medium",
    icon: Zap,
    color: "synapse",
    stat: "74%",
    statLabel: "keyboard nav",
    actionable: "Enable chord shortcuts for your most-used flows.",
  },
  {
    category: "Attention Pattern",
    title: "Dashboard widgets — bottom-right ignored",
    description:
      "Attention heatmap analysis shows zero dwell time on bottom-right widgets for 14+ sessions. AIPE will propose a layout reorganization to move high-value content into your attention zone.",
    impact: "medium",
    icon: Eye,
    color: "neural",
    stat: "14",
    statLabel: "sessions ignored",
    actionable: "Reorganize layout to surface high-value content.",
  },
  {
    category: "Session Pattern",
    title: "You start exploratory, shift to focused",
    description:
      "The first 15 minutes of each session shows wide navigation (5+ sections). After that, you settle into 1–2 focused areas. AIPE now delays sidebar collapse to support early exploration.",
    impact: "low",
    icon: TrendingUp,
    color: "quantum",
    stat: "15m",
    statLabel: "exploration phase",
    actionable: "Breadcrumb navigation is temporarily expanded during this window.",
  },
];

const impactColors = {
  high: "text-plasma-400 bg-plasma-500/10 border-plasma-500/20",
  medium: "text-neural-300 bg-neural-400/10 border-neural-400/20",
  low: "text-synapse-300 bg-synapse-400/10 border-synapse-400/20",
};

const featureColors = {
  quantum: "text-quantum-400 bg-quantum-400/10 border-quantum-400/20",
  neural: "text-neural-400 bg-neural-400/10 border-neural-400/20",
  synapse: "text-synapse-400 bg-synapse-400/10 border-synapse-400/20",
  plasma: "text-plasma-500 bg-plasma-500/10 border-plasma-500/20",
} as const;

export default function InsightsPage() {
  const { setBreadcrumbs } = useUIStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "AIPE", href: "/" },
      { label: "Behavior Insights", href: "/insights" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="animate-in stagger-1">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-plasma-500" />
          <span className="section-label">AI-Generated Insights</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">
          Behavior Insights
        </h1>
        <p className="text-sm text-white/35 max-w-lg">
          AIPE has detected {INSIGHT_CARDS.length} behavioral patterns across your
          sessions. These insights drive real-time interface adaptations.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 animate-in stagger-2">
        {[
          { label: "Patterns Detected", value: "5", color: "quantum" },
          { label: "High Impact", value: "2", color: "plasma" },
          { label: "Applied Adaptations", value: "14", color: "synapse" },
        ].map((s) => (
          <div key={s.label} className="card-base p-4 text-center">
            <div
              className={cn(
                "text-3xl font-display font-bold mb-1",
                s.color === "quantum" && "text-quantum-400",
                s.color === "plasma" && "text-plasma-400",
                s.color === "synapse" && "text-synapse-400"
              )}
            >
              {s.value}
            </div>
            <div className="text-xs font-mono text-white/30">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Insight cards */}
      <div className="space-y-4">
        {INSIGHT_CARDS.map((insight, i) => {
          const Icon = insight.icon;
          const colorClass = featureColors[insight.color as keyof typeof featureColors];
          return (
            <div
              key={insight.title}
              className={cn(
                "card-base p-5 group transition-all duration-300",
                `animate-in stagger-${i + 1}`
              )}
            >
              <div className="flex items-start gap-4">
                {/* Stat display */}
                <div className="flex-shrink-0 text-right min-w-16">
                  <div
                    className={cn(
                      "text-2xl font-display font-bold tabular-nums leading-tight",
                      colorClass.split(" ")[0]
                    )}
                  >
                    {insight.stat}
                  </div>
                  <div className="text-xs font-mono text-white/25 leading-tight">
                    {insight.statLabel}
                  </div>
                </div>

                <div className="w-px self-stretch bg-white/[0.06]" />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="section-label text-[10px]">
                      {insight.category}
                    </span>
                    <span
                      className={cn(
                        "badge text-[10px] capitalize border",
                        impactColors[insight.impact as keyof typeof impactColors]
                      )}
                    >
                      {insight.impact} impact
                    </span>
                  </div>

                  <h3 className="text-sm font-display font-semibold text-white/90 mb-2">
                    {insight.title}
                  </h3>

                  <p className="text-xs text-white/40 leading-relaxed mb-3">
                    {insight.description}
                  </p>

                  {/* Actionable */}
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                    <Sparkles className="w-3 h-3 text-neural-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-neural-300/70">{insight.actionable}</p>
                  </div>
                </div>

                {/* Icon */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0",
                    colorClass
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI note */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-neural-400/5 border border-neural-400/15 animate-in stagger-6">
        <Brain className="w-4 h-4 text-neural-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-neural-300 mb-0.5">How AIPE generates insights</p>
          <p className="text-xs text-white/30 leading-relaxed">
            Insights are generated by correlating thousands of behavioral signals across sessions.
            Pattern confidence requires a minimum of 3 sessions before surfacing. All analysis
            happens locally — no behavioral data is transmitted externally.
          </p>
        </div>
      </div>
    </div>
  );
}
