import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import type {
  PersonalizationProfile,
  AIRecommendation,
  AdaptationDelta,
  BehaviorSignal,
} from "@/types/personalization";
import { PersonalizationEngine } from "@/lib/ai/personalization-engine";

interface PersonalizationState {
  // Profile
  profile: PersonalizationProfile | null;
  isLoading: boolean;
  isAdapting: boolean;
  lastError: string | null;

  // Recommendations
  recommendations: AIRecommendation[];
  dismissedRecommendations: string[];

  // History
  adaptationHistory: AdaptationDelta[];
  signalQueue: BehaviorSignal[];

  // UI State
  isPanelOpen: boolean;
  activeSection:
    | "overview"
    | "colors"
    | "layout"
    | "typography"
    | "motion"
    | "ai"
    | null;
  previewMode: boolean;
  previewProfile: PersonalizationProfile | null;

  // Actions
  initProfile: (userId: string) => void;
  updateProfile: (
    updates: Partial<PersonalizationProfile>
  ) => void;
  adaptProfile: () => Promise<void>;
  pushSignal: (signal: BehaviorSignal) => void;
  applyRecommendation: (id: string) => void;
  dismissRecommendation: (id: string) => void;
  setPanel: (open: boolean, section?: PersonalizationState["activeSection"]) => void;
  setPreviewMode: (enabled: boolean, profile?: PersonalizationProfile) => void;
  resetToDefaults: () => void;
}

export const usePersonalizationStore = create<PersonalizationState>()(
  subscribeWithSelector(
    persist(
      ((set, get) => ({
        profile: null,
        isLoading: false,
        isAdapting: false,
        lastError: null,
        recommendations: [],
        dismissedRecommendations: [],
        adaptationHistory: [],
        signalQueue: [],
        isPanelOpen: false,
        activeSection: null,
        previewMode: false,
        previewProfile: null,

        initProfile: (userId: string) => {
          const s = get();
          if (!s.profile) {
            set({ profile: PersonalizationEngine.createDefaultProfile(userId), isLoading: false });
          }
        },

        updateProfile: (updates) => {
          const { profile } = get();
          if (profile) {
            set({ profile: { ...profile, ...updates, updatedAt: new Date() } });
          }
        },

        adaptProfile: async () => {
          const { profile, signalQueue } = get();
          if (!profile || signalQueue.length < 5) return;

          set({ isAdapting: true });

          try {
            await new Promise((r) => setTimeout(r, 800));

            const mockBehaviorProfile = createMockBehaviorProfile(profile.userId);
            const { profile: newProfile, deltas, recommendations } =
              await PersonalizationEngine.adaptProfile(
                profile,
                mockBehaviorProfile,
                signalQueue
              );

            const { adaptationHistory, dismissedRecommendations, recommendations: existingRecs } = get();
            set({
              profile: newProfile,
              adaptationHistory: [...deltas, ...adaptationHistory].slice(0, 100),
              recommendations: [
                ...recommendations.filter((r) => !dismissedRecommendations.includes(r.id)),
                ...existingRecs,
              ].slice(0, 10),
              signalQueue: [],
              isAdapting: false,
            });
          } catch {
            set({ isAdapting: false, lastError: "Adaptation failed — retrying shortly" });
          }
        },

        pushSignal: (signal) => {
          const { signalQueue } = get();
          const updated = [...signalQueue, signal].slice(-200);
          set({ signalQueue: updated });
          if (updated.length >= 30) {
            get().adaptProfile();
          }
        },

        applyRecommendation: (id) => {
          const { recommendations, profile } = get();
          if (!profile) return;
          const rec = recommendations.find((r) => r.id === id);
          if (!rec) return;
          const updatedProfile = applyRecommendationToProfile(profile, rec);
          set({
            profile: updatedProfile,
            recommendations: recommendations.map((r) =>
              r.id === id ? { ...r, applied: true } : r
            ),
          });
        },

        dismissRecommendation: (id) => {
          const { dismissedRecommendations, recommendations } = get();
          set({
            dismissedRecommendations: [...dismissedRecommendations, id],
            recommendations: recommendations.filter((r) => r.id !== id),
          });
        },

        setPanel: (open, section = null) => {
          set({ isPanelOpen: open, activeSection: section });
        },

        setPreviewMode: (enabled, previewProfile) => {
          set({ previewMode: enabled, previewProfile: previewProfile ?? null });
        },

        resetToDefaults: () => {
          const { profile } = get();
          if (profile) {
            const defaults = PersonalizationEngine.createDefaultProfile(profile.userId);
            set({ profile: defaults, adaptationHistory: [], recommendations: [] });
          }
        },
      })),
      {
        name: "aipe-personalization",
        partialize: (state) => ({
          profile: state.profile,
          dismissedRecommendations: state.dismissedRecommendations,
          adaptationHistory: state.adaptationHistory.slice(0, 20),
        }),
      }
    )
  )
);

// ─── Helpers ────────────────────────────────────────────────────────────────

function applyRecommendationToProfile(
  profile: PersonalizationProfile,
  rec: AIRecommendation
): PersonalizationProfile {
  const updated = structuredClone(profile);
  switch (rec.type) {
    case "density":
      updated.layout.density = "compact";
      break;
    case "motion":
      updated.motion.preference = "reduced";
      break;
    case "navigation":
      updated.accessibility.keyboardNavigation = "enhanced";
      break;
  }
  return updated;
}

function createMockBehaviorProfile(userId: string) {
  return {
    userId,
    updatedAt: new Date(),
    patterns: [],
    recentSessions: [
      {
        sessionId: "s1",
        userId,
        startedAt: new Date(Date.now() - 3600000),
        duration: 3600000,
        pageViews: 12,
        interactions: 87,
        errorsEncountered: 2,
        featuresUsed: ["dashboard", "analytics", "command-palette"],
        averageSessionDepth: 4,
      },
    ],
    attentionHeatmap: null,
    currentCognitiveLoad: {
      timestamp: new Date(),
      level: "medium" as const,
      signals: {
        errorRate: 0.02,
        backtrackingRate: 0.1,
        pauseDuration: 1200,
        scrollVelocity: 0.5,
        clickAccuracy: 0.94,
        typingSpeed: 65,
      },
      confidence: 0.78,
    },
    currentEmotionalState: {
      timestamp: new Date(),
      state: "focused" as const,
      signals: {
        interactionVelocity: 0.7,
        dwellPatterns: "deep" as const,
        navigationPattern: "linear" as const,
        timeOfDay: new Date().getHours(),
        sessionDuration: 3600000,
        errorFrustrationScore: 0.15,
      },
      confidence: 0.71,
    },
    currentProductivityMode: {
      timestamp: new Date(),
      mode: "deep-work" as const,
      signals: {
        featureUsagePattern: ["command-palette", "keyboard-shortcut"],
        workflowCompletionRate: 0.82,
        shortcutUsage: 0.65,
        multiTaskingScore: 0.3,
        focusScore: 0.85,
      },
      confidence: 0.88,
    },
    preferredInteractionStyle: "keyboard" as const,
    powerUserScore: 0.78,
    adaptabilityScore: 0.65,
    consistencyScore: 0.72,
    peakPerformanceHours: [9, 10, 14, 15],
    featureAdoptionRate: 0.61,
  };
}
