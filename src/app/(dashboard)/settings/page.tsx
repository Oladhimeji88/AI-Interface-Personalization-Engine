"use client";

import { useEffect } from "react";
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
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const SETTING_SECTIONS = [
  {
    id: "ai",
    label: "AI Engine",
    icon: Brain,
    description: "Control how AIPE learns and adapts your interface",
    settings: [
      {
        label: "Real-time adaptation",
        description: "Allow AI to modify the interface during sessions",
        type: "toggle",
        key: "realtimeAdaptation",
        default: true,
      },
      {
        label: "Behavioral signal collection",
        description: "Track clicks, scrolls, and typing patterns",
        type: "toggle",
        key: "behaviorTracking",
        default: true,
      },
      {
        label: "Cross-session memory",
        description: "Remember preferences and patterns across sessions",
        type: "toggle",
        key: "crossSessionMemory",
        default: true,
      },
      {
        label: "Adaptation confidence threshold",
        description: "Minimum AI confidence required before applying changes",
        type: "slider",
        key: "confidenceThreshold",
        min: 50,
        max: 95,
        default: 65,
        unit: "%",
      },
    ],
  },
  {
    id: "privacy",
    label: "Privacy & Data",
    icon: Shield,
    description: "Manage your behavioral data and privacy settings",
    settings: [
      {
        label: "Local-only processing",
        description: "All inference runs on-device. No data sent externally",
        type: "toggle",
        key: "localOnly",
        default: true,
        locked: true,
      },
      {
        label: "Session data retention",
        description: "How long behavioral data is stored",
        type: "select",
        key: "dataRetention",
        options: ["7 days", "30 days", "90 days", "Forever"],
        default: "30 days",
      },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Control when AIPE notifies you of adaptations",
    settings: [
      {
        label: "Adaptation toasts",
        description: "Show notifications when AI applies changes",
        type: "toggle",
        key: "adaptationToasts",
        default: false,
      },
      {
        label: "Weekly insight report",
        description: "Receive a weekly summary of your behavior patterns",
        type: "toggle",
        key: "weeklyReport",
        default: true,
      },
    ],
  },
  {
    id: "keyboard",
    label: "Keyboard Shortcuts",
    icon: Keyboard,
    description: "Customize keyboard bindings",
    settings: [],
    custom: "keyboard",
  },
];

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

export default function SettingsPage() {
  const { setBreadcrumbs } = useUIStore();
  const { resetToDefaults, adaptationHistory } = usePersonalizationStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: "AIPE", href: "/" },
      { label: "Settings", href: "/settings" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="animate-in stagger-1">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-white/30" />
          <span className="section-label">System</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-white/35">
          Configure the AI engine, privacy controls, and platform behavior
        </p>
      </div>

      {/* Sections */}
      {SETTING_SECTIONS.map((section, sIdx) => {
        const Icon = section.icon;
        return (
          <div
            key={section.id}
            className={cn("card-base overflow-hidden animate-in", `stagger-${sIdx + 2}`)}
          >
            {/* Section header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center">
                <Icon className="w-4 h-4 text-white/40" />
              </div>
              <div>
                <h2 className="text-sm font-display font-semibold text-white/90">
                  {section.label}
                </h2>
                <p className="text-xs text-white/30">{section.description}</p>
              </div>
            </div>

            {/* Settings */}
            <div className="divide-y divide-white/[0.04]">
              {section.settings.map((setting) => (
                <div key={setting.key} className="px-5 py-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-white/80">
                        {setting.label}
                      </span>
                      {"locked" in setting && setting.locked && (
                        <span className="badge bg-synapse-400/10 text-synapse-300 border-synapse-400/20 text-[10px]">
                          Always on
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/35">{setting.description}</p>
                  </div>

                  {/* Control */}
                  <div className="flex-shrink-0">
                    {setting.type === "toggle" && (
                      <button
                        disabled={"locked" in setting && setting.locked}
                        className={cn(
                          "relative w-10 h-5 rounded-full transition-all duration-200",
                          setting.default ? "bg-synapse-400" : "bg-white/10",
                          "locked" in setting && setting.locked && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200",
                            setting.default ? "left-5" : "left-0.5"
                          )}
                        />
                      </button>
                    )}
                    {setting.type === "select" && "options" in setting && (
                      <select className="input-base text-xs py-1.5 pr-8 appearance-none cursor-pointer">
                        {setting.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                    {setting.type === "slider" && "min" in setting && (
                      <div className="flex items-center gap-2 w-40">
                        <input
                          type="range"
                          min={setting.min}
                          max={setting.max}
                          defaultValue={setting.default as number}
                          className="flex-1 accent-quantum-400"
                        />
                        <span className="text-xs font-mono text-white/40 w-10 text-right">
                          {setting.default}
                          {setting.unit}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Custom keyboard section */}
              {section.custom === "keyboard" && (
                <div className="px-5 py-4">
                  <div className="space-y-2">
                    {SHORTCUTS.map((sc) => (
                      <div
                        key={sc.action}
                        className="flex items-center justify-between py-1.5"
                      >
                        <span className="text-xs text-white/50">{sc.action}</span>
                        <div className="flex items-center gap-1">
                          {sc.keys.map((k) => (
                            <kbd
                              key={k}
                              className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.09] text-xs font-mono text-white/40"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Data management */}
      <div className="card-base overflow-hidden animate-in stagger-6">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center">
            <Database className="w-4 h-4 text-white/40" />
          </div>
          <div>
            <h2 className="text-sm font-display font-semibold text-white/90">Data Management</h2>
            <p className="text-xs text-white/30">
              {adaptationHistory.length} adaptations logged
            </p>
          </div>
        </div>
        <div className="divide-y divide-white/[0.04]">
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white/80 mb-0.5">Reset personalization</div>
              <div className="text-xs text-white/35">
                Revert all AI-applied settings to defaults
              </div>
            </div>
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white/50 hover:text-white/80 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] transition-all duration-150"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-crimson-400 mb-0.5">
                Clear all behavioral data
              </div>
              <div className="text-xs text-white/35">
                Permanently delete all session history and patterns
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-crimson-400 hover:text-crimson-300 bg-crimson-500/5 hover:bg-crimson-500/10 border border-crimson-500/20 transition-all duration-150">
              <Trash2 className="w-3.5 h-3.5" />
              Clear data
            </button>
          </div>
        </div>
      </div>

      {/* Version info */}
      <div className="flex items-center justify-between text-xs font-mono text-white/20 animate-in stagger-7">
        <span>AIPE v0.1.0 — AI Interface Personalization Engine</span>
        <span>Built on Next.js 14 · Zustand · TypeScript</span>
      </div>
    </div>
  );
}
