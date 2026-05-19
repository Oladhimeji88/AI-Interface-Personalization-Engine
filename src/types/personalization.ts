export type DensityLevel = "compact" | "comfortable" | "spacious";
export type MotionPreference = "full" | "reduced" | "none";
export type ColorMode = "dark" | "light" | "auto";
export type NavigationStyle = "sidebar" | "topbar" | "hybrid" | "minimal";
export type TypographyScale = "xs" | "sm" | "md" | "lg" | "xl";
export type CognitiveLoad = "low" | "medium" | "high";
export type EmotionalState =
  | "focused"
  | "exploratory"
  | "fatigued"
  | "energized"
  | "neutral";
export type ProductivityMode =
  | "deep-work"
  | "review"
  | "creative"
  | "communication"
  | "default";

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface TypographyConfig {
  scale: TypographyScale;
  displayFont: string;
  bodyFont: string;
  monoFont: string;
  lineHeight: number;
  letterSpacing: number;
  fontWeight: {
    display: number;
    heading: number;
    body: number;
    caption: number;
  };
}

export interface LayoutConfig {
  density: DensityLevel;
  sidebarWidth: number;
  contentMaxWidth: number;
  gridColumns: number;
  cardRadius: number;
  spacing: number;
  navigationStyle: NavigationStyle;
  stickyHeaders: boolean;
  compactCards: boolean;
  showBreadcrumbs: boolean;
}

export interface MotionConfig {
  preference: MotionPreference;
  springStiffness: number;
  springDamping: number;
  transitionDuration: number;
  pageTransition:
    | "fade"
    | "slide"
    | "scale"
    | "blur"
    | "none";
  hoverEffects: boolean;
  loadingAnimations: boolean;
  backgroundParticles: boolean;
}

export interface AccessibilityConfig {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  focusRing: "default" | "thick" | "glow";
  screenReaderOptimized: boolean;
  keyboardNavigation: "standard" | "enhanced";
  colorBlindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";
  captions: boolean;
}

export interface PersonalizationProfile {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  colors: ColorPalette;
  typography: TypographyConfig;
  layout: LayoutConfig;
  motion: MotionConfig;
  accessibility: AccessibilityConfig;
  cognitiveLoad: CognitiveLoad;
  emotionalState: EmotionalState;
  productivityMode: ProductivityMode;
  aiConfidence: number;
  lastAdaptedAt: Date;
  adaptationCount: number;
}

export interface AdaptationDelta {
  field: string;
  previousValue: unknown;
  newValue: unknown;
  reason: string;
  confidence: number;
  appliedAt: Date;
}

export interface PersonalizationSnapshot {
  profile: PersonalizationProfile;
  delta: AdaptationDelta[];
  triggerEvent: string;
  behaviorSignals: BehaviorSignal[];
}

export interface BehaviorSignal {
  type:
    | "scroll"
    | "click"
    | "hover"
    | "keyboard"
    | "idle"
    | "focus"
    | "error"
    | "success";
  timestamp: Date;
  element?: string;
  duration?: number;
  frequency?: number;
  metadata?: Record<string, unknown>;
}

export interface AIRecommendation {
  id: string;
  type: "layout" | "color" | "typography" | "motion" | "navigation" | "density";
  title: string;
  description: string;
  confidence: number;
  impact: "low" | "medium" | "high";
  preview?: string;
  applied: boolean;
  dismissed: boolean;
  createdAt: Date;
}

export interface ThemeToken {
  name: string;
  value: string;
  category: "color" | "spacing" | "typography" | "motion" | "shadow" | "radius";
  description: string;
  adaptive: boolean;
}
