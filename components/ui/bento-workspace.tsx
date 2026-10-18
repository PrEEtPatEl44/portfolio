"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, GitBranch, RotateCcw } from "lucide-react";
import { BentoContext, ZOOMABLE_TILES } from "@/components/ui/bento-tile";
import { EyeDrawing } from "@/components/ui/tracking-eye";
import { WorkspaceRail, WORKSPACE_SHORTCUTS } from "@/components/ui/workspace-rail";
import { useWorkspaceStartup } from "@/components/ui/use-workspace-startup";
import { LAUNCH_COMMAND, OPEN_COMMAND } from "@/lib/workspace-startup";

type WorkspaceIntro = {
  name: string;
  location: string;
  role: string;
  company: string;
  description: string;
  today: string;
  links: { name: string; href: string }[];
};

const FLIGHT_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const SECTIONS = ["projects", "work", "education", "contact", "skills", "activity"];

function highlightCode(line: string, links: WorkspaceIntro["links"], interactive: boolean) {
  return line.split(/("(?:[^"\\]|\\.)*(?:"|$)|\/\/.*$|\bconst\b)/g).map((token, index) => {
    const link = links.find((item) => token === JSON.stringify(item.href));
    return link ? (
      <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" tabIndex={interactive ? 0 : -1} aria-label={`${link.name} profile`} className="workspace-source-link">{token}</a>
    ) : (
      <span key={index} className={token.startsWith("//") ? "workspace-comment" : token.startsWith('"') ? "workspace-string" : token === "const" ? "workspace-keyword" : undefined}>{token}</span>
    );
  });
}

/** Today's date in UTC, rolling over at UTC midnight rather than local midnight. */
function useUtcDate(initial: string) {
  const [date, setDate] = useState(initial);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const now = new Date();
      setDate(now.toISOString().slice(0, 10));
      timer = setTimeout(tick, Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1) - now.getTime() + 50);
    };
    timer = setTimeout(tick, 0);
    return () => clearTimeout(timer);
  }, []);
  return date;
}

function useTorontoClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-CA", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Toronto" });
    const tick = () => setTime(format.format(new Date()));
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 30_000);
    return () => { clearTimeout(first); clearInterval(timer); };
  }, []);
  return time;
}

export function BentoWorkspace({ intro, children }: { intro: WorkspaceIntro; children: ReactNode }) {
  const [command, setCommand] = useState("");
  const [message, setMessage] = useState("ready when you are. type :help to explore.");
  const [focused, setFocused] = useState<string | null>(null);
  const [zoomed, setZoomed] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleNameRef = useRef<HTMLSpanElement>(null);
  const stageEyeRef = useRef<HTMLDivElement>(null);
  const stageNameRef = useRef<HTMLSpanElement>(null);
  const today = useUtcDate(intro.today);
  const clock = useTorontoClock();

  const lines = useMemo(() => [
    "// a little context before the code.",
    "const preet = {",
    `  name: ${JSON.stringify(intro.name)},`,
    `  role: ${JSON.stringify(intro.role)},`,
    `  at: ${JSON.stringify(intro.company)},`,
    `  basedIn: ${JSON.stringify(intro.location)},`,
    ...intro.links.map((link) => `  ${link.name.toLowerCase()}: ${JSON.stringify(link.href)},`),
    "};",
    "",
    `// ${intro.description}`,
  ], [intro]);
  const source = lines.join("\n");
  const { frame, finish, restart } = useWorkspaceStartup(source);
  const complete = frame.phase === "ready";
  const launching = frame.phase === "launching";
  const introducing = frame.phase === "identity" || frame.phase === "morphing";
  const fileOpen = frame.phase === "typing" || launching || complete;
  const visibleSource = source.slice(0, frame.codeLength);
  const cursorLine = visibleSource.split("\n").length - 1;
  const cursorColumn = visibleSource.length - visibleSource.lastIndexOf("\n");
  const [firstName, ...rest] = intro.name.split(" ");

  // For a moment after "ready" the tiles crossfade from skeleton to content; skips and replays don't.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(complete), complete ? 1400 : 0);
    return () => clearTimeout(timer);
  }, [complete]);
  const resolving = complete && !settled && !frame.instant;

  // Eye + title morph: the intro's eye and name fly into the oculus tile and the editor title bar.
  useLayoutEffect(() => {
    if (frame.phase !== "morphing") return;
    const target = rootRef.current?.querySelector(".bento-oculus .tracking-eye-drawing");
    const flights = ([[stageEyeRef.current, target], [stageNameRef.current, titleNameRef.current]] as const).map(([from, to]) => {
      if (!from || !to) return null;
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      if (!a.width || !b.width) return null;
      from.style.transformOrigin = "0 0";
      return from.animate(
        [{ transform: "none" }, { transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${b.width / a.width})` }],
        { duration: 720, easing: FLIGHT_EASING, fill: "forwards" },
      );
    });
    return () => flights.forEach((flight) => flight?.cancel());
  }, [frame.phase]);

  const focus = useCallback((id: string) => setFocused(id), []);
  const toggleZoom = useCallback((id: string) => {
    finish();
    setFocused(id);
    if (ZOOMABLE_TILES.includes(id)) setZoomed((current) => (current === id ? null : id));
  }, [finish]);

  // A section key focuses its tile; pressing it again on the focused tile zooms it.
  const focusedRef = useRef(focused);
  useEffect(() => { focusedRef.current = focused; }, [focused]);
  const navigate = useCallback((id: string) => {
    finish();
    if (focusedRef.current === id) return toggleZoom(id);
    setZoomed(null);
    setFocused(id);
    requestAnimationFrame(() => {
      const tile = document.getElementById(id);
      if (!tile) return;
      tile.scrollIntoView({ block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      tile.focus({ preventScroll: true });
    });
  }, [finish, toggleZoom]);

  // /projects redirects to /#projects: open that tile full-screen. The palette asks the same way.
  useEffect(() => {
    const open = (id: string) => {
      if (!SECTIONS.includes(id)) return;
      finish();
      setFocused(id);
      if (ZOOMABLE_TILES.includes(id)) setZoomed(id);
    };
    const fromHash = () => open(window.location.hash.slice(1));
    const fromEvent = (event: Event) => open((event as CustomEvent<string>).detail);
    const initial = requestAnimationFrame(fromHash);
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("portfolio:zoom", fromEvent);
    return () => {
      cancelAnimationFrame(initial);
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener("portfolio:zoom", fromEvent);
    };
  }, [finish]);

  const openCommands = useCallback(() => {
    finish();
    window.dispatchEvent(new Event("portfolio:commands"));
  }, [finish]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key === "Escape" && zoomed) return setZoomed(null);
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat ||
        target?.closest("input, textarea, select, button, a, [contenteditable], [role='dialog']") ||
        document.querySelector("[role='dialog']")) return;
      if (event.key === ":") {
        event.preventDefault();
        finish();
        setCommand(":");
        requestAnimationFrame(() => inputRef.current?.focus());
      } else if (event.key.toLowerCase() === "z") {
        event.preventDefault();
        // With nothing selected, z opens Projects; on a tile that can't zoom it does nothing.
        const target = zoomed ?? focusedRef.current ?? "projects";
        if (ZOOMABLE_TILES.includes(target)) toggleZoom(target);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish, toggleZoom, zoomed]);

  function runCommand(raw: string) {
    finish();
    const value = raw.trim().replace(/^:/, "").toLowerCase();
    if (value === "help" || value === "?" || value === "search") {
      window.dispatchEvent(new Event("portfolio:commands"));
      setMessage(":work · :projects · :education · :contact · :skills · :activity · :search");
    } else if (SECTIONS.includes(value) || WORKSPACE_SHORTCUTS.some((item) => item.target === value)) {
      navigate(value);
      setMessage(`focused ${value}. press z to zoom.`);
    } else {
      setMessage("unknown command. try :help or :search.");
    }
    setCommand("");
  }

  return (
    <BentoContext.Provider value={{ ready: complete, focused, zoomed, focus, toggleZoom }}>
    <section ref={rootRef} aria-labelledby="workspace-heading" className="bento" data-startup={frame.phase} data-instant={frame.instant ? "true" : undefined} data-resolving={resolving || undefined}>
      <header className="bento-bar" aria-label="Workspace status">
        <span className="bento-bar-session">[portfolio]</span>
        <span className="bento-bar-window">0:main*</span>
        <span className="bento-bar-hints">z zoom · ←/→ projects · w/p/e/c focus · : command</span>
        <span role="status">{complete ? `${SECTIONS.length} buffers loaded` : "⟳ loading buffers…"}</span>
        <span className="bento-bar-clock">&quot;preet@toronto&quot;{clock && ` ${clock}`}</span>
      </header>

      <div className="bento-grid" id="workspace-files">
        <section className="bento-hero" aria-label="Introduction">
          <p className="text-muted-foreground">{"// hello, world"}</p>
          <p className="bento-name" aria-hidden="true">{firstName}<br /><span className="text-brand">{rest.join(" ")}</span></p>
          <p>{intro.role} <span className="text-brand">@ {intro.company}</span></p>
          <p className="text-muted-foreground">{intro.location}</p>
          <p className="text-muted-foreground">{intro.description}</p>
          <div className="bento-links">
            {intro.links.map((link) => <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="workspace-link lowercase">{link.name}<ArrowUpRight className="h-3 w-3" /></a>)}
          </div>
        </section>

        <div className="bento-editor">
          <header className="bento-editor-chrome">
            <h1 id="workspace-heading" className="bento-title"><span className="text-brand" aria-hidden="true">❯</span><span ref={titleNameRef} className="bento-title-name">Preet Codes</span><span className="bento-title-path">/ portfolio</span></h1>
            <span className="bento-version"><time dateTime={today}>{today.replaceAll("-", ".")}</time><abbr title="Coordinated Universal Time" className="bento-utc">UTC</abbr></span>
          </header>
          <div className="bento-session">
            <pre className="sr-only" aria-label="Introduction code" aria-hidden={complete}>{source}</pre>
            {!complete && <button type="button" onClick={finish} className="workspace-skip">skip intro <span aria-hidden="true">[esc]</span></button>}
            {!fileOpen && !introducing && (
              <div className="workspace-shell" aria-hidden="true">
                <div className="workspace-shell-title"><span className="h-1.5 w-1.5 bg-brand" /> zsh <span className="text-muted-foreground/50">/ ~/portfolio</span></div>
                <div className="workspace-shell-prompt"><span className="text-brand">❯</span><span>{OPEN_COMMAND.slice(0, frame.commandLength)}{frame.phase === "shell" && <span className="workspace-cursor">&nbsp;</span>}</span></div>
                <p className={`workspace-opening ${frame.phase === "opening" ? "opacity-100" : "opacity-0"}`}>↳ opening ~/portfolio/now.ts</p>
                <div className="workspace-shell-footer">PREET CODES <span>workspace / init</span></div>
              </div>
            )}
            <div className={`bento-buffer ${fileOpen ? "workspace-buffer-open" : "workspace-buffer-pending"}`} inert={!fileOpen}>
              <div className="flex items-center justify-between border-b border-border bg-muted/30 pr-4 text-[10px]">
                <span className="workspace-file-tab border-r border-border border-t-2 border-t-brand bg-background px-4 py-3"><span className="mr-2 text-brand">TS</span> now.ts <span className="ml-5 text-muted-foreground">{complete ? "×" : "+"}</span></span>
                <button type="button" onClick={() => { setZoomed(null); restart(); }} disabled={!complete} aria-label="Replay startup animation" title="Replay startup animation" className="workspace-replay"><RotateCcw className="h-3 w-3" /><span>replay</span></button>
              </div>
              <div className="bento-code text-[11px] leading-[1.9] sm:text-xs" tabIndex={0} role="region" aria-label="Introduction code buffer">
                <code className="block min-w-max pr-6" aria-hidden={!complete}>
                  {lines.map((line, index) => {
                    const offset = lines.slice(0, index).reduce((total, previous) => total + previous.length + 1, 0);
                    const text = line.slice(0, Math.max(0, frame.codeLength - offset));
                    const current = index === cursorLine;
                    return (
                      <span className={`workspace-code-line flex ${current ? "bg-muted/40" : ""}`} key={index}>
                        <span aria-hidden="true" className={`w-12 shrink-0 select-none pr-4 text-right ${current ? "text-brand" : "text-muted-foreground/60"}`}>{index + 1}</span>
                        <span className="relative whitespace-pre">{highlightCode(text, intro.links, complete)}{current && <span aria-hidden="true" className="workspace-cursor">&nbsp;</span>}</span>
                      </span>
                    );
                  })}
                  {/* Empty buffer rows, the way nvim draws them. */}
                  {Array.from({ length: 12 }, (_, i) => <span key={i} aria-hidden="true" className="block pl-5 text-brand/35">~</span>)}
                </code>
              </div>
              <div className="flex items-stretch justify-between bg-muted/50 text-[10px]">
                <div className="flex items-center"><span className="min-w-20 border-r border-border bg-muted px-3 py-1.5 text-center font-bold text-foreground">{complete || launching ? "NORMAL" : "INSERT"}</span><span className="flex items-center gap-1.5 px-3 text-muted-foreground"><GitBranch className="h-3 w-3" />main</span></div>
                <span className="px-3 py-1.5 text-muted-foreground">now.ts <span className="ml-3 hidden sm:inline">utf-8</span> <span className="ml-3">{cursorLine + 1}:{cursorColumn}</span></span>
              </div>
              <form className="flex min-h-11 items-center gap-2 border-t border-border px-4 text-xs" onSubmit={(event) => { event.preventDefault(); if (!complete) finish(); else runCommand(command); }}>
                <span aria-hidden="true" className="text-brand">:</span>
                <input ref={inputRef} value={launching ? LAUNCH_COMMAND.slice(0, frame.launchLength ?? 0) : command} readOnly={!complete} onChange={(event) => setCommand(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") { setCommand(""); inputRef.current?.blur(); } }} aria-label="Portfolio command" autoComplete="off" spellCheck={false} placeholder={complete ? "help, projects, search…" : ""} className="min-w-0 flex-1 bg-transparent py-3 text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-brand" />
                <button type="submit" className={`border px-2 py-1 text-[10px] transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-brand ${launching && frame.launchLength === LAUNCH_COMMAND.length ? "border-brand bg-muted text-foreground" : "border-border text-muted-foreground"}`}>enter ↵</button>
              </form>
            </div>
          </div>
          <p role="status" className="bento-message">{complete ? message : " "}</p>
        </div>

        <div className="bento-oculus">
          <WorkspaceRail onNavigate={navigate} onOpenCommands={openCommands} />
        </div>

        {children}
      </div>

      {introducing && (
        <div className="bento-stage" aria-hidden="true">
          <div ref={stageEyeRef} className="bento-stage-eye"><EyeDrawing /></div>
          <p className="bento-stage-title"><span className="bento-stage-prompt text-brand">❯</span> <span ref={stageNameRef} className="bento-stage-name">Preet Codes</span></p>
          <div className="bento-stage-copy">
            <p>{intro.role} <span className="text-brand">@ {intro.company}</span></p>
            <p className="mt-1 text-[10px] text-muted-foreground">{intro.location}</p>
            <span className="workspace-intro-hint"><span className="workspace-cursor">&nbsp;</span> opening my workspace</span>
          </div>
        </div>
      )}
    </section>
    </BentoContext.Provider>
  );
}
