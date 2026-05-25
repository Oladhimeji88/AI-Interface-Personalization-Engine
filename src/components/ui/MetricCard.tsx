"use client";

import { cn } from "@/lib/utils";
import { TrendUp, TrendDown, Minus } from "@/components/ui/icons";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  accent?: "quantum" | "neural" | "synapse" | "plasma";
  size?: "sm" | "md" | "lg";
  live?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const accentMap = {
  quantum: {
    glow:   "hover:shadow-quantum-sm",
    text:   "text-quantum-400",
    bg:     "bg-quantum-400/10",
    border: "border-quantum-400/20",
    dot:    "bg-quantum-400",
  },
  neural: {
    glow:   "hover:shadow-neural-sm",
    text:   "text-neural-400",
    bg:     "bg-neural-400/10",
    border: "border-neural-400/20",
    dot:    "bg-neural-400",
  },
  synapse: {
    glow:   "hover:shadow-synapse-sm",
    text:   "text-synapse-400",
    bg:     "bg-synapse-400/10",
    border: "border-synapse-400/20",
    dot:    "bg-synapse-400",
  },
  plasma: {
    glow:   "hover:shadow-[0_0_16px_rgba(245,158,11,0.18)]",
    text:   "text-plasma-500",
    bg:     "bg-plasma-500/10",
    border: "border-plasma-500/20",
    dot:    "bg-plasma-500",
  },
};

export function MetricCard({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  accent = "quantum",
  size = "md",
  live = false,
  className,
  children,
}: MetricCardProps) {
  const colors = accentMap[accent];
  const isPositive = delta !== undefined && delta > 0;
  const isNegative = delta !== undefined && delta < 0;

  return (
    <div
      className={cn(
        "card-base group relative overflow-hidden transition-all duration-300",
        colors.glow,
        size === "sm" && "p-4",
        size === "md" && "p-5",
        size === "lg" && "p-6",
        className
      )}
    >
      {/* Hover shimmer streak */}
      <div
        className={cn(
          "absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          "bg-gradient-to-r from-transparent via-current to-transparent",
          colors.text
        )}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="section-label">{label}</span>
          {live && (
            <span className="flex items-center gap-1.5">
              <span className="live-dot" />
              <span className="text-[10px] font-mono text-synapse-400">LIVE</span>
            </span>
          )}
        </div>

        {/* Value */}
        <div className="flex items-end gap-2 mb-2">
          <span
            className={cn(
              "font-display font-bold leading-none tabular-nums",
              colors.text,
              size === "sm" && "text-2xl",
              size === "md" && "text-3xl",
              size === "lg" && "text-4xl"
            )}
          >
            {value}
          </span>
          {unit && (
            <span className="text-sm text-white/30 font-mono mb-0.5">{unit}</span>
          )}
        </div>

        {/* Delta */}
        {delta !== undefined && (
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "flex items-center gap-1 text-[11px] font-mono font-semibold",
                isPositive  && "text-synapse-400",
                isNegative  && "text-crimson-500",
                !isPositive && !isNegative && "text-white/30"
              )}
            >
              {isPositive  ? <TrendUp   size={12} weight="bold" /> :
               isNegative  ? <TrendDown size={12} weight="bold" /> :
                             <Minus     size={12} weight="bold" />}
              {Math.abs(delta)}%
            </span>
            {deltaLabel && (
              <span className="text-[11px] text-white/25 font-mono">{deltaLabel}</span>
            )}
          </div>
        )}

        {children}
      </div>

      {/* Ambient accent glow */}
      <div
        className={cn(
          "absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500",
          colors.dot
        )}
      />
    </div>
  );
}
