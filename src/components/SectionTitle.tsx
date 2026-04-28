/* ============================================================
   SectionTitle.tsx — Encabezado reutilizable para cada sección

   Muestra:
     - Una línea de "prompt" simulando que se ejecutó un comando
     - El título principal entre corchetes [LABEL] con glow verde
     - Un divisor decorativo
     - Un comentario opcional en estilo código  // subtitle
   ============================================================ */

interface Props {
  label:     string;   // ej: "SKILLS"
  subtitle?: string;   // ej: "tech stack & competencias"
  className?: string;
}

export default function SectionTitle({ label, subtitle, className = "" }: Props) {
  return (
    <div className={`mb-12 ${className}`}>

      {/* Línea de prompt: simula que se ejecutó un comando para "leer" la sección */}
      <div className="flex items-center gap-3 mb-3 text-xs">
        <span className="text-terminal-dim">root@omargarcia:~$</span>
        <span className="text-terminal-green">cat {label.toLowerCase()}.log</span>
      </div>

      {/* Título principal */}
      <h2 className="text-2xl md:text-3xl font-bold text-terminal-green glow-green tracking-wider">
        [{label}]
      </h2>

      {/* Divisor: línea verde corta → rombo → línea larga gris */}
      <div className="flex items-center gap-3 mt-3">
        <div className="h-px bg-terminal-green w-16 opacity-60" />
        <div className="w-1.5 h-1.5 bg-terminal-green rotate-45 opacity-60" />
        <div className="h-px bg-terminal-border flex-1 opacity-40" />
      </div>

      {/* Subtítulo en estilo comentario de código */}
      {subtitle && (
        <p className="mt-2 text-terminal-muted text-xs">// {subtitle}</p>
      )}
    </div>
  );
}
