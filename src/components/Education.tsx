/* ============================================================
   Education.tsx — Sección de educación y certificaciones

   Divide en dos columnas:
     - Izquierda: estudios formales con borde de color lateral
     - Derecha: certificaciones como lista numerada
   ============================================================ */
"use client";

import { useEffect, useRef } from "react";
import SectionTitle from "@/components/SectionTitle";
import { EDUCATIONS, CERTIFICATIONS } from "@/lib/data";

export default function Education() {
  const ref = useRef<HTMLDivElement>(null);

  /* Activa la animación de entrada cuando el elemento
     entra en el viewport (igual que las demás secciones) */
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
    <section id="education" className="py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionTitle label="EDUCATION" subtitle="formación y certificaciones" />

        <div ref={ref} className="fade-up grid md:grid-cols-2 gap-10">

          {/* ── Columna izquierda: estudios formales ─────────── */}
          <div>
            <p className="text-terminal-green text-xs font-bold tracking-widest mb-4">
              [FORMAL_EDUCATION]
            </p>

            <div className="space-y-4">
              {EDUCATIONS.map((edu) => (
                <div
                  key={edu.id}
                  /* Borde izquierdo cian para diferenciar visualmente
                     del fondo y dar jerarquía a la entrada            */
                  className="terminal-window p-5 border-l-2 border-l-terminal-cyan"
                >
                  <p className="text-terminal-text text-sm font-bold">{edu.degree}</p>
                  <p className="text-terminal-cyan text-xs mt-1">{edu.institution}</p>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-terminal-muted text-xs">{edu.period}</p>

                    {/* Badge de estado: verde si completado, amarillo si en curso */}
                    <span className={`text-[10px] px-2 py-0.5 border ${
                      edu.status === "completed"
                        ? "border-terminal-green text-terminal-green"
                        : "border-terminal-yellow text-terminal-yellow"
                    }`}>
                      {edu.status === "completed" ? "COMPLETED" : "IN PROGRESS"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Columna derecha: certificaciones ──────────────── */}
          <div>
            <p className="text-terminal-green text-xs font-bold tracking-widest mb-4">
              [CERTIFICATIONS]
            </p>

            <div className="space-y-3">
              {CERTIFICATIONS.map((cert, i) => (
                <div
                  key={cert.id}
                  className="terminal-window p-4 flex items-start gap-3 hover:border-terminal-green/40 transition-all duration-200"
                >
                  {/* Número de certificación con padding de ceros */}
                  <span className="text-terminal-green text-xs font-bold shrink-0 mt-0.5">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>

                  {/* Nombre e issuer */}
                  <div className="flex-1 min-w-0">
                    <p className="text-terminal-text text-xs font-bold leading-snug">
                      {cert.name}
                    </p>
                    <p className="text-terminal-muted text-xs mt-0.5">{cert.issuer}</p>
                  </div>

                  {/* Año — alineado a la derecha */}
                  <span className="text-terminal-cyan text-xs shrink-0">{cert.year}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
