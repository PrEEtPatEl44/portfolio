"use client";

import { useState, useRef, useEffect } from "react";

const tracks = [
  { name: "COFFEE LOFI CHILL", src: "/audio/coffee-lofi-chill.mp3" },
  { name: "GOOD NIGHT LOFI COZY", src: "/audio/good-night-lofi-cozy.mp3" },
  { name: "STUDY CALM PEACEFUL", src: "/audio/study-calm-peaceful.mp3" },
];

export function MusicPlayer() {
  const [playing, setPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Broadcast state so the command palette can react
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("music:statechange", { detail: { playing } }),
    );
  }, [playing]);

  // Command palette → pause
  useEffect(() => {
    const handler = () => {
      audioRef.current?.pause();
      setPlaying(null);
    };
    window.addEventListener("music:pause", handler);
    return () => window.removeEventListener("music:pause", handler);
  }, []);

  // Command palette → play track by index
  useEffect(() => {
    const handler = (e: CustomEvent<{ index: number }>) =>
      handlePlay(e.detail.index);
    window.addEventListener("music:play", handler as EventListener);
    return () =>
      window.removeEventListener("music:play", handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  function handlePlay(index: number) {
    if (playing === index) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(tracks[index].src);
    audio.loop = true;
    audio.play().catch(() => {});
    audio.addEventListener("ended", () => setPlaying(null));
    audioRef.current = audio;
    setPlaying(index);
  }

  return null;
}
