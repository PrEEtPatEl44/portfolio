"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Volume2, VolumeX, Play, Pause, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const tracks = [
  { name: "COFFEE LOFI CHILL", src: "/audio/coffee-lofi-chill.mp3" },
  { name: "GOOD NIGHT LOFI COZY", src: "/audio/good-night-lofi-cozy.mp3" },
  { name: "STUDY CALM PEACEFUL", src: "/audio/study-calm-peaceful.mp3" },
];

export function MusicPlayer() {
  const [playing, setPlaying] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showTooltip) return;
    const dismiss = setTimeout(() => setShowTooltip(false), 10000);
    return () => clearTimeout(dismiss);
  }, [showTooltip]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  function handlePlay(index: number) {
    if (playing === index) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(tracks[index].src);
    audio.muted = muted;
    audio.loop = true;
    audio.play().catch(() => {});
    audio.addEventListener("ended", () => setPlaying(null));
    audioRef.current = audio;
    setPlaying(index);
  }

  function handleMuteToggle() {
    setMuted((v) => !v);
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {/* Mute button */}
      <button
        onClick={handleMuteToggle}
        className={`group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-none
         border border-neutral-800 bg-black text-sm font-medium shadow-xs transition-colors hover:border-brand
         focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:shadow-none ${
           muted ? "border-brand" : ""
         }`}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          <VolumeX className="h-4 w-4 text-brand transition-colors" />
        ) : (
          <Volume2 className="h-4 w-4 text-neutral-500 transition-colors group-hover:text-brand" />
        )}
      </button>

      {/* Tooltip popup */}
      {showTooltip && (
        <button
          onClick={() => {
            setShowTooltip(false);
            setOpen(true);
          }}
          className="absolute top-14 right-0 animate-in fade-in slide-in-from-top-2 duration-300 cursor-pointer"
        >
          <div className="relative flex items-center gap-2 border-2 border-brand bg-brand px-4 py-2 font-space-mono text-xs tracking-widest text-black font-bold whitespace-nowrap">
            [ SYSTEM: PLAY CALMING AUDIO? ]
            <span
              role="button"
              aria-label="Dismiss"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="inline-flex items-center justify-center hover:opacity-70"
            >
              <X className="h-3.5 w-3.5" />
            </span>
            <div className="absolute -top-[6px] right-4 h-0 w-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-brand" />
          </div>
        </button>
      )}

      {/* Music button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className={`group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-none
             border border-neutral-800 bg-black text-sm font-medium shadow-xs transition-colors hover:border-brand
             focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:shadow-none ${
               playing !== null ? "border-brand" : ""
             }`}
            aria-label="Open music player"
          >
            <Music
              className={`h-4 w-4 transition-colors ${playing !== null ? "text-brand" : "text-neutral-500 group-hover:text-brand"}`}
            />
          </button>
        </DialogTrigger>

        <DialogContent className="origin-top-right rounded-none border border-neutral-800 bg-black p-0 font-space-mono sm:max-w-sm data-[state=open]:slide-in-from-top-8 data-[state=open]:slide-in-from-right-8 data-[state=closed]:slide-out-to-top-8 data-[state=closed]:slide-out-to-right-8 [&>button]:text-neutral-500 [&>button]:hover:text-brand">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-sm tracking-[0.2em] text-brand">
              SELECT FREQUENCY
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2 px-4 pb-4">
            {tracks.map((track, i) => (
              <button
                key={track.name}
                onClick={() => handlePlay(i)}
                className={`group flex items-center justify-between px-4 py-4 text-left transition-colors
                  ${
                    playing === i
                      ? "border border-brand bg-brand/5 text-white"
                      : "border border-transparent text-neutral-400  hover:border-brand "
                  }`}
              >
                <span className="text-sm tracking-wider">{track.name}</span>
                {playing === i ? (
                  <Pause className="h-4 w-4 text-brand group-hover:text-brand" />
                ) : (
                  <Play className="h-4 w-4 group-hover:text-brand" />
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
