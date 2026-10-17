"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createStartupTimeline, getStartupFrame, type StartupFrame } from "@/lib/workspace-startup";

export function useWorkspaceStartup(source: string) {
  const timeline = useMemo(() => createStartupTimeline(source), [source]);
  const [frame, setFrame] = useState<StartupFrame>(timeline[0]);
  const [replay, setReplay] = useState(0);
  const finishRef = useRef<() => void>(() => {});

  const finish = useCallback(() => finishRef.current(), []);
  const restart = useCallback(() => setReplay((value) => value + 1), []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    let navigationFrame: number | null = null;
    let stopped = false;
    const start = performance.now();

    const complete = () => {
      stopped = true;
      clearTimeout(timer);
      setFrame({ ...timeline[timeline.length - 1], instant: true });
    };
    finishRef.current = complete;

    const advance = () => {
      if (stopped) return;
      if (motion.matches) return complete();
      const elapsed = performance.now() - start;
      const current = getStartupFrame(timeline, elapsed);
      const index = timeline.indexOf(current);
      setFrame(current);
      if (index + 1 < timeline.length) {
        timer = setTimeout(advance, Math.max(1, timeline[index + 1].at - elapsed));
      }
    };
    const onMotionChange = () => { if (motion.matches) complete(); };
    const onEscape = (event: KeyboardEvent) => { if (event.key === "Escape") complete(); };
    const fragment = window.location.hash.slice(1);
    const destination = replay === 0 && fragment ? document.getElementById(fragment) : null;
    if (destination?.closest("#workspace-files")) {
      timer = setTimeout(() => {
        complete();
        navigationFrame = requestAnimationFrame(() => {
          destination.scrollIntoView({ block: "start", behavior: "instant" });
          destination.focus({ preventScroll: true });
        });
      }, 0);
    } else {
      timer = setTimeout(advance, 0);
    }
    motion.addEventListener("change", onMotionChange);
    window.addEventListener("keydown", onEscape);

    return () => {
      stopped = true;
      clearTimeout(timer);
      if (navigationFrame !== null) cancelAnimationFrame(navigationFrame);
      finishRef.current = () => {};
      motion.removeEventListener("change", onMotionChange);
      window.removeEventListener("keydown", onEscape);
    };
  }, [timeline, replay]);

  return { frame, finish, restart };
}
