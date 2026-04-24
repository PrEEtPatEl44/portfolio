"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type EyePos = "center" | "left" | "right";

const EYE_X: Record<EyePos, [number, number]> = {
  center: [4, 7],
  left: [3, 6],
  right: [5, 8],
};

const DIALOGS = [
  "hii",
  "sup",
  "yo",
  "who dat?",
  "ooo",
  "hmm",
  "neat",
  "cool",
  ":)",
  "nice name",
  "reading...",
];

function faceRow(pos: EyePos) {
  const [a, b] = EYE_X[pos];
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
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyePos, setEyePos] = useState<EyePos>("center");
  const [dialog, setDialog] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIsBlinking(true);
      window.setTimeout(() => setIsBlinking(false), 140);
    }, 3500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let timeoutId: number | undefined;
    let dialogTimeoutId: number | undefined;

    const tick = () => {
      const roll = Math.random();
      const nextPos: EyePos =
        roll < 0.55 ? "right" : roll < 0.75 ? "left" : "center";
      setEyePos(nextPos);

      if (nextPos === "right" && Math.random() < 0.75) {
        setDialog(pick(DIALOGS));
        window.clearTimeout(dialogTimeoutId);
        dialogTimeoutId = window.setTimeout(() => setDialog(null), 1800);
      } else if (nextPos === "center") {
        setDialog(null);
      }

      timeoutId = window.setTimeout(tick, 2000 + Math.random() * 1800);
    };

    timeoutId = window.setTimeout(tick, 900);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearTimeout(dialogTimeoutId);
    };
  }, []);

  const row3 = faceRow(eyePos);

  return (
    <div className={`relative shrink-0 text-brand ${className}`}>
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
            <rect x={EYE_X[eyePos][0]} y="3" width="1" height="1" />
            <rect x={EYE_X[eyePos][1]} y="3" width="1" height="1" />
          </>
        )}
      </svg>

      <AnimatePresence>
        {dialog && (
          <motion.div
            key={dialog}
            initial={{ opacity: 0, scale: 0.6, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -2 }}
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
