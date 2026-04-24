"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";

const GITHUB_USERNAME = "PrEEtPatEl44";

function getBrandColor(): string {
  const inline = document.documentElement.style.getPropertyValue("--brand");
  if (inline) return inline.trim();
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--brand")
    .trim();
}

export function GitHubActivity() {
  const [data, setData] = useState<Activity[] | null>(null);
  const [brandColor, setBrandColor] = useState<string>("oklch(0.65 0.2 41)");
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(
    null,
  );

  // Watch for accent changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setBrandColor(getBrandColor());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
    setBrandColor(getBrandColor());
    return () => observer.disconnect();
  }, []);

  // Fetch contribution data
  useEffect(() => {
    fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`
    )
      .then((res) => res.json())
      .then((json) => setData(json.contributions))
      .catch(() => setData([]));
  }, []);

  const colorCustomization = useCallback(() => {
    return {
      dark: [
        "#27272a", // zinc-800
        `color-mix(in oklch, ${brandColor} 25%, #27272a)`,
        `color-mix(in oklch, ${brandColor} 50%, #27272a)`,
        `color-mix(in oklch, ${brandColor} 75%, #27272a)`,
        brandColor,
      ] as [string, string, string, string, string],
    };
  }, [brandColor]);

  if (data === null) {
    return (
      <div className="h-32 animate-pulse rounded bg-zinc-800/50" />
    );
  }

  return (
    <>
      <ActivityCalendar
        data={data}
        theme={colorCustomization()}
        colorScheme="dark"
        blockSize={12}
        blockRadius={2}
        blockMargin={3}
        fontSize={12}
        renderBlock={(block, activity) => {
          const label = `${
            activity.count === 0
              ? "No"
              : `${activity.count} contribution${
                  activity.count === 1 ? "" : "s"
                }`
          } on ${activity.date}`;
          return React.cloneElement(block, {
            onMouseEnter: (e: React.MouseEvent) =>
              setTip({ x: e.clientX, y: e.clientY, text: label }),
            onMouseMove: (e: React.MouseEvent) =>
              setTip((t) =>
                t ? { ...t, x: e.clientX, y: e.clientY } : null,
              ),
            onMouseLeave: () => setTip(null),
          });
        }}
        style={{
          fontFamily: "var(--font-space-mono)",
          color: "#a1a1aa", // zinc-400
        }}
      />
      {tip && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded border border-zinc-700 bg-black/90 px-2 py-1 font-space-mono text-xs whitespace-nowrap text-zinc-200 shadow-lg"
          style={{ left: tip.x, top: tip.y - 8 }}
        >
          {tip.text}
        </div>
      )}
    </>
  );
}
