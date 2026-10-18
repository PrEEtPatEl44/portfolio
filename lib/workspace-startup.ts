export const OPEN_COMMAND = "build me a portfolio";
export const LAUNCH_COMMAND = "open it";

export type StartupPhase = "identity" | "morphing" | "shell" | "opening" | "typing" | "launching" | "ready";
export type StartupFrame = {
  phase: StartupPhase;
  commandLength: number;
  codeLength: number;
  launchLength?: number;
  instant?: boolean;
};

/** A deterministic timeline: the session pauses where tools "run", without random hydration. */
export function createStartupTimeline(source: string) {
  // Identity shows the name and an empty prompt; shell types the prompt there;
  // morphing is the "enter": name and prompt fly into the hero and the terminal.
  const frames: (StartupFrame & { at: number })[] = [
    { at: 0, phase: "identity", commandLength: 0, codeLength: 0 },
    { at: 700, phase: "shell", commandLength: 0, codeLength: 0 },
  ];
  let at = 820;
  for (let index = 1; index <= OPEN_COMMAND.length; index++) {
    at += 48 + (index % 3) * 16;
    frames.push({ at, phase: "shell", commandLength: index, codeLength: 0 });
  }
  at += 380;
  frames.push({ at, phase: "morphing", commandLength: OPEN_COMMAND.length, codeLength: 0 });
  at += 720;
  frames.push({ at, phase: "opening", commandLength: OPEN_COMMAND.length, codeLength: 0 });
  at += 520;
  frames.push({ at, phase: "typing", commandLength: OPEN_COMMAND.length, codeLength: 0 });
  for (let index = 1; index <= source.length; index++) {
    if (source[index - 1] === "\n") {
      // Wait while a tool "runs" before its result line, and a beat between steps.
      const next = source.slice(index).split("\n", 1)[0].trimStart();
      at += next.startsWith("⎿") ? 220 : next.startsWith("⏺") ? 90 : 24;
    } else {
      at += 1 + (index % 2);
    }
    frames.push({ at, phase: "typing", commandLength: OPEN_COMMAND.length, codeLength: index });
  }
  at += 140;
  frames.push({ at, phase: "launching", commandLength: OPEN_COMMAND.length, codeLength: source.length, launchLength: 0 });
  for (let index = 1; index <= LAUNCH_COMMAND.length; index++) {
    at += 28;
    frames.push({ at, phase: "launching", commandLength: OPEN_COMMAND.length, codeLength: source.length, launchLength: index });
  }
  frames.push({ at: at + 180, phase: "ready", commandLength: OPEN_COMMAND.length, codeLength: source.length, launchLength: LAUNCH_COMMAND.length });
  return frames;
}

export function getStartupFrame(timeline: ReturnType<typeof createStartupTimeline>, elapsed: number) {
  // Binary search also catches up immediately when a background tab resumes.
  let low = 0;
  let high = timeline.length - 1;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (timeline[middle].at <= elapsed) low = middle;
    else high = middle - 1;
  }
  return timeline[low];
}
