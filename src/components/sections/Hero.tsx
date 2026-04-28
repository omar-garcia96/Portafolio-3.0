"use client";

import { useEffect, useState } from "react";
import TerminalText from "@/components/ui/TerminalText";
import { SITE_META } from "@/lib/constants";

const INFO_BLOCKS = [
  {
    key:   "[SYSTEM INFO]",
    value: `Uptime: 1+ years remote, ${SITE_META.uptime}.`,
  },
  {
    key:   "[EXPERIENCE]",
    value: "Cloud Computing · DevOps · Infra as Code.",
  },
  {
    key:   "[EDUCATION]",
    value: "Ing. Sistemas.",
  },
  {
    key:   "[SKILLS]",
    value: "AWS · Terraform · Docker · K8s · GitHub · Scripting.",
  },
];

export default function Hero() {
  const [phase, setPhase] = useState(0);

  // Stagger info blocks
  useEffect(() => {
    if (phase < INFO_BLOCKS.length) {
      const t = setTimeout(() => setPhase((p) => p + 1), phase === 0 ? 3800 : 1000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center bg-grid pt-14 pb-28 overflow-hidden"
    >
      {/* Background gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-br from-terminal-bg via-terminal-bg/90 to-[#001a0f]/80 pointer-events-none" />

      {/* Subtle green glow orb */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-terminal-green/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 w-full grid md:grid-cols-2 gap-12 items-center">

        {/* ── Left: content ─────────────────────────────── */}
        <div>
          {/* Prompt line */}
          <div className="mb-4 text-terminal-muted text-sm">
            <span className="text-terminal-dim">root@omargarcia</span>
            <span className="text-terminal-text">:</span>
            <span className="text-terminal-cyan">~</span>
            <span className="text-terminal-text">$ </span>
            <span className="text-terminal-green">./whoami.sh</span>
          </div>

          {/* Name */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-terminal-green glow-green mb-6 leading-tight">
            <TerminalText
              text="Omar Garcia"
              speed={70}
              delay={300}
              showCursor={false}
            />
            <span className="animate-blink text-terminal-green">_</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-terminal-text leading-relaxed mb-8 max-w-xl">
            {SITE_META.title}.{" "}
            <span className="text-terminal-green">{SITE_META.subtitle}</span>{" "}
            {SITE_META.description}
          </p>

          {/* Divider with icons */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-terminal-green/40 w-8" />
            <div className="flex gap-2 text-terminal-muted">
              {["⚙", "🧠", "☁", "🔒", "💻"].map((icon, i) => (
                <span key={i} className="text-sm opacity-60 hover:opacity-100 transition-opacity cursor-default">
                  {icon}
                </span>
              ))}
            </div>
            <div className="h-px bg-terminal-border flex-1" />
          </div>

          {/* Info blocks */}
          <div className="space-y-3">
            {INFO_BLOCKS.map((block, i) => (
              <div
                key={block.key}
                className={`transition-all duration-500 ${
                  i < phase
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                <span className="text-terminal-green text-xs font-bold">
                  {block.key}
                </span>
                <br />
                <span className="text-terminal-muted text-xs">{block.value}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="px-5 py-2.5 border border-terminal-green text-terminal-green text-xs font-mono tracking-widest hover:bg-terminal-green hover:text-terminal-bg transition-all duration-200 glow-border"
            >
              &gt; ./init_contact
            </a>
            <a
              href="#portfolio"
              className="px-5 py-2.5 border border-terminal-border text-terminal-muted text-xs font-mono tracking-widest hover:border-terminal-cyan hover:text-terminal-cyan transition-all duration-200"
            >
              &gt; ls ./projects
            </a>
          </div>
        </div>

        {/* ── Right: terminal window ─────────────────────── */}
        <div className="hidden md:block">
          <div className="terminal-window max-w-md ml-auto glow-border">
            {/* Titlebar */}
            <div className="terminal-titlebar">
              <div className="terminal-dot bg-[#ff5f57]" />
              <div className="terminal-dot bg-[#febc2e]" />
              <div className="terminal-dot bg-[#28c840]" />
              <span className="ml-3 text-terminal-muted text-xs">
                bash — omar@portfolio ~ — 80×24
              </span>
            </div>

            {/* Terminal body */}
            <div className="p-4 text-xs space-y-2 min-h-[320px]">
              <div>
                <span className="text-terminal-dim">omar@portfolio</span>
                <span className="text-terminal-text">:</span>
                <span className="text-terminal-cyan">~</span>
                <span className="text-terminal-text"> $ </span>
                <span className="text-terminal-green">cat about.txt</span>
              </div>
              <div className="text-terminal-text pl-2 space-y-1">
                <p><span className="text-terminal-cyan">name:</span>     Omar Garcia</p>
                <p><span className="text-terminal-cyan">role:</span>     Cloud & DevOps Engineer</p>
                <p><span className="text-terminal-cyan">location:</span> {SITE_META.location}</p>
                <p><span className="text-terminal-cyan">uptime:</span>   {SITE_META.uptime}</p>
                <p><span className="text-terminal-cyan">status:</span>   <span className="text-terminal-green">● AVAILABLE FOR WORK</span></p>
              </div>
              <div className="mt-3">
                <span className="text-terminal-dim">omar@portfolio</span>
                <span className="text-terminal-text">:</span>
                <span className="text-terminal-cyan">~</span>
                <span className="text-terminal-text"> $ </span>
                <span className="text-terminal-green">ls -la ./certs/</span>
              </div>
              <div className="text-terminal-muted pl-2 space-y-0.5">
                <p><span className="text-terminal-cyan">drwxr-x</span> scripting.cert</p>
                <p><span className="text-terminal-cyan">drwxr-x</span> terraform.cert</p>
                <p><span className="text-terminal-cyan">drwxr-x</span> docker.cert</p>
                <p><span className="text-terminal-cyan">drwxr-x</span> aws-practitioner-essencial.cert</p>
                <p><span className="text-terminal-cyan">drwxr-x</span> github.cert</p>
              </div>
              <div className="mt-3">
                <span className="text-terminal-dim">omar@portfolio</span>
                <span className="text-terminal-text">:</span>
                <span className="text-terminal-cyan">~</span>
                <span className="text-terminal-text"> $ </span>
                <span className="animate-blink text-terminal-green">▌</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
