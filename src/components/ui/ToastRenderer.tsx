"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/lib/store/ui.store";
import { cn } from "@/lib/utils";
import {
  CheckCircle, XCircle, Warning, Info, Brain, X,
} from "@/components/ui/icons";

const CONFIG = {
  success: {
    Icon:   CheckCircle,
    weight: "fill" as const,
    icon:   "text-synapse-400 bg-synapse-400/10 border-synapse-400/22",
    bar:    "bg-synapse-400",
    border: "border-synapse-400/14",
  },
  error: {
    Icon:   XCircle,
    weight: "fill" as const,
    icon:   "text-crimson-400 bg-crimson-500/10 border-crimson-500/22",
    bar:    "bg-crimson-500",
    border: "border-crimson-500/14",
  },
  warning: {
    Icon:   Warning,
    weight: "fill" as const,
    icon:   "text-plasma-400 bg-plasma-500/10 border-plasma-500/22",
    bar:    "bg-plasma-500",
    border: "border-plasma-500/14",
  },
  info: {
    Icon:   Info,
    weight: "fill" as const,
    icon:   "text-quantum-400 bg-quantum-400/10 border-quantum-400/22",
    bar:    "bg-quantum-400",
    border: "border-quantum-400/14",
  },
  ai: {
    Icon:   Brain,
    weight: "duotone" as const,
    icon:   "text-neural-300 bg-neural-400/10 border-neural-400/22",
    bar:    "bg-neural-400",
    border: "border-neural-400/14",
  },
};

export function ToastRenderer() {
  const { toasts, removeToast } = useUIStore();
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    toasts.forEach((toast) => {
      if (!timers.current[toast.id]) {
        timers.current[toast.id] = setTimeout(() => {
          removeToast(toast.id);
          delete timers.current[toast.id];
        }, toast.duration ?? 4000);
      }
    });
  }, [toasts, removeToast]);

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const cfg = CONFIG[toast.type];
          const { Icon } = cfg;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 48, scale: 0.94 }}
              animate={{ opacity: 1, x: 0,  scale: 1    }}
              exit={{ opacity: 0, x: 48, scale: 0.94, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={cn(
                "pointer-events-auto relative overflow-hidden",
                "flex items-start gap-3 px-4 py-3.5 rounded-2xl",
                "min-w-[260px] max-w-[320px]",
                "bg-void-100/98 backdrop-blur-xl",
                "border shadow-card-lg",
                cfg.border
              )}
            >
              {/* Progress bar */}
              <motion.div
                className={cn("absolute bottom-0 left-0 h-0.5 rounded-full", cfg.bar)}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: (toast.duration ?? 4000) / 1000, ease: "linear" }}
              />

              {/* Icon */}
              <div
                className={cn(
                  "w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5",
                  cfg.icon
                )}
              >
                <Icon size={14} weight={cfg.weight} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-[12px] font-semibold text-white/90 leading-snug">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-[11px] text-white/40 mt-0.5 leading-snug">
                    {toast.description}
                  </p>
                )}
              </div>

              {/* Dismiss */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
                className="text-white/20 hover:text-white/60 transition-colors flex-shrink-0 mt-0.5 -mr-1"
              >
                <X size={13} weight="bold" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
