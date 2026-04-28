/* ============================================================
   layout.tsx — Root Layout de Next.js (App Router)
   
   Este componente envuelve TODAS las páginas del sitio.
   Aquí se define:
     - La fuente global (JetBrains Mono via next/font)
     - Los metadatos SEO (title, description, og:)
     - Los componentes que aparecen en toda la app (Navbar, StatusBar)
   ============================================================ */
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar    from "@/components/Navbar";
import StatusBar from "@/components/StatusBar";

/* next/font descarga la fuente en build time y la sirve localmente
   → sin peticiones externas a Google en producción (mejor privacidad y velocidad)
   → "variable" expone la fuente como variable CSS --font-mono                   */
const jetbrains = JetBrains_Mono({
  subsets:  ["latin"],
  variable: "--font-mono",
  display:  "swap", // muestra texto con fuente de respaldo mientras carga
});

/* Metadatos que Next.js inyecta automáticamente en el <head>
   → openGraph se usa cuando alguien comparte el link en redes  */
export const metadata: Metadata = {
  title:       "Omar Garcia | Cloud & DevOps Engineer",
  description: "Ingeniero de Sistemas especializado en Cloud Computing & Automatización.",
  keywords:    ["Cloud Engineer", "DevOps", "AWS", "Terraform", "GitHub", "CI/CD", "Docker", "Kubernetes", "Infraestructura como Código", "Automatización" ],
  authors:     [{ name: "Omar Garcia" }],
  openGraph: {
    title:       "Omar Garcia | Cloud & DevOps Engineer",
    description: "Construyendo soluciones eficientes, estables y seguras en entornos complejos.",
    url:         "https://omargarcia.xyz",
    type:        "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      {/* jetbrains.variable → inyecta --font-mono en el DOM
          scanlines / crt-noise → efectos visuales definidos en globals.css */}
      <body className={`${jetbrains.variable} scanlines crt-noise antialiased`}>

        {/* Navbar fijo en la parte superior */}
        <Navbar />

        {/* Contenido de cada página (page.tsx) */}
        <main>{children}</main>

        {/* Barra de estado fija en la parte inferior */}
        <StatusBar />

      </body>
    </html>
  );
}
