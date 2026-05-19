"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Brain,
  Zap,
  Eye,
  Layers,
  ArrowRight,
  Sparkles,
  Activity,
  MousePointer2,
  BarChart3,
  ChevronRight,
  Circle,
} from "lucide-react";

// ─── Animated background particles ──────────────────────────────────────────

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; color: string; alpha: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["rgba(14,165,233", "rgba(139,92,246", "rgba(16,185,129"];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color},${p.alpha})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255,255,255,${0.03 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
}

// ─── Feature cards ────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Brain,
    title: "Behavioral AI Engine",
    description:
      "Continuously analyzes clicks, scrolls, keyboard patterns, and dwell time to build a precise model of how you work.",
    accent: "quantum",
    tag: "Core",
  },
  {
    icon: Layers,
    title: "Adaptive Layout System",
    description:
      "Dynamically reconfigures navigation, density, grid structure, and sidebar width based on your cognitive state.",
    accent: "neural",
    tag: "Layout",
  },
  {
    icon: Eye,
    title: "Cognitive Load Balancing",
    description:
      "Detects high mental load and automatically simplifies the interface — fewer distractions, clearer hierarchy.",
    accent: "synapse",
    tag: "Intelligence",
  },
  {
    icon: Zap,
    title: "Real-time Mutation Engine",
    description:
      "CSS token injection and dynamic theme switching happens in under 16ms — zero flicker, zero reload.",
    accent: "plasma",
    tag: "Performance",
  },
  {
    icon: Activity,
    title: "Emotional State Adaptation",
    description:
      "Time of day, session length, and interaction velocity are correlated to adapt the interface to your emotional context.",
    accent: "quantum",
    tag: "Emotional UX",
  },
  {
    icon: MousePointer2,
    title: "Interaction Pattern Memory",
    description:
      "Remembers your preferred flows across sessions. Power users get compact density; explorers get guided paths.",
    accent: "neural",
    tag: "Memory",
  },
];

const accentStyles = {
  quantum: {
    icon: "text-quantum-400 bg-quantum-400/10 border-quantum-400/20",
    glow: "group-hover:shadow-quantum-sm",
    badge: "bg-quantum-400/10 text-quantum-300 border-quantum-400/20",
  },
  neural: {
    icon: "text-neural-400 bg-neural-400/10 border-neural-400/20",
    glow: "group-hover:shadow-neural-sm",
    badge: "bg-neural-400/10 text-neural-300 border-neural-400/20",
  },
  synapse: {
    icon: "text-synapse-400 bg-synapse-400/10 border-synapse-400/20",
    glow: "group-hover:shadow-synapse-sm",
    badge: "bg-synapse-400/10 text-synapse-300 border-synapse-400/20",
  },
  plasma: {
    icon: "text-plasma-500 bg-plasma-500/10 border-plasma-500/20",
    glow: "group-hover:shadow-[0_0_24px_rgba(249,115,22,0.2)]",
    badge: "bg-plasma-500/10 text-plasma-400 border-plasma-500/20",
  },
} as const;

// ─── Stats ──────────────────────────────────────────────────────────────

const STATS = [
  { value: "<16ms", label: "UI adaptation latency" },
  { value: "94%", label: "Pattern detection accuracy" },
  { value: "∞", label: "Personalization dimensions" },
  { value: "0", label: "Manual configuration needed" },
];

// ─── Main component ──────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div className="min-h-screen bg-void-DEFAULT overflow-hidden">
      {/* Particle background */}
      <ParticleField />

      {/* Mouse-reactive glow */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(14,165,233,0.07) 0%, transparent 60%)`,
        }}
      />

      {/* Grid overlay */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-quantum-400 to-neural-400 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-white text-sm tracking-tight">AIPE</span>
            <span className="text-white/20 mx-2 text-xs">·</span>
            <span className="font-mono text-xs text-white/25">v0.1 beta</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg btn-primary text-sm"
          >
            Open Platform
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative z-10 pt-24 pb-20 px-8 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-neural-400/25 mb-8 animate-in stagger-1">
          <Sparkles className="w-3 h-3 text-neural-300" />
          <span className="text-xs font-mono font-medium text-neural-200">
            AI-Native Interface Layer
          </span>
          <span className="w-px h-3 bg-white/10" />
          <span className="live-dot" />
          <span className="text-xs font-mono text-synapse-400">Live</span>
        </div>

        {/* Headline */}
        <h1
          className={cn(
            "text-5xl sm:text-6xl lg:text-7xl font-display font-bold",
            "text-white leading-[1.05] tracking-tight mb-6",
            "animate-in stagger-2"
          )}
        >
          The interface that
          <br />
          <span className="text-gradient-quantum">learns you</span>
        </h1>

        {/* Sub */}
        <p
          className={cn(
            "text-lg text-white/40 max-w-2xl mx-auto leading-relaxed mb-10",
            "animate-in stagger-3"
          )}
        >
          AIPE sits above your digital products as an AI-native operating layer —
          continuously analyzing behavior, inferring cognitive state, and
          reconstructing the interface in real time to match exactly how you work.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 animate-in stagger-4">
          <Link href="/dashboard" className="btn-primary text-base px-6 py-3">
            <Brain className="w-4 h-4" />
            Enter Platform
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/personalize" className="btn-secondary text-base px-6 py-3">
            <Layers className="w-4 h-4" />
            View Personalization
          </Link>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="relative z-10 py-12 border-y border-white/[0.05] animate-in stagger-5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/[0.05]">
          {STATS.map((stat) => (
            <div key={stat.value} className="px-8 text-center">
              <div className="text-3xl font-display font-bold text-white mb-1 tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs font-mono text-white/30">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ────────────────────────────────── */}
      <section className="relative z-10 py-24 px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-in stagger-1">
          <span className="section-label mb-3 block">Capabilities</span>
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Every dimension of your interface, <br />
            <span className="text-gradient-neural">adapted by AI</span>
          </h2>
          <p className="text-white/35 text-sm max-w-xl mx-auto">
            From micro-interactions to macro-layout — AIPE operates across every
            layer of the interface stack simultaneously.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => {
            const styles = accentStyles[feature.accent as keyof typeof accentStyles];
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={cn(
                  "card-base p-5 group transition-all duration-300 animate-in",
                  styles.glow,
                  `stagger-${i + 1}`
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl border flex items-center justify-center",
                      styles.icon
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={cn("badge border", styles.badge)}>
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-sm font-display font-semibold text-white/90 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-white/35 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="relative z-10 py-24 px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label mb-3 block">Architecture</span>
          <h2 className="text-3xl font-display font-bold text-white">
            How AIPE works
          </h2>
        </div>
        <div className="space-y-3">
          {[
            {
              step: "01",
              title: "Signal Capture",
              desc: "Every interaction — click velocity, scroll depth, keyboard patterns, idle states — is captured as behavioral signals at 60hz.",
              icon: Activity,
              color: "quantum",
            },
            {
              step: "02",
              title: "AI Inference Pipeline",
              desc: "Signals flow into the personalization engine, which infers cognitive load, emotional state, productivity mode, and interaction preferences.",
              icon: Brain,
              color: "neural",
            },
            {
              step: "03",
              title: "Interface Mutation",
              desc: "When confidence exceeds threshold, the engine mutates CSS design tokens in real time — layout, density, colors, motion, typography.",
              icon: Zap,
              color: "synapse",
            },
            {
              step: "04",
              title: "Memory & Evolution",
              desc: "Every adaptation is logged. The model improves its confidence across sessions, building a deeply personal interface fingerprint.",
              icon: BarChart3,
              color: "plasma",
            },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className={cn(
                  "flex items-start gap-5 p-5 rounded-2xl",
                  "border border-white/[0.06] bg-white/[0.02]",
                  "hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200",
                  `animate-in stagger-${i + 1}`
                )}
              >
                <div className="font-display font-bold text-3xl text-white/[0.07] font-numeric w-10 flex-shrink-0 mt-0.5">
                  {step.step}
                </div>
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border",
                    step.color === "quantum" && "bg-quantum-400/10 border-quantum-400/20 text-quantum-400",
                    step.color === "neural" && "bg-neural-400/10 border-neural-400/20 text-neural-400",
                    step.color === "synapse" && "bg-synapse-400/10 border-synapse-400/20 text-synapse-400",
                    step.color === "plasma" && "bg-plasma-500/10 border-plasma-500/20 text-plasma-500"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-display font-semibold text-white/80 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-white/30 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-quantum-400/20 to-neural-400/20 border border-neural-400/20 flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-neural-300" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Ready to let AI own your interface?
          </h2>
          <p className="text-white/35 text-sm mb-8 leading-relaxed">
            Open the platform and let AIPE spend the first few minutes learning
            your patterns. Most users see their first adaptation within 90 seconds.
          </p>
          <Link href="/dashboard" className="btn-primary text-base px-8 py-3.5 mx-auto">
            <Sparkles className="w-4 h-4" />
            Start Adapting
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.05] px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-white/20" />
          <span className="text-xs font-mono text-white/20">
            AIPE · AI Interface Personalization Engine · v0.1.0
          </span>
        </div>
        <span className="text-xs font-mono text-white/15">
          Built for the future of software interfaces
        </span>
      </footer>
    </div>
  );
}
