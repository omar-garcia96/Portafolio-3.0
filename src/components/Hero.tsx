/* ============================================================
   Hero.tsx — Primera sección visible al cargar el sitio

   Contiene:
     - Línea de prompt (context visual)
     - Nombre con efecto typing (TerminalText)
     - Descripción profesional
     - 4 bloques de info que aparecen en cascada
     - Ventana de terminal a la derecha (desktop)
     - Dos botones CTA
   ============================================================ */
"use client";

import { useEffect, useState } from "react";
import TerminalText from "@/components/TerminalText";
import { SITE } from "@/lib/data";
import JarvisActivator from "@/components/JarvisActivator";

/* Bloques de información que aparecen uno a uno después
   de que termina el efecto typing del nombre              */
const INFO_BLOCKS = [
  { key: "[SYSTEM INFO]", value: `Uptime: 1+ years remote, ${SITE.uptime}.` },
  { key: "[EXPERIENCE]",  value: "Cloud Computing · DevOps · Infra as Code." },
  { key: "[EDUCATION]",   value: "Ing. Sistemas" },
  { key: "[SKILLS]",      value: "AWS · Terraform · Docker · K8s · GitHub · Scripting." },
];

export default function Hero() {
  /* Controla cuántos bloques de info se han revelado (0-4) */
  const [phase, setPhase] = useState(0);

  /* ── Revelar bloques en cascada ──────────────────────────
     - phase 0 → 1: espera 3.8s (tiempo del typing del nombre)
     - phase 1 → 2, 2 → 3, 3 → 4: cada 900ms             */
  useEffect(() => {
    if (phase >= INFO_BLOCKS.length) return;
    const delay = phase === 0 ? 3800 : 900;
    const t = setTimeout(() => setPhase((p) => p + 1), delay);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center bg-grid pt-14 pb-28 overflow-hidden"
    >
      {/* Gradiente de fondo: oscurece el grid para dar profundidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-terminal-bg via-terminal-bg/92 to-[#001a0f]/75 pointer-events-none" />

      <JarvisActivator />

      {/* Orbe de brillo verde — efecto ambiental decorativo */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-terminal-green/5 blur-3xl pointer-events-none" />

      {/* ── Contenido principal ──────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 w-full grid md:grid-cols-2 gap-12 items-center">

        {/* ── Columna izquierda ────────────────────────────── */}
        <div>
          {/* Línea de prompt — da contexto de "ejecutando script" */}
          <div className="mb-4 text-sm">
            <span className="text-terminal-dim">root@omargarcia</span>
            <span className="text-terminal-text">:</span>
            <span className="text-terminal-cyan">~</span>
            <span className="text-terminal-text">$ </span>
            <span className="text-terminal-green">./whoami.sh</span>
          </div>

          {/* Nombre con efecto de escritura */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-terminal-green glow-green mb-6 leading-tight">
            <TerminalText
              text="Omar Garcia"
              speed={70}
              delay={300}
              showCursor={false}
            />
            {/* Cursor parpadeante al final del nombre */}
            <span className="animate-blink text-terminal-green">_</span>
          </h1>

          {/* Descripción profesional */}
          <p className="text-sm sm:text-base text-terminal-text leading-relaxed mb-8 max-w-xl">
            {SITE.title}.{" "}
            <span className="text-terminal-green">{SITE.subtitle}</span>{" "}
            {SITE.description}
          </p>

          {/* Divisor decorativo con íconos */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-terminal-green/40 w-8" />
            {["⚙", "☁", "🔒", "💻", "🧠"].map((icon, i) => (
              <span key={i} className="text-sm opacity-50 hover:opacity-100 transition-opacity cursor-default">
                {icon}
              </span>
            ))}
            <div className="h-px bg-terminal-border flex-1" />
          </div>

          {/* Bloques de info — aparecen progresivamente con transición CSS */}
          <div className="space-y-3">
            {INFO_BLOCKS.map((block, i) => (
              <div
                key={block.key}
                className={`transition-all duration-500 ${
                  i < phase
                    ? "opacity-100 translate-y-0"   // visible
                    : "opacity-0 translate-y-2"     // oculto desplazado
                }`}
              >
                <span className="text-terminal-green text-xs font-bold">{block.key}</span>
                <br />
                <span className="text-terminal-muted text-xs">{block.value}</span>
              </div>
            ))}
          </div>

          {/* Botones CTA */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="px-5 py-2.5 border border-terminal-green text-terminal-green text-xs tracking-widest hover:bg-terminal-green hover:text-terminal-bg transition-all duration-200 glow-border"
            >
              &gt; ./init_contact
            </a>
            <a
              href="#portfolio"
              className="px-5 py-2.5 border border-terminal-border text-terminal-muted text-xs tracking-widest hover:border-terminal-cyan hover:text-terminal-cyan transition-all duration-200"
            >
              &gt; ls ./projects
            </a>
          </div>
        </div>

        {/* ── Columna derecha: ventana de terminal (solo desktop) ─ */}
        <div className="hidden md:block">
          <div className="terminal-window max-w-md ml-auto glow-border">

            {/* Barra de título con puntos de colores */}
            <div className="terminal-titlebar">
              <div className="terminal-dot bg-[#ff5f57]" />
              <div className="terminal-dot bg-[#febc2e]" />
              <div className="terminal-dot bg-[#28c840]" />
              <span className="ml-3 text-terminal-muted text-xs">bash — omar@portfolio ~ — 80×24</span>
            </div>

            {/* Cuerpo del terminal: comandos y sus salidas */}
            <div className="p-4 text-xs space-y-2 min-h-[300px]">

              {/* Comando: cat about.txt */}
              <p>
                <span className="text-terminal-dim">omar@portfolio</span>
                <span className="text-terminal-text">:</span>
                <span className="text-terminal-cyan">~</span>
                <span className="text-terminal-text"> $ </span>
                <span className="text-terminal-green">cat about.txt</span>
              </p>
              <div className="text-terminal-text pl-2 space-y-0.5">
                <p><span className="text-terminal-cyan">name:</span>     Omar Garcia</p>
                <p><span className="text-terminal-cyan">role:</span>     Cloud & DevOps Engineer</p>
                <p><span className="text-terminal-cyan">location:</span> {SITE.location}</p>
                <p><span className="text-terminal-cyan">uptime:</span>   {SITE.uptime}</p>
                <p><span className="text-terminal-cyan">status:</span>   <span className="text-terminal-green">● AVAILABLE FOR WORK</span></p>
              </div>

              {/* Comando: ls ./certs/ */}
              <p className="pt-1">
                <span className="text-terminal-dim">omar@portfolio</span>
                <span className="text-terminal-text">:</span>
                <span className="text-terminal-cyan">~</span>
                <span className="text-terminal-text"> $ </span>
                <span className="text-terminal-green">ls ./certs/</span>
              </p>
              <div className="text-terminal-muted pl-2 space-y-0.5">
                <p><span className="text-terminal-cyan">-rw-r--r--</span> curso-completo-de-aws-devops.cert</p>
                <p><span className="text-terminal-cyan">-rw-r--r--</span> fundamentals-of-architecting-on-aws.cert</p>
                <p><span className="text-terminal-cyan">-rw-r--r--</span> scripting.cert</p>
                <p><span className="text-terminal-cyan">-rw-r--r--</span> terraform.cert</p>
                <p><span className="text-terminal-cyan">-rw-r--r--</span> docker.cert</p>
                <p><span className="text-terminal-cyan">-rw-r--r--</span> aws-practitioner-essencial.cert</p>
                <p><span className="text-terminal-cyan">-rw-r--r--</span> github.cert</p>
              </div>

              {/* Cursor esperando el siguiente comando */}
              <p className="pt-1">
                <span className="text-terminal-dim">omar@portfolio</span>
                <span className="text-terminal-text">:</span>
                <span className="text-terminal-cyan">~</span>
                <span className="text-terminal-text"> $ </span>
                <span className="animate-blink text-terminal-green">▌</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
