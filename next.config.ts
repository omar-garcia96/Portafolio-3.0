import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* "export" genera una carpeta /out con HTML/CSS/JS puro
     sin necesidad de servidor Node — ideal para subirlo a S3 */
  output: "export",

  /* Agrega / al final de cada URL → S3 lo necesita para
     resolver rutas como /about/ en vez de /about            */
  trailingSlash: true,

  /* Next.js optimiza imágenes en servidor; como usamos S3
     (sin servidor) desactivamos la optimización automática  */
  images: { unoptimized: true },
};

export default nextConfig;
