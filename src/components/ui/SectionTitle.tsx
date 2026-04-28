interface SectionTitleProps {
  label: string;        // e.g. "SKILLS"
  subtitle?: string;
  className?: string;
}

export default function SectionTitle({
  label,
  subtitle,
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`mb-12 ${className}`}>
      {/* Top line */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-terminal-muted text-sm">root@omargarcia:~$</span>
        <span className="text-terminal-green text-sm">cat {label.toLowerCase()}.log</span>
      </div>

      {/* Main title */}
      <h2 className="text-2xl md:text-3xl font-bold text-terminal-green glow-green tracking-wider">
        [{label}]
      </h2>

      {/* Divider */}
      <div className="flex items-center gap-3 mt-3">
        <div className="h-px bg-terminal-green flex-1 max-w-[80px] opacity-60" />
        <div className="w-1.5 h-1.5 bg-terminal-green rotate-45 opacity-60" />
        <div className="h-px bg-terminal-border flex-1 opacity-40" />
      </div>

      {subtitle && (
        <p className="mt-3 text-terminal-muted text-sm">// {subtitle}</p>
      )}
    </div>
  );
}
