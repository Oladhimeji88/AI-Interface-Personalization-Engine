"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { usePersonalizationStore } from "@/lib/store/personalization.store";
import { Stack, Box, Inline, Text } from "@atlaskit/primitives";
import Heading from "@atlaskit/heading";
import Button from "@atlaskit/button";
import Lozenge from "@atlaskit/lozenge";
import Toggle from "@atlaskit/toggle";
import SectionMessage from "@atlaskit/section-message";
import {
  Brain,
  Shield,
  Bell,
  Keyboard,
  Database,
  RotateCcw,
  Trash2,
  Download,
  Check,
  Zap,
} from "lucide-react";
import styles from "./page.module.css";

const SHORTCUTS = [
  { action: "Command palette",         keys: ["⌘", "K"]       },
  { action: "Toggle focus mode",       keys: ["⌘", "⇧", "F"]  },
  { action: "Trigger AI adaptation",   keys: ["⌘", "⇧", "A"]  },
  { action: "Navigate to Dashboard",   keys: ["G", "D"]        },
  { action: "Navigate to Personalize", keys: ["G", "P"]        },
  { action: "Navigate to Analytics",   keys: ["G", "A"]        },
  { action: "Navigate to Insights",    keys: ["G", "I"]        },
  { action: "Toggle sidebar",          keys: ["⌘", "\\"]       },
];

export default function SettingsPage() {
  const { setBreadcrumbs } = useUIStore();
  const { profile, adaptationHistory, resetToDefaults, clearHistory, aiSettings, updateAISettings, recommendations } =
    usePersonalizationStore();

  const [notifyToasts,     setNotifyToasts]     = useState(true);
  const [weeklyReport,     setWeeklyReport]      = useState(true);
  const [behaviorTracking, setBehaviorTracking]  = useState(true);
  const [crossSession,     setCrossSession]      = useState(true);
  const [realtimeAdapt,    setRealtimeAdapt]     = useState(true);
  const [exported,         setExported]          = useState(false);
  const [confirmClear,     setConfirmClear]      = useState(false);

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

  const aiToggles = [
    { label: "Real-time adaptation",       desc: "Allow AI to modify the interface during sessions",    on: realtimeAdapt,    set: setRealtimeAdapt    },
    { label: "Behavioral signal collection", desc: "Track clicks, scrolls, and typing patterns",         on: behaviorTracking, set: setBehaviorTracking  },
    { label: "Cross-session memory",        desc: "Remember preferences and patterns across sessions",   on: crossSession,     set: setCrossSession      },
  ];

  const notifyToggles = [
    { label: "Adaptation toasts",    desc: "Show a toast when AI applies changes",            on: notifyToasts,  set: setNotifyToasts  },
    { label: "Weekly insight report", desc: "Receive a weekly summary of behavior patterns",  on: weeklyReport,  set: setWeeklyReport  },
  ];

  return (
    <Box padding="space.400">
      <div className={styles.pageWrapper}>
        <Stack space="space.400">

          {/* ── Header ──────────────────────────────────────── */}
          <Stack space="space.150">
            <Inline space="space.100" alignBlock="center">
              <Lozenge appearance="default" isBold>System</Lozenge>
            </Inline>
            <Heading size="xlarge">Settings</Heading>
            <Text color="color.text.subtle">
              Configure the AI engine, privacy, notifications, and platform behavior.
            </Text>
          </Stack>

          {/* ── AI Engine ───────────────────────────────────── */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconAI}><Brain size={16} /></div>
              <div className={styles.sectionHeaderText}>
                <Text weight="semibold" color="color.text">AI Engine</Text>
                <Text size="small" color="color.text.subtlest">
                  Control how AIPE learns and adapts your interface
                </Text>
              </div>
              {profile && (
                <span className={styles.confidenceBadge}>
                  {Math.round(profile.aiConfidence * 100)}% confidence
                </span>
              )}
            </div>

            {aiToggles.map(({ label, desc, on, set }) => (
              <div key={label} className={styles.settingRow}>
                <Stack space="space.050">
                  <Text weight="medium" color="color.text">{label}</Text>
                  <Text size="small" color="color.text.subtlest">{desc}</Text>
                </Stack>
                <Toggle
                  id={`toggle-${label.replace(/\s+/g, "-").toLowerCase()}`}
                  label={label}
                  isChecked={on}
                  onChange={() => set((v) => !v)}
                />
              </div>
            ))}

            <div className={styles.slidersSection}>
              {(["responseSpeed", "confidenceThreshold"] as const).map((key) => {
                const meta = {
                  responseSpeed:       { label: "Response Speed",       hint: "How quickly AI reacts to behavioral changes"      },
                  confidenceThreshold: { label: "Confidence Threshold", hint: "Minimum confidence before applying changes" },
                }[key];
                return (
                  <div key={key} className={styles.sliderRow}>
                    <div className={styles.sliderHeader}>
                      <Text weight="medium" color="color.text.subtle" size="small">{meta.label}</Text>
                      <span className={styles.sliderValue}>{aiSettings[key]}%</span>
                    </div>
                    <input
                      type="range"
                      aria-label={meta.label}
                      min={0}
                      max={100}
                      value={aiSettings[key]}
                      onChange={(e) => updateAISettings({ [key]: Number(e.target.value) })}
                      className={styles.sliderInput}
                    />
                    <span className={styles.sliderHint}>{meta.hint}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Privacy & Data ───────────────────────────────── */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconPrivacy}><Shield size={16} /></div>
              <div className={styles.sectionHeaderText}>
                <Text weight="semibold" color="color.text">Privacy &amp; Data</Text>
                <Text size="small" color="color.text.subtlest">
                  All processing is local — no data leaves your device
                </Text>
              </div>
            </div>

            <div className={styles.settingRow}>
              <Stack space="space.050">
                <Inline space="space.100" alignBlock="center">
                  <Text weight="medium" color="color.text">Local-only processing</Text>
                  <span className={styles.alwaysOnBadge}>Always on</span>
                </Inline>
                <Text size="small" color="color.text.subtlest">
                  All inference runs on-device — zero external requests
                </Text>
              </Stack>
              <Toggle
                id="toggle-local-processing"
                label="Local-only processing"
                isChecked
                onChange={() => {}}
                isDisabled
              />
            </div>

            <div className={styles.settingRow}>
              <Stack space="space.050">
                <Text weight="medium" color="color.text">Data retention period</Text>
                <Text size="small" color="color.text.subtlest">
                  How long behavioral history is stored locally
                </Text>
              </Stack>
              <select aria-label="Data retention period" defaultValue="30 days" className={styles.selectInput}>
                {["7 days", "30 days", "90 days", "Forever"].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Notifications ────────────────────────────────── */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconNotify}><Bell size={16} /></div>
              <div className={styles.sectionHeaderText}>
                <Text weight="semibold" color="color.text">Notifications</Text>
                <Text size="small" color="color.text.subtlest">
                  Control when and how AIPE notifies you
                </Text>
              </div>
            </div>

            {notifyToggles.map(({ label, desc, on, set }) => (
              <div key={label} className={styles.settingRow}>
                <Stack space="space.050">
                  <Text weight="medium" color="color.text">{label}</Text>
                  <Text size="small" color="color.text.subtlest">{desc}</Text>
                </Stack>
                <Toggle
                  id={`toggle-${label.replace(/\s+/g, "-").toLowerCase()}`}
                  label={label}
                  isChecked={on}
                  onChange={() => set((v) => !v)}
                />
              </div>
            ))}
          </div>

          {/* ── Keyboard Shortcuts ───────────────────────────── */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconKeyboard}><Keyboard size={16} /></div>
              <div className={styles.sectionHeaderText}>
                <Text weight="semibold" color="color.text">Keyboard Shortcuts</Text>
                <Text size="small" color="color.text.subtlest">
                  Global shortcuts active throughout the platform
                </Text>
              </div>
            </div>

            <div className={styles.shortcutsBody}>
              {SHORTCUTS.map((sc) => (
                <div key={sc.action} className={styles.shortcutRow}>
                  <Text size="small" color="color.text.subtle">{sc.action}</Text>
                  <div className={styles.shortcutKeys}>
                    {sc.keys.map((k, i) => (
                      <span key={i} className={styles.shortcutKeys}>
                        {i > 0 && <span className={styles.shortcutPlus}>+</span>}
                        <kbd className={styles.kbd}>{k}</kbd>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Data Management ──────────────────────────────── */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconData}><Database size={16} /></div>
              <div className={styles.sectionHeaderText}>
                <Text weight="semibold" color="color.text">Data Management</Text>
                <Text size="small" color="color.text.subtlest">
                  {adaptationHistory.length} adaptation{adaptationHistory.length !== 1 ? "s" : ""} logged
                  {" · "}
                  {recommendations.length} recommendation{recommendations.length !== 1 ? "s" : ""} pending
                </Text>
              </div>
            </div>

            <div className={styles.settingRow}>
              <Stack space="space.050">
                <Text weight="medium" color="color.text">Export profile</Text>
                <Text size="small" color="color.text.subtlest">
                  Download your full personalization profile as JSON
                </Text>
              </Stack>
              <Button
                appearance="default"
                onClick={handleExportProfile}
                iconBefore={() => exported ? <Check size={14} /> : <Download size={14} />}
              >
                {exported ? "Exported!" : "Export JSON"}
              </Button>
            </div>

            <div className={styles.settingRow}>
              <Stack space="space.050">
                <Text weight="medium" color="color.text">Reset personalization</Text>
                <Text size="small" color="color.text.subtlest">
                  Revert all AI-applied settings to factory defaults
                </Text>
              </Stack>
              <Button
                appearance="subtle"
                onClick={() => resetToDefaults()}
                iconBefore={() => <RotateCcw size={14} />}
              >
                Reset
              </Button>
            </div>

            <div className={styles.settingRow}>
              <Stack space="space.050">
                <Text weight="medium" color="color.text.danger">Clear adaptation history</Text>
                <Text size="small" color="color.text.subtlest">
                  Delete all logged adaptations — AI will start fresh
                </Text>
              </Stack>
              <Button
                appearance={confirmClear ? "danger" : "subtle"}
                onClick={handleClearData}
                iconBefore={() => <Trash2 size={14} />}
              >
                {confirmClear ? "Confirm clear" : "Clear history"}
              </Button>
            </div>
          </div>

          {/* ── About ────────────────────────────────────────── */}
          <Box backgroundColor="elevation.surface.raised" padding="space.300" borderRadius="border.radius">
            <Stack space="space.300">
              <Inline space="space.150" alignBlock="center">
                <div className={styles.iconAbout}><Zap size={16} /></div>
                <Stack space="space.025">
                  <Text weight="semibold" color="color.text">About AIPE</Text>
                  <Text size="small" color="color.text.subtlest">
                    AI Interface Personalization Engine
                  </Text>
                </Stack>
              </Inline>

              <div className={styles.statGrid}>
                {[
                  { label: "Version",         value: "0.1.0 beta" },
                  { label: "Adaptations",     value: profile?.adaptationCount ?? 0 },
                  { label: "Profile version", value: `v${profile?.version ?? 1}` },
                  { label: "AI confidence",   value: `${Math.round((profile?.aiConfidence ?? 0.5) * 100)}%` },
                ].map(({ label, value }) => (
                  <div key={label} className={styles.statCell}>
                    <div className={styles.statLabel}>{label}</div>
                    <div className={styles.statValue}>{value}</div>
                  </div>
                ))}
              </div>

              <SectionMessage appearance="information">
                <Text size="small">
                  Built on Next.js 14, React 18, Zustand, and Recharts.
                  All behavioral analysis runs client-side — no external API calls are made.
                </Text>
              </SectionMessage>
            </Stack>
          </Box>

          {/* ── Footer ───────────────────────────────────────── */}
          <div className={styles.footer}>
            <span>AIPE v0.1.0 — AI Interface Personalization Engine</span>
            <span>© 2025</span>
          </div>

        </Stack>
      </div>
    </Box>
  );
}
