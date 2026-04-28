// Ejemplo de cómo debe quedar tu tarjeta de proyecto.
// Adapta esto a tu componente actual (ProjectCard, etc.)

import Link from "next/link";

type ProjectCardProps = {
  number: string;
  slug: string; // "pipeline-cicd" o "aws-static-website"
  title: string;
  status: "ACTIVE" | "ARCHIVED";
  description: string;
  highlights: string[];
  tags: string[];
  repoUrl?: string;
  demoUrl?: string;
};

export default function ProjectCard({
  number,
  slug,
  title,
  status,
  description,
  highlights,
  tags,
  repoUrl,
  demoUrl,
}: ProjectCardProps) {
  return (
    // 👇 Envuelve TODO en un Link — al hacer click va a la documentación completa
    <Link href={`/projects/${slug}`} className="block group">
      <article className="border border-[#00ff41]/30 p-5 hover:border-[#00ff41]/70 transition-colors cursor-pointer">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-[#00ff41] font-bold text-sm leading-snug">
            <span className="text-[#00ff41]/40">[{number}]</span>{" "}
            {title}
          </h3>
          <span
            className={`shrink-0 text-xs px-2 py-0.5 border ${
              status === "ACTIVE"
                ? "border-[#00ff41] text-[#00ff41]"
                : "border-[#00ff41]/40 text-[#00ff41]/40"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Description */}
        <p className="text-[#00ff41]/60 text-xs leading-relaxed mb-3">
          {description}
        </p>

        {/* Highlights */}
        <ul className="mb-4 space-y-1">
          {highlights.map((h, i) => (
            <li key={i} className="text-xs text-[#00ff41]/70 flex items-start gap-2">
              <span className="text-[#00ff41] mt-0.5">✓</span>
              {h}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 border border-[#00ff41]/20 text-[#00ff41]/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action buttons — stopPropagation para que no activen el Link padre */}
        <div className="flex gap-4">
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-[#00ff41]/60 hover:text-[#00ff41] transition-colors"
            >
              {">"} ./view_repo
            </a>
          )}
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-[#00ff41]/60 hover:text-[#00ff41] transition-colors"
            >
              {">"} ./open_demo
            </a>
          )}
        </div>

        {/* Indicador de "ver documentación" */}
        <div className="mt-3 pt-3 border-t border-[#00ff41]/10 flex items-center justify-between">
          <span className="text-xs text-[#00ff41]/30 group-hover:text-[#00ff41]/60 transition-colors">
            {">"} ./read_docs
          </span>
          <span className="text-xs text-[#00ff41]/30 group-hover:text-[#00ff41]/60 transition-colors">
            documentación técnica →
          </span>
        </div>

      </article>
    </Link>
  );
}
