"use client";

import { useEffect, useId, useRef, useState, type Ref } from "react";
import { getEyeGaze, getSightline, type Point } from "@/lib/eye-tracking";

type TrackingFrame = {
  pointer: Point | null;
  origin: Point;
  irisRadius: number;
  gaze: ReturnType<typeof getEyeGaze>;
  touch: boolean;
  reducedMotion: boolean;
};

const restingGaze = { x: 0, y: 0, angle: 0, distance: 0 };
const almond = "M24 60 Q100 -2 176 60 Q100 122 24 60Z";

/** The oculus drawing on its own, so the startup intro can open the same eye. */
export function EyeDrawing({ gaze = restingGaze, svgRef, className = "" }: {
  gaze?: { x: number; y: number };
  svgRef?: Ref<SVGSVGElement>;
  className?: string;
}) {
  const clipId = useId();
  return (
    <svg ref={svgRef} viewBox="0 0 200 120" fill="none" className={`tracking-eye-drawing ${className}`}>
      <defs>
        <clipPath id={clipId}><path d={almond} /></clipPath>
      </defs>
      {/* Measurement grid and corner registration marks. */}
      <g stroke="currentColor" strokeWidth="0.65" opacity="0.2">
        <path d="M0 60H200M100 0V120" strokeDasharray="2 5" />
        <path d="M8 27V14H21M179 14H192V27M8 93V106H21M179 106H192V93" />
        <path d="M58 13V18M79 13V16M121 13V16M142 13V18M58 102V107M79 104V107M121 104V107M142 102V107" />
      </g>
      <g className="tracking-eye-lid">
        <g clipPath={`url(#${clipId})`}>
          <g transform={`translate(${gaze.x} ${gaze.y})`}>
            <circle cx="100" cy="60" r="27" stroke="var(--brand)" strokeWidth="0.8" opacity="0.3" />
            <circle cx="100" cy="60" r="21" stroke="var(--brand)" strokeWidth="1.2" />
            <ellipse cx="100" cy="60" rx="12" ry="21" stroke="var(--brand)" strokeWidth="0.6" opacity="0.45" />
            <ellipse cx="100" cy="60" rx="21" ry="8" stroke="var(--brand)" strokeWidth="0.6" opacity="0.45" />
            <path d="M100 35V43M100 77V85M75 60H83M117 60H125" stroke="var(--brand)" strokeWidth="0.8" />
            <circle cx="100" cy="60" r="8" stroke="var(--brand)" />
            <circle cx="100" cy="60" r="2.5" fill="var(--brand)" />
            <circle cx="105" cy="54" r="1.5" fill="var(--foreground)" opacity="0.8" />
          </g>
        </g>
        <path d={almond} stroke="currentColor" strokeWidth="1" opacity="0.65" />
      </g>
      <path d="M29 51Q100 -12 171 51" stroke="currentColor" strokeWidth="0.65" opacity="0.2" />
      <path d="M18 60H27M173 60H182" stroke="var(--brand)" />
    </svg>
  );
}

export function TrackingEye({ className = "" }: { className?: string }) {
  const beamId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<TrackingFrame>({
    pointer: null,
    origin: { x: 0, y: 0 },
    irisRadius: 0,
    gaze: restingGaze,
    touch: false,
    reducedMotion: false,
  });

  useEffect(() => {
    const eye = svgRef.current;
    const panel = panelRef.current;
    if (!eye || !panel) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pointer: Point | null = null;
    let touch = false;
    let raf: number | null = null;

    const update = () => {
      raf = null;
      const bounds = eye.getBoundingClientRect();
      const origin = { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
      setFrame({
        pointer,
        origin,
        // The iris ring is r=21 in a 200-unit-wide drawing.
        irisRadius: bounds.width * 0.11,
        gaze: pointer && !motion.matches ? getEyeGaze(origin, pointer) : restingGaze,
        touch,
        reducedMotion: motion.matches,
      });
    };

    const schedule = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };
    const move = (event: PointerEvent) => {
      if (!event.isPrimary) return;
      pointer = { x: event.clientX, y: event.clientY };
      touch = event.pointerType === "touch";
      schedule();
    };
    const reset = () => {
      pointer = null;
      schedule();
    };
    const release = (event: PointerEvent) => {
      if (event.pointerType === "touch") reset();
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(panel);
    const workspace = panel.closest(".workspace, .bento");
    if (workspace) observer.observe(workspace);
    schedule();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", reset, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("blur", reset);
    document.documentElement.addEventListener("pointerleave", reset);
    motion.addEventListener("change", schedule);

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", reset);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("blur", reset);
      document.documentElement.removeEventListener("pointerleave", reset);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  const tracking = frame.pointer !== null;
  const gaze = tracking ? frame.gaze : restingGaze;
  const overlay = tracking && !frame.touch && !frame.reducedMotion;
  const beam = overlay && frame.pointer ? getSightline(frame.origin, frame.pointer, frame.irisRadius) : null;
  const coordinate = (axis: "x" | "y") => tracking ? String(Math.round(frame.pointer![axis])).padStart(4, "0") : "----";

  return (
    <div className={`tracking-eye ${className}`}>
      <div ref={panelRef} className="tracking-eye-panel">
      <div className="tracking-eye-instrument" aria-hidden="true">
        <div className="tracking-eye-heading"><span>oculus / 01</span><span className={tracking ? "text-brand" : ""}>{tracking ? "locked" : "standby"}</span></div>
        <EyeDrawing svgRef={svgRef} gaze={gaze} />
        <div className="tracking-eye-coordinates"><span><i>X</i> {coordinate("x")}</span><span><i>Y</i> {coordinate("y")}</span><span className="tracking-eye-unit">px</span></div>
      </div>
      </div>

      {overlay && frame.pointer && beam && (
        <div className="tracking-eye-overlay" aria-hidden="true">
          {/* Dotted sightline: dots stream from the iris out to the cursor. */}
          <svg className="tracking-eye-sightline" width="100%" height="100%">
            <defs>
              <linearGradient id={beamId} gradientUnits="userSpaceOnUse" x1={beam.from.x} y1={beam.from.y} x2={beam.to.x} y2={beam.to.y}>
                <stop offset="0" style={{ stopColor: "var(--brand)", stopOpacity: 0.9 }} />
                <stop offset="1" style={{ stopColor: "var(--brand)", stopOpacity: 0.25 }} />
              </linearGradient>
            </defs>
            <circle className="tracking-eye-beam-origin" cx={beam.from.x} cy={beam.from.y} r="2.5" fill="var(--brand)" />
            <line className="tracking-eye-beam" x1={beam.from.x} y1={beam.from.y} x2={beam.to.x} y2={beam.to.y} stroke={`url(#${beamId})`} strokeWidth="2" strokeLinecap="round" strokeDasharray="0 9" />
          </svg>
          <div className="tracking-eye-target" style={{ left: frame.pointer.x, top: frame.pointer.y }}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M2 9V2H9M17 2H24V9M2 17V24H9M17 24H24V17" stroke="currentColor" strokeWidth="0.8" /><path d="M10 13H16M13 10V16" stroke="currentColor" strokeWidth="0.6" /></svg>
          </div>
          <span className="tracking-eye-target-label" style={{
            left: `clamp(8px, ${frame.pointer.x + 20}px, calc(100vw - 132px))`,
            top: `clamp(8px, ${frame.pointer.y + 20}px, calc(100dvh - 28px))`,
          }}>x {coordinate("x")} · y {coordinate("y")}</span>
        </div>
      )}
    </div>
  );
}
