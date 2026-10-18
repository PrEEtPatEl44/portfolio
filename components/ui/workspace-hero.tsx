"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, GitBranch, RotateCcw } from "lucide-react";
import { WorkspaceRail, WORKSPACE_SHORTCUTS } from "@/components/ui/workspace-rail";
import { useWorkspaceStartup } from "@/components/ui/use-workspace-startup";
import { LAUNCH_COMMAND, OPEN_COMMAND } from "@/lib/workspace-startup";

type WorkspaceIntro = {
  name: string;
  location: string;
  role: string;
  company: string;
  description: string;
  project: string;
  version: string;
  links: { name: string; href: string }[];
};

function navigate(target: string) {
  const section = document.getElementById(target);
  if (!section) return;
  section.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    block: "start",
  });
  section.focus({ preventScroll: true });
}

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

export function WorkspaceHero({ intro, children }: { intro: WorkspaceIntro; children: ReactNode }) {
  const [command, setCommand] = useState("");
  const [message, setMessage] = useState("ready when you are. type :help to explore.");
  const inputRef = useRef<HTMLInputElement>(null);
  const workspaceRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const lines = [
    "// a little context before the code.",
    "const preet = {",
    `  name: ${JSON.stringify(intro.name)},`,
    `  role: ${JSON.stringify(intro.role)},`,
    `  at: ${JSON.stringify(intro.company)},`,
    `  basedIn: ${JSON.stringify(intro.location)},`,
    `  building: ${JSON.stringify(intro.project)},`,
    ...intro.links.map((link) => `  ${link.name.toLowerCase()}: ${JSON.stringify(link.href)},`),
    "};",
    "",
    `// ${intro.description}`,
  ];
  const source = lines.join("\n");
  const { frame, finish, restart } = useWorkspaceStartup(source);
  const complete = frame.phase === "ready";
  const launching = frame.phase === "launching";
  const introducing = frame.phase === "identity" || frame.phase === "morphing";
  const fileOpen = frame.phase === "typing" || launching || complete;
  const visibleSource = source.slice(0, frame.codeLength);
  const cursorLine = visibleSource.split("\n").length - 1;
  const cursorColumn = visibleSource.length - visibleSource.lastIndexOf("\n");

  useEffect(() => {
    const preview = previewRef.current;
    const workspace = workspaceRef.current;
    if (!preview || !workspace) return;
    const measure = () => workspace.style.setProperty("--workspace-window-height", `${preview.offsetHeight + 2}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(preview);
    measure();
    return () => observer.disconnect();
  }, []);

  // A section is hidden until the workspace opens; navigate after React reveals it.
  const openSection = useCallback((target: string) => {
    finish();
    requestAnimationFrame(() => navigate(target));
  }, [finish]);

  const openCommands = useCallback(() => {
    finish();
    window.dispatchEvent(new Event("portfolio:commands"));
  }, [finish]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat ||
        target?.closest("input, textarea, select, button, a, [contenteditable], [role='dialog']") ||
        document.querySelector("[role='dialog']")) return;
      if (event.key === ":") {
        event.preventDefault();
        finish();
        setCommand(":");
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [finish]);

  function runCommand(raw: string) {
    finish();
    const value = raw.trim().replace(/^:/, "").toLowerCase();
    if (value === "help" || value === "?" || value === "search") {
      window.dispatchEvent(new Event("portfolio:commands"));
      setMessage(":work · :projects · :education · :contact · :search");
    } else if (WORKSPACE_SHORTCUTS.some((item) => item.target === value)) {
      requestAnimationFrame(() => navigate(value));
      setMessage(`jumped to ${value}.`);
    } else {
      setMessage("unknown command. try :help or :search.");
    }
    setCommand("");
  }

  return (
    <section ref={workspaceRef} aria-labelledby="workspace-heading" className="workspace" data-startup={frame.phase} data-instant={frame.instant ? "true" : undefined}>
      <WorkspaceRail onNavigate={openSection} onOpenCommands={openCommands} />
      <div className="workspace-content-column">
      <div className="workspace-editor relative overflow-hidden border border-border bg-background">
        <div ref={previewRef} className="workspace-preview relative">
        <header className="workspace-chrome relative flex min-h-14 items-center justify-end border-b border-border px-4 font-space-mono">
          <h1 id="workspace-heading" className="workspace-title"><span className="workspace-title-prompt text-brand" aria-hidden="true">❯</span>Preet Codes<span className="workspace-title-path">/ portfolio</span></h1>
          <span className="workspace-version shrink-0 text-[10px] text-muted-foreground">{intro.version}</span>
        </header>
        <div className="workspace-intro-copy" aria-hidden="true">
          <p>{intro.role} <span className="text-brand">@ {intro.company}</span></p>
          <p className="mt-1 text-[10px] text-muted-foreground">{intro.location}</p>
          <p className="mt-5 text-[10px] text-muted-foreground">{intro.description}</p>
          <span className="workspace-intro-hint"><span className="workspace-cursor">&nbsp;</span> opening my workspace</span>
        </div>
        <div className="workspace-session relative">
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
        <div className={`workspace-buffer ${fileOpen ? "workspace-buffer-open" : "workspace-buffer-pending"}`} inert={!fileOpen}>
        <div className="flex items-center justify-between border-b border-border bg-muted/30 pr-4 font-space-mono text-[10px]">
          <span className="workspace-file-tab border-r border-border border-t-2 border-t-brand bg-background px-4 py-3"><span className="mr-2 text-brand">TS</span> now.ts <span className="ml-5 text-muted-foreground">{complete ? "×" : "+"}</span></span>
          <button type="button" onClick={() => { window.scrollTo({ top: 0, behavior: "instant" }); restart(); }} disabled={!complete} aria-label="Replay startup animation" title="Replay startup animation" className="workspace-replay"><RotateCcw className="h-3 w-3" /><span>replay</span></button>
        </div>
        <div className="overflow-x-auto py-5 font-space-mono text-[11px] leading-[1.9] sm:text-xs" tabIndex={0} role="region" aria-label="Introduction code buffer">
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
            <span aria-hidden="true" className="pl-5 text-brand/35">~</span>
          </code>
        </div>
        <div className="flex items-stretch justify-between bg-muted/50 font-space-mono text-[10px]">
          <div className="flex items-center"><span className="min-w-20 border-r border-border bg-muted px-3 py-1.5 text-center font-bold text-foreground">{complete || launching ? "NORMAL" : "INSERT"}</span><span className="flex items-center gap-1.5 px-3 text-muted-foreground"><GitBranch className="h-3 w-3" />main</span></div>
          <span className="px-3 py-1.5 text-muted-foreground">now.ts <span className="ml-3 hidden sm:inline">utf-8</span> <span className="ml-3">{cursorLine + 1}:{cursorColumn}</span></span>
        </div>
        <form className="flex min-h-11 items-center gap-2 border-t border-border px-4 font-space-mono text-xs" onSubmit={(event) => { event.preventDefault(); if (!complete) finish(); else runCommand(command); }}>
          <span aria-hidden="true" className="text-brand">:</span>
          <input ref={inputRef} value={launching ? LAUNCH_COMMAND.slice(0, frame.launchLength ?? 0) : command} readOnly={!complete} onChange={(event) => setCommand(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") { setCommand(""); inputRef.current?.blur(); } }} aria-label="Portfolio command" autoComplete="off" spellCheck={false} placeholder={complete ? "help, projects, search…" : ""} className="min-w-0 flex-1 bg-transparent py-3 text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-brand" />
          <button type="submit" className={`border px-2 py-1 text-[10px] transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-brand ${launching && frame.launchLength === LAUNCH_COMMAND.length ? "border-brand bg-muted text-foreground" : "border-border text-muted-foreground"}`}>enter ↵</button>
        </form>
        </div>
        </div>
        </div>
        <p role="status" hidden={!complete} className="workspace-message font-space-mono text-[10px] leading-relaxed text-muted-foreground">{message}</p>
      </div>

      <div className="workspace-after-intro" hidden={!complete} inert={!complete}>
      <main className="workspace-site" id="workspace-files" aria-label="Portfolio files">{children}</main>
      <footer className="workspace-site-status flex flex-wrap items-center justify-between gap-4">
        <span><span className="text-brand">NORMAL</span> <span className="ml-3">6 buffers · portfolio</span></span>
        <div className="flex gap-5">{intro.links.map((link) => <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-space-mono text-[10px] lowercase text-muted-foreground transition-colors hover:text-brand">{link.name}<ArrowUpRight className="h-3 w-3" /></a>)}</div>
      </footer>
      </div>
      </div>
    </section>
  );
}
