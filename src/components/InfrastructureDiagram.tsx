"use client";
/* ============================================================
   InfrastructureDiagram.tsx

   ViewBox: 400 x 900
   Nodos: ~160px de ancho x 70px de alto
   Espaciado entre filas: ~100px
   Flechas: strokeWidth 2.5

   Secuencia (8 pasos x 2s):
     1. USER + GITHUB
     2. Route53
     3. CloudFront
     4. S3
     5. CodePipeline → S3
     6. API Gateway
     7. Lambda
     8. DynamoDB + SNS
   ============================================================ */

import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────
type NodeDef = {
  id:       string;
  label:    string;
  sub:      string;
  x:        number;
  y:        number;
  w:        number;
  h:        number;
  icon:     string;
  dim?:     boolean;
};

type ArrowDef = {
  id:      string;
  path:    string;
  dim?:    boolean;
  dashed?: boolean;
};

type DiagramConfig = {
  nodes: NodeDef[];
  arrows: ArrowDef[];
  steps: { nodes: string[]; arrows: string[] }[];
};

const DIAGRAM_CONFIGS: Record<string, DiagramConfig> = {
  "portfolio-aws-devops": {
    nodes: [
      { id: "user", label: "USER", sub: "browser", x: 20, y: 20, w: 160, h: 70, icon: "👤" },
      { id: "gh", label: "GitHub", sub: "source · webhook", x: 220, y: 20, w: 160, h: 70, icon: "🐙", dim: true },
      { id: "r53", label: "Route53", sub: "omargarcia.xyz", x: 110, y: 320, w: 180, h: 70, icon: "🌐" },
      { id: "cf", label: "CloudFront", sub: "CDN · SSL · HTTP/3 · OAC", x: 60, y: 620, w: 280, h: 70, icon: "🌍" },
      { id: "s3", label: "S3", sub: "privado · OAC", x: 20, y: 920, w: 155, h: 70, icon: "🔒" },
      { id: "pipeline", label: "CodePipeline", sub: "build → deploy", x: 225, y: 920, w: 155, h: 70, icon: "🚀", dim: true },
      { id: "api", label: "API Gateway", sub: "HTTP API · POST /contact", x: 80, y: 1220, w: 240, h: 70, icon: "🚦" },
      { id: "lambda", label: "Lambda", sub: "Node.js 22.x", x: 80, y: 1520, w: 240, h: 70, icon: "⚡" },
      { id: "dynamo", label: "DynamoDB", sub: "on-demand · TTL", x: 20, y: 1820, w: 170, h: 70, icon: "💾" },
      { id: "sns", label: "SNS", sub: "→ email alert", x: 210, y: 1820, w: 170, h: 70, icon: "📣" },
    ],
    arrows: [
      { id: "a-user-r53", path: "M100 90 L200 320" },
      { id: "a-gh-pipeline", path: "M300 90 Q380 500 302 920", dim: true, dashed: true },
      { id: "a-r53-cf", path: "M200.1 390 L200 620" },
      { id: "a-cf-s3", path: "M150 690 L97 920" },
      { id: "a-pipeline-s3", path: "M225 955 L175 955", dim: true, dashed: true },
      { id: "a-user-api", path: "M60 90 Q0 650 200 1220", dim: true, dashed: true },
      { id: "a-api-lambda", path: "M200 1290 L200 1520" },
      { id: "a-lambda-dynamo", path: "M160 1590 L105 1820" },
      { id: "a-lambda-sns", path: "M240 1590 L295 1820" },
    ],
    steps: [
      { nodes: ["user", "gh"], arrows: [] },
      { nodes: ["user", "gh", "r53"], arrows: ["a-user-r53"] },
      { nodes: ["user", "gh", "r53", "cf"], arrows: ["a-user-r53", "a-r53-cf"] },
      { nodes: ["user", "gh", "r53", "cf", "s3"], arrows: ["a-user-r53", "a-r53-cf", "a-cf-s3"] },
      { nodes: ["user", "gh", "r53", "cf", "s3", "pipeline"], arrows: ["a-user-r53", "a-r53-cf", "a-cf-s3", "a-gh-pipeline", "a-pipeline-s3"] },
      { nodes: ["user", "gh", "r53", "cf", "s3", "pipeline", "api"], arrows: ["a-user-r53", "a-r53-cf", "a-cf-s3", "a-gh-pipeline", "a-pipeline-s3", "a-user-api"] },
      { nodes: ["user", "gh", "r53", "cf", "s3", "pipeline", "api", "lambda"], arrows: ["a-user-r53", "a-r53-cf", "a-cf-s3", "a-gh-pipeline", "a-pipeline-s3", "a-user-api", "a-api-lambda"] },
      { nodes: ["user", "gh", "r53", "cf", "s3", "pipeline", "api", "lambda", "dynamo", "sns"], arrows: ["a-user-r53", "a-r53-cf", "a-cf-s3", "a-gh-pipeline", "a-pipeline-s3", "a-user-api", "a-api-lambda", "a-lambda-dynamo", "a-lambda-sns"] },
    ]
  },
  "aws-static-website": {
    nodes: [
      { id: "user", label: "USER", sub: "browser", x: 20, y: 20, w: 160, h: 70, icon: "👤" },
      { id: "gh", label: "GitHub", sub: "Actions CI/CD", x: 220, y: 20, w: 160, h: 70, icon: "🐙", dim: true },
      { id: "cf", label: "CloudFront", sub: "CDN · Edge Locations", x: 60, y: 320, w: 280, h: 70, icon: "🌍" },
      { id: "s3", label: "S3", sub: "Private Bucket (OAC)", x: 110, y: 620, w: 180, h: 70, icon: "🔒" },
    ],
    arrows: [
      { id: "a-user-cf", path: "M100 90 L200 320" },
      { id: "a-cf-s3", path: "M200 390 L200 620" },
      { id: "a-gh-s3", path: "M300 90 Q380 350 200 620", dim: true, dashed: true },
    ],
    steps: [
      { nodes: ["user", "gh"], arrows: [] },
      { nodes: ["user", "gh", "cf"], arrows: ["a-user-cf"] },
      { nodes: ["user", "gh", "cf", "s3"], arrows: ["a-user-cf", "a-cf-s3", "a-gh-s3"] },
    ]
  },
  "pipeline-cicd": {
    nodes: [
      { id: "user", label: "USER", sub: "HTTPS Request", x: 20, y: 20, w: 160, h: 70, icon: "👤" },
      { id: "gh", label: "GitHub", sub: "Actions Workflow", x: 220, y: 20, w: 160, h: 70, icon: "🐙", dim: true },
      { id: "tunnel", label: "CF Tunnel", sub: "Zero Trust Tunnel", x: 20, y: 320, w: 170, h: 70, icon: "☁️" },
      { id: "ecr", label: "ECR", sub: "Docker Registry", x: 210, y: 320, w: 170, h: 70, icon: "📦", dim: true },
      { id: "ec2", label: "EC2", sub: "Docker + Nginx", x: 80, y: 620, w: 240, h: 70, icon: "🖥️" },
      { id: "s3", label: "S3", sub: "Terraform State", x: 120, y: 920, w: 160, h: 70, icon: "📄", dim: true },
    ],
    arrows: [
      { id: "a-user-tunnel", path: "M100 90 L105 320" },
      { id: "a-tunnel-ec2", path: "M105 390 L200 620" },
      { id: "a-gh-ecr", path: "M300 90 L295 320", dim: true, dashed: true },
      { id: "a-ecr-ec2", path: "M295 390 L200 620", dim: true, dashed: true },
      { id: "a-gh-s3", path: "M300 90 Q400 500 200 920", dim: true, dashed: true },
    ],
    steps: [
      { nodes: ["user", "gh"], arrows: [] },
      { nodes: ["user", "gh", "tunnel", "ecr", "s3"], arrows: ["a-user-tunnel", "a-gh-ecr", "a-gh-s3"] },
      { nodes: ["user", "gh", "tunnel", "ecr", "s3", "ec2"], arrows: ["a-user-tunnel", "a-gh-ecr", "a-gh-s3", "a-tunnel-ec2", "a-ecr-ec2"] },
    ]
  }
};

// ─────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────
export default function InfrastructureDiagram({ slug }: { slug: string }) {
  const config = DIAGRAM_CONFIGS[slug] || DIAGRAM_CONFIGS["portfolio-aws-devops"];
  const { nodes, arrows, steps } = config;

  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef   = useRef(false);

  const startAnimation = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStep(0);
    setDone(false);
    let cur = 0;
    timerRef.current = setInterval(() => {
      cur += 1;
      if (cur >= steps.length) {
        clearInterval(timerRef.current!);
        setDone(true);
        return;
      }
      setStep(cur);
    }, 2000);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTimeout(startAnimation, 400); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentStep = step >= 0 ? steps[Math.min(step, steps.length - 1)] : { nodes: [], arrows: [] };
  const isN = (id: string) => currentStep.nodes.includes(id);
  const isA = (id: string) => currentStep.arrows.includes(id);

  return (
    <div
      ref={containerRef}
      className="sticky top-24 flex flex-col"
      style={{ minHeight: "1200px" }}
    >
      <div className="border border-[#00ff41]/20 bg-[#050505] rounded-sm flex flex-col h-full overflow-hidden">

        {/* Titlebar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#00ff41]/10 bg-[#0a0a0a] shrink-0">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[#00ff41]/40 text-[9px] font-mono tracking-widest">
            infra.diagram
          </span>
          <div className="ml-auto flex items-center gap-2">
            {step === -1 && (
              <span className="text-[#00ff41]/30 text-[9px] font-mono">standby...</span>
            )}
            {step >= 0 && !done && (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-[#00ff41] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00ff41]" />
                </span>
                <span className="text-[#00ff41]/60 text-[9px] font-mono">
                  deploying {step + 1}/{steps.length}...
                </span>
              </>
            )}
            {done && (
              <span className="text-[#00ff41] text-[9px] font-mono">✓ deployed</span>
            )}
          </div>
        </div>

        {/* SVG */}
        {/* Cambiamos overflow-hidden por overflow-y-auto para permitir scroll interno */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          <svg
            viewBox="0 0 400 2000" // Ampliado a 2000 para soportar los nuevos saltos
            className="w-full"
            style={{ minHeight: "1800px" }} // Esto es la magia: fuerza al SVG a crecer verticalmente
            preserveAspectRatio="xMidYMin meet"
          >
            <defs>
              <marker id="arr" viewBox="0 0 12 12" refX="10" refY="6"
                markerWidth="7" markerHeight="7" orient="auto">
                <path d="M2 2L10 6L2 10" fill="none" stroke="#00ff41"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
              <marker id="arr-dim" viewBox="0 0 12 12" refX="10" refY="6"
                markerWidth="7" markerHeight="7" orient="auto">
                <path d="M2 2L10 6L2 10" fill="none" stroke="#00ff4150"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="3.5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-sm" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="1.5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              {/* Scan gradient */}
              <linearGradient id="scanG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#00ff41" stopOpacity="0"/>
                <stop offset="50%"  stopColor="#00ff41" stopOpacity="1"/>
                <stop offset="100%" stopColor="#00ff41" stopOpacity="0"/>
              </linearGradient>
            </defs>

            {/* Scan line */}
            <rect x="0" y="0" width="400" height="6" fill="url(#scanG)" opacity="0.12"
              style={{ animation: "scanD 4s linear infinite" }}/>

            {/* ── Flechas ─────────────────────────────────── */}
            {arrows.map((a) => (
              <path
                key={a.id}
                d={a.path}
                fill="none"
                stroke={a.dim ? "#00ff4150" : "#00ff41"}
                strokeWidth={a.dim ? "1.5" : "2.5"}
                strokeDasharray={a.dashed ? "6 5" : "none"}
                markerEnd={a.dim ? "url(#arr-dim)" : "url(#arr)"}
                style={{
                  opacity:    isA(a.id) ? 1 : 0,
                  transition: "opacity 0.6s ease",
                  filter:     isA(a.id) && !a.dim ? "url(#glow)" : "none",
                }}
              />
            ))}

            {/* ── Nodos ───────────────────────────────────── */}
            {nodes.map((n) => {
              const vis = isN(n.id);
              const cx  = n.x + n.w / 2;
              const cy  = n.y + n.h / 2;

              return (
                <g
                  key={n.id}
                  style={{
                    opacity:    vis ? 1 : 0,
                    transform:  vis ? "translateY(0)" : "translateY(12px)",
                    transition: "opacity 0.55s ease, transform 0.55s ease",
                  }}
                >
                  {/* Glow background */}
                  {!n.dim && vis && (
                    <rect x={n.x - 3} y={n.y - 3}
                      width={n.w + 6} height={n.h + 6}
                      rx="6" fill="#00ff41" opacity="0.03"/>
                  )}

                  {/* Caja */}
                  <rect
                    x={n.x} y={n.y} width={n.w} height={n.h} rx="5"
                    fill="#060606"
                    stroke={n.dim ? "#00ff4130" : "#00ff4165"}
                    strokeWidth={n.dim ? "1" : "1.8"}
                    strokeDasharray={n.dim ? "6 4" : "none"}
                    style={{ filter: vis && !n.dim ? "url(#glow)" : "none" }}
                  />

                  {/* Acento superior */}
                  {!n.dim && (
                    <line
                      x1={n.x + 10} y1={n.y}
                      x2={n.x + n.w - 10} y2={n.y}
                      stroke="#00ff41" strokeWidth="2.5" opacity="0.7"
                    />
                  )}

                  {/* Icono */}
                  <text x={n.x + 22} y={cy + 10}
                    fontSize="28" textAnchor="middle"
                    style={{ userSelect: "none" }}>
                    {n.icon}
                  </text>

                  {/* Label */}
                  <text
                    x={n.x + 46} y={cy - 8}
                    fill={n.dim ? "#00ff4165" : "#00ff41"}
                    fontFamily="monospace"
                    fontSize="16"
                    fontWeight="bold"
                    style={{ filter: vis && !n.dim ? "url(#glow-sm)" : "none" }}
                  >
                    {n.label}
                  </text>

                  {/* Sublabel */}
                  <text
                    x={n.x + 46} y={cy + 15}
                    fill={n.dim ? "#00ff4140" : "#00ff4170"}
                    fontFamily="monospace"
                    fontSize="12"
                  >
                    {n.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#00ff41]/10 shrink-0 flex items-center gap-2">
          <span className="text-[#00ff41]/40 text-[9px] font-mono">omar@aws:~$</span>
          <span className="text-[#00ff41]/50 text-[9px] font-mono">
            {step < 0       && "// scroll para iniciar despliegue"}
            {step >= 0 && !done && `terraform apply... [${step + 1}/${steps.length}]`}
            {done            && "Apply complete! 9 resources added ✓"}
          </span>
          {!done && step >= 0 && (
            <span className="animate-blink text-[#00ff41] text-[11px] ml-1">▌</span>
          )}
        </div>
      </div>

    <style>{`
        @keyframes scanD {
          from { transform: translateY(-8px);  }
          to   { transform: translateY(2000px); } 
        }
      `}</style>
    </div>
  );
}