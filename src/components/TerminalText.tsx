/* ============================================================
   TerminalText.tsx — Componente de efecto "typing"

   Muestra el texto carácter por carácter, simulando que
   alguien lo está escribiendo en un terminal.

   Props:
     text       → texto a escribir
     speed      → milisegundos entre cada carácter (default 45ms)
     delay      → ms de espera antes de empezar (default 0)
     className  → clases CSS adicionales
     showCursor → muestra/oculta el cursor parpadeante
     onComplete → callback cuando termina de escribir
   ============================================================ */
"use client";

import { useEffect, useState } from "react";

interface Props {
  text:        string;
  speed?:      number;
  delay?:      number;
  className?:  string;
  showCursor?: boolean;
  onComplete?: () => void;
}

export default function TerminalText({
  text,
  speed      = 45,
  delay      = 0,
  className  = "",
  showCursor = true,
  onComplete,
}: Props) {
  /* Texto que se muestra hasta ahora (va creciendo) */
  const [displayed, setDisplayed] = useState("");

  /* true cuando ya terminó de escribir todo */
  const [done, setDone] = useState(false);

  /* true cuando el delay inicial ya pasó */
  const [started, setStarted] = useState(false);

  /* ── Esperar el delay antes de empezar ──────────────── */
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  /* ── Agregar un carácter cada `speed` ms ─────────────── */
  useEffect(() => {
    if (!started) return;

    if (displayed.length >= text.length) {
      // Terminamos de escribir
      setDone(true);
      onComplete?.();
      return;
    }

    /* Programa el siguiente carácter */
    const t = setTimeout(
      () => setDisplayed(text.slice(0, displayed.length + 1)),
      speed
    );
    return () => clearTimeout(t);
  }, [started, displayed, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {/* Cursor: barra vertical que parpadea cuando terminó de escribir */}
      {showCursor && (
        <span
          className={`inline-block w-[2px] h-[1em] bg-terminal-green align-middle ml-0.5 ${
            done ? "animate-blink" : "opacity-100"
          }`}
        />
      )}
    </span>
  );
}
