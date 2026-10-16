"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import type { BehaviorSignal } from "@/types/personalization";

interface AIContextValue {
  isAdapting: boolean;
  aiConfidence: number;
  adaptationCount: number;
  trackSignal: (signal: Omit<BehaviorSignal, "timestamp">) => void;
  triggerAdaptation: () => void;
}

const AIContext = createContext<AIContextValue | null>(null);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const {
    profile,
    isAdapting,
    initProfile,
    pushSignal,
    adaptProfile,
  } = usePersonalizationStore();

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionStartRef = useRef(Date.now());

  // ── Bootstrap ────────────────────────────────────────────────────────
  useEffect(() => {
    initProfile("user-001");
  }, [initProfile]);

  // ── Apply adaptive CSS variables to DOM ──────────────────────────────
  useEffect(() => {
    if (!profile) return;

    const root = document.documentElement;
    const c = profile.colors;
    const l = profile.layout;
    const m = profile.motion;

    root.style.setProperty("--color-primary", c.primary);
    root.style.setProperty("--color-secondary", c.secondary);
    root.style.setProperty("--color-accent", c.accent);
    root.style.setProperty("--color-background", c.background);
    root.style.setProperty("--color-surface", c.surface);
    root.style.setProperty("--color-text", c.text);
    root.style.setProperty("--color-text-muted", c.textMuted);
    root.style.setProperty("--color-border", c.border);
    root.style.setProperty("--sidebar-width", `${l.sidebarWidth}px`);
    root.style.setProperty(
      "--duration-base",
      `${m.preference === "none" ? 0 : m.transitionDuration}ms`
    );
  }, [profile]);

  // ── Global behavior tracking ──────────────────────────────────────────
  const trackSignal = useCallback(
    (signal: Omit<BehaviorSignal, "timestamp">) => {
      pushSignal({ ...signal, timestamp: new Date() });
    },
    [pushSignal]
  );

  // ── Passive event listeners ────────────────────────────────────────
  useEffect(() => {
    let clickCount = 0;

    const handleClick = () => {
      clickCount++;
      trackSignal({ type: "click", duration: Date.now() - sessionStartRef.current });
      resetIdleTimer();
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      const isShortcut = e.metaKey || e.ctrlKey || e.altKey;
      trackSignal({
        type: isShortcut ? "keyboard" : "keyboard",
        metadata: { key: e.key, isShortcut },
      });
      resetIdleTimer();
    };

    const handleScroll = () => {
      trackSignal({ type: "scroll", duration: window.scrollY });
      resetIdleTimer();
    };

    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        trackSignal({ type: "idle", duration: 30000 });
      }, 30000);
    };

    window.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("keydown", handleKeyPress, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("scroll", handleScroll);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [trackSignal]);

  const triggerAdaptation = useCallback(() => {
    adaptProfile();
  }, [adaptProfile]);

  const value: AIContextValue = {
    isAdapting,
    aiConfidence: profile?.aiConfidence ?? 0,
    adaptationCount: profile?.adaptationCount ?? 0,
    trackSignal,
    triggerAdaptation,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI(): AIContextValue {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error("useAI must be used within AIProvider");
  return ctx;
}
