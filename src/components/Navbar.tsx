/* ============================================================
   Navbar.tsx — Barra de navegación fija en la parte superior

   Comportamiento:
     - Fondo transparente → opaco al hacer scroll
     - Resalta el enlace de la sección activa (IntersectionObserver)
     - Menú hamburguesa en móvil
   ============================================================ */
"use client"; // necesario porque usa hooks (useState, useEffect)

import { useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/data";

export default function Navbar() {
  /* true cuando el usuario ha scrolleado más de 20px */
  const [scrolled, setScrolled] = useState(false);

  /* id de la sección actualmente visible en pantalla */
  const [activeId, setActiveId] = useState("");

  /* controla si el menú móvil está abierto */
  const [menuOpen, setMenuOpen] = useState(false);

  /* ── Detectar scroll para cambiar fondo del navbar ──── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll); // limpieza
  }, []);

  /* ── Detectar qué sección está en pantalla ───────────── 
     IntersectionObserver dispara el callback cuando un elemento
     entra o sale del viewport.
     rootMargin "-40% 0px -55% 0px" → solo activa cuando la
     sección está en la franja central de la pantalla          */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    // Observamos cada sección
    NAV_LINKS.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-terminal-bg/95 backdrop-blur border-b border-terminal-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">

        {/* ── Logo / handle ──────────────────────────── */}
        <a href="#hero" className="text-terminal-green text-sm font-bold tracking-wider hover:glow-green transition-all">
          {SITE.handle}
        </a>

        {/* ── Links de escritorio (ocultos en móvil) ─── */}
        <ul className="hidden md:flex items-center">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} className="flex items-center">
              {/* Separador "::" entre links (estilo terminal) */}
              {i > 0 && (
                <span className="text-terminal-border text-xs mx-1 select-none">::</span>
              )}
              <a
                href={link.href}
                className={`text-xs tracking-widest px-1 transition-all ${
                  activeId === link.href.slice(1) // compara "skills" con "skills"
                    ? "text-terminal-green glow-green"
                    : "text-terminal-muted hover:text-terminal-green"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* ── Botón hamburguesa (solo visible en móvil) ─ */}
        <button
          className="md:hidden text-terminal-green p-1"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Abrir menú"
        >
          {/* Tres líneas que se transforman en X cuando el menú está abierto */}
          <div className="space-y-1.5">
            <span className={`block h-px w-5 bg-terminal-green transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-px w-5 bg-terminal-green transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-terminal-green transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </nav>

      {/* ── Menú desplegable móvil ──────────────────────── */}
      {menuOpen && (
        <div className="md:hidden bg-terminal-surface border-b border-terminal-border">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)} // cierra al navegar
              className="block px-6 py-3 text-sm text-terminal-muted hover:text-terminal-green border-b border-terminal-border/30 last:border-0 transition-colors"
            >
              &gt; {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
