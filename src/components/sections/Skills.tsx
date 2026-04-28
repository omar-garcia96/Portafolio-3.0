"use client";

import { useEffect, useRef, useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import { SKILL_CATEGORIES } from "@/lib/constants";

export default function Skills() {
  const ref       = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); el.classList.add("visible"); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" className="py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionTitle label="SKILLS" subtitle="tech stack & competencias" />

        <div ref={ref} className="fade-up grid md:grid-cols-2 gap-8">
          {SKILL_CATEGORIES.map((cat) => (
            <div key={cat.id} className="terminal-window p-5">
              {/* Category header */}
              <p className="text-terminal-green text-xs font-bold mb-4 tracking-wider">
                {cat.label}
              </p>

              <div className="space-y-3">
                {cat.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-terminal-text text-xs">{skill.name}</span>
                      <span className="text-terminal-muted text-xs">{skill.level}%</span>
                    </div>
                    {/* Bar */}
                    <div className="h-1 bg-terminal-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: visible ? `${skill.level}%` : "0%",
                          background: "linear-gradient(90deg, #00ff41, #00d4ff)",
                          boxShadow: "0 0 8px rgba(0,255,65,0.5)",
                          transitionDelay: "200ms",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Badge cloud */}
        <div className="mt-10">
          <p className="text-terminal-muted text-xs mb-4">// also working with</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Route53","API Gateway","CloudWatch","DynamoDB","RDS","ECS","EC2",
              "VPC","SNS","SQS","Nginx","GitHub","Linux","PostgreSQL","Redis",
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs border border-terminal-border text-terminal-muted font-mono hover:border-terminal-green hover:text-terminal-green transition-all duration-200 cursor-default"
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
