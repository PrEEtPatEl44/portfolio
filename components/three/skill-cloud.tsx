"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { skills } from "@/data/data";
import { CAT_COLOR, SKILL_CATEGORY } from "@/lib/skill-categories";

/**
 * Skills projected onto a sphere (Fibonacci distribution) and rendered as DOM
 * labels. Projection is done by hand each frame so the text stays crisp and
 * selectable instead of being baked into a texture.
 */

export function SkillCloud() {
  const hostRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rot = useRef({ x: -0.2, y: 0 });
  const vel = useRef({ x: 0, y: 0.0016 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [reduced, setReduced] = useState(false);

  const points = useMemo(() => {
    const n = skills.length;
    const ga = Math.PI * (3 - Math.sqrt(5));
    return skills.map((s, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = ga * i;
      return {
        name: s.name,
        cat: SKILL_CATEGORY[s.name] ?? 0,
        x: Math.cos(th) * r,
        y,
        z: Math.sin(th) * r,
      };
    });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const host = hostRef.current;
      if (host) {
        const w = host.clientWidth;
        const h = host.clientHeight;
        const R = Math.min(w, h) * 0.4;

        if (!reduced) {
          if (!drag.current) {
            vel.current.y += (0.0016 - vel.current.y) * 0.02;
            vel.current.x *= 0.94;
          }
          rot.current.y += vel.current.y;
          rot.current.x = Math.max(
            -0.9,
            Math.min(0.9, rot.current.x + vel.current.x),
          );
        }

        const cx = Math.cos(rot.current.x), sx = Math.sin(rot.current.x);
        const cy = Math.cos(rot.current.y), sy = Math.sin(rot.current.y);

        points.forEach((p, i) => {
          const el = nodeRefs.current[i];
          if (!el) return;
          const x1 = p.x * cy + p.z * sy;
          const z1 = -p.x * sy + p.z * cy;
          const y2 = p.y * cx - z1 * sx;
          const z2 = p.y * sx + z1 * cx;

          const persp = 1.9 / (1.9 + z2 * 0.85);
          const depth = (z2 + 1) / 2;
          el.style.transform =
            `translate3d(${(w / 2 + x1 * R * persp).toFixed(1)}px,` +
            `${(h / 2 + y2 * R * persp).toFixed(1)}px,0) ` +
            `translate(-50%,-50%) scale(${(0.72 + depth * 0.5).toFixed(3)})`;
          el.style.opacity = (0.25 + depth * 0.75).toFixed(3);
          el.style.zIndex = String(Math.round(depth * 100));
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [points, reduced]);

  return (
    <div
      ref={hostRef}
      className="relative h-[clamp(320px,50vw,460px)] w-full cursor-grab touch-pan-y active:cursor-grabbing"
      role="img"
      aria-label={`Rotating 3D cloud of ${skills.length} skills`}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        vel.current.y = (e.clientX - drag.current.x) * 0.00035;
        vel.current.x = -(e.clientY - drag.current.y) * 0.00035;
        drag.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    >
      {points.map((p, i) => (
        <span
          key={p.name}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          className="pointer-events-none absolute left-0 top-0 whitespace-nowrap font-space-mono text-xs tracking-wide"
          style={{ color: CAT_COLOR[p.cat] }}
        >
          {p.name}
        </span>
      ))}
    </div>
  );
}
