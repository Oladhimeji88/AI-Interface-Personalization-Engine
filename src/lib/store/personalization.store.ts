import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
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
      immer((set, get) => ({
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
          set((state) => {
            if (!state.profile) {
              state.profile = PersonalizationEngine.createDefaultProfile(userId);
              state.isLoading = false;
            }
          });
        },

        updateProfile: (updates) => {
          set((state) => {
            if (state.profile) {
              Object.assign(state.profile, updates);
              state.profile.updatedAt = new Date();
            }
          });
        },

        adaptProfile: async () => {
          const { profile, signalQueue } = get();
          if (!profile || signalQueue.length < 5) return;

          set((state) => {
            state.isAdapting = true;
          });

          try {
            // Simulate async AI inference (replace with actual API call)
            await new Promise((r) => setTimeout(r, 800));

            const mockBehaviorProfile = createMockBehaviorProfile(
              profile.userId
            );
            const { profile: newProfile, deltas, recommendations } =
              await PersonalizationEngine.adaptProfile(
                profile,
                mockBehaviorProfile,
                signalQueue
              );

            set((state) => {
              state.profile = newProfile;
              state.adaptationHistory = [
                ...deltas,
                ...state.adaptationHistory,
              ].slice(0, 100);
              state.recommendations = [
                ...recommendations.filter(
                  (r) => !state.dismissedRecommendations.includes(r.id)
                ),
                ...state.recommendations,
              ].slice(0, 10);
              state.signalQueue = [];
              state.isAdapting = false;
            });
          } catch (err) {
            set((state) => {
              state.isAdapting = false;
              state.lastError = "Adaptation failed — retrying shortly";
            });
          }
        },

        pushSignal: (signal) => {
          set((state) => {
            state.signalQueue = [...state.signalQueue, signal].slice(-200);
          });

          // Auto-trigger adaptation when enough signals accumulate
          const { signalQueue, adaptProfile } = get();
          if (signalQueue.length >= 30) {
            adaptProfile();
          }
        },

        applyRecommendation: (id) => {
          set((state) => {
            const rec = state.recommendations.find((r) => r.id === id);
            if (rec && state.profile) {
              rec.applied = true;
              // Apply the recommendation to the profile
              applyRecommendationToProfile(state.profile, rec);
            }
          });
        },

        dismissRecommendation: (id) => {
          set((state) => {
            state.dismissedRecommendations.push(id);
            state.recommendations = state.recommendations.filter(
              (r) => r.id !== id
            );
          });
        },

        setPanel: (open, section = null) => {
          set((state) => {
            state.isPanelOpen = open;
            state.activeSection = section;
          });
        },

        setPreviewMode: (enabled, previewProfile) => {
          set((state) => {
            state.previewMode = enabled;
            state.previewProfile = previewProfile ?? null;
          });
        },

        resetToDefaults: () => {
          set((state) => {
            if (state.profile) {
              const defaults = PersonalizationEngine.createDefaultProfile(
                state.profile.userId
              );
              state.profile = defaults;
              state.adaptationHistory = [];
              state.recommendations = [];
            }
          });
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
): void {
  switch (rec.type) {
    case "density":
      profile.layout.density = "compact";
      break;
    case "motion":
      profile.motion.preference = "reduced";
      break;
    case "navigation":
      profile.accessibility.keyboardNavigation = "enhanced";
      break;
  }
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
