import type {
  PersonalizationProfile,
  BehaviorSignal,
  AIRecommendation,
  AdaptationDelta,
  ColorPalette,
  LayoutConfig,
  MotionConfig,
  TypographyConfig,
  CognitiveLoad,
  EmotionalState,
  ProductivityMode,
} from "@/types/personalization";
import type { BehaviorProfile } from "@/types/behavior";
import { v4 as uuidv4 } from "uuid";

// ─── Preset Palettes ────────────────────────────────────────────────────────

const COLOR_PRESETS: Record<string, ColorPalette> = {
  "quantum-dark": {
    primary: "#0EA5E9",
    secondary: "#8B5CF6",
    accent: "#10B981",
    background: "#050508",
    surface: "rgba(255,255,255,0.04)",
    text: "#F8FAFC",
    textMuted: "rgba(248,250,252,0.5)",
    border: "rgba(255,255,255,0.08)",
    success: "#10B981",
    warning: "#F97316",
    error: "#EF4444",
  },
  "neural-focus": {
    primary: "#8B5CF6",
    secondary: "#0EA5E9",
    accent: "#F97316",
    background: "#07070F",
    surface: "rgba(139,92,246,0.06)",
    text: "#F8FAFC",
    textMuted: "rgba(248,250,252,0.45)",
    border: "rgba(139,92,246,0.15)",
    success: "#10B981",
    warning: "#FBBF24",
    error: "#F87171",
  },
  "synapse-green": {
    primary: "#10B981",
    secondary: "#0EA5E9",
    accent: "#8B5CF6",
    background: "#050A07",
    surface: "rgba(16,185,129,0.05)",
    text: "#ECFDF5",
    textMuted: "rgba(236,253,245,0.45)",
    border: "rgba(16,185,129,0.12)",
    success: "#34D399",
    warning: "#FBBF24",
    error: "#F87171",
  },
  "minimal-light": {
    primary: "#0F172A",
    secondary: "#475569",
    accent: "#0EA5E9",
    background: "#F8FAFC",
    surface: "rgba(0,0,0,0.03)",
    text: "#0F172A",
    textMuted: "rgba(15,23,42,0.5)",
    border: "rgba(0,0,0,0.08)",
    success: "#059669",
    warning: "#D97706",
    error: "#DC2626",
  },
};

// ─── Core Engine ─────────────────────────────────────────────────────────────

export class PersonalizationEngine {
  private static readonly ADAPTATION_THRESHOLD = 0.65;
  private static readonly CONFIDENCE_DECAY = 0.95;
  private static readonly MAX_RECOMMENDATIONS = 5;

  /**
   * Analyzes behavior signals and generates a personalized profile.
   * This is the core inference pipeline.
   */
  static async adaptProfile(
    currentProfile: PersonalizationProfile,
    behaviorProfile: BehaviorProfile,
    signals: BehaviorSignal[]
  ): Promise<{
    profile: PersonalizationProfile;
    deltas: AdaptationDelta[];
    recommendations: AIRecommendation[];
  }> {
    const deltas: AdaptationDelta[] = [];
    const updatedProfile = structuredClone(currentProfile);

    // ── Phase 1: Infer cognitive and emotional state ──────────────────────
    const cognitiveLoad = this.inferCognitiveLoad(signals, behaviorProfile);
    const emotionalState = this.inferEmotionalState(signals, behaviorProfile);
    const productivityMode = this.inferProductivityMode(signals, behaviorProfile);

    if (cognitiveLoad !== currentProfile.cognitiveLoad) {
      deltas.push({
        field: "cognitiveLoad",
        previousValue: currentProfile.cognitiveLoad,
        newValue: cognitiveLoad,
        reason: this.explainCognitiveAdaptation(cognitiveLoad, signals),
        confidence: 0.78,
        appliedAt: new Date(),
      });
      updatedProfile.cognitiveLoad = cognitiveLoad;
    }

    if (emotionalState !== currentProfile.emotionalState) {
      deltas.push({
        field: "emotionalState",
        previousValue: currentProfile.emotionalState,
        newValue: emotionalState,
        reason: `Interaction patterns indicate ${emotionalState} state`,
        confidence: 0.72,
        appliedAt: new Date(),
      });
      updatedProfile.emotionalState = emotionalState;
    }

    updatedProfile.productivityMode = productivityMode;

    // ── Phase 2: Adapt layout based on state ─────────────────────────────
    const adaptedLayout = this.adaptLayout(
      currentProfile.layout,
      cognitiveLoad,
      emotionalState,
      behaviorProfile
    );
    if (JSON.stringify(adaptedLayout) !== JSON.stringify(currentProfile.layout)) {
      deltas.push({
        field: "layout",
        previousValue: currentProfile.layout.density,
        newValue: adaptedLayout.density,
        reason: this.explainLayoutAdaptation(adaptedLayout, cognitiveLoad),
        confidence: 0.81,
        appliedAt: new Date(),
      });
      updatedProfile.layout = adaptedLayout;
    }

    // ── Phase 3: Adapt motion based on state ─────────────────────────────
    const adaptedMotion = this.adaptMotion(
      currentProfile.motion,
      cognitiveLoad,
      behaviorProfile
    );
    if (
      adaptedMotion.preference !== currentProfile.motion.preference ||
      adaptedMotion.transitionDuration !== currentProfile.motion.transitionDuration
    ) {
      deltas.push({
        field: "motion",
        previousValue: currentProfile.motion.preference,
        newValue: adaptedMotion.preference,
        reason: `Cognitive load level ${cognitiveLoad} warrants motion adjustment`,
        confidence: 0.75,
        appliedAt: new Date(),
      });
      updatedProfile.motion = adaptedMotion;
    }

    // ── Phase 4: Adapt typography for readability ─────────────────────────
    const adaptedTypography = this.adaptTypography(
      currentProfile.typography,
      cognitiveLoad,
      emotionalState
    );
    if (adaptedTypography.scale !== currentProfile.typography.scale) {
      deltas.push({
        field: "typography.scale",
        previousValue: currentProfile.typography.scale,
        newValue: adaptedTypography.scale,
        reason: "Readability optimization based on current session patterns",
        confidence: 0.69,
        appliedAt: new Date(),
      });
      updatedProfile.typography = adaptedTypography;
    }

    // ── Phase 5: Generate AI recommendations ─────────────────────────────
    const recommendations = this.generateRecommendations(
      updatedProfile,
      behaviorProfile,
      deltas
    );

    // ── Phase 6: Update metadata ──────────────────────────────────────────
    updatedProfile.updatedAt = new Date();
    updatedProfile.lastAdaptedAt = new Date();
    updatedProfile.adaptationCount += deltas.length;
    updatedProfile.aiConfidence = this.calculateOverallConfidence(deltas);
    updatedProfile.version += 1;

    return { profile: updatedProfile, deltas, recommendations };
  }

  // ─── Inference: Cognitive Load ──────────────────────────────────────────

  private static inferCognitiveLoad(
    signals: BehaviorSignal[],
    behavior: BehaviorProfile
  ): CognitiveLoad {
    const recentSignals = signals.slice(-50);

    const errorSignals = recentSignals.filter((s) => s.type === "error").length;
    const idleSignals = recentSignals.filter((s) => s.type === "idle").length;
    const rapidClicks = recentSignals.filter(
      (s) => s.type === "click" && (s.duration ?? 0) < 200
    ).length;

    const errorScore = Math.min(errorSignals / 5, 1);
    const idleScore = Math.min(idleSignals / 10, 1);
    const rapidScore = Math.min(rapidClicks / 20, 1);

    const loadScore = errorScore * 0.4 + idleScore * 0.3 + rapidScore * 0.3;

    if (loadScore > 0.6) return "high";
    if (loadScore > 0.3) return "medium";
    return "low";
  }

  // ─── Inference: Emotional State ─────────────────────────────────────────

  private static inferEmotionalState(
    signals: BehaviorSignal[],
    behavior: BehaviorProfile
  ): EmotionalState {
    const recentSignals = signals.slice(-30);
    const hour = new Date().getHours();

    const scrollSignals = recentSignals.filter((s) => s.type === "scroll");
    const avgScrollDuration =
      scrollSignals.reduce((acc, s) => acc + (s.duration ?? 0), 0) /
      Math.max(scrollSignals.length, 1);

    const keyboardSignals = recentSignals.filter((s) => s.type === "keyboard");
    const isKeyboardHeavy = keyboardSignals.length > recentSignals.length * 0.3;
    const isLongSession =
      behavior.recentSessions[0]?.duration > 60 * 60 * 1000; // > 1hr

    if (isKeyboardHeavy && !isLongSession) return "focused";
    if (isLongSession && hour > 16) return "fatigued";
    if (avgScrollDuration > 2000) return "exploratory";
    if (hour >= 9 && hour <= 11) return "energized";

    return "neutral";
  }

  // ─── Inference: Productivity Mode ──────────────────────────────────────

  private static inferProductivityMode(
    signals: BehaviorSignal[],
    behavior: BehaviorProfile
  ): ProductivityMode {
    const features = behavior.currentProductivityMode.signals.featureUsagePattern;

    if (features.includes("command-palette") || features.includes("keyboard-shortcut")) {
      return "deep-work";
    }
    if (features.includes("dashboard") || features.includes("analytics")) {
      return "review";
    }
    if (features.includes("editor") || features.includes("canvas")) {
      return "creative";
    }
    if (features.includes("messages") || features.includes("notifications")) {
      return "communication";
    }
    return "default";
  }

  // ─── Adaptation: Layout ─────────────────────────────────────────────────

  private static adaptLayout(
    layout: LayoutConfig,
    cognitiveLoad: CognitiveLoad,
    emotionalState: EmotionalState,
    behavior: BehaviorProfile
  ): LayoutConfig {
    const adapted = { ...layout };

    if (cognitiveLoad === "high") {
      adapted.density = "spacious";
      adapted.compactCards = false;
      adapted.sidebarWidth = 280;
    } else if (
      emotionalState === "focused" ||
      behavior.powerUserScore > 0.7
    ) {
      adapted.density = "compact";
      adapted.compactCards = true;
      adapted.sidebarWidth = 220;
    } else {
      adapted.density = "comfortable";
      adapted.compactCards = false;
      adapted.sidebarWidth = 260;
    }

    if (emotionalState === "fatigued") {
      adapted.navigationStyle = "minimal";
      adapted.showBreadcrumbs = false;
    }

    return adapted;
  }

  // ─── Adaptation: Motion ─────────────────────────────────────────────────

  private static adaptMotion(
    motion: MotionConfig,
    cognitiveLoad: CognitiveLoad,
    behavior: BehaviorProfile
  ): MotionConfig {
    const adapted = { ...motion };

    if (cognitiveLoad === "high" || behavior.adaptabilityScore < 0.3) {
      adapted.preference = "reduced";
      adapted.transitionDuration = 150;
      adapted.backgroundParticles = false;
    } else if (cognitiveLoad === "low" && behavior.powerUserScore > 0.6) {
      adapted.preference = "full";
      adapted.transitionDuration = 300;
      adapted.backgroundParticles = true;
    }

    return adapted;
  }

  // ─── Adaptation: Typography ─────────────────────────────────────────────

  private static adaptTypography(
    typography: TypographyConfig,
    cognitiveLoad: CognitiveLoad,
    emotionalState: EmotionalState
  ): TypographyConfig {
    const adapted = { ...typography };

    if (cognitiveLoad === "high" || emotionalState === "fatigued") {
      adapted.scale = "lg";
      adapted.lineHeight = 1.75;
      adapted.letterSpacing = 0.02;
    } else if (emotionalState === "focused") {
      adapted.scale = "sm";
      adapted.lineHeight = 1.5;
      adapted.letterSpacing = 0;
    } else {
      adapted.scale = "md";
      adapted.lineHeight = 1.6;
      adapted.letterSpacing = 0.01;
    }

    return adapted;
  }

  // ─── Recommendations ────────────────────────────────────────────────────

  private static generateRecommendations(
    profile: PersonalizationProfile,
    behavior: BehaviorProfile,
    deltas: AdaptationDelta[]
  ): AIRecommendation[] {
    const recs: AIRecommendation[] = [];

    if (behavior.powerUserScore > 0.75 && profile.layout.density !== "compact") {
      recs.push({
        id: uuidv4(),
        type: "density",
        title: "Compact density detected",
        description:
          "Your interaction patterns suggest you'd benefit from compact density — more information visible without scrolling.",
        confidence: 0.84,
        impact: "high",
        applied: false,
        dismissed: false,
        createdAt: new Date(),
      });
    }

    if (
      behavior.currentEmotionalState.state === "fatigued" &&
      profile.motion.preference === "full"
    ) {
      recs.push({
        id: uuidv4(),
        type: "motion",
        title: "Reduce visual noise",
        description:
          "After extended sessions, reducing animations can lower cognitive fatigue by 23%.",
        confidence: 0.78,
        impact: "medium",
        applied: false,
        dismissed: false,
        createdAt: new Date(),
      });
    }

    if (behavior.preferredInteractionStyle === "keyboard") {
      recs.push({
        id: uuidv4(),
        type: "navigation",
        title: "Keyboard-first navigation",
        description:
          "Enable enhanced keyboard navigation with chord sequences for your most-used flows.",
        confidence: 0.91,
        impact: "high",
        applied: false,
        dismissed: false,
        createdAt: new Date(),
      });
    }

    return recs.slice(0, this.MAX_RECOMMENDATIONS);
  }

  // ─── Utilities ──────────────────────────────────────────────────────────

  private static calculateOverallConfidence(deltas: AdaptationDelta[]): number {
    if (deltas.length === 0) return 1;
    return (
      deltas.reduce((acc, d) => acc + d.confidence, 0) / deltas.length
    );
  }

  private static explainCognitiveAdaptation(
    load: CognitiveLoad,
    signals: BehaviorSignal[]
  ): string {
    const errorCount = signals.filter((s) => s.type === "error").length;
    if (load === "high")
      return `${errorCount} error events detected — interface simplified to reduce load`;
    if (load === "low") return "Clean session detected — interface optimized for density";
    return "Moderate interaction patterns — balanced interface applied";
  }

  private static explainLayoutAdaptation(
    layout: LayoutConfig,
    load: CognitiveLoad
  ): string {
    const density = layout.density;
    return `${density} density applied based on ${load} cognitive load inference`;
  }

  // ─── Profile Factory ────────────────────────────────────────────────────

  static createDefaultProfile(userId: string): PersonalizationProfile {
    const palette = COLOR_PRESETS["quantum-dark"];
    return {
      id: uuidv4(),
      userId,
      name: "Default Profile",
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      colors: palette,
      typography: {
        scale: "md",
        displayFont: "Syne",
        bodyFont: "DM Sans",
        monoFont: "JetBrains Mono",
        lineHeight: 1.6,
        letterSpacing: 0.01,
        fontWeight: { display: 700, heading: 600, body: 400, caption: 400 },
      },
      layout: {
        density: "comfortable",
        sidebarWidth: 260,
        contentMaxWidth: 1280,
        gridColumns: 12,
        cardRadius: 12,
        spacing: 16,
        navigationStyle: "sidebar",
        stickyHeaders: true,
        compactCards: false,
        showBreadcrumbs: true,
      },
      motion: {
        preference: "full",
        springStiffness: 300,
        springDamping: 30,
        transitionDuration: 280,
        pageTransition: "fade",
        hoverEffects: true,
        loadingAnimations: true,
        backgroundParticles: true,
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        focusRing: "glow",
        screenReaderOptimized: false,
        keyboardNavigation: "enhanced",
        colorBlindMode: "none",
        captions: false,
      },
      cognitiveLoad: "low",
      emotionalState: "neutral",
      productivityMode: "default",
      aiConfidence: 0.5,
      lastAdaptedAt: new Date(),
      adaptationCount: 0,
    };
  }

  static getPresetPalettes() {
    return COLOR_PRESETS;
  }
}
