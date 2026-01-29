"use client";

import { useEffect, useState } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

export function TextScramble({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const duration = 1200;
    const frameInterval = 30;
    const totalFrames = duration / frameInterval;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const lockedCount = Math.floor(progress * text.length);

      const result = text.split("").map((char, i) => {
        if (char === " ") return " ";
        if (i < lockedCount) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      });

      setDisplay(result.join(""));

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, frameInterval);

    return () => clearInterval(interval);
  }, [mounted, text]);

  return <span className={className}>{display}</span>;
}
