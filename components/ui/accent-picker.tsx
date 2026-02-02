"use client";

import { useState, useRef, useEffect } from "react";
import { Palette } from "lucide-react";
const accents = [
  { name: "red", color: "oklch(0.55 0.25 27)", bg: "bg-red-500" },
  { name: "orange", color: "oklch(0.65 0.2 41)", bg: "bg-orange-500" },
  { name: "purple", color: "oklch(0.5 0.3 300)", bg: "[rgb(153,51,255)]" },
  { name: "lime", color: "oklch(0.87 0.35 142)", bg: "[rgb(0,255,0)]" },
];

export function AccentPicker() {
  const [active, setActive] = useState("orange");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function handleClick(accent: (typeof accents)[number]) {
    setActive(accent.name);
    document.documentElement.style.setProperty("--brand", accent.color);
  }

  return (
    <div ref={ref} className="fixed top-4 left-4 z-50 flex items-center gap-2">
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
        className={`flex h-10 items-center gap-2 border border-neutral-800 bg-black px-3 shadow-xs transition-all ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        {accents.map((accent) => (
          <button
            key={accent.name}
            onClick={() => handleClick(accent)}
            className={`h-4 w-4 rounded-full transition-transform hover:scale-125 ${active === accent.name ? "ring-2 ring-white ring-offset-1 ring-offset-black" : ""}`}
            style={{ backgroundColor: accent.color }}
            aria-label={`Set accent to ${accent.name}`}
          />
        ))}
      </div>
    </div>
  );
}
