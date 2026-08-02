export function TerminalBox({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-zinc-300 bg-white/60 p-4 font-space-mono transition-colors hover:border-brand/50 dark:border-zinc-800 dark:bg-black/60 ${className}`}
    >
      <div className="mb-3 flex items-center gap-1.5 border-b border-zinc-300 pb-2 dark:border-zinc-800">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand/70" />
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-700" />
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-700" />
        {title && (
          <span className="ml-2 min-w-0 truncate text-xs text-zinc-600 dark:text-zinc-500">
            {title}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
