"use client";

import { useEffect, useState } from "react";

interface TerminalTextProps {
  text: string;
  speed?: number;        // ms per character
  delay?: number;        // ms before starting
  className?: string;
  showCursor?: boolean;
  onComplete?: () => void;
}

export default function TerminalText({
  text,
  speed = 45,
  delay = 0,
  className = "",
  showCursor = true,
  onComplete,
}: TerminalTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      setDone(true);
      onComplete?.();
      return;
    }
    const t = setTimeout(
      () => setDisplayed(text.slice(0, displayed.length + 1)),
      speed
    );
    return () => clearTimeout(t);
  }, [started, displayed, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && (
        <span
          className={`inline-block w-[2px] h-[1em] bg-terminal-green align-middle ml-0.5 ${
            done ? "animate-blink" : ""
          }`}
        />
      )}
    </span>
  );
}
