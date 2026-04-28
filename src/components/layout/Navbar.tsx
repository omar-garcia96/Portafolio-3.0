"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, SITE_META } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [activeSection, setActive]  = useState("");

  // Scroll-based background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

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
        {/* Logo */}
        <a
          href="#hero"
          className="text-terminal-green font-mono text-sm font-bold tracking-wider hover:glow-green transition-all"
        >
          {SITE_META.handle}
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-0">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} className="flex items-center">
              {i > 0 && (
                <span className="text-terminal-border mx-1 text-xs select-none">::</span>
              )}
              <a
                href={link.href}
                className={`text-xs font-mono tracking-widest transition-all px-1 py-0.5 ${
                  activeSection === link.href.slice(1)
                    ? "text-terminal-green glow-green"
                    : "text-terminal-muted hover:text-terminal-green"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-terminal-green p-1"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-px w-5 bg-terminal-green transition-all ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-px w-5 bg-terminal-green transition-all ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-5 bg-terminal-green transition-all ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-terminal-surface border-b border-terminal-border">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 text-sm text-terminal-muted hover:text-terminal-green hover:bg-terminal-border/20 transition-colors border-b border-terminal-border/40 last:border-0"
            >
              &gt; {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
