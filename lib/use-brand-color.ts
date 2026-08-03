"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type * as THREE from "three";
import { cssColorToThree } from "./three-utils";

/**
 * Tracks the `--brand` custom property that AccentPicker writes onto <html>,
 * so the 3D scene recolours with the rest of the site. Subscribing via
 * useSyncExternalStore keeps this out of an effect.
 */
export function useBrandColor(): THREE.Color {
  const subscribe = useCallback((onChange: () => void) => {
    const obs = new MutationObserver(onChange);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
    return () => obs.disconnect();
  }, []);

  const css = useSyncExternalStore(
    subscribe,
    () => {
      const root = document.documentElement;
      return (
        root.style.getPropertyValue("--brand").trim() ||
        getComputedStyle(root).getPropertyValue("--brand").trim()
      );
    },
    () => "",
  );

  return useMemo(() => cssColorToThree(css), [css]);
}
