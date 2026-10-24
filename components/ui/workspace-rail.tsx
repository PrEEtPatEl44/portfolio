"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TrackingEye } from "@/components/ui/tracking-eye";

export const WORKSPACE_SHORTCUTS = [
  { key: "w", label: "work", target: "work" },
  { key: "p", label: "projects", target: "projects" },
  { key: "e", label: "education", target: "education" },
  { key: "c", label: "contact", target: "contact" },
];

export function WorkspaceRail({ archive = false, enabled = true, onNavigate, onOpenCommands }: {
  archive?: boolean;
  enabled?: boolean;
  onNavigate?: (target: string) => void;
  onOpenCommands?: () => void;
}) {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const flashRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showCommands = useCallback(() => {
    if (onOpenCommands) onOpenCommands();
    else window.dispatchEvent(new Event("portfolio:commands"));
  }, [onOpenCommands]);

  const go = useCallback((shortcut: (typeof WORKSPACE_SHORTCUTS)[number]) => {
    setActiveKey(shortcut.key);
    if (flashRef.current) clearTimeout(flashRef.current);
    flashRef.current = setTimeout(() => setActiveKey(null), 450);
    if (onNavigate) onNavigate(shortcut.target);
    else if (archive && shortcut.target === "projects") {
      const list = document.getElementById("all-projects");
      list?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      list?.focus({ preventScroll: true });
    } else router.push(`/#${shortcut.target}`);
  }, [archive, onNavigate, router]);

  useEffect(() => {
    if (!enabled) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat ||
        target?.closest("input, textarea, select, button, a, [contenteditable], [role='dialog']") ||
        document.querySelector("[role='dialog']")) return;
      const shortcut = WORKSPACE_SHORTCUTS.find((item) => item.key === event.key.toLowerCase());
      if (shortcut) { event.preventDefault(); go(shortcut); }
      else if (event.key === "?") { event.preventDefault(); showCommands(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, go, showCommands]);

  useEffect(() => () => { if (flashRef.current) clearTimeout(flashRef.current); }, []);

  return (
    <aside className="workspace-side-rail" aria-label="Oculus and navigation">
      <TrackingEye enabled={enabled} />
      <p className="workspace-rail-label">navigate / keys</p>
      <nav aria-label="Section shortcuts" className="workspace-rail-keys">
        {WORKSPACE_SHORTCUTS.map((shortcut) => (
          <button key={shortcut.key} onClick={() => go(shortcut)} aria-label={`Go to ${shortcut.label} (key ${shortcut.key.toUpperCase()})`} aria-current={archive && shortcut.key === "p" ? "page" : undefined} className={`workspace-key ${activeKey === shortcut.key || (archive && activeKey === null && shortcut.key === "p") ? "workspace-key-active" : ""}`}>
            <kbd>{shortcut.key.toUpperCase()}</kbd><span>{shortcut.label}</span>
          </button>
        ))}
        <button className="workspace-key" onClick={showCommands} aria-label="Open command palette"><kbd>?</kbd><span>help</span></button>
      </nav>
    </aside>
  );
}
