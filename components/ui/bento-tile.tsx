"use client";

import { createContext, useContext, useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

type BentoState = {
  ready: boolean;
  focused: string | null;
  zoomed: string | null;
  focus: (id: string) => void;
  toggleZoom: (id: string) => void;
};

/** Only these tiles open full screen; the rest stay in the grid. */
export const ZOOMABLE_TILES = ["projects", "work"];

export const BentoContext = createContext<BentoState | null>(null);

export function useBento() {
  const bento = useContext(BentoContext);
  if (!bento) throw new Error("useBento must be used inside <BentoWorkspace>");
  return bento;
}

const ZOOM_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Grow from, or shrink back to, the tile's grid slot by clipping instead of scaling text. */
function useZoomClip(ref: RefObject<HTMLElement | null>, zoomed: boolean) {
  const previous = useRef(zoomed);

  useLayoutEffect(() => {
    const tile = ref.current;
    const grid = tile?.parentElement;
    if (!tile || !grid || previous.current === zoomed) return;
    previous.current = zoomed;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const slot = () => {
      const g = grid.getBoundingClientRect();
      const t = tile.getBoundingClientRect();
      return `inset(${t.top - g.top}px ${g.right - t.right}px ${g.bottom - t.bottom}px ${t.left - g.left}px)`;
    };

    if (zoomed) {
      tile.removeAttribute("data-zoomed");
      const from = slot();
      tile.setAttribute("data-zoomed", "true");
      tile.animate([{ clipPath: from }, { clipPath: "inset(0)" }], { duration: 420, easing: ZOOM_EASING });
    } else {
      const to = slot();
      // Keep it covering the grid while the clip closes; React doesn't own this attribute.
      tile.dataset.closing = "true";
      const done = () => delete tile.dataset.closing;
      tile.animate([{ clipPath: "inset(0)" }, { clipPath: to }], { duration: 320, easing: ZOOM_EASING }).finished.then(done, done);
    }
  }, [ref, zoomed]);
}

/** A file in the bento grid: skeleton while the workspace boots, zoomable over the whole grid. */
export function BentoTile({ id, title, filename, type = "MD", action, className = "", children }: {
  id: string;
  title: string;
  filename: string;
  type?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const { ready, focused, zoomed, focus, toggleZoom } = useBento();
  const ref = useRef<HTMLElement>(null);
  const isZoomed = zoomed === id;
  useZoomClip(ref, isZoomed);

  return (
    <section
      ref={ref}
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-heading`}
      aria-busy={!ready}
      inert={!ready}
      data-area={id}
      data-loading={!ready || undefined}
      data-focus={focused === id || undefined}
      data-zoomed={isZoomed || undefined}
      onPointerDown={() => focus(id)}
      className={`bento-tile workspace-section workspace-file ${className}`}
    >
      <header className="workspace-file-header">
        <span aria-hidden="true" className="text-brand">{type}</span>
        <h2 id={`${id}-heading`}>{title}</h2>
        <span className="workspace-file-path">{filename}</span>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {action}
          {ZOOMABLE_TILES.includes(id) && (
            <button type="button" onClick={() => toggleZoom(id)} aria-pressed={isZoomed} aria-label={isZoomed ? `Restore ${title}` : `Zoom ${title}`} title={isZoomed ? "restore (esc)" : "zoom (z)"} className="bento-zoom">
              {isZoomed ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              <span>{isZoomed ? "esc" : "z"}</span>
            </button>
          )}
        </div>
      </header>
      <div className="bento-tile-body">{children}</div>
    </section>
  );
}
