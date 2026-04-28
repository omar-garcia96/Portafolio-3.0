/* ============================================================
   StatusBar.tsx — Barra fija en la parte inferior del sitio

   Simula la barra de estado de un terminal / IDE:
     - Fila superior: SYS STATUS · CLOUD · SEC LEVEL · NETWORK + hora
     - Fila inferior: atajos de navegación rápida
   
   La latencia y la hora se actualizan en tiempo real con setInterval.
   ============================================================ */
"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/data";

export default function StatusBar() {
  /* Hora actual en formato HH:MM:SS */
  const [time, setTime] = useState("");

  /* Latencia simulada que varía para dar sensación de "vida" */
  const [latency, setLatency] = useState(12);

  /* ── Actualizar reloj cada segundo ──────────────────── */
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick(); // llamada inicial para evitar el flash de ""
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ── Variar latencia cada 3 segundos (9–17ms) ────────── */
  useEffect(() => {
    const id = setInterval(
      () => setLatency(Math.floor(Math.random() * 8) + 9),
      3000
    );
    return () => clearInterval(id);
  }, []);

  return (
    /* pb-[env(safe-area-inset-bottom)] → respeta el notch en iOS */
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-terminal-surface/95 backdrop-blur border-t border-terminal-border">

      {/* ── Fila 1: métricas del sistema ─────────────────── */}
      <div className="px-4 py-1 flex flex-wrap items-center gap-x-4 text-[10px] font-mono border-b border-terminal-border/30">

        {/* Estado general del servidor */}
        <span className="text-terminal-green">
          SYS STATUS: <strong>[OK]</strong>
        </span>

        <span className="text-terminal-muted hidden sm:inline">|</span>

        {/* Plataformas cloud activas */}
        <span className="hidden sm:inline text-terminal-muted">
          CLOUD:{" "}
          <span className="text-terminal-green">[AWS:ACTIVE]</span>
        </span>

        <span className="text-terminal-muted hidden lg:inline">|</span>

        {/* IP y latencia de red */}
        <span className="hidden lg:inline text-terminal-muted">
          NETWORK:{" "}
          <span className="text-terminal-cyan">
            [IP:{SITE.ip}][LATENCY:{latency}ms]
          </span>
        </span>

        {/* Reloj — empujado a la derecha con ml-auto */}
        <span className="ml-auto text-terminal-muted hidden sm:inline">{time}</span>
      </div>

      {/* ── Fila 2: atajos de navegación rápida ───────────── */}
      <div className="px-4 py-1 flex flex-wrap items-center gap-x-6 text-[10px] font-mono">

        {/* Atajo 1: ir a la sección contacto */}
        <a href="#contact" className="text-terminal-muted hover:text-terminal-green transition-colors">
          omar@remote-shell ~ $ ./init_contact
        </a>

        {/* Atajo 2: abrir LinkedIn (nueva pestaña) */}
        <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer"
           className="hidden sm:inline text-terminal-muted hover:text-terminal-cyan transition-colors">
          omar@linkedin:~ $ ./open_profile
        </a>

        {/* Atajo 3: abrir GitHub — cursor parpadeante al final */}
        <a href={SITE.github} target="_blank" rel="noopener noreferrer"
           className="hidden md:inline text-terminal-muted hover:text-terminal-green transition-colors">
          omar@github ~ $ ./social_contact_
          <span className="animate-blink">▌</span>
        </a>
      </div>
    </div>
  );
}
