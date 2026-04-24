"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

type EyeX = -2 | -1 | 0 | 1 | 2;
type Mood = "calm" | "curious" | "excited";
type GazeSource = "idle" | "cursor";

const EYE_X_VALUES: readonly EyeX[] = [-2, -1, 0, 1, 2];

function eyesForBucket(bucket: EyeX): [number, number] {
  switch (bucket) {
    case -2:
      return [2, 5];
    case -1:
      return [3, 6];
    case 0:
      return [4, 7];
    case 1:
      return [5, 8];
    case 2:
      return [6, 9];
  }
}

const DIALOGS_BY_MOOD: Record<Mood, readonly string[]> = {
  calm: [
    "hii",
    "sup",
    "yo",
    "who dat?",
    ":)",
    "nice name",
    "reading...",
    "cozy",
  ],
  curious: [
    "hmm?",
    "what's this?",
    "keep going",
    "ooo",
    "neat",
    "tell me more",
    "interesting",
  ],
  excited: ["!!!", "yeees", "woo", "nice!", "cool!", ":D", "more!", "whee"],
};

function faceRow(bucket: EyeX) {
  const [a, b] = eyesForBucket(bucket);
  const eyes = new Set([a, b]);
  const segments: Array<{ x: number; width: number }> = [];
  let start: number | null = null;
  for (let x = 1; x <= 10; x++) {
    if (eyes.has(x)) {
      if (start !== null) {
        segments.push({ x: start, width: x - start });
        start = null;
      }
    } else if (start === null) {
      start = x;
    }
  }
  if (start !== null) segments.push({ x: start, width: 11 - start });
  return segments;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function PixelMascot({ className = "" }: { className?: string }) {
  const [eyeX, setEyeX] = useState<EyeX>(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [dialog, setDialog] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood>("calm");
  const [gazeSource, setGazeSource] = useState<GazeSource>("idle");
  const [reducedMotion, setReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<{ cx: number; cy: number } | null>(null);
  const lastMoveRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const latestEventRef = useRef<{ x: number; y: number } | null>(null);

  const gazeSourceRef = useRef<GazeSource>("idle");
  const eyeXRef = useRef<EyeX>(0);
  useEffect(() => {
    gazeSourceRef.current = gazeSource;
  }, [gazeSource]);
  useEffect(() => {
    eyeXRef.current = eyeX;
  }, [eyeX]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setMood((prev) => {
      if (prev === "calm" && v > 0.32) return "curious";
      if (prev === "curious" && v < 0.28) return "calm";
      if (prev === "curious" && v > 0.72) return "excited";
      if (prev === "excited" && v < 0.68) return "curious";
      return prev;
    });
  });

  useEffect(() => {
    const recomputeCenter = () => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      centerRef.current = {
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
      };
    };

    const processMove = () => {
      rafRef.current = null;
      const center = centerRef.current;
      const p = latestEventRef.current;
      if (!center || !p) return;
      const dx = p.x - center.cx;
      const bucket: EyeX =
        dx < -120 ? -2 : dx < -40 ? -1 : dx > 120 ? 2 : dx > 40 ? 1 : 0;
      if (eyeXRef.current !== bucket) setEyeX(bucket);
      if (gazeSourceRef.current !== "cursor") setGazeSource("cursor");
    };

    const onMove = (e: MouseEvent) => {
      latestEventRef.current = { x: e.clientX, y: e.clientY };
      lastMoveRef.current = performance.now();
      if (!centerRef.current) recomputeCenter();
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(processMove);
    };

    const onViewportChange = () => {
      if (centerRef.current) recomputeCenter();
    };

    // FadeIn wrapper translates the mascot on mount — re-cache after it settles.
    const settleTimeout = window.setTimeout(() => {
      if (centerRef.current) recomputeCenter();
    }, 800);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", onViewportChange, { passive: true });
    window.addEventListener("scroll", onViewportChange, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange);
      window.clearTimeout(settleTimeout);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (
        gazeSourceRef.current === "cursor" &&
        performance.now() - lastMoveRef.current > 2500
      ) {
        setGazeSource("idle");
      }
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const blinkMs =
      mood === "excited" ? 1800 : mood === "curious" ? 2800 : 3500;
    const id = window.setInterval(() => {
      setIsBlinking(true);
      window.setTimeout(() => setIsBlinking(false), 140);
    }, blinkMs);
    return () => window.clearInterval(id);
  }, [mood]);

  useEffect(() => {
    if (gazeSource !== "idle") return;
    let timeoutId: number | undefined;
    const minDelay = mood === "excited" ? 1200 : mood === "curious" ? 1600 : 2000;
    const jitter = mood === "excited" ? 800 : 1200;
    const tick = () => {
      const next =
        EYE_X_VALUES[Math.floor(Math.random() * EYE_X_VALUES.length)];
      setEyeX(next);
      timeoutId = window.setTimeout(tick, minDelay + Math.random() * jitter);
    };
    timeoutId = window.setTimeout(tick, 900);
    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [gazeSource, mood]);

  useEffect(() => {
    let timeoutId: number | undefined;
    let clearId: number | undefined;
    const prob = mood === "excited" ? 0.55 : mood === "curious" ? 0.4 : 0.3;
    const minDelay = mood === "excited" ? 2400 : 3200;
    const tick = () => {
      if (Math.random() < prob) {
        const line = pick(DIALOGS_BY_MOOD[mood]);
        setDialog(line);
        if (clearId !== undefined) window.clearTimeout(clearId);
        clearId = window.setTimeout(() => {
          setDialog((d) => (d === line ? null : d));
        }, 1800);
      }
      timeoutId = window.setTimeout(tick, minDelay + Math.random() * 2000);
    };
    timeoutId = window.setTimeout(tick, 2000);
    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (clearId !== undefined) window.clearTimeout(clearId);
    };
  }, [mood]);

  const row3 = faceRow(eyeX);
  const [eyeA, eyeB] = eyesForBucket(eyeX);

  const faceAnimate = reducedMotion
    ? undefined
    : mood === "excited"
      ? { y: [0, -2, 0], rotate: 0 }
      : mood === "curious"
        ? { y: 0, rotate: eyeX * 1.5 }
        : { y: 0, rotate: 0 };

  const faceTransition =
    mood === "excited" && !reducedMotion
      ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" as const }
      : { type: "spring" as const, stiffness: 120, damping: 18 };

  return (
    <div
      ref={containerRef}
      className={`relative shrink-0 text-brand ${className}`}
    >
      <motion.div
        className="h-full w-full"
        animate={faceAnimate}
        transition={faceTransition}
      >
        <svg
          viewBox="0 0 12 8"
          className="h-full w-full"
          fill="currentColor"
          shapeRendering="crispEdges"
          aria-hidden
        >
          <rect x="4" y="0" width="4" height="1" />
          <rect x="3" y="1" width="6" height="1" />
          <rect x="2" y="2" width="8" height="1" />
          {row3.map((seg) => (
            <rect
              key={`r3-${seg.x}`}
              x={seg.x}
              y="3"
              width={seg.width}
              height="1"
            />
          ))}
          <rect x="0" y="4" width="12" height="1" />
          <rect x="0" y="5" width="12" height="1" />
          <rect x="1" y="6" width="2" height="1" />
          <rect x="5" y="6" width="2" height="1" />
          <rect x="9" y="6" width="2" height="1" />
          <rect x="0" y="7" width="1" height="1" />
          <rect x="2" y="7" width="1" height="1" />
          <rect x="9" y="7" width="1" height="1" />
          <rect x="11" y="7" width="1" height="1" />

          {isBlinking && (
            <>
              <rect x={eyeA} y="3" width="1" height="1" />
              <rect x={eyeB} y="3" width="1" height="1" />
            </>
          )}
        </svg>
      </motion.div>

      <AnimatePresence>
        {dialog && (
          <motion.div
            key={dialog}
            initial={
              reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 4 }
            }
            animate={
              reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: -2 }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-sm border border-brand/60 bg-black/70 px-2 py-0.5 font-space-mono text-[10px] leading-none text-brand"
          >
            {dialog}
            <span className="absolute -bottom-[3px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rotate-45 border-r border-b border-brand/60 bg-black/70" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
