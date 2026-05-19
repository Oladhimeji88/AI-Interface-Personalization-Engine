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
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        numeric: ["var(--font-barlow)", "sans-serif"],
      },
      colors: {
        void: {
          DEFAULT: "#050508",
          50: "#0A0A12",
          100: "#0F0F1A",
          200: "#141420",
          300: "#1A1A28",
          400: "#22223A",
          500: "#2C2C4A",
        },
        quantum: {
          DEFAULT: "#0EA5E9",
          50: "#E0F4FD",
          100: "#B3E7FB",
          200: "#7DD3F8",
          300: "#38BDF8",
          400: "#0EA5E9",
          500: "#0284C7",
          600: "#0369A1",
        },
        neural: {
          DEFAULT: "#8B5CF6",
          50: "#EDE9FE",
          100: "#DDD6FE",
          200: "#C4B5FD",
          300: "#A78BFA",
          400: "#8B5CF6",
          500: "#7C3AED",
          600: "#6D28D9",
        },
        synapse: {
          DEFAULT: "#10B981",
          50: "#D1FAE5",
          100: "#A7F3D0",
          200: "#6EE7B7",
          300: "#34D399",
          400: "#10B981",
          500: "#059669",
          600: "#047857",
        },
        plasma: {
          DEFAULT: "#F97316",
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
        },
        crimson: {
          DEFAULT: "#EF4444",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
        },
        surface: {
          1: "rgba(255,255,255,0.03)",
          2: "rgba(255,255,255,0.06)",
          3: "rgba(255,255,255,0.09)",
          4: "rgba(255,255,255,0.12)",
        },
        border: {
          1: "rgba(255,255,255,0.06)",
          2: "rgba(255,255,255,0.10)",
          3: "rgba(255,255,255,0.16)",
        },
      },
      backgroundImage: {
        "quantum-glow":
          "radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.15) 0%, transparent 60%)",
        "neural-glow":
          "radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.12) 0%, transparent 50%)",
        "synapse-glow":
          "radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.10) 0%, transparent 50%)",
        "mesh-gradient":
          "radial-gradient(at 40% 20%, rgba(14,165,233,0.08) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139,92,246,0.08) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(16,185,129,0.06) 0px, transparent 50%)",
        "card-shimmer":
          "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)",
      },
      boxShadow: {
        "quantum-sm": "0 0 16px rgba(14,165,233,0.2)",
        quantum: "0 0 32px rgba(14,165,233,0.25)",
        "quantum-lg": "0 0 64px rgba(14,165,233,0.3)",
        "neural-sm": "0 0 16px rgba(139,92,246,0.2)",
        neural: "0 0 32px rgba(139,92,246,0.25)",
        "synapse-sm": "0 0 16px rgba(16,185,129,0.2)",
        synapse: "0 0 32px rgba(16,185,129,0.25)",
        "card-elevated":
          "0 1px 1px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        "card-float":
          "0 2px 4px rgba(0,0,0,0.6), 0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "fade-up": "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right":
          "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-left":
          "slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        pulse: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-slow": "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "orbit-slow": "orbit 20s linear infinite",
        "orbit-fast": "orbit 8s linear infinite",
        "neural-pulse": "neuralPulse 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
        "grid-fade": "gridFade 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(32px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-32px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        neuralPulse: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
        gridFade: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
        "spring-hard": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        expo: "cubic-bezier(0.87, 0, 0.13, 1)",
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
