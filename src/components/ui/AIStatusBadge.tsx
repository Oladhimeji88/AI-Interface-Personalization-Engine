"use client";

import { cn } from "@/lib/utils";
import { Brain, Zap, RefreshCcw } from "lucide-react";
import { usePersonalizationStore } from "@/lib/store/personalization.store";

interface AIStatusBadgeProps {
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function AIStatusBadge({
  className,
  showLabel = true,
  size = "md",
}: AIStatusBadgeProps) {
  const { isAdapting, profile } = usePersonalizationStore();
  const confidence = profile?.aiConfidence ?? 0;
  const count = profile?.adaptationCount ?? 0;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/[0.08]",
        size === "sm" && "px-2 py-1 text-xs",
        className
      )}
    >
      {isAdapting ? (
        <RefreshCcw
          className={cn(
            "text-quantum-400 animate-spin",
            size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"
          )}
        />
      ) : (
        <Brain
          className={cn(
            "text-neural-400",
            size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"
          )}
        />
      )}
      {showLabel && (
        <span
          className={cn(
            "font-mono font-medium",
            size === "sm" ? "text-xs" : "text-xs",
            isAdapting ? "text-quantum-300" : "text-white/60"
          )}
        >
          {isAdapting
            ? "Adapting…"
            : `${Math.round(confidence * 100)}% confidence`}
        </span>
      )}
      {!isAdapting && count > 0 && showLabel && (
        <>
          <span className="w-px h-3 bg-white/10" />
          <span className="flex items-center gap-1 text-xs font-mono text-white/30">
            <Zap className="w-2.5 h-2.5" />
            {count}
          </span>
        </>
      )}
    </div>
  );
}
