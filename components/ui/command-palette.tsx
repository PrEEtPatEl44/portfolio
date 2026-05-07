"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Home,
  Terminal,
  FileText,
  Github,
  Linkedin,
  Music,
  Pause,
  Search,
} from "lucide-react";
import type { BlogPostMeta } from "@/lib/blog";

interface CommandPaletteProps {
  posts: BlogPostMeta[];
}

export function CommandPalette({ posts }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState<number | null>(null);
  const router = useRouter();

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Track music playback state from MusicPlayer
  useEffect(() => {
    const handler = (e: CustomEvent<{ playing: number | null }>) =>
      setMusicPlaying(e.detail.playing);
    window.addEventListener("music:statechange", handler as EventListener);
    return () =>
      window.removeEventListener("music:statechange", handler as EventListener);
  }, []);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  const playTrack = useCallback((index: number) => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("music:play", { detail: { index } }));
  }, []);

  const pauseMusic = useCallback(() => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("music:pause"));
  }, []);

  return (
    <>
      {/* Search trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="group fixed top-4 right-16 z-50 flex h-10 items-stretch overflow-hidden border border-border bg-background shadow-xs transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {/* Icon + label */}
        <span className="flex items-center gap-2 px-3">
          <Search className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-brand" />
          <span className="hidden font-space-mono text-xs tracking-wide text-muted-foreground transition-colors group-hover:text-foreground sm:inline">
            search
          </span>
        </span>

        {/* Key caps zone */}
        <span className="flex items-center gap-1 border-l border-border px-2.5 transition-colors group-hover:border-brand/40">
          <kbd className="flex h-5 items-center justify-center border border-border bg-muted/40 px-1.5 font-space-mono text-[9px] text-muted-foreground transition-colors group-hover:border-brand/50 group-hover:text-brand">
            ⌘
          </kbd>
          <kbd className="flex h-5 items-center justify-center border border-border bg-muted/40 px-1.5 font-space-mono text-[9px] text-muted-foreground transition-colors group-hover:border-brand/50 group-hover:text-brand">
            K
          </kbd>
        </span>
      </button>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
          >
            <DialogPrimitive.Title className="sr-only">
              Command Palette
            </DialogPrimitive.Title>

            <Command className="overflow-hidden border border-zinc-700 bg-zinc-950 font-space-mono shadow-2xl">
              {/* Title bar */}
              <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-brand/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
                <span className="ml-2 text-xs text-zinc-500">~/search</span>
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                <span className="text-sm text-brand">{">"}</span>
                <Command.Input
                  placeholder="type a command or search..."
                  className="flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
                />
              </div>

              {/* List */}
              <Command.List className="max-h-72 overflow-y-auto py-2">
                <Command.Empty className="py-8 text-center text-xs text-zinc-500">
                  no results found.
                </Command.Empty>

                {musicPlaying !== null && (
                  <Command.Group>
                    <GroupLabel>NOW PLAYING</GroupLabel>
                    <PaletteItem
                      icon={<Pause className="h-3.5 w-3.5" />}
                      onSelect={pauseMusic}
                    >
                      Pause Music
                    </PaletteItem>
                  </Command.Group>
                )}

                <Command.Group>
                  <GroupLabel>NAVIGATE</GroupLabel>
                  <PaletteItem
                    icon={<Home className="h-3.5 w-3.5" />}
                    onSelect={() => run(() => router.push("/"))}
                  >
                    Home
                  </PaletteItem>
                  <PaletteItem
                    icon={<Terminal className="h-3.5 w-3.5" />}
                    onSelect={() => run(() => router.push("/projects"))}
                  >
                    Projects
                  </PaletteItem>
                  <PaletteItem
                    icon={<FileText className="h-3.5 w-3.5" />}
                    onSelect={() => run(() => router.push("/blogs"))}
                  >
                    Blog
                  </PaletteItem>
                </Command.Group>

                {posts.length > 0 && (
                  <Command.Group>
                    <GroupLabel>POSTS</GroupLabel>
                    {posts.map((post) => (
                      <PaletteItem
                        key={post.slug}
                        icon={<FileText className="h-3.5 w-3.5" />}
                        hint={post.date}
                        onSelect={() =>
                          run(() => router.push(`/blogs/${post.slug}`))
                        }
                      >
                        {post.title}
                      </PaletteItem>
                    ))}
                  </Command.Group>
                )}

                <Command.Group>
                  <GroupLabel>MUSIC</GroupLabel>
                  <PaletteItem
                    icon={<Music className="h-3.5 w-3.5" />}
                    onSelect={() => playTrack(0)}
                  >
                    Coffee Lofi Chill
                  </PaletteItem>
                  <PaletteItem
                    icon={<Music className="h-3.5 w-3.5" />}
                    onSelect={() => playTrack(1)}
                  >
                    Good Night Lofi Cozy
                  </PaletteItem>
                  <PaletteItem
                    icon={<Music className="h-3.5 w-3.5" />}
                    onSelect={() => playTrack(2)}
                  >
                    Study Calm Peaceful
                  </PaletteItem>
                </Command.Group>

                <Command.Group>
                  <GroupLabel>LINKS</GroupLabel>
                  <PaletteItem
                    icon={<Github className="h-3.5 w-3.5" />}
                    hint="↗"
                    onSelect={() =>
                      run(() =>
                        window.open(
                          "https://github.com/PrEEtPatEl44",
                          "_blank",
                          "noopener,noreferrer",
                        ),
                      )
                    }
                  >
                    GitHub
                  </PaletteItem>
                  <PaletteItem
                    icon={<Linkedin className="h-3.5 w-3.5" />}
                    hint="↗"
                    onSelect={() =>
                      run(() =>
                        window.open(
                          "https://www.linkedin.com/in/preet-patel44/",
                          "_blank",
                          "noopener,noreferrer",
                        ),
                      )
                    }
                  >
                    LinkedIn
                  </PaletteItem>
                </Command.Group>
              </Command.List>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-2">
                <span className="text-[10px] text-zinc-600">
                  ↑↓ navigate &middot; ↵ select &middot; esc close
                </span>
                <kbd className="text-[10px] text-zinc-600">⌘K</kbd>
              </div>
            </Command>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-1 pt-2 text-[10px] tracking-widest text-zinc-500">
      {children}
    </div>
  );
}

function PaletteItem({
  icon,
  children,
  hint,
  onSelect,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
  onSelect?: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="group mx-2 flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-xs text-zinc-400 data-[selected=true]:bg-zinc-800 data-[selected=true]:text-brand"
    >
      {icon && (
        <span className="text-zinc-600 group-data-[selected=true]:text-brand">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
      {hint && <span className="text-[10px] text-zinc-600">{hint}</span>}
    </Command.Item>
  );
}
