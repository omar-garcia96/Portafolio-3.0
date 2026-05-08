/* ============================================================
   JarvisActivator.tsx — Detector de aplausos para activar JARVIS
   
   Flujo completo:
     1. Muestra el texto "aplaude dos veces para activar a JARVIS"
     2. Al hacer clic → solicita acceso al micrófono
     3. Analiza el audio en tiempo real buscando picos de volumen
     4. Dos picos seguidos (< 1.5s entre ellos) = dos aplausos
     5. Reproduce el audio de JARVIS
     6. Muestra animación de activación
   ============================================================ */
"use client";

import { useEffect, useRef, useState } from "react";

type JarvisState = "idle" | "listening" | "activated" | "error";

export default function JarvisActivator() {

  const [state, setState]         = useState<JarvisState>("idle");
  const [showHint, setShowHint]   = useState(false);

  // Refs para el análisis de audio — no necesitan re-render
  const audioCtxRef   = useRef<AudioContext | null>(null);
  const analyserRef   = useRef<AnalyserNode | null>(null);
  const streamRef     = useRef<MediaStream | null>(null);
  const frameRef      = useRef<number>(0);
  const lastClapRef   = useRef<number>(0);  // timestamp del último aplauso
  const clapCountRef  = useRef<number>(0);  // contador de aplausos
  const cooldownRef   = useRef<boolean>(false); // evita detectar el mismo aplauso dos veces
  const audioRef      = useRef<HTMLAudioElement | null>(null);

  // Muestra el hint después de 3 segundos para no interrumpir la animación del Hero
  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => stopListening();
  }, []);

  // Detiene solo el loop — mantiene stream y contexto activos
    const stopListening = () => {
        cancelAnimationFrame(frameRef.current);
    };

    // Cierra todo — solo al desmontar el componente
    const stopAll = () => {
        cancelAnimationFrame(frameRef.current);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
        analyserRef.current = null;
    };

  const startListening = async () => {
    // Si ya está activado o escuchando, no hace nada
    if (state === "listening" || state === "activated") return;

    try {
      // Solicita acceso al micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Crea el contexto de audio y el analizador
      const ctx      = new AudioContext();
      const analyser = ctx.createAnalyser();

      // fftSize define la resolución del análisis —
      // 256 es suficiente para detectar picos de volumen
      analyser.fftSize = 256;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioCtxRef.current  = ctx;
      analyserRef.current  = analyser;

      setState("listening");
      clapCountRef.current = 0;
      lastClapRef.current  = 0;

      detectClaps(analyser);

    } catch {
      // El usuario denegó el micrófono
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  const detectClaps = (analyser: AnalyserNode) => {
    const buffer = new Uint8Array(analyser.frequencyBinCount);

    const loop = () => {
      frameRef.current = requestAnimationFrame(loop);
      analyser.getByteFrequencyData(buffer);

      // Calcula el volumen promedio del frame actual
      const avg = buffer.reduce((a, b) => a + b, 0) / buffer.length;

      // Umbral — un aplauso genera un pico brusco de volumen.
      // 45 funciona bien en la mayoría de micrófonos y entornos.
      // Si detecta mal ajusta este valor: más alto = menos sensible
      const THRESHOLD = 93;

      if (avg > THRESHOLD && !cooldownRef.current) {
        cooldownRef.current = true;
        const now = Date.now();

        // Ventana de tiempo entre aplausos:
        // mínimo 200ms (evita doble detección del mismo aplauso)
        // máximo 1500ms (si tarda más, reinicia el contador)
        if (now - lastClapRef.current > 200 && now - lastClapRef.current < 1500) {
          clapCountRef.current += 1;
        } else {
          clapCountRef.current = 1;
        }

        lastClapRef.current = now;

        // ¡Dos aplausos detectados!
        if (clapCountRef.current >= 2) {
          clapCountRef.current = 0;
          activateJarvis();
          return; // detiene el loop
        }

        // Cooldown de 300ms para no detectar el mismo aplauso múltiples veces
        setTimeout(() => { cooldownRef.current = false; }, 300);
      }
    };

    loop();
  };

  const activateJarvis = () => {
    // Solo cancela el loop — NO cierra el stream ni el contexto
    cancelAnimationFrame(frameRef.current);
    setState("activated");

    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/jarvis.mp3");
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});

    // Cuando termina el audio vuelve a escuchar con el mismo stream
    audioRef.current.onended = () => {
        clapCountRef.current = 0;
        lastClapRef.current  = 0;
        cooldownRef.current  = false;
        cancelAnimationFrame(frameRef.current);
        setState("idle");
    };
  };

  return (
    <div className="hidden md:flex absolute top-20 right-8 z-10 flex-col items-end gap-2">

      {/* Texto hint — aparece después de 3 segundos */}
      {showHint && state === "idle" && (
        <button
          onClick={startListening}
          className="text-white/40 hover:text-white/70 text-[10px] font-mono tracking-wide transition-colors cursor-pointer text-right"
        >
          // click para activar a JARVIS
        </button>
      )}

      {/* Estado: escuchando */}
      {state === "listening" && (
        <div className="flex items-center gap-2">
          {/* Indicador de micrófono activo */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff41] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff41]" />
          </span>
          <span className="text-[#00ff41] text-[10px] font-mono tracking-wide">
            // escuchando... aplaude dos veces
          </span>
        </div>
      )}

      {/* Estado: activado */}
      {state === "activated" && (
        <div className="flex flex-col items-end gap-1 animate-pulse">
          <span className="text-[#00ff41] text-[10px] font-mono tracking-wide">
            // JARVIS ONLINE
          </span>
          <span className="text-white/60 text-[10px] font-mono">
            {">"} Bienvenido, Sir.
          </span>
        </div>
      )}

      {/* Estado: error de micrófono */}
      {state === "error" && (
        <span className="text-red-400/70 text-[10px] font-mono tracking-wide">
          // acceso al micrófono denegado
        </span>
      )}

    </div>
  );
}