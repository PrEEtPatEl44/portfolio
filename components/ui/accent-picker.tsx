"use client";

import { useState, useEffect } from "react";

const accents = [
  { name: "red", color: "oklch(0.55 0.25 27)", bg: "bg-red-500" },
  { name: "orange", color: "oklch(0.65 0.2 41)", bg: "bg-orange-500" },
  { name: "green", color: "oklch(0.55 0.2 145)", bg: "bg-green-500" },
];

export function AccentPicker() {
  const [active, setActive] = useState("orange");
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShowPulse(true), 1500);
    return () => clearTimeout(id);
  }, []);

  function handleClick(accent: (typeof accents)[number]) {
    setActive(accent.name);
    document.documentElement.style.setProperty("--brand", accent.color);
  }

  return (
    <div className="group/picker fixed top-4 left-4 z-50 flex items-center gap-2">
      {accents.map((accent, i) => (
        <button
          key={accent.name}
          onClick={() => handleClick(accent)}
          className={`${accent.bg} h-3 w-3 rounded-full transition-transform hover:scale-125 ${showPulse ? "animate-accent-pulse" : ""} ${active === accent.name ? "ring-2 ring-white ring-offset-1 ring-offset-black" : ""}`}
          style={{ animationDelay: `${i * 150}ms` }}
          aria-label={`Set accent to ${accent.name}`}
        />
      ))}
      <span className="pointer-events-none ml-1 rounded bg-zinc-800 px-2 py-1 font-[family-name:var(--font-space-mono)] text-[10px] text-zinc-400 opacity-0 transition-opacity group-hover/picker:opacity-100">
        Change theme
      </span>
    </div>
  );
}
