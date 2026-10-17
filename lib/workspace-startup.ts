export const OPEN_COMMAND = "nvim now.ts";
export const LAUNCH_COMMAND = "open portfolio";

export type StartupPhase = "identity" | "morphing" | "shell" | "opening" | "typing" | "launching" | "ready";
export type StartupFrame = {
  phase: StartupPhase;
  commandLength: number;
  codeLength: number;
  launchLength?: number;
  instant?: boolean;
};

/** A deterministic timeline: slight punctuation pauses without random hydration. */
export function createStartupTimeline(source: string) {
  // Identity holds while the oculus opens and blinks; morphing is the eye + title flight.
  const frames: (StartupFrame & { at: number })[] = [
    { at: 0, phase: "identity", commandLength: 0, codeLength: 0 },
    { at: 1500, phase: "morphing", commandLength: 0, codeLength: 0 },
    { at: 2300, phase: "shell", commandLength: 0, codeLength: 0 },
  ];
  let at = 2420;
  for (let index = 1; index <= OPEN_COMMAND.length; index++) {
    at += 48 + (index % 3) * 16;
    frames.push({ at, phase: "shell", commandLength: index, codeLength: 0 });
  }
  at += 240;
  frames.push({ at, phase: "opening", commandLength: OPEN_COMMAND.length, codeLength: 0 });
  at += 320;
  frames.push({ at, phase: "typing", commandLength: OPEN_COMMAND.length, codeLength: 0 });
  for (let index = 1; index <= source.length; index++) {
    const character = source[index - 1];
    at += character === "\n" ? 28 : /[{},;]/.test(character) ? 10 : 2 + (index % 3);
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
