/* ============================================================
   Experience.tsx — Sección de experiencia laboral

   Cada trabajo se muestra como un "log entry" de terminal:
   número de entrada, cargo, empresa, período, tipo y lista
   de responsabilidades precedidas por ">".
   ============================================================ */
"use client";

import { useEffect, useRef } from "react";
import SectionTitle from "@/components/SectionTitle";
import { EXPERIENCES } from "@/lib/data";

/* Color del badge según tipo de trabajo */
const TYPE_COLOR: Record<string, string> = {
  remote: "text-terminal-green",
  onsite: "text-terminal-cyan",
  hybrid: "text-terminal-yellow",
};

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="experience" className="py-24 bg-terminal-surface/20 border-y border-terminal-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionTitle label="EXPERIENCE" subtitle="historial de trabajos" />

        <div ref={ref} className="fade-up space-y-6">
          {EXPERIENCES.map((exp, i) => (
            <div key={exp.id} className="terminal-window p-6 hover:border-terminal-green/30 transition-all duration-300 glow-border">

              {/* ── Encabezado: índice, cargo, empresa, período, tipo ── */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {/* Índice con ceros: [01], [02]... */}
                    <span className="text-terminal-muted text-xs">[{String(i + 1).padStart(2, "0")}]</span>
                    <span className="text-terminal-green font-bold text-sm">{exp.role}</span>
                  </div>
                  <p className="text-terminal-cyan text-xs">{exp.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-terminal-muted text-xs">{exp.period}</p>
                  {/* Badge con color según tipo de contrato */}
                  <p className={`text-xs font-bold mt-0.5 ${TYPE_COLOR[exp.type]}`}>
                    [{exp.type.toUpperCase()}]
                  </p>
                </div>
              </div>

              {/* ── Lista de logros / responsabilidades ────────── */}
              <ul className="space-y-1.5 mb-4">
                {exp.description.map((line, j) => (
                  <li key={j} className="flex gap-2 text-xs text-terminal-text">
                    <span className="text-terminal-green shrink-0">&gt;</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              {/* ── Tags de tecnologías ─────────────────────────── */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-terminal-border">
                {exp.tech.map((t) => (
                  <span key={t} className="px-2 py-0.5 text-[10px] border border-terminal-border text-terminal-muted">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
