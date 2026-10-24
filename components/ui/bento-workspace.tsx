"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { BentoContext, ZOOMABLE_TILES } from "@/components/ui/bento-tile";
import { WorkspaceRail, WORKSPACE_SHORTCUTS } from "@/components/ui/workspace-rail";
import { useBentoIntro, introLines } from "@/components/ui/use-bento-intro";
import { OPEN_COMMAND } from "@/lib/workspace-startup";

type WorkspaceIntro = {
  name: string;
  location: string;
  role: string;
  company: string;
  description: string;
  today: string;
  links: { name: string; href: string }[];
};

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
  const waveId = useId();
  const today = useUtcDate(intro.today);
  const clock = useTorontoClock();

  const lines = useMemo(() => introLines(intro.name, intro.role, intro.company), [intro.name, intro.role, intro.company]);
  const { ready: complete, skip, finish, replay } = useBentoIntro(rootRef);
  const [firstName, ...rest] = intro.name.split(" ");

  const replayIntro = useCallback(() => {
    setZoomed(null);
    setFocused(null);
    inputRef.current?.blur();
    // Restore the actual slot before measuring, including any in-flight zoom clip.
    requestAnimationFrame(() => {
      rootRef.current?.querySelectorAll<HTMLElement>(".bento-tile").forEach((tile) => {
        tile.getAnimations().forEach((animation) => animation.cancel());
        delete tile.dataset.closing;
      });
      replay();
    });
  }, [replay]);

  const focus = useCallback((id: string) => setFocused(id), []);
  const toggleZoom = useCallback((id: string) => {
    if (!complete) return;
    setFocused(id);
    if (ZOOMABLE_TILES.includes(id)) setZoomed((current) => (current === id ? null : id));
  }, [complete]);

  // A section key focuses its tile; pressing it again on the focused tile zooms it.
  const focusedRef = useRef(focused);
  useEffect(() => { focusedRef.current = focused; }, [focused]);
  const navigate = useCallback((id: string) => {
    if (!complete) return;
    if (focusedRef.current === id) return toggleZoom(id);
    setZoomed(null);
    setFocused(id);
    requestAnimationFrame(() => {
      const tile = document.getElementById(id);
      if (!tile) return;
      tile.scrollIntoView({ block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      tile.focus({ preventScroll: true });
    });
  }, [complete, toggleZoom]);

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
      if (!complete) return;
      const target = event.target as HTMLElement | null;
      if (event.key.toLowerCase() === "r" && !event.metaKey && !event.ctrlKey && !event.altKey && !event.repeat && !target?.closest("input, textarea, select, [contenteditable], [role='dialog']") && !document.querySelector("[role='dialog']")) {
        event.preventDefault(); replayIntro(); return;
      }
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
  }, [complete, finish, replayIntro, toggleZoom, zoomed]);

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
    <section ref={rootRef} aria-labelledby="workspace-heading" className="bento bento-reel" data-startup={complete ? "ready" : "intro"}>
      <div className="bento-startup-skip" data-nosnippet hidden={complete}>
        <button type="button" onClick={skip} aria-label="Fast-forward startup animation">
          skip intro <kbd aria-hidden="true">esc</kbd>
        </button>
      </div>
      {complete && <button type="button" className="intro-replay" onClick={replayIntro} data-nosnippet>↻ replay intro <kbd>r</kbd></button>}
      <header className="bento-bar" aria-label="Workspace status">
        <span className="bento-bar-session">[portfolio]</span>
        <span className="bento-bar-window">0:main*</span>
        <span className="bento-bar-hints">z zoom · ←/→ projects · w/p/e/c focus · : command</span>
        <span role="status">{SECTIONS.length} buffers loaded</span>
        <span className="bento-bar-clock">&quot;preet@toronto&quot;{clock && ` ${clock}`}</span>
      </header>

      <div className="bento-grid" id="workspace-files" inert={!complete}>
        <section className="bento-hero" data-intro-tile="hero" aria-label="Introduction">
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
            <pre className="sr-only" aria-label="Claude Code session" aria-hidden={complete}>{`> ${OPEN_COMMAND}\n${lines.join("\n")}`}</pre>
            <div className="cc-scroll" tabIndex={0} role="region" aria-label="Claude Code session">
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
                <p className="cc-user">&gt; {OPEN_COMMAND}</p>
                {lines.map((line, index) => (
                  <p key={index} data-intro-line={index} className={`cc-line ${line.trimStart().startsWith("⎿") ? "cc-result" : ""}`}>{renderTranscriptLine(line, intro.links, complete)}<span className="intro-line-flash" aria-hidden="true">{line}</span></p>
                ))}
                <p className="cc-spinner intro-building" aria-hidden="true"><span>✻</span> Building… <span className="cc-dim">(esc to fast-forward)</span></p>
                <div className="cc-explore" aria-hidden={!complete}>
                  <div className="cc-output-group">
                    <p><span className="cc-dot">⏺</span> <b>Read</b>(data/data.ts)</p>
                    <p className="cc-output-result">⎿ {intro.role} @ {intro.company}</p>
                    <p className="cc-output-result cc-output-continuation">{intro.description}</p>
                  </div>
                  <div className="cc-output-group">
                    <p><span className="cc-dot">⏺</span> <b>Read</b>(app/page.tsx)</p>
                    <p className="cc-output-result">⎿ hero, work, projects, oculus</p>
                    <p className="cc-output-result cc-output-continuation">skills, activity, education, contact</p>
                  </div>
                  <div className="cc-output-group">
                    <p><span className="cc-dot">⏺</span> <b>Read</b>(data/data.ts · socialLinks)</p>
                    {intro.links.map((link, index) => <p key={link.name} className={`cc-output-result ${index > 0 ? "cc-output-continuation" : ""}`}>{index === 0 && "⎿ "}<a href={link.href} target="_blank" rel="noopener noreferrer">{link.href}</a></p>)}
                  </div>
                </div>

              </div>
            </div>
            <form className="cc-prompt" onSubmit={(event) => { event.preventDefault(); if (!complete) finish(); else runCommand(command); }}>
              <span aria-hidden="true" className="text-brand">&gt;</span>
              <input ref={inputRef} value={command} onChange={(event) => setCommand(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") { setCommand(""); inputRef.current?.blur(); } }} aria-label="Portfolio command" autoComplete="off" spellCheck={false} placeholder="help, projects, search…" />
              <button type="submit" aria-label="Run command" className="cc-enter">↵</button>
            </form>
            <div className="cc-footer">
              <span aria-hidden="true">⏵⏵ accept edits on</span>
              {complete ? <span aria-hidden="true">⎇ main · ~/portfolio</span> : <span aria-hidden="true">esc to skip intro</span>}
            </div>
          </div>
          <p role="status" className="bento-message">{message}</p>
        </div>

        <div className="bento-oculus" data-intro-tile="eye">
          <WorkspaceRail enabled={complete} onNavigate={navigate} onOpenCommands={openCommands} />
        </div>

        {children}
      </div>

      <div className="intro-stage" aria-hidden="true" data-nosnippet>
        <div className="intro-card">
          <p className="intro-name">{firstName}<br /><span>{rest.join(" ")}</span></p>
          <div className="intro-prompt">
            <span className="intro-chevron">&gt;</span>
            <span className="intro-highlight" />
            {OPEN_COMMAND.split(" ").map((word, index) => <span key={index} className="intro-word">{word}<span className="intro-word-ink">{word}</span></span>)}
            <span className="intro-caret" />
            <span className="intro-return">↵<span>↵</span></span>
          </div>
        </div>
      </div>
      {[0, 1].map((index) => <svg key={index} className="intro-wave" aria-hidden="true" data-nosnippet>
        <defs>
          <pattern id={`${waveId}-grid-${index}`} width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#f26a21" strokeWidth="1" /></pattern>
          <mask id={`${waveId}-mask-${index}`} maskUnits="userSpaceOnUse" x="-200%" y="-200%" width="500%" height="500%"><circle data-wave-band cx="0" cy="0" fill="none" stroke="white" /></mask>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${waveId}-grid-${index})`} mask={`url(#${waveId}-mask-${index})`} />
        {index === 0 && <circle data-wave-ring cx="0" cy="0" fill="none" stroke="#f26a21" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />}
      </svg>)}

    </section>
    </BentoContext.Provider>
  );
}
