import type { Config } from "tailwindcss";

const config: Config = {
  /* Tailwind solo genera las clases que realmente se usan
     en estos archivos — reduce el tamaño del CSS final     */
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      /* ── Paleta de colores del tema terminal ─────────── */
      colors: {
        terminal: {
          bg:      "#080c10", // fondo principal (negro azulado)
          surface: "#0d1117", // fondo de tarjetas y ventanas
          border:  "#1a2332", // bordes sutiles
          green:   "#00ff41", // verde neón principal (texto, acentos)
          cyan:    "#00d4ff", // cian para highlights secundarios
          dim:     "#4a9f5c", // verde apagado (texto de prompt)
          muted:   "#8b949e", // gris para texto secundario
          text:    "#c9d1d9", // blanco roto para texto normal
          red:     "#ff4444", // rojo para errores
          yellow:  "#ffd700", // amarillo para advertencias / badges
        },
      },

      /* ── Fuente monospace como familia por defecto ───── */
      fontFamily: {
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },

      /* ── Animaciones personalizadas ──────────────────── */
      animation: {
        blink:   "blink 1s step-end infinite",   // cursor parpadeante
        glitch:  "glitch 4s infinite",            // efecto glitch en títulos
        scanline:"scanline 8s linear infinite",   // línea que baja (CRT)
        fadeUp:  "fadeUp 0.6s ease forwards",     // entrada de secciones
      },

      /* ── Keyframes de cada animación ─────────────────── */
      keyframes: {
        // Cursor: alterna opacidad entre 0 y 1
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
        // Glitch: mueve ligeramente el elemento en momentos aleatorios
        glitch: {
          "0%, 88%, 100%": { transform: "translate(0)" },
          "90%": { transform: "translate(-2px,  1px)" },
          "92%": { transform: "translate( 2px, -1px)" },
          "94%": { transform: "translate(-1px,  2px)" },
        },
        // Scanline: una línea semitransparente recorre la pantalla de arriba a abajo
        scanline: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        // FadeUp: los elementos entran desde abajo con fade
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)"    },
        },
      },
    },
  },
  plugins: [],
};

export default config;
