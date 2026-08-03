"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query without calling setState from an effect, so the
 * value is correct on the very first client render (and safely `false` on the
 * server, where matchMedia doesn't exist).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
