import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Inter — primary UI font (screen-optimised, industry standard)
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Syne — display/hero headings only
        display: ["var(--font-syne)", "sans-serif"],
        // JetBrains Mono — code, metrics, labels, chart axes
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        // ── 60% Foundation — Ink (dark navy-black backgrounds) ──────────
        void: {
          DEFAULT: "#080913",
          50: "#0C0E1A",
          100: "#101322",
          200: "#15192D",
          300: "#1B2038",
          400: "#212844",
          500: "#283050",
          600: "#30385C",
        },
        // ── 10% Accent — Quantum (professional blue, primary action) ────
        quantum: {
          DEFAULT: "#4F80FF",
          50: "#EEF3FF",
          100: "#DCE7FF",
          200: "#BACFFF",
          300: "#88AEFF",
          400: "#4F80FF",
          500: "#2B5EF0",
          600: "#1A45D4",
        },
        // ── 10% Accent — Neural (AI/violet secondary, used for AI features) ─
        neural: {
          DEFAULT: "#9B73F8",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
        },
        // ── Semantic — Synapse (success / emerald) ───────────────────────
        synapse: {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
        // ── Semantic — Plasma (warning / amber) ──────────────────────────
        plasma: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        // ── Semantic — Crimson (error / rose) ────────────────────────────
        crimson: {
          DEFAULT: "#F43F5E",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
        },
        // ── 30% Structure — White/alpha surfaces and borders ─────────────
        surface: {
          1: "rgba(255,255,255,0.03)",
          2: "rgba(255,255,255,0.055)",
          3: "rgba(255,255,255,0.09)",
          4: "rgba(255,255,255,0.13)",
        },
        border: {
          1: "rgba(255,255,255,0.05)",
          2: "rgba(255,255,255,0.09)",
          3: "rgba(255,255,255,0.15)",
        },
      },
      // ── 8pt Spacing System ──────────────────────────────────────────────
      spacing: {
        // Core 8pt values (8, 16, 24, 32, 40, 48, 56, 64, 80, 96)
        // Tailwind's default already covers: 2(8), 4(16), 6(24), 8(32), 10(40), 12(48), 14(56), 16(64)
        // Additional named aliases for clarity:
        "4.5": "1.125rem", // 18px — occasional half-step
        "18": "4.5rem",    // 72px
        "22": "5.5rem",    // 88px
        "26": "6.5rem",    // 104px
      },
      backgroundImage: {
        "quantum-glow":
          "radial-gradient(ellipse at 50% 0%, rgba(79,128,255,0.12) 0%, transparent 60%)",
        "neural-glow":
          "radial-gradient(ellipse at 80% 50%, rgba(167,139,250,0.10) 0%, transparent 50%)",
        "synapse-glow":
          "radial-gradient(ellipse at 20% 80%, rgba(52,211,153,0.08) 0%, transparent 50%)",
        "mesh-gradient":
          "radial-gradient(at 40% 20%, rgba(79,128,255,0.06) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(167,139,250,0.06) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(52,211,153,0.04) 0px, transparent 50%)",
        "card-shimmer":
          "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)",
      },
      boxShadow: {
        // Elevation shadows (0 layers, clean)
        "card-sm": "0 1px 2px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
        "card-md": "0 2px 4px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-lg": "0 4px 8px rgba(0,0,0,0.6), 0 16px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)",
        // Kept for backward compat
        "card-elevated": "0 1px 2px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-float": "0 4px 8px rgba(0,0,0,0.6), 0 16px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)",
        // Accent glows
        "quantum-sm": "0 0 16px rgba(79,128,255,0.20)",
        "quantum":    "0 0 32px rgba(79,128,255,0.25)",
        "quantum-lg": "0 0 64px rgba(79,128,255,0.30)",
        "neural-sm":  "0 0 16px rgba(167,139,250,0.20)",
        "neural":     "0 0 32px rgba(167,139,250,0.25)",
        "synapse-sm": "0 0 16px rgba(52,211,153,0.18)",
        "synapse":    "0 0 32px rgba(52,211,153,0.22)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "fade-in":        "fadeIn 0.35s ease forwards",
        "fade-up":        "fadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in":       "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right": "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-left":  "slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse":          "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-slow":     "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer":        "shimmer 2.5s linear infinite",
        "neural-pulse":   "neuralPulse 2s ease-in-out infinite",
        "float":          "float 6s ease-in-out infinite",
        "scan-line":      "scanLine 3s linear infinite",
      },
      keyframes: {
        fadeIn:       { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeUp:       { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        scaleIn:      { "0%": { opacity: "0", transform: "scale(0.94)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        slideInRight: { "0%": { opacity: "0", transform: "translateX(28px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        slideInLeft:  { "0%": { opacity: "0", transform: "translateX(-28px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        shimmer:      { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        neuralPulse:  { "0%, 100%": { opacity: "0.4", transform: "scale(1)" }, "50%": { opacity: "1", transform: "scale(1.04)" } },
        float:        { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
        scanLine:     { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(400%)" } },
      },
      transitionTimingFunction: {
        spring:       "cubic-bezier(0.16, 1, 0.3, 1)",
        "spring-hard": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        expo:         "cubic-bezier(0.87, 0, 0.13, 1)",
        "expo-out":   "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
