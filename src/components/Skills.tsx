/* ============================================================
   Skills.tsx — Sección de habilidades técnicas

   Barras de progreso animadas: arrancan en 0 y se expanden
   hasta el nivel real cuando la sección entra en pantalla.
   La transición usa CSS (transition: width) disparado por
   el cambio de estado `visible`.
   ============================================================ */
"use client";

import { useEffect, useRef, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import { SKILL_CATEGORIES } from "@/lib/data";

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);

  /* Controla si las barras deben animarse (se activa al hacer scroll) */
  const [visible, setVisible] = useState(false);

  /* ── Observar entrada en viewport ───────────────────── */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);        // activa barras de progreso
          el.classList.add("visible"); // activa fade-up
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" className="py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionTitle label="SKILLS" subtitle="tech stack & competencias" />

        {/* Grid de tarjetas: 2 columnas en desktop */}
        <div ref={ref} className="fade-up grid md:grid-cols-2 gap-6">
          {SKILL_CATEGORIES.map((cat) => (
            <div key={cat.id} className="terminal-window p-5">

              {/* Encabezado de categoría */}
              <p className="text-terminal-green text-xs font-bold tracking-widest mb-4">
                {cat.label}
              </p>

              {/* Lista de habilidades con barras */}
              <div className="space-y-3">
                {cat.skills.map((skill) => (
                  <div key={skill.name}>
                    {/* Nombre y porcentaje */}
                    <div className="flex justify-between mb-1">
                      <span className="text-terminal-text text-xs">{skill.name}</span>
                      <span className="text-terminal-muted text-xs">{skill.level}%</span>
                    </div>

                    {/* Barra de progreso:
                        - Fondo: gris oscuro (riél)
                        - Fill: gradiente verde→cian animado
                        - width pasa de 0 a skill.level% cuando visible=true */}
                    <div className="h-1 bg-terminal-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width:            visible ? `${skill.level}%` : "0%",
                          background:       "linear-gradient(90deg, #00ff41, #00d4ff)",
                          boxShadow:        "0 0 8px rgba(0,255,65,0.5)",
                          transitionDelay:  "150ms",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Nube de tags adicionales (tecnologías de soporte) */}
        <div className="mt-10">
          <p className="text-terminal-muted text-xs mb-4">// also working with</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Route53","CloudWatch","DynamoDB","RDS","ECS","EC2",
              "VPC","SNS","SQS","Nginx","Linux","MySQL","Terraform",
              "Git","Bash","Docker","Kubernetes", "SDKs","CI/CD", "Lambda","ECR","API Gateway"
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs border border-terminal-border text-terminal-muted hover:border-terminal-green hover:text-terminal-green transition-all duration-200 cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
