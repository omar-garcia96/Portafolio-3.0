import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, projects } from "@/data/projects";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.subtitle} | Omar Garcia`,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-mono px-4 pt-24 pb-8 md:px-8 lg:px-16">

      {/* Top bar */}
      <div className="mb-8 flex items-center justify-between border-b border-[#00ff41]/20 pb-4">
        <Link
          href="/"
          className="text-[#00ff41]/60 hover:text-[#00ff41] transition-colors text-sm flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">{"<"}</span>
          <span>cd ..</span>
        </Link>
        <span className="text-[#00ff41]/40 text-xs hidden sm:block">
          root@omargarcia:~/projects/{slug}$
        </span>
        <span
          className={`text-xs px-2 py-0.5 border ${
            project.status === "ACTIVE"
              ? "border-[#00ff41] text-[#00ff41]"
              : "border-white/40 text-white/40"
          }`}
        >
          {project.status}
        </span>
      </div>

      {/* Header */}
      <header className="mb-10">
        {/* Subtítulo — verde apagado */}
        <p className="text-[#00ff41]/50 text-sm mb-1">
          <span className="text-[#00ff41]/30">// </span>
          {project.subtitle}
        </p>

        {/* Título principal — verde brillante con cursor parpadeante */}
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#00ff41] leading-tight mb-4">
          {project.title}
          {/* Cursor parpadeante — solo en el título del proyecto */}
          <span className="animate-blink text-[#00ff41] ml-0.5">_</span>
        </h1>

        {/* Descripción — blanco suave */}
        <p className="text-white/70 text-sm leading-relaxed max-w-3xl">
          {project.description}
        </p>

        {/* Highlights — ✓ verde, texto blanco */}
        <ul className="mt-4 space-y-1">
          {project.highlights.map((h, i) => (
            <li key={i} className="text-sm text-white/80 flex items-start gap-2">
              <span className="text-[#00ff41] mt-0.5 shrink-0">✓</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 border border-[#00ff41]/30 text-[#00ff41]/70 hover:border-[#00ff41] hover:text-[#00ff41] transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-4">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-[#00ff41] transition-colors flex items-center gap-1"
            >
              <span className="text-[#00ff41]/40">{">"}</span> ./view_repo
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-[#00ff41] transition-colors flex items-center gap-1"
            >
              <span className="text-[#00ff41]/40">{">"}</span> ./open_demo
            </a>
          )}
        </div>
      </header>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-[#00ff41]/40 text-xs">cat documentation.md</span>
        <div className="flex-1 border-t border-[#00ff41]/20" />
      </div>

      {/* Documentation sections */}
      <div className="space-y-10 max-w-4xl">
        {project.sections.map((section, i) => (
          <section key={i} className="group">

            {/* Título de sección — verde */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-[#00ff41] font-bold text-base md:text-lg shrink-0">
                {section.title}
              </h2>
              <div className="flex-1 border-t border-[#00ff41]/15 group-hover:border-[#00ff41]/30 transition-colors" />
            </div>

            {/* Contenido de sección — blanco */}
            {section.content && (
              <div className="text-white/70 text-sm leading-relaxed whitespace-pre-line pl-4 border-l border-[#00ff41]/20 mb-4">
                {section.content}
              </div>
            )}

            {/* Subsecciones */}
            {section.subsections && (
              <div className="pl-4 space-y-4 mt-4">
                {section.subsections.map((sub, j) => (
                  <div key={j} className="border-l border-[#00ff41]/20 pl-4">
                    {/* Subtítulo — verde */}
                    <h3 className="text-[#00ff41] text-sm font-bold mb-2 flex items-center gap-2">
                      <span className="text-[#00ff41]/40">{"///"}</span>
                      {sub.title}
                    </h3>
                    {/* Contenido subsección — blanco */}
                    <p className="text-white/65 text-sm leading-relaxed whitespace-pre-line">
                      {sub.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-6 border-t border-[#00ff41]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="text-white/30 text-xs">
          Omar Garcia · omargarcia.xyz
        </span>
        <Link
          href="/"
          className="text-white/50 hover:text-[#00ff41] transition-colors text-sm flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">{"<"}</span>
          volver al portfolio
        </Link>
      </footer>
    </main>
  );
}