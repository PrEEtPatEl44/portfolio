"use client";

import { useEffect, useRef, useState } from "react";

const STATIONS = [
  { id: "entry", label: "ENTRY" },
  { id: "work", label: "DEPLOYMENT" },
  { id: "artifacts", label: "ARTIFACTS" },
  { id: "embedding", label: "EMBEDDING" },
  { id: "activity", label: "ACTIVITY" },
  { id: "exit", label: "EXIT" },
];

/**
 * Instrument overlay: live camera depth plus a station rail. Reads the same
 * scroll position the 3D camera flies on, so the number is the real depth.
 */
export function DepthHud() {
  const zRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState("entry");

  useEffect(() => {
    let raf = 0;
    let shown = 0;
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const target = max > 0 ? (window.scrollY / max) * 352 : 0;
      shown += (target - shown) * 0.12;
      if (zRef.current) {
        zRef.current.textContent = "Z+" + shown.toFixed(1).padStart(5, "0");
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { threshold: 0.35 },
    );
    STATIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* bottom-right keeps clear of the command palette + accent picker chrome */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-30 font-space-mono text-[10px] tracking-[0.14em] text-zinc-500">
        DEPTH{" "}
        <span ref={zRef} className="text-[color:var(--brand)] tabular-nums">
          Z+000.0
        </span>
      </div>

      <nav
        aria-label="Sections"
        className="fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3.5 lg:flex"
      >
        {STATIONS.map((s) => {
          const on = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`group flex items-center gap-2.5 font-space-mono text-[10px] tracking-[0.14em] transition-colors ${
                on ? "text-[color:var(--brand)]" : "text-zinc-600"
              }`}
            >
              <span
                className={`block h-px bg-current transition-all ${on ? "w-7" : "w-4"}`}
              />
              <span
                className={`transition-opacity ${on ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              >
                {s.label}
              </span>
            </a>
          );
        })}
      </nav>
    </>
  );
}
