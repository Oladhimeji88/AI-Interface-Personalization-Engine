"use client";

import { cn } from "@/lib/utils";
import { Brain, Lightning, ArrowCounterClockwise } from "@/components/ui/icons";
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
        "inline-flex items-center gap-2 rounded-full glass border border-white/[0.08]",
        size === "sm" ? "px-2 py-1" : "px-3 py-1.5",
        className
      )}
    >
      {isAdapting ? (
        <ArrowCounterClockwise
          size={size === "sm" ? 12 : 14}
          weight="bold"
          className="text-quantum-400 animate-spin"
        />
      ) : (
        <Brain
          size={size === "sm" ? 12 : 14}
          weight="duotone"
          className="text-neural-400"
        />
      )}

      {showLabel && (
        <span
          className={cn(
            "font-mono font-medium",
            size === "sm" ? "text-[11px]" : "text-xs",
            isAdapting ? "text-quantum-300" : "text-white/60"
          )}
        >
          {isAdapting ? "Adapting…" : `${Math.round(confidence * 100)}% confidence`}
        </span>
      )}

      {!isAdapting && count > 0 && showLabel && (
        <>
          <span className="w-px h-3 bg-white/10" />
          <span className="flex items-center gap-1 text-[11px] font-mono text-white/30">
            <Lightning size={10} weight="fill" />
            {count}
          </span>
        </>
      )}
    </div>
  );
}
