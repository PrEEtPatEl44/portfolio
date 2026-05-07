"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): "dark" | "light" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): "dark" | "light" {
  return "dark";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="group fixed top-4 right-4 z-50 inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-none border border-border bg-background text-sm font-medium shadow-xs transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-brand" />
      ) : (
        <Moon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-brand" />
      )}
    </button>
  );
}
