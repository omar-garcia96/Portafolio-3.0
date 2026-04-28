"use client";

import { useEffect, useRef } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import { SITE_META } from "@/lib/constants";

const STATS = [
  { label: "Years Experience", value: "3+",   color: "text-terminal-green" },
  { label: "Cloud Platforms",  value: "1",    color: "text-terminal-cyan"  },
  { label: "Projects Deployed", value: "6+", color: "text-terminal-green" },
  { label: "Certifications",   value: "10",    color: "text-terminal-yellow"},
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 bg-terminal-surface/30 border-y border-terminal-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionTitle
          label="ABOUT"
          subtitle="información del sistema"
        />

        <div ref={ref} className="fade-up grid md:grid-cols-2 gap-12 items-start">
          {/* Text */}
          <div className="space-y-4 text-sm text-terminal-text leading-relaxed">
            <p>
              <span className="text-terminal-green">&gt;</span> Soy{" "}
              <span className="text-terminal-green font-bold">Omar Garcia</span>,
              Ingeniero de Sistemas especializado en{" "}
              <span className="text-terminal-cyan">Cloud Computing</span>y{" "}
              <span className="text-terminal-cyan">Automatización</span>.
            </p>
            <p>
              <span className="text-terminal-green">&gt;</span> Con más de 3 años
              de experiencia construyendo infraestructuras escalables,
              resilientes y seguras, principalmente sobre{" "}
              <span className="text-terminal-green">AWS</span> 
            </p>
            <p>
              <span className="text-terminal-green">&gt;</span> Apasionado por la
              filosofía <span className="text-terminal-cyan">Infrastructure as Code</span>{" "}
              con Terraform y la automatización de pipelines CI/CD. Disfruto
              transformar arquitecturas manuales en sistemas autónomos y auditables.
            </p>
            <p>
              <span className="text-terminal-green">&gt;</span> Actualmente disponible
              para proyectos <span className="text-terminal-green">freelance</span> y
              oportunidades <span className="text-terminal-green">remote</span>.
            </p>

            {/* Location + email */}
            <div className="pt-4 space-y-2 text-terminal-muted border-t border-terminal-border">
              <p>
                <span className="text-terminal-green text-xs">LOCATION</span>{" "}
                {SITE_META.location}
              </p>
              <p>
                <span className="text-terminal-green text-xs">CONTACT </span>{" "}
                <a
                  href={`mailto:${SITE_META.email}`}
                  className="text-terminal-cyan hover:text-terminal-green transition-colors"
                >
                  {SITE_META.email}
                </a>
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="terminal-window p-5 text-center glow-border hover:border-terminal-green/40 transition-all duration-300"
              >
                <p className={`text-3xl font-bold ${s.color} glow-green`}>
                  {s.value}
                </p>
                <p className="text-terminal-muted text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
