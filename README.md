# AIPE — AI Interface Personalization Engine

An AI-native operating layer that dynamically reconstructs its own interface based on your behavior, cognitive load, emotional state, and productivity patterns — in real time.

---

## Overview

AIPE observes how you interact with a digital interface (click cadence, keyboard patterns, scroll depth, session duration) and continuously mutates CSS design tokens, layout density, motion preferences, and typography to match your current state. No manual configuration required.

The core idea: the interface should adapt to the user, not the other way around.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + CSS custom properties |
| State | Zustand (`persist` + `subscribeWithSelector`) |
| Animation | Framer Motion 11 |
| Charts | Recharts 2 |
| Icons | Phosphor Icons (`@phosphor-icons/react`) |
| UI Primitives | Radix UI (Dialog, Slider, Switch, Select, Tabs, Tooltip) |
| Fonts | Inter · Syne · JetBrains Mono (via `next/font/google`) |

---

## Design System

### 60 : 30 : 10 Colour Rule

| Role | Share | Colour | Usage |
|---|---|---|---|
| **Ink** (Foundation) | 60% | `void.*` `#080913` base | All backgrounds — page, sidebar, header, cards |
| **Slate** (Structure) | 30% | White/alpha surfaces · `#94A3B8` text | Borders, dividers, secondary text, surface lifts |
| **Quantum** (Accent) | 10% | `#4F80FF` blue | Buttons, links, active states, focus rings |

Additional semantic accents used sparingly:

| Name | Hex | Role |
|---|---|---|
| Neural | `#A78BFA` | AI-specific features, recommendations |
| Synapse | `#34D399` | Success, live indicators |
| Plasma | `#F59E0B` | Warnings, cognitive load charts |
| Crimson | `#F43F5E` | Errors, destructive actions |

### 8pt Spacing Grid

All spacing uses multiples of 8px: **8 · 16 · 24 · 32 · 40 · 48 · 64px**

Tailwind shorthand: `p-2` `p-4` `p-6` `p-8` `p-10` `p-12` `p-16`

### Typography

| Font | Variable | Use |
|---|---|---|
| Inter | `--font-inter` | All body and UI text (default `font-sans`) |
| Syne | `--font-syne` | Display / hero headings (`font-display`) |
| JetBrains Mono | `--font-mono` | Code, metrics, badges, chart axes |

### Icon Weights (Phosphor)

| Weight | When to use |
|---|---|
| `regular` | Default functional icons |
| `bold` | Active / selected state |
| `fill` | Status indicators, solid on/off states |
| `duotone` | Decorative, brand marks, card accents |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout — font loading, AIProvider
│   ├── globals.css                 # Design tokens, utility classes
│   └── (dashboard)/
│       ├── layout.tsx              # Dashboard shell — Sidebar, TopBar, CommandPalette
│       ├── dashboard/page.tsx      # Live metrics, charts, adaptation history
│       ├── analytics/page.tsx      # Weekly trends, behaviour radar, heatmap
│       ├── insights/page.tsx       # Behavioural pattern cards
│       ├── personalize/page.tsx    # Typography, accessibility, AI sensitivity
│       ├── editor/page.tsx         # Live token editor with split-panel preview
│       ├── settings/page.tsx       # AI engine, privacy, shortcuts, data export
│       └── themes/page.tsx         # Preset colour palettes
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx             # Collapsible nav with active state weights
│   │   └── TopBar.tsx              # Breadcrumbs, search, adapt trigger
│   └── ui/
│       ├── icons.ts                # Centralized Phosphor Icons barrel
│       ├── AIStatusBadge.tsx       # Brain/confidence indicator
│       ├── CommandPalette.tsx      # ⌘K modal with fuzzy search
│       ├── MetricCard.tsx          # Accent stat card with delta
│       └── ToastRenderer.tsx       # Auto-dismiss toast overlay
│
├── lib/
│   ├── ai/
│   │   └── personalization-engine.ts  # Core inference engine
│   ├── store/
│   │   ├── personalization.store.ts   # Profile, AI settings, adaptation history
│   │   └── ui.store.ts                # Sidebar, toasts, command palette, breadcrumbs
│   └── utils.ts
│
├── providers/
│   └── AIProvider.tsx              # Passive signal tracking, CSS variable sync
│
└── types/
    ├── personalization.ts          # Profile, recommendation, delta types
    └── behavior.ts                 # Signal, session, behaviour profile types
```

---

## How It Works

### Signal Collection

`AIProvider` attaches passive global listeners on mount:

- **Click** → records element type, target area
- **Keydown** → detects keyboard-first patterns, shortcut usage
- **Scroll** → tracks reading depth and navigation style
- **Idle timeout** → infers cognitive fatigue

Signals are pushed to `personalizationStore.signalQueue`. When the queue reaches 5 signals, `adaptProfile()` is triggered automatically.

### Inference Engine (`personalization-engine.ts`)

Given a `BehaviorProfile`, the engine:

1. **Infers state** — maps signal patterns to `CognitiveLoad`, `EmotionalState`, `ProductivityMode`
2. **Adapts tokens** — adjusts layout density, motion preference, typography scale, colour palette
3. **Generates recommendations** — confidence-scored suggestions surfaced in the dashboard
4. **Emits deltas** — a list of `AdaptationDelta` objects (field, from, to, reason, confidence)

### CSS Variable Sync (`AIProvider`)

On every profile update, `AIProvider` reads `profile.colors.*` and writes them directly to `document.documentElement` as CSS custom properties (`--color-primary`, `--color-background`, etc.). The entire app re-themes without a re-render.

### Toast Notifications

Cross-store toast calls use Zustand's `getState()` pattern from within the personalization store:

```ts
useUIStore.getState().addToast({ type: "ai", title: "Profile adapted", ... });
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npm run type-check

# Production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000).

---

## Key Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` | Open command palette |
| `⌘⇧F` | Toggle focus mode |

---

## Utility Classes (globals.css)

| Class | Description |
|---|---|
| `.card-base` | Standard card surface with 3-layer elevation shadow |
| `.btn-primary` | Quantum-blue filled button |
| `.btn-secondary` | Glass-effect button |
| `.btn-ghost` | Transparent ghost button |
| `.input-base` | Dark input with quantum focus ring |
| `.badge` | Pill label (monospace, small) |
| `.section-label` | 10px mono uppercase group header |
| `.glass` / `.glass-heavy` | Backdrop-blur surface layers |
| `.animate-in .stagger-N` | Staggered fade-up entrance (64ms steps) |
| `.live-dot` | Synapse-green pulsing indicator |

---

## AI Settings

Configurable in **Settings → AI Engine** and **Personalize → AI Engine**:

| Setting | Default | Description |
|---|---|---|
| Response Speed | 75 | How quickly the AI reacts to new signals |
| Confidence Threshold | 65 | Minimum confidence before applying an adaptation |

---

## License

Private — all rights reserved.
