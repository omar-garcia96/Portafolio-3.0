"use client";

import { useEffect, useState } from "react";
import { SITE_META } from "@/lib/constants";

export default function StatusBar() {
  const [latency, setLatency] = useState(12);
  const [time, setTime]       = useState("");

  // Update time every second
  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate latency jitter
  useEffect(() => {
    const t = setInterval(
      () => setLatency(Math.floor(Math.random() * 8) + 9),
      3000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-terminal-surface/95 backdrop-blur border-t border-terminal-border">
      {/* Status row */}
      <div className="px-4 py-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[10px] font-mono border-b border-terminal-border/40">
        <span className="text-terminal-green">
          SYS STATUS:{" "}
          <span className="text-terminal-green font-bold">[OK]</span>
        </span>
        <span className="text-terminal-muted hidden sm:inline">|</span>
        <span className="text-terminal-muted hidden sm:inline">
          CLOUD:{" "}
          <span className="text-terminal-green">[AWS:ACTIVE]</span>
        </span>
        <span className="text-terminal-muted hidden md:inline">|</span>
        <span className="text-terminal-muted hidden md:inline">
        </span>
        <span className="text-terminal-muted hidden lg:inline">|</span>
        <span className="text-terminal-muted hidden lg:inline">
          NETWORK:{" "}
          <span className="text-terminal-cyan">
            [IP:{SITE_META.ip}][LATENCY:{latency}ms]
          </span>
        </span>
        <span className="ml-auto text-terminal-muted hidden sm:inline">
          {time}
        </span>
      </div>

      {/* Links row */}
      <div className="px-4 py-1 flex flex-wrap items-center gap-x-6 text-[10px] font-mono">
        <a
          href="#contact"
          className="text-terminal-muted hover:text-terminal-green transition-colors"
        >
          omar@remote-shell ~ $ ./init_contact
        </a>
        <a
          href={SITE_META.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terminal-muted hover:text-terminal-cyan transition-colors hidden sm:inline"
        >
          omar@linkedin:~ $ ./open_profile
        </a>
        <a
          href={SITE_META.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terminal-muted hover:text-terminal-green transition-colors hidden md:inline cursor-text"
        >
          omar@github ~ $ ./social_contact_
          <span className="animate-blink">▌</span>
        </a>
      </div>
    </div>
  );
}
