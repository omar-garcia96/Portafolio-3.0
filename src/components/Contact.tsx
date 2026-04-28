/* ============================================================
   Contact.tsx — Sección de contacto

   Flujo completo del formulario:
     1. Usuario llena los campos (name, email, subject, message)
     2. Al enviar → POST a API_ENDPOINT (AWS API Gateway)
     3. API Gateway invoca la Lambda function
     4. Lambda publica un mensaje en SNS
     5. SNS envía el email al propietario del sitio

   El panel de "stdout" muestra los logs del proceso en tiempo
   real para mantener la estética terminal.
   ============================================================ */
"use client";

import { useEffect, useRef, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import { API_ENDPOINT, SITE } from "@/lib/data";
import type { ContactForm, ApiResponse } from "@/lib/data";

/* Estados posibles del formulario */
type Status = "idle" | "sending" | "success" | "error";

/* Valores iniciales vacíos del formulario */
const EMPTY_FORM: ContactForm = { name: "", email: "", subject: "", message: "" };

/* Campos de texto (input) del formulario — generados dinámicamente */
const TEXT_FIELDS = [
  { name: "name"    as const, label: "NAME",    type: "text",  placeholder: "Tu nombre"         },
  { name: "email"   as const, label: "EMAIL",   type: "email", placeholder: "tu@email.com"      },
  { name: "subject" as const, label: "SUBJECT", type: "text",  placeholder: "Asunto del mensaje" },
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);

  /* Estado del formulario controlado: cada campo se sincroniza con `form` */
  const [form, setForm]     = useState<ContactForm>(EMPTY_FORM);

  /* Estado del envío: controla texto del botón y estilos */
  const [status, setStatus] = useState<Status>("idle");

  /* Log visual (panel de stdout): muestra el progreso del envío */
  const [logs, setLogs]     = useState<string[]>([
    "// Formulario de contacto inicializado.",
    "// Completa los campos y ejecuta ./send_message",
  ]);

  /* Referencia al contenedor del log para auto-scroll al fondo */
  const logRef = useRef<HTMLDivElement>(null);

  /* Activa la animación de entrada al hacer scroll */
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

  /* Scroll automático al fondo del log cada vez que se agrega una línea */
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  /* Agrega una línea nueva al panel de stdout */
  const addLog = (line: string) => setLogs((prev) => [...prev, line]);

  /* Sincroniza cada input/textarea con el estado `form` */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ── Envío del formulario ────────────────────────────────
     1. Valida campos requeridos
     2. Muestra logs de progreso
     3. POST a API Gateway
     4. Maneja respuesta exitosa o error                    */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Validación básica: los tres primeros campos son obligatorios */
    if (!form.name || !form.email || !form.message) {
      addLog("ERROR: Campos requeridos vacíos (name, email, message).");
      return;
    }

    setStatus("sending");
    addLog(`[${new Date().toISOString()}] Iniciando envío...`);
    addLog(`> POST ${API_ENDPOINT}`);
    addLog(`> payload: { name: "${form.name}", email: "${form.email}" }`);

    try {
      const res = await fetch(API_ENDPOINT, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });

      /* Intenta parsear JSON; si falla, lanza error */
      const data: ApiResponse = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        addLog("✓ Respuesta HTTP 200 OK.");
        addLog("✓ Lambda ejecutada correctamente.");
        addLog("✓ Mensaje publicado en SNS → email enviado.");
        setForm(EMPTY_FORM); // limpia el formulario
      } else {
        throw new Error(data.message ?? `HTTP ${res.status}`);
      }
    } catch (err: unknown) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Error de red desconocido";
      addLog(`ERROR: ${msg}`);
      addLog("// Verifica que API_ENDPOINT esté configurado en .env.local");
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionTitle label="CONTACT" subtitle="./init_contact — envía un mensaje" />

        <div ref={ref} className="fade-up grid md:grid-cols-2 gap-10">

          {/* ── Columna izquierda: formulario ─────────────────── */}
          <div className="terminal-window">

            {/* Barra de título */}
            <div className="terminal-titlebar">
              <div className="terminal-dot bg-[#ff5f57]" />
              <div className="terminal-dot bg-[#febc2e]" />
              <div className="terminal-dot bg-[#28c840]" />
              <span className="ml-3 text-terminal-muted text-xs">bash — contact_form.sh</span>
            </div>

            {/* Formulario — sin <form> action para evitar navegación;
                el envío se maneja con onSubmit → fetch              */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Campos de texto (name, email, subject) */}
              {TEXT_FIELDS.map((field) => (
                <div key={field.name}>
                  {/* Label en mayúsculas estilo terminal */}
                  <label className="block text-terminal-green text-xs mb-1.5 tracking-widest">
                    {field.label}
                  </label>
                  {/* Prompt ">" antes de cada input */}
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

              {/* Campo de mensaje (textarea) */}
              <div>
                <label className="block text-terminal-green text-xs mb-1.5 tracking-widest">
                  MESSAGE
                </label>
                <div className="flex gap-2 items-start">
                  <span className="text-terminal-muted text-xs shrink-0 mt-2">&gt;</span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aquí..."
                    rows={4}
                    /* "terminal-input" base + overrides para textarea */
                    className="terminal-input resize-none border border-terminal-border p-2 !border-b-0 rounded-none focus:!border-terminal-green"
                  />
                </div>
              </div>

              {/* Botón de envío — cambia texto y estilo según el estado */}
              <button
                type="submit"
                disabled={status === "sending"}
                className={`w-full py-2.5 text-xs tracking-widest border transition-all duration-200 ${
                  status === "sending"
                    ? "border-terminal-muted text-terminal-muted cursor-not-allowed"
                    : status === "success"
                    ? "border-terminal-green bg-terminal-green/10 text-terminal-green"
                    : status === "error"
                    ? "border-terminal-red text-terminal-red hover:bg-terminal-red/10"
                    : "border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-bg"
                }`}
              >
                {status === "sending" ? "[ ENVIANDO... ]"        :
                 status === "success" ? "[ ✓ MENSAJE ENVIADO ]"  :
                 status === "error"   ? "[ ✗ REINTENTAR ]"       :
                                        "> ./send_message"       }
              </button>
            </form>
          </div>

          {/* ── Columna derecha: log de stdout + info directa ─── */}
          <div className="space-y-6">

            {/* Panel de logs: muestra el proceso de envío en tiempo real */}
            <div className="terminal-window">
              <div className="terminal-titlebar">
                <div className="terminal-dot bg-[#ff5f57]" />
                <div className="terminal-dot bg-[#febc2e]" />
                <div className="terminal-dot bg-[#28c840]" />
                <span className="ml-3 text-terminal-muted text-xs">stdout — process.log</span>
              </div>

              {/* Área scrolleable de logs */}
              <div ref={logRef} className="p-4 min-h-[180px] max-h-[220px] overflow-y-auto space-y-1">
                {logs.map((line, i) => (
                  <p
                    key={i}
                    className={`text-xs ${
                      line.startsWith("ERROR")   ? "text-terminal-red"   :
                      line.startsWith("✓")       ? "text-terminal-green" :
                      line.startsWith(">")       ? "text-terminal-cyan"  :
                                                   "text-terminal-muted"
                    }`}
                  >
                    {line}
                  </p>
                ))}
                {/* Cursor parpadeante al final del log */}
                <span className="animate-blink text-terminal-green text-xs">▌</span>
              </div>
            </div>

            {/* Datos de contacto directo */}
            <div className="space-y-3 text-xs text-terminal-muted">
              <p className="text-terminal-green font-bold tracking-widest">[DIRECT_CONTACT]</p>

              <p>
                <span className="text-terminal-green">EMAIL    </span>
                <a href={`mailto:${SITE.email}`}
                   className="text-terminal-cyan hover:text-terminal-green transition-colors">
                  {SITE.email}
                </a>
              </p>

              <p>
                <span className="text-terminal-green">LINKEDIN </span>
                <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer"
                   className="text-terminal-cyan hover:text-terminal-green transition-colors">
                  {SITE.linkedin}
                </a>
              </p>

              <p>
                <span className="text-terminal-green">GITHUB   </span>
                <a href={SITE.github} target="_blank" rel="noopener noreferrer"
                   className="text-terminal-cyan hover:text-terminal-green transition-colors">
                  {SITE.github}
                </a>
              </p>

              {/* Nota técnica del flujo serverless */}
              <p className="pt-2 text-terminal-muted/50 leading-relaxed">
                // Flujo: formulario → API Gateway → Lambda → SNS → Email
                <br />
                // Endpoint configurado en NEXT_PUBLIC_API_ENDPOINT
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
