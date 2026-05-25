"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { cn } from "@/lib/utils";
import {
  Settings,
  Brain,
  Shield,
  Bell,
  Keyboard,
  Database,
  RotateCcw,
  Trash2,
  Download,
  Check,
  Info,
  Zap,
} from "lucide-react";

// ─── Shared toggle ────────────────────────────────────────────────────────────

function Toggle({
  on,
  disabled,
  onToggle,
  label,
}: {
  on: boolean;
  disabled?: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on ? "true" : "false"}
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "relative w-10 h-5 rounded-full transition-all duration-200",
        on ? "bg-synapse-400" : "bg-white/10",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div
        className={cn(
          "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200",
          on ? "left-5" : "left-0.5"
        )}
      />
    </button>
  );
}

// ─── Keyboard shortcut reference ──────────────────────────────────────────────

const SHORTCUTS = [
  { action: "Command palette", keys: ["⌘", "K"] },
  { action: "Toggle focus mode", keys: ["⌘", "⇧", "F"] },
  { action: "Trigger AI adaptation", keys: ["⌘", "⇧", "A"] },
  { action: "Navigate to Dashboard", keys: ["G", "D"] },
  { action: "Navigate to Personalize", keys: ["G", "P"] },
  { action: "Navigate to Analytics", keys: ["G", "A"] },
  { action: "Navigate to Insights", keys: ["G", "I"] },
  { action: "Toggle sidebar", keys: ["⌘", "\\"] },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { setBreadcrumbs } = useUIStore();
  const {
    profile,
    adaptationHistory,
    resetToDefaults,
    clearHistory,
    aiSettings,
    updateAISettings,
    recommendations,
  } = usePersonalizationStore();

  const [notifyToasts, setNotifyToasts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [behaviorTracking, setBehaviorTracking] = useState(true);
  const [crossSession, setCrossSession] = useState(true);
  const [realtimeAdapt, setRealtimeAdapt] = useState(true);
  const [exported, setExported] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { label: "AIPE", href: "/" },
      { label: "Settings", href: "/settings" },
    ]);
  }, [setBreadcrumbs]);

  const handleExportProfile = () => {
    if (!profile) return;
    const data = JSON.stringify({ profile, aiSettings, adaptationHistory }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aipe-profile-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const handleClearData = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    clearHistory();
    setConfirmClear(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">
      {/* Header */}
      <div className="animate-in stagger-1">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-white/30" />
          <span className="section-label">System</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-white/35">
          Configure the AI engine, privacy, notifications, and platform behavior.
        </p>
      </div>

      {/* ── AI Engine ──────────────────────────────────────── */}
      <div className="card-base overflow-hidden animate-in stagger-2">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-xl bg-neural-400/10 border border-neural-400/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-neural-400" />
          </div>
          <div>
            <h2 className="text-sm font-display font-semibold text-white/90">AI Engine</h2>
            <p className="text-xs text-white/30">Control how AIPE learns and adapts your interface</p>
          </div>
          {profile && (
            <span className="ml-auto badge bg-synapse-400/10 text-synapse-300 border-synapse-400/20">
              {Math.round(profile.aiConfidence * 100)}% confidence
            </span>
          )}
        </div>

        <div className="divide-y divide-white/[0.04]">
          {[
            { label: "Real-time adaptation", desc: "Allow AI to modify the interface during sessions", on: realtimeAdapt, set: setRealtimeAdapt },
            { label: "Behavioral signal collection", desc: "Track clicks, scrolls, and typing patterns", on: behaviorTracking, set: setBehaviorTracking },
            { label: "Cross-session memory", desc: "Remember preferences and patterns across sessions", on: crossSession, set: setCrossSession },
          ].map(({ label, desc, on, set }) => (
            <div key={label} className="px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-white/80 mb-0.5">{label}</div>
                <div className="text-xs text-white/35">{desc}</div>
              </div>
              <Toggle on={on} label={label} onToggle={() => set((v) => !v)} />
            </div>
          ))}

          {/* Sliders */}
          <div className="px-5 py-4 space-y-5">
            {([
              { label: "Response Speed", hint: "How quickly AI reacts to behavioral changes", key: "responseSpeed" },
              { label: "Confidence Threshold", hint: "Minimum confidence before applying changes", key: "confidenceThreshold" },
            ] as const).map(({ label, hint, key }) => (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white/70">{label}</label>
                  <span className="text-xs font-mono text-neural-400 tabular-nums">{aiSettings[key]}%</span>
                </div>
                <input
                  type="range"
                  aria-label={label}
                  min={0}
                  max={100}
                  value={aiSettings[key]}
                  onChange={(e) => updateAISettings({ [key]: Number(e.target.value) })}
                  className="w-full accent-neural-400"
                />
                <p className="text-xs text-white/20">{hint}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Privacy & Data ────────────────────────────────── */}
      <div className="card-base overflow-hidden animate-in stagger-3">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-xl bg-synapse-400/10 border border-synapse-400/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-synapse-400" />
          </div>
          <div>
            <h2 className="text-sm font-display font-semibold text-white/90">Privacy & Data</h2>
            <p className="text-xs text-white/30">All processing is local — no data leaves your device</p>
          </div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          <div className="px-5 py-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-white/80">Local-only processing</span>
                <span className="badge bg-synapse-400/10 text-synapse-300 border-synapse-400/20 text-[10px]">Always on</span>
              </div>
              <div className="text-xs text-white/35">All inference runs on-device — zero external requests</div>
            </div>
            <Toggle on label="Local-only processing" onToggle={() => {}} disabled />
          </div>

          <div className="px-5 py-4 flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-white/80 mb-0.5">Data retention period</div>
              <div className="text-xs text-white/35">How long behavioral history is stored locally</div>
            </div>
            <select
              aria-label="Data retention period"
              defaultValue="30 days"
              className="input-base text-xs py-1.5 cursor-pointer w-32"
            >
              {["7 days", "30 days", "90 days", "Forever"].map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Notifications ─────────────────────────────────── */}
      <div className="card-base overflow-hidden animate-in stagger-4">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-xl bg-plasma-500/10 border border-plasma-500/20 flex items-center justify-center">
            <Bell className="w-4 h-4 text-plasma-400" />
          </div>
          <div>
            <h2 className="text-sm font-display font-semibold text-white/90">Notifications</h2>
            <p className="text-xs text-white/30">Control when and how AIPE notifies you</p>
          </div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {[
            { label: "Adaptation toasts", desc: "Show a toast when AI applies changes", on: notifyToasts, set: setNotifyToasts },
            { label: "Weekly insight report", desc: "Receive a weekly summary of behavior patterns", on: weeklyReport, set: setWeeklyReport },
          ].map(({ label, desc, on, set }) => (
            <div key={label} className="px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-white/80 mb-0.5">{label}</div>
                <div className="text-xs text-white/35">{desc}</div>
              </div>
              <Toggle on={on} label={label} onToggle={() => set((v) => !v)} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Keyboard Shortcuts ────────────────────────────── */}
      <div className="card-base overflow-hidden animate-in stagger-5">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-xl bg-quantum-400/10 border border-quantum-400/20 flex items-center justify-center">
            <Keyboard className="w-4 h-4 text-quantum-400" />
          </div>
          <div>
            <h2 className="text-sm font-display font-semibold text-white/90">Keyboard Shortcuts</h2>
            <p className="text-xs text-white/30">Global shortcuts active throughout the platform</p>
          </div>
        </div>

        <div className="px-5 py-4 space-y-1.5">
          {SHORTCUTS.map((sc) => (
            <div key={sc.action} className="flex items-center justify-between py-1.5">
              <span className="text-xs text-white/50">{sc.action}</span>
              <div className="flex items-center gap-1">
                {sc.keys.map((k, i) => (
                  <span key={i} className="flex items-center gap-0.5">
                    {i > 0 && <span className="text-white/15 text-xs mx-0.5">+</span>}
                    <kbd className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.09] text-[11px] font-mono text-white/45">
                      {k}
                    </kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Data Management ───────────────────────────────── */}
      <div className="card-base overflow-hidden animate-in stagger-6">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center">
            <Database className="w-4 h-4 text-white/40" />
          </div>
          <div>
            <h2 className="text-sm font-display font-semibold text-white/90">Data Management</h2>
            <p className="text-xs text-white/30">
              {adaptationHistory.length} adaptation{adaptationHistory.length !== 1 ? "s" : ""} logged · {recommendations.length} recommendation{recommendations.length !== 1 ? "s" : ""} pending
            </p>
          </div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {/* Export */}
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-white/80 mb-0.5">Export profile</div>
              <div className="text-xs text-white/35">Download your full personalization profile as JSON</div>
            </div>
            <button
              type="button"
              onClick={handleExportProfile}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-quantum-300 bg-quantum-400/10 hover:bg-quantum-400/20 border border-quantum-400/20 transition-all duration-150 flex-shrink-0"
            >
              {exported ? <Check className="w-3.5 h-3.5 text-synapse-400" /> : <Download className="w-3.5 h-3.5" />}
              {exported ? "Exported!" : "Export JSON"}
            </button>
          </div>

          {/* Reset */}
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-white/80 mb-0.5">Reset personalization</div>
              <div className="text-xs text-white/35">Revert all AI-applied settings to factory defaults</div>
            </div>
            <button
              type="button"
              onClick={resetToDefaults}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white/50 hover:text-white/80 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] transition-all duration-150 flex-shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Clear history */}
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-crimson-400 mb-0.5">Clear adaptation history</div>
              <div className="text-xs text-white/35">
                Delete all logged adaptations — AI will start fresh
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearData}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 flex-shrink-0",
                confirmClear
                  ? "text-white bg-crimson-500 border border-crimson-500 hover:bg-crimson-600"
                  : "text-crimson-400 bg-crimson-500/5 hover:bg-crimson-500/10 border border-crimson-500/20"
              )}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {confirmClear ? "Confirm clear" : "Clear history"}
            </button>
          </div>
        </div>
      </div>

      {/* ── About ────────────────────────────────────────── */}
      <div className="card-base p-5 animate-in stagger-7">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-quantum-400/20 to-neural-400/20 border border-neural-400/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-neural-300" />
          </div>
          <div>
            <h2 className="text-sm font-display font-semibold text-white/90">About AIPE</h2>
            <p className="text-xs text-white/30">AI Interface Personalization Engine</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Version", value: "0.1.0 beta" },
            { label: "Adaptations", value: profile?.adaptationCount ?? 0 },
            { label: "Profile version", value: `v${profile?.version ?? 1}` },
            { label: "AI confidence", value: `${Math.round((profile?.aiConfidence ?? 0.5) * 100)}%` },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-xs font-mono text-white/25 mb-0.5">{label}</div>
              <div className="text-sm font-display font-semibold text-white/80">{value}</div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-quantum-400/5 border border-quantum-400/10">
          <Info className="w-3.5 h-3.5 text-quantum-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-quantum-300/70 leading-relaxed">
            Built on Next.js 14, React 18, Zustand, Framer Motion, and Tailwind CSS.
            All behavioral analysis runs client-side — no external API calls are made.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs font-mono text-white/15 pb-2 animate-in stagger-8">
        <span>AIPE v0.1.0 — AI Interface Personalization Engine</span>
        <span>© 2025</span>
      </div>
    </div>
  );
}
