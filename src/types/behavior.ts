import type { EmotionalState, CognitiveLoad, ProductivityMode } from "./personalization";

export interface SessionMetrics {
  sessionId: string;
  userId: string;
  startedAt: Date;
  duration: number;
  pageViews: number;
  interactions: number;
  errorsEncountered: number;
  featuresUsed: string[];
  averageSessionDepth: number;
}

export interface InteractionPattern {
  id: string;
  pattern:
    | "rapid-clicking"
    | "slow-reading"
    | "keyboard-power"
    | "mouse-heavy"
    | "touch-gesture"
    | "command-palette"
    | "deep-scrolling"
    | "tab-hopping";
  frequency: number;
  confidence: number;
  lastSeen: Date;
}

export interface AttentionHeatmap {
  sessionId: string;
  elements: Array<{
    selector: string;
    label: string;
    dwellTime: number;
    clickCount: number;
    hoverCount: number;
    viewportPercentage: number;
    importance: number;
  }>;
  capturedAt: Date;
}

export interface CognitiveLoadSignal {
  timestamp: Date;
  level: CognitiveLoad;
  signals: {
    errorRate: number;
    backtrackingRate: number;
    pauseDuration: number;
    scrollVelocity: number;
    clickAccuracy: number;
    typingSpeed: number;
  };
  confidence: number;
}

export interface EmotionalSignal {
  timestamp: Date;
  state: EmotionalState;
  signals: {
    interactionVelocity: number;
    dwellPatterns: "shallow" | "deep";
    navigationPattern: "linear" | "exploratory" | "bouncing";
    timeOfDay: number;
    sessionDuration: number;
    errorFrustrationScore: number;
  };
  confidence: number;
}

export interface ProductivitySignal {
  timestamp: Date;
  mode: ProductivityMode;
  signals: {
    featureUsagePattern: string[];
    workflowCompletionRate: number;
    shortcutUsage: number;
    multiTaskingScore: number;
    focusScore: number;
  };
  confidence: number;
}

export interface BehaviorProfile {
  userId: string;
  updatedAt: Date;
  patterns: InteractionPattern[];
  recentSessions: SessionMetrics[];
  attentionHeatmap: AttentionHeatmap | null;
  currentCognitiveLoad: CognitiveLoadSignal;
  currentEmotionalState: EmotionalSignal;
  currentProductivityMode: ProductivitySignal;
  preferredInteractionStyle: "keyboard" | "mouse" | "touch" | "mixed";
  powerUserScore: number;
  adaptabilityScore: number;
  consistencyScore: number;
  peakPerformanceHours: number[];
  featureAdoptionRate: number;
}

export interface BehaviorEvent {
  id: string;
  sessionId: string;
  userId: string;
  type: EventType;
  timestamp: Date;
  payload: EventPayload;
  processed: boolean;
}

export type EventType =
  | "page_view"
  | "click"
  | "scroll"
  | "hover_start"
  | "hover_end"
  | "focus"
  | "blur"
  | "keypress"
  | "shortcut"
  | "error"
  | "success"
  | "navigation"
  | "search"
  | "feature_use"
  | "idle_start"
  | "idle_end"
  | "drag"
  | "resize";

export interface EventPayload {
  element?: string;
  elementType?: string;
  path?: string;
  duration?: number;
  velocity?: number;
  coordinates?: { x: number; y: number };
  key?: string;
  value?: string;
  metadata?: Record<string, unknown>;
}
