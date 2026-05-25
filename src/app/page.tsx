"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Brain, Lightning, Eye, Stack, Pulse, Cursor,
  ChartBar, ArrowRight, Sparkle, ArrowUpRight,
  Check,
} from "@/components/ui/icons";

// ── Feature data ───────────────────────────────────────────────────────────────
const FEATURES = [
  {
    Icon: Brain,
    title: "Behavioral AI Engine",
    description: "Continuously analyses clicks, scrolls, keyboard cadence, and dwell time to build a precise model of how you work.",
    tag: "Core",
  },
  {
    Icon: Stack,
    title: "Adaptive Layout System",
    description: "Dynamically reconfigures navigation, density, grid structure, and sidebar width based on your cognitive state.",
    tag: "Layout",
  },
  {
    Icon: Eye,
    title: "Cognitive Load Balancing",
    description: "Detects high mental load and automatically simplifies the interface — fewer distractions, clearer hierarchy.",
    tag: "Intelligence",
  },
  {
    Icon: Lightning,
    title: "Real-time Mutation Engine",
    description: "CSS token injection and dynamic theme switching happen in under 16ms — zero flicker, zero reload.",
    tag: "Performance",
  },
  {
    Icon: Pulse,
    title: "Emotional State Adaptation",
    description: "Session length and interaction velocity are correlated to adapt the interface to your emotional context.",
    tag: "Emotional UX",
  },
  {
    Icon: Cursor,
    title: "Interaction Pattern Memory",
    description: "Remembers your preferred flows across sessions. Power users get compact density; explorers get guided paths.",
    tag: "Memory",
  },
];

const STATS = [
  { value: "<16ms", label: "Adaptation latency" },
  { value: "94%",   label: "Pattern accuracy"   },
  { value: "12+",   label: "Interface dimensions" },
  { value: "Zero",  label: "Manual config needed" },
];

const STEPS = [
  {
    n: "01",
    Icon: Pulse,
    title: "Signal Capture",
    desc: "Every interaction — click velocity, scroll depth, keyboard patterns, idle states — is captured as behavioural signals.",
  },
  {
    n: "02",
    Icon: Brain,
    title: "AI Inference",
    desc: "Signals flow into the personalization engine which infers cognitive load, emotional state, and productivity mode.",
  },
  {
    n: "03",
    Icon: Lightning,
    title: "Interface Mutation",
    desc: "When confidence exceeds threshold, the engine mutates CSS design tokens — layout, density, colours, motion, typography.",
  },
  {
    n: "04",
    Icon: ChartBar,
    title: "Memory & Evolution",
    desc: "Every adaptation is logged. The model improves confidence across sessions, building a deeply personal interface fingerprint.",
  },
];

// ── Hero image — replace src with your Higgsfield-generated image ──────────────
// Prompt suggestion for Higgsfield:
// "Futuristic minimal dashboard UI interface, clean white light theme, abstract
//  data visualization, soft blue glow accents, professional tech product screenshot,
//  cinematic render, ultra high resolution"
const HERO_IMG   = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85";

// Showcase image — replace with Higgsfield output
// Prompt: "Abstract neural network nodes connecting, soft blue light on white background,
//  minimal elegant depth of field, product art direction"
const SHOWCASE_IMG = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=85";

// Feature visual — replace with Higgsfield output
// Prompt: "Person working on laptop, minimal bright workspace, soft natural light,
//  productivity focus, wide shot, editorial photography style"
const WORK_IMG   = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85";

// ── Component ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav
        className={cn(
          "fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 h-16",
          "transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-lg border-b border-slate-100 shadow-sm"
            : "bg-transparent"
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-quantum-400 flex items-center justify-center shadow-quantum-sm">
            <span className="text-white font-display font-bold text-base leading-none">Ω</span>
          </div>
          <span className="font-display font-bold text-[15px] tracking-tight text-slate-900">
            Omega
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-700 text-white text-[13px] font-semibold transition-all duration-150 shadow-sm"
          >
            Open Platform
            <ArrowRight size={13} weight="bold" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-quantum-400/8 border border-quantum-400/20 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-quantum-400" />
              <span className="text-[12px] font-mono font-medium text-quantum-500">
                AI-Native Interface Layer
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-[3.5rem] font-display font-bold text-slate-900 leading-[1.06] tracking-tight mb-6">
              Your interface,{" "}
              <span className="text-quantum-400">intelligently</span>
              <br />
              adapted.
            </h1>

            {/* Sub */}
            <p className="text-[16px] text-slate-500 leading-relaxed mb-8 max-w-lg">
              Omega sits above your digital products as an AI operating layer —
              continuously learning your behaviour and reshaping the interface
              in real time to match exactly how you work.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-quantum-400 hover:bg-quantum-500 text-white text-[14px] font-semibold transition-all duration-150 shadow-quantum-sm hover:shadow-quantum"
              >
                <Brain size={15} weight="fill" />
                Enter Platform
                <ArrowRight size={13} weight="bold" />
              </Link>
              <Link
                href="/personalize"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-700 text-[14px] font-medium transition-all duration-150 hover:bg-slate-50"
              >
                <Stack size={14} weight="regular" />
                View Personalization
              </Link>
            </div>

            {/* Inline proof */}
            <div className="flex items-center gap-6">
              {[
                { v: "<16ms", l: "latency"  },
                { v: "94%",   l: "accuracy" },
                { v: "Zero",  l: "config"   },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-[22px] font-display font-bold text-slate-900 leading-none">{s.v}</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product screenshot */}
          {/* ↓ Replace the Image src with your Higgsfield-generated hero visual */}
          <div className="relative">
            {/* Browser mockup frame */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-300/40">
              {/* Chrome bar */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
                <div className="ml-4 flex-1 h-5 bg-slate-200/70 rounded text-[10px] text-slate-400 font-mono px-2 flex items-center">
                  omega.app/dashboard
                </div>
              </div>
              {/* Screenshot */}
              <Image
                src={HERO_IMG}
                alt="Omega dashboard — AI interface adapting in real time"
                width={1200}
                height={750}
                className="w-full object-cover"
                priority
              />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-lg">
              <span className="live-dot" />
              <span className="text-[11px] font-mono text-slate-600">
                Adapting interface…
              </span>
            </div>

            {/* Confidence badge */}
            <div className="absolute -top-4 -right-4 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-quantum-400 shadow-quantum-sm text-white">
              <Brain size={12} weight="fill" />
              <span className="text-[11px] font-mono font-semibold">92% confidence</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────── */}
      <section className="py-12 border-y border-slate-100 bg-slate-50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-slate-200">
          {STATS.map((s) => (
            <div key={s.value} className="px-8 text-center">
              <div className="text-3xl font-display font-bold text-slate-900 mb-1 tabular-nums">
                {s.value}
              </div>
              <div className="text-[11px] font-mono text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Showcase image ──────────────────────────────────────────── */}
      {/* ↓ Replace Image src with Higgsfield-generated abstract AI visual */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-[11px] font-mono font-semibold tracking-widest uppercase text-quantum-400 mb-4 block">
              How it adapts
            </span>
            <h2 className="text-[2rem] font-display font-bold text-slate-900 leading-tight mb-5">
              The engine that never stops learning
            </h2>
            <p className="text-slate-500 text-[15px] leading-relaxed mb-6">
              Every click, scroll, and pause is a signal. Omega's personalization engine
              processes these signals continuously, updating your interface profile as your
              context shifts — between deep focus, collaborative review, and creative exploration.
            </p>
            <ul className="space-y-3">
              {[
                "Detects cognitive load from interaction velocity",
                "Adjusts layout density without page reloads",
                "Remembers preferences across sessions",
                "Zero manual configuration required",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] text-slate-600">
                  <Check size={16} weight="bold" className="text-quantum-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 mt-8 text-[13px] font-semibold text-quantum-400 hover:text-quantum-500 transition-colors"
            >
              See it live <ArrowUpRight size={14} weight="bold" />
            </Link>
          </div>

          <div className="order-1 lg:order-2">
            <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
              <Image
                src={SHOWCASE_IMG}
                alt="Omega AI neural adaptation — abstract visualization"
                width={1200}
                height={900}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features grid ───────────────────────────────────────────── */}
      <section className="py-24 px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] font-mono font-semibold tracking-widest uppercase text-quantum-400 mb-4 block">
              Capabilities
            </span>
            <h2 className="text-[2rem] font-display font-bold text-slate-900 mb-4">
              Every dimension, adapted by AI
            </h2>
            <p className="text-slate-400 text-[15px] max-w-xl mx-auto">
              From micro-interactions to macro-layout — Omega operates across every
              layer of your interface stack simultaneously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={cn(
                  "bg-white rounded-xl p-6 border border-slate-100",
                  "hover:border-slate-200 hover:shadow-md hover:shadow-slate-100",
                  "transition-all duration-200 group"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-quantum-400/8 border border-quantum-400/16 flex items-center justify-center">
                    <f.Icon size={16} weight="duotone" className="text-quantum-400" />
                  </div>
                  <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-[13px] font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-[12px] text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — steps */}
          <div>
            <span className="text-[11px] font-mono font-semibold tracking-widest uppercase text-quantum-400 mb-4 block">
              Architecture
            </span>
            <h2 className="text-[2rem] font-display font-bold text-slate-900 mb-8 leading-tight">
              How Omega works
            </h2>
            <div className="space-y-6">
              {STEPS.map((step, i) => (
                <div key={step.n} className="flex items-start gap-4">
                  {/* Step number + connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-quantum-400/10 border border-quantum-400/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-mono font-bold text-quantum-400">
                        {step.n}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-px flex-1 bg-slate-100 mt-2 min-h-[1.5rem]" />
                    )}
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <step.Icon size={14} weight="bold" className="text-quantum-400" />
                      <h3 className="text-[13px] font-semibold text-slate-900">{step.title}</h3>
                    </div>
                    <p className="text-[12px] text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — editorial image */}
          {/* ↓ Replace with Higgsfield-generated workspace / product image */}
          <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
            <Image
              src={WORK_IMG}
              alt="Omega in use — adaptive interface for focused work"
              width={1200}
              height={1200}
              className="w-full object-cover aspect-square"
            />
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-8 bg-slate-900">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-quantum-400 flex items-center justify-center mx-auto mb-6 shadow-quantum">
            <span className="text-white font-display font-bold text-2xl leading-none">Ω</span>
          </div>
          <h2 className="text-[2rem] font-display font-bold text-white mb-4 leading-tight">
            Ready to let AI own your interface?
          </h2>
          <p className="text-slate-400 text-[15px] mb-8 leading-relaxed">
            Open Omega and let it spend the first few minutes learning your patterns.
            Most users see their first adaptation within 90 seconds.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-quantum-400 hover:bg-quantum-300 text-white text-[14px] font-semibold transition-all duration-150 shadow-quantum-sm hover:shadow-quantum"
          >
            <Sparkle size={15} weight="fill" />
            Start Adapting
            <ArrowRight size={13} weight="bold" />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 px-8 py-6 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-quantum-400 flex items-center justify-center">
            <span className="text-white font-display font-bold text-[10px] leading-none">Ω</span>
          </div>
          <span className="text-[12px] font-mono text-slate-400">
            Omega · AI Interface Personalization Engine · v0.1.0
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-300">
          Built for the future of software interfaces
        </span>
      </footer>
    </div>
  );
}
