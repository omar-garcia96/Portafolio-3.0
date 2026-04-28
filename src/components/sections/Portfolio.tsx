"use client";

import { useEffect, useRef } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import { PROJECTS } from "@/lib/constants";

const STATUS_STYLE: Record<string, string> = {
  active:      "border-terminal-green text-terminal-green",
  archived:    "border-terminal-muted text-terminal-muted",
  "in-progress": "border-terminal-yellow text-terminal-yellow",
};

export default function Portfolio() {
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
    <section id="portfolio" className="py-24 bg-terminal-surface/20 border-y border-terminal-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionTitle label="PORTFOLIO" subtitle="proyectos desplegados" />

        <div ref={ref} className="fade-up grid md:grid-cols-2 gap-6">
          {PROJECTS.map((proj, i) => (
            <div
              key={proj.id}
              className="terminal-window p-5 flex flex-col gap-4 hover:border-terminal-green/40 transition-all duration-300 group"
            >
              {/* Title row */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-terminal-muted text-xs">
                      [{String(i + 1).padStart(2, "0")}]
                    </span>
                    <h3 className="text-terminal-green text-sm font-bold group-hover:glow-green transition-all">
                      {proj.title}
                    </h3>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 border shrink-0 ${
                    STATUS_STYLE[proj.status]
                  }`}
                >
                  {proj.status.toUpperCase().replace("-", "_")}
                </span>
              </div>

              {/* Description */}
              <p className="text-terminal-muted text-xs leading-relaxed">{proj.description}</p>

              {/* Highlights */}
              <ul className="space-y-1">
                {proj.highlights.map((h, j) => (
                  <li key={j} className="flex gap-2 text-xs text-terminal-text">
                    <span className="text-terminal-green shrink-0">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* Tech */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-terminal-border">
                {proj.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-[10px] border border-terminal-border text-terminal-muted hover:border-terminal-cyan hover:text-terminal-cyan transition-all cursor-default"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-4 text-xs">
                {proj.repoUrl && (
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terminal-muted hover:text-terminal-green transition-colors"
                  >
                    &gt; ./view_repo
                  </a>
                )}
                {proj.demoUrl && (
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terminal-muted hover:text-terminal-cyan transition-colors"
                  >
                    &gt; ./open_demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
