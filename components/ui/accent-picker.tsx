"use client";

import { useState } from "react";
import { Palette } from "lucide-react";
const accents = [
  { name: "red", color: "oklch(0.55 0.25 27)", bg: "bg-red-500" },
  { name: "orange", color: "oklch(0.65 0.2 41)", bg: "bg-orange-500" },
  { name: "green", color: "oklch(0.55 0.2 145)", bg: "bg-green-500" },
];

export function AccentPicker() {
  const [active, setActive] = useState("orange");
  const [open, setOpen] = useState(false);

  function handleClick(accent: (typeof accents)[number]) {
    setActive(accent.name);
    document.documentElement.style.setProperty("--brand", accent.color);
  }

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
      {/* Palette icon button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-none
         border border-neutral-800 bg-black text-sm font-medium shadow-xs transition-colors hover:border-brand
         focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:shadow-none ${
           open ? "border-brand" : ""
         }`}
        aria-label="Toggle accent picker"
      >
        <Palette className="h-4 w-4 text-neutral-500 transition-colors group-hover:text-brand" />
      </button>

      {/* Color circles */}
      <div
        className={`flex items-center gap-2 transition-all ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        {accents.map((accent, i) => (
          <button
            key={accent.name}
            onClick={() => handleClick(accent)}
            className={`${accent.bg} h-3 w-3 rounded-full transition-transform hover:scale-125  ${active === accent.name ? "ring-2 ring-white ring-offset-1 ring-offset-black" : ""}`}
            style={{ animationDelay: `${i * 150}ms` }}
            aria-label={`Set accent to ${accent.name}`}
          />
        ))}
      </div>
    </div>
  );
}
