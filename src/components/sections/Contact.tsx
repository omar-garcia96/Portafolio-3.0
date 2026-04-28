"use client";

import { useEffect, useRef, useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import { API_ENDPOINT, SITE_META } from "@/lib/constants";
import type { ContactForm, ApiResponse } from "@/lib/types";

type Status = "idle" | "sending" | "success" | "error";

const INITIAL: ContactForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const [form, setForm]     = useState<ContactForm>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [log, setLog]       = useState<string[]>([
    "// Formulario de contacto listo.",
    "// Completa los campos y ejecuta ./send_message",
  ]);

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

  const addLog = (line: string) =>
    setLog((prev) => [...prev, line]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      addLog("ERROR: Campos requeridos vacíos.");
      return;
    }

    setStatus("sending");
    addLog(`[${new Date().toISOString()}] Enviando mensaje...`);
    addLog(`> POST ${API_ENDPOINT}`);

    try {
      const res = await fetch(API_ENDPOINT, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data: ApiResponse = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        addLog("✓ Mensaje enviado correctamente.");
        addLog("✓ Notificación enviada via SNS → email.");
        setForm(INITIAL);
      } else {
        throw new Error(data.message ?? "Error desconocido");
      }
    } catch (err: unknown) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Error de red";
      addLog(`ERROR: ${msg}`);
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionTitle label="CONTACT" subtitle="./init_contact — envía un mensaje" />

        <div ref={ref} className="fade-up grid md:grid-cols-2 gap-10">

          {/* ── Form ─────────────────────────────────────── */}
          <div className="terminal-window">
            <div className="terminal-titlebar">
              <div className="terminal-dot bg-[#ff5f57]" />
              <div className="terminal-dot bg-[#febc2e]" />
              <div className="terminal-dot bg-[#28c840]" />
              <span className="ml-3 text-terminal-muted text-xs">
                bash — contact_form.sh
              </span>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {(
                [
                  { name: "name",    label: "NAME",    type: "text",  placeholder: "Tu nombre" },
                  { name: "email",   label: "EMAIL",   type: "email", placeholder: "tu@email.com" },
                  { name: "subject", label: "SUBJECT", type: "text",  placeholder: "Asunto del mensaje" },
                ] as const
              ).map((field) => (
                <div key={field.name}>
                  <label className="block text-terminal-green text-xs mb-1.5 tracking-widest">
                    {field.label}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-terminal-muted text-xs shrink-0">&gt;</span>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="terminal-input"
                      autoComplete="off"
                    />
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-terminal-green text-xs mb-1.5 tracking-widest">
                  MESSAGE
                </label>
                <div className="flex gap-2">
                  <span className="text-terminal-muted text-xs shrink-0 mt-2">&gt;</span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aquí..."
                    rows={4}
                    className="terminal-input resize-none border border-terminal-border bg-transparent rounded-none p-2 !border-b-0 focus:!border-terminal-green"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className={`w-full py-2.5 text-xs font-mono tracking-widest transition-all duration-200 border ${
                  status === "sending"
                    ? "border-terminal-muted text-terminal-muted cursor-not-allowed"
                    : status === "success"
                    ? "border-terminal-green bg-terminal-green/10 text-terminal-green"
                    : "border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-bg"
                }`}
              >
                {status === "sending"
                  ? "[ ENVIANDO... ]"
                  : status === "success"
                  ? "[ ✓ MENSAJE ENVIADO ]"
                  : "> ./send_message"}
              </button>
            </form>
          </div>

          {/* ── Terminal log + info ───────────────────────── */}
          <div className="space-y-6">
            {/* Log output */}
            <div className="terminal-window">
              <div className="terminal-titlebar">
                <div className="terminal-dot bg-[#ff5f57]" />
                <div className="terminal-dot bg-[#febc2e]" />
                <div className="terminal-dot bg-[#28c840]" />
                <span className="ml-3 text-terminal-muted text-xs">stdout</span>
              </div>
              <div className="p-4 min-h-[180px] space-y-1">
                {log.map((line, i) => (
                  <p
                    key={i}
                    className={`text-xs ${
                      line.startsWith("ERROR")
                        ? "text-terminal-red"
                        : line.startsWith("✓")
                        ? "text-terminal-green"
                        : line.startsWith(">")
                        ? "text-terminal-cyan"
                        : "text-terminal-muted"
                    }`}
                  >
                    {line}
                  </p>
                ))}
                <span className="animate-blink text-terminal-green text-xs">▌</span>
              </div>
            </div>

            {/* Direct contact */}
            <div className="space-y-3 text-xs text-terminal-muted">
              <p className="text-terminal-green font-bold tracking-widest">[DIRECT_CONTACT]</p>
              <p>
                <span className="text-terminal-green">EMAIL </span>
                <a href={`mailto:${SITE_META.email}`} className="text-terminal-cyan hover:text-terminal-green transition-colors">
                  {SITE_META.email}
                </a>
              </p>
              <p>
                <span className="text-terminal-green">LINKEDIN </span>
                <a href={SITE_META.linkedin} target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:text-terminal-green transition-colors">
                  {SITE_META.linkedin}
                </a>
              </p>
              <p>
                <span className="text-terminal-green">GITHUB </span>
                <a href={SITE_META.github} target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:text-terminal-green transition-colors">
                  {SITE_META.github}
                </a>
              </p>
              <p className="pt-2 text-terminal-muted/60">
                // El formulario conecta a AWS API Gateway → Lambda → SNS → Email
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
