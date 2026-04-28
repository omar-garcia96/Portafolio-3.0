"use client";

import { useEffect, useRef } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import { EDUCATIONS, CERTIFICATIONS } from "@/lib/constants";

export default function Education() {
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
    <section id="education" className="py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionTitle label="EDUCATION" subtitle="formación y certificaciones" />

        <div ref={ref} className="fade-up grid md:grid-cols-2 gap-10">

          {/* Formal education */}
          <div>
            <p className="text-terminal-green text-xs font-bold tracking-widest mb-4">
              [FORMAL_EDUCATION]
            </p>
            <div className="space-y-4">
              {EDUCATIONS.map((edu) => (
                <div
                  key={edu.id}
                  className="terminal-window p-5 border-l-2 border-l-terminal-cyan"
                >
                  <p className="text-terminal-text text-sm font-bold">{edu.degree}</p>
                  <p className="text-terminal-cyan text-xs mt-1">{edu.institution}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-terminal-muted text-xs">{edu.period}</p>
                    <span
                      className={`text-[10px] px-2 py-0.5 border ${
                        edu.status === "completed"
                          ? "border-terminal-green text-terminal-green"
                          : "border-terminal-yellow text-terminal-yellow"
                      }`}
                    >
                      {edu.status === "completed" ? "COMPLETED" : "IN PROGRESS"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <p className="text-terminal-green text-xs font-bold tracking-widest mb-4">
              [CERTIFICATIONS]
            </p>
            <div className="space-y-3">
              {CERTIFICATIONS.map((cert, i) => (
                <div
                  key={cert.id}
                  className="terminal-window p-4 flex items-start gap-3 hover:border-terminal-green/40 transition-all"
                >
                  <span className="text-terminal-green font-bold text-xs shrink-0 mt-0.5">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <div className="flex-1">
                    <p className="text-terminal-text text-xs font-bold">{cert.name}</p>
                    <p className="text-terminal-muted text-xs mt-0.5">{cert.issuer}</p>
                  </div>
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
