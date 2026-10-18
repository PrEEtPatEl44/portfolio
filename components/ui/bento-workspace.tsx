"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { BentoContext, ZOOMABLE_TILES } from "@/components/ui/bento-tile";
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

const TOOLS = /^(Read|Write|Update|Bash)$/;

/** One transcript line, styled like a Claude Code session; finished URLs become links. */
function renderTranscriptLine(line: string, links: WorkspaceIntro["links"], interactive: boolean) {
  return line.split(/(https?:\/\/\S+|⏺|⎿|✓|\b(?:Read|Write|Update|Bash)(?=\())/g).map((token, index) => {
    const link = links.find((item) => token === item.href);
    if (link) return <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" tabIndex={interactive ? 0 : -1} aria-label={`${link.name} profile`} className="workspace-source-link">{token}</a>;
    const className = token === "⏺" ? "cc-dot" : token === "⎿" ? "cc-dim" : token === "✓" ? "cc-ok" : TOOLS.test(token) ? "cc-tool" : undefined;
    return <span key={index} className={className}>{token}</span>;
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
  const sessionRef = useRef<HTMLDivElement>(null);
  const stageNameRef = useRef<HTMLParagraphElement>(null);
  const stagePromptRef = useRef<HTMLDivElement>(null);
  const today = useUtcDate(intro.today);
  const clock = useTorontoClock();

  // What Claude "does" after `> build me a portfolio`.
  const lines = useMemo(() => [
    "⏺ I'll build your portfolio from your profile.",
    "⏺ Read(profile.md)",
    `  ⎿  ${intro.name} · ${intro.role} @ ${intro.company}`,
    "⏺ Write(data/data.ts)",
    "  ⎿  hero, work, projects, skills, education",
    "⏺ Write(app/page.tsx)",
    "  ⎿  bento grid: hero, terminal, oculus, six tiles",
    "⏺ Update(app/globals.css)",
    "  ⎿  terminal theme, grid, scanlines",
    "⏺ Bash(npm run build)",
    "  ⎿  ✓ Compiled successfully",
    "⏺ Done. Your portfolio is ready.",
    ...intro.links.map((link) => `   ${link.name.toLowerCase().padEnd(9)}${link.href}`),
  ], [intro]);
  const source = lines.join("\n");
  const { frame, finish } = useWorkspaceStartup(source);
  const complete = frame.phase === "ready";
  const launching = frame.phase === "launching";
  const introducing = frame.phase === "identity" || frame.phase === "shell" || frame.phase === "morphing";
  const entered = frame.commandLength === OPEN_COMMAND.length;
  const promptSent = frame.phase === "opening" || frame.phase === "typing" || launching || complete;
  const working = frame.phase === "opening" || frame.phase === "typing";
  const shown = source.slice(0, frame.codeLength).split("\n");
  const typed = launching ? LAUNCH_COMMAND.slice(0, frame.launchLength ?? 0) : "";
  const [firstName, ...rest] = intro.name.split(" ");

  // For a moment after "ready" the tiles crossfade from skeleton to content; skips and replays don't.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(complete), complete ? 1400 : 0);
    return () => clearTimeout(timer);
  }, [complete]);
  const resolving = complete && !settled && !frame.instant;

  // Keep the newest session output in view once it no longer fits.
  useLayoutEffect(() => {
    const session = sessionRef.current;
    if (session) session.scrollTop = session.scrollHeight;
  }, [frame.codeLength, frame.phase]);

  useLayoutEffect(() => {
    if (frame.phase !== "morphing") return;
    // "Enter": the name grows into the hero, the prompt box settles into the terminal.
    const root = rootRef.current;
    const pairs = [
      [stageNameRef.current, root?.querySelector(".bento-name"), false],
      [stagePromptRef.current, root?.querySelector(".cc-prompt"), true],
    ] as const;
    const flights = pairs.map(([from, to, stretch]) => {
      if (!from || !to) return null;
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      if (!a.width || !b.width) return null;
      const sx = b.width / a.width;
      const sy = stretch ? b.height / a.height : sx;
      from.style.transformOrigin = "0 0";
      return from.animate(
        [{ transform: "none" }, { transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${sx}, ${sy})` }],
        { duration: 700, easing: FLIGHT_EASING, fill: "forwards" },
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
      {!complete && (
        <div className="bento-startup-skip" data-nosnippet>
          <button type="button" onClick={() => {
            finish();
            requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
          }} aria-label="Skip startup animation">
            skip intro <kbd aria-hidden="true">esc</kbd>
          </button>
        </div>
      )}
      <header className="bento-bar" aria-label="Workspace status">
        <span className="bento-bar-session">[portfolio]</span>
        <span className="bento-bar-window">0:main*</span>
        <span className="bento-bar-hints">z zoom · ←/→ projects · w/p/e/c focus · : command</span>
        <span role="status">{complete ? `${SECTIONS.length} buffers loaded` : "⟳ loading buffers…"}</span>
        <span className="bento-bar-clock">&quot;preet@toronto&quot;{clock && ` ${clock}`}</span>
      </header>

      <div className="bento-grid" id="workspace-files">
        <section className="bento-hero" aria-label="Introduction" aria-busy={!complete} data-loading={!complete || undefined}>
          <p className="text-muted-foreground">{"// hello, world"}</p>
          <p className="bento-name" aria-hidden="true">{firstName}<br /><span className="text-brand">{rest.join(" ")}</span></p>
          <p>{intro.role} <span className="text-brand">@ {intro.company}</span></p>
          <p className="text-muted-foreground">{intro.location}</p>
          <p className="text-muted-foreground">{intro.description}</p>
          <div className="bento-links">
            {intro.links.map((link) => <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="workspace-link lowercase">{link.name}<ArrowUpRight className="h-3 w-3" /></a>)}
          </div>
        </section>

        <div className="bento-editor" data-nosnippet>
          <header className="bento-editor-chrome">
            <h1 id="workspace-heading" className="bento-title"><span className="text-brand" aria-hidden="true">❯</span><span className="bento-title-name">Preet Patel</span><span className="bento-title-path">/ portfolio</span></h1>
            <span className="bento-version"><time dateTime={today}>{today.replaceAll("-", ".")}</time><abbr title="Coordinated Universal Time" className="bento-utc">UTC</abbr></span>
          </header>
          <div className="bento-session cc">
            <pre className="sr-only" aria-label="Claude Code session" aria-hidden={complete}>{`> ${OPEN_COMMAND}\n${source}`}</pre>
            <div ref={sessionRef} className="cc-scroll" tabIndex={0} role="region" aria-label="Claude Code session">
              <div className="cc-log" aria-hidden={!complete}>
                <div className="cc-welcome">
                  <p><span className="text-brand">✻</span> Welcome to <b>Claude Code</b></p>
                  <p className="cc-dim">cwd: ~/portfolio</p>
                  <div className="cc-tips">
                    <p>Tips for getting started:</p>
                    <ol>
                      <li>Press <kbd>W</kbd> <kbd>P</kbd> <kbd>E</kbd> <kbd>C</kbd> to jump between tiles</li>
                      <li>Press a key twice, or <kbd>z</kbd>, to open Work or Projects full screen</li>
                      <li>Type <kbd>help</kbd> below for every command</li>
                    </ol>
                  </div>
                </div>
                {promptSent && <p className="cc-user">&gt; {OPEN_COMMAND}</p>}
                {frame.codeLength > 0 && shown.map((line, index) => (
                  <p key={index} className={`cc-line ${line.trimStart().startsWith("⎿") ? "cc-result" : ""}`}>{renderTranscriptLine(line, intro.links, complete)}</p>
                ))}
                {working && <p className="cc-spinner"><span className="cc-spin">✻</span> {frame.phase === "opening" ? "Thinking…" : "Building…"} <span className="cc-dim">(esc to interrupt)</span></p>}
              </div>
            </div>
            <form className="cc-prompt" onSubmit={(event) => { event.preventDefault(); if (!complete) finish(); else runCommand(command); }}>
              <span aria-hidden="true" className="text-brand">&gt;</span>
              {complete ? (
                <input ref={inputRef} value={command} onChange={(event) => setCommand(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") { setCommand(""); inputRef.current?.blur(); } }} aria-label="Portfolio command" autoComplete="off" spellCheck={false} placeholder="help, projects, search…" />
              ) : (
                <span className="cc-typed" aria-hidden="true">{typed}<span className="workspace-cursor">&nbsp;</span></span>
              )}
              <button type="submit" aria-label="Run command" className={launching && frame.launchLength === LAUNCH_COMMAND.length ? "cc-enter cc-enter-hot" : "cc-enter"}>↵</button>
            </form>
            <div className="cc-footer">
              <span aria-hidden="true">⏵⏵ accept edits on</span>
              {complete ? <span aria-hidden="true">⎇ main · ~/portfolio</span> : <span aria-hidden="true">esc to skip intro</span>}
            </div>
          </div>
          <p role="status" className="bento-message">{complete ? message : " "}</p>
        </div>

        <div className="bento-oculus" data-loading={!complete || undefined}>
          <WorkspaceRail onNavigate={navigate} onOpenCommands={openCommands} />
        </div>

        {children}
      </div>

      {introducing && (
        <div className="bento-stage" aria-hidden="true" data-nosnippet>
          <div className="bento-stage-head">
            <p ref={stageNameRef} className="bento-stage-name">{firstName}<br /><span className="text-brand">{rest.join(" ")}</span></p>
          </div>
          <div ref={stagePromptRef} className="bento-stage-prompt">
            <span className="text-brand">&gt;</span>
            <span className="cc-typed">{OPEN_COMMAND.slice(0, frame.commandLength)}<span className="workspace-cursor">&nbsp;</span></span>
            <span className={entered ? "cc-enter cc-enter-hot" : "cc-enter"}>↵</span>
          </div>
        </div>
      )}
    </section>
    </BentoContext.Provider>
  );
}
