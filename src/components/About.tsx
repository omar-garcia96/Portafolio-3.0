/* ============================================================
   About.tsx — Sección "Sobre mí"

   Usa IntersectionObserver para activar la animación de entrada
   (.fade-up → .fade-up.visible) cuando la sección es visible.
   ============================================================ */
"use client";

import { useEffect, useRef } from "react";
import SectionTitle from "@/components/SectionTitle";
import { SITE } from "@/lib/data";

/* Estadísticas rápidas mostradas en la cuadrícula derecha */
const STATS = [
  { label: "Years Experience",  value: "3+",  color: "text-terminal-green"  },
  { label: "Cloud Platforms",   value: "1",   color: "text-terminal-cyan"   },
  { label: "Projects Deployed", value: "6+", color: "text-terminal-green"  },
  { label: "Certifications",    value: "13",   color: "text-terminal-yellow" },
];

export default function About() {
  /* Referencia al contenedor para aplicar la animación de entrada */
  const ref = useRef<HTMLDivElement>(null);

  /* ── IntersectionObserver: activa animación al hacer scroll ─
     Cuando el elemento entra un 15% en el viewport, agrega
     la clase "visible" que activa la transición CSS en .fade-up */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 bg-terminal-surface/30 border-y border-terminal-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionTitle label="ABOUT" subtitle="información del sistema" />

        <div ref={ref} className="fade-up grid md:grid-cols-2 gap-12 items-start">

          {/* ── Texto de presentación ──────────────────────── */}
          <div className="space-y-4 text-sm text-terminal-text leading-relaxed">
            <p>
              <span className="text-terminal-green">&gt;</span> Soy{" "}
              <span className="text-terminal-green font-bold">Omar Garcia</span>,
              Ingeniero de Sistemas especializado en{" "}
              <span className="text-terminal-cyan">Cloud Computing </span>y{" "}
              <span className="text-terminal-cyan">Automatización</span>.
            </p>
            <p>
              <span className="text-terminal-green">&gt;</span> Más de 3 años construyendo
              infraestructuras escalables y seguras sobre{" "}
              <span className="text-terminal-green">AWS</span>.
            </p>
            <p>
              <span className="text-terminal-green">&gt;</span> Apasionado por{" "}
              <span className="text-terminal-cyan">Infrastructure as Code</span> con
              Terraform y la automatización de pipelines CI/CD.
            </p>
            <p>
              <span className="text-terminal-green">&gt;</span> Disponible para proyectos{" "}
              <span className="text-terminal-green">freelance</span> y oportunidades{" "}
              <span className="text-terminal-green">remote</span>.
            </p>

            {/* Datos de contacto directo */}
            <div className="pt-4 space-y-1.5 border-t border-terminal-border text-terminal-muted text-xs">
              <p>
                <span className="text-terminal-green uppercase tracking-widest">location </span>
                {SITE.location}
              </p>
              <p>
                <span className="text-terminal-green uppercase tracking-widest">email    </span>
                <a href={`mailto:${SITE.email}`} className="text-terminal-cyan hover:text-terminal-green transition-colors">
                  {SITE.email}
                </a>
              </p>
            </div>
          </div>

          {/* ── Cuadrícula de estadísticas ─────────────────── */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="terminal-window p-5 text-center glow-border hover:border-terminal-green/30 transition-all">
                {/* Número grande con color temático */}
                <p className={`text-3xl font-bold ${s.color} glow-green`}>{s.value}</p>
                <p className="text-terminal-muted text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
