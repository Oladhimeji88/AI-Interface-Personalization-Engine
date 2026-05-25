"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info, Brain } from "lucide-react";
import { useUIStore } from "@/lib/store/ui.store";
import { cn } from "@/lib/utils";

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  ai: Brain,
};

const STYLES = {
  success: {
    icon: "text-synapse-400 bg-synapse-400/10 border-synapse-400/25",
    bar: "bg-synapse-400",
    border: "border-synapse-400/15",
  },
  error: {
    icon: "text-crimson-400 bg-crimson-500/10 border-crimson-500/25",
    bar: "bg-crimson-500",
    border: "border-crimson-500/15",
  },
  warning: {
    icon: "text-plasma-400 bg-plasma-500/10 border-plasma-500/25",
    bar: "bg-plasma-500",
    border: "border-plasma-500/15",
  },
  info: {
    icon: "text-quantum-400 bg-quantum-400/10 border-quantum-400/25",
    bar: "bg-quantum-400",
    border: "border-quantum-400/15",
  },
  ai: {
    icon: "text-neural-300 bg-neural-400/10 border-neural-400/25",
    bar: "bg-neural-400",
    border: "border-neural-400/15",
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
          const Icon = ICONS[toast.type];
          const style = STYLES[toast.type];

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 48, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 48, scale: 0.94, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={cn(
                "pointer-events-auto relative overflow-hidden",
                "flex items-start gap-3 px-4 py-3.5 rounded-2xl min-w-[260px] max-w-[320px]",
                "bg-void-DEFAULT/95 backdrop-blur-xl",
                "border shadow-2xl",
                style.border
              )}
            >
              {/* Progress bar */}
              <motion.div
                className={cn("absolute bottom-0 left-0 h-0.5 rounded-full", style.bar)}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: (toast.duration ?? 4000) / 1000, ease: "linear" }}
              />

              {/* Icon */}
              <div
                className={cn(
                  "w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5",
                  style.icon
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-semibold text-white/90 leading-snug">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-white/40 mt-0.5 leading-snug">{toast.description}</p>
                )}
              </div>

              {/* Close */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/20 hover:text-white/60 transition-colors flex-shrink-0 mt-0.5 -mr-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
