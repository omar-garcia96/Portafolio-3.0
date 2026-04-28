/* ============================================================
   page.tsx — Página principal (única página del sitio)

   Simplemente importa y apila todas las secciones en orden.
   El scroll del usuario navega entre ellas gracias a los IDs
   (#hero, #about, etc.) que cada sección define.
   ============================================================ */
import Hero       from "@/components/Hero";
import About      from "@/components/About";
import Skills     from "@/components/Skills";
import Experience from "@/components/Experience";
import Education  from "@/components/Education";
import Portfolio  from "@/components/Portfolio";
import Contact    from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />        {/* Presentación + typing effect */}
      <About />       {/* Resumen personal + estadísticas */}
      <Skills />      {/* Barras de habilidades por categoría */}
      <Experience />  {/* Historial laboral estilo log */}
      <Education />   {/* Educación formal + certificaciones */}
      <Portfolio />   {/* Proyectos destacados */}
      <Contact />     {/* Formulario → API Gateway → Lambda → SNS */}
    </>
  );
}
