"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BentoTile, useBento } from "@/components/ui/bento-tile";

type DeckProject = { title: string; description: string; tags: string[]; link: string; featured?: boolean };

const pad = (index: number) => String(index + 1).padStart(2, "0");

/** One project in detail with the whole list underneath; cycles until someone takes over. */
export function ProjectDeck({ projects }: { projects: DeckProject[] }) {
  const { ready, zoomed, toggleZoom } = useBento();
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const count = projects.length;
  const project = projects[index];

  const show = useCallback((next: number, byUser = true) => {
    setIndex((next + count) % count);
    if (byUser) setHeld(true);
  }, [count]);

  // A manual pick holds the deck for a while before autoplay resumes.
  useEffect(() => {
    if (!held) return;
    const timer = setTimeout(() => setHeld(false), 12_000);
    return () => clearTimeout(timer);
  }, [held, index]);

  useEffect(() => {
    if (!ready) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.metaKey || event.ctrlKey || event.altKey ||
        target?.closest("input, textarea, select, [contenteditable], [role='dialog']") ||
        document.querySelector("[role='dialog']")) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      show(index + (event.key === "ArrowRight" ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, index, show]);

  return (
    <BentoTile id="projects" title="Projects" filename="projects.ts" type="TS" action={
      <>
        <span className="workspace-file-path tabular-nums">{pad(index)} / {pad(count - 1)}</span>
        <button type="button" onClick={() => show(index - 1)} aria-label="Previous project" className="bento-zoom"><ChevronLeft className="h-3 w-3" /></button>
        <button type="button" onClick={() => show(index + 1)} aria-label="Next project" className="bento-zoom"><ChevronRight className="h-3 w-3" /></button>
        {zoomed !== "projects" && <button type="button" onClick={() => toggleZoom("projects")} className="bento-zoom" aria-label="View all projects">all</button>}
      </>
    }>
      <div className="deck" data-paused={held || !ready || zoomed === "projects" || undefined}>
        <article key={index} className="deck-detail" aria-live="polite">
          <div className="deck-top">
            <span className="deck-number" aria-hidden="true">{pad(index)}</span>
            {project.featured && <span className="deck-featured">★ featured</span>}
          </div>
          <h3 className="deck-title">{project.title}</h3>
          <p className="deck-description">{project.description}</p>
          <div className="deck-tags flex flex-wrap gap-1.5">
            {project.tags.map((tag) => <Badge key={tag} variant="outline" className="workspace-tag">{tag}</Badge>)}
          </div>
          {project.link !== "#" ? (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="workspace-link deck-open">open repo <ArrowUpRight className="h-3 w-3" /></a>
          ) : (
            <span className="deck-open text-[11px] text-muted-foreground">private repo</span>
          )}
        </article>
        <ol className="deck-list" aria-label="All projects">
          {projects.map((item, i) => (
            <li key={item.title}>
              <button type="button" onClick={() => show(i)} aria-current={i === index || undefined} className="deck-item">
                <span className="text-brand">{pad(i)}</span>
                <span className="deck-item-title">{item.title}</span>
                {item.featured && <span className="text-brand" aria-label="featured">★</span>}
                <span className="deck-item-tags">{item.tags.slice(0, 4).join(" · ")}</span>
                {i === index && <span aria-hidden="true" className="deck-progress" onAnimationEnd={() => show(index + 1, false)} />}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </BentoTile>
  );
}
