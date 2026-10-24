"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";

const GITHUB_USERNAME = "PrEEtPatEl44";

function getBrandColor(): string {
  const inline = document.documentElement.style.getPropertyValue("--brand");
  if (inline) return inline.trim();
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--brand")
    .trim();
}

function getStats(data: Activity[]) {
  let longest = 0;
  let run = 0;
  for (const day of data) {
    run = day.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  // Today may simply not have commits yet, so the streak can still be alive from yesterday.
  let current = 0;
  const end = data.at(-1)?.count === 0 ? data.length - 2 : data.length - 1;
  for (let i = end; i >= 0 && data[i].count > 0; i--) current++;
  return [
    ["contributions", data.reduce((total, day) => total + day.count, 0)],
    ["active days", data.filter((day) => day.count > 0).length],
    ["longest streak", `${longest}d`],
    ["current streak", `${current}d`],
  ] as const;
}

/** `fit` sizes the calendar to its container instead of scrolling, and adds streak stats. */
export function GitHubActivity({ fit = false }: { fit?: boolean }) {
  const [data, setData] = useState<Activity[] | null>(null);
  const [brandColor, setBrandColor] = useState<string>("oklch(0.65 0.2 41)");
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(
    null,
  );
  const [compact, setCompact] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fitWidth, setFitWidth] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!fit || !el) return;
    const observer = new ResizeObserver(([entry]) => setFitWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, [fit, data]);

  // Shrink the calendar on narrow viewports
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Scroll to the most recent contributions once the calendar renders
  useEffect(() => {
    if (!data) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth;
  }, [data, compact]);

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

  if (data === null || data.length === 0) {
    return (
      <p className="min-h-40 py-4 font-space-mono text-xs text-muted-foreground" role="status">{data === null ? "Fetching GitHub contributions…" : "GitHub contributions unavailable."}</p>
    );
  }

  // 53 weeks across, 2px gaps: the largest square that fits the tile.
  const fitBlock = Math.max(4, Math.min(12, Math.floor(fitWidth / 53) - 2));

  return (
    <>
      <div ref={scrollRef} className="no-scrollbar w-full overflow-x-auto">
        <div className="w-fit mx-auto">
          <ActivityCalendar
            data={data}
            theme={colorCustomization()}
            colorScheme="dark"
            blockSize={fit ? fitBlock : compact ? 9 : 12}
            blockRadius={2}
            blockMargin={fit ? 2 : compact ? 2 : 3}
            fontSize={fit ? 10 : 12}
            showColorLegend={!fit}
            showTotalCount={!fit}
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
        </div>
      </div>
      {fit && (
        <dl className="activity-stats">
          {getStats(data).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      )}
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
