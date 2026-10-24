/** Timing and easing from docs/intro-reference.html; coordinates come from the live DOM. */
export const INTRO_END = 6;
export const ARRANGE = 4.55;
export const WORD_TIMES = [0.35, 0.57, 0.71, 0.87];
export const LINE_TIMES = [1.9, 2.05, 2.15, 2.32, 2.54, 2.76, 2.98, 3.2, 3.42, 3.64, 3.86, 4.12, 4.42, 4.66];
export const DEAL = [
  { id: "hero", side: -1, row: 0, line: 3, tilt: -4, jitter: -14 },
  { id: "work", side: 1, row: 0, line: 4, tilt: 3.5, jitter: 10 },
  { id: "education", side: -1, row: 1, line: 5, tilt: 5, jitter: 16 },
  { id: "contact", side: 1, row: 1, line: 6, tilt: -3, jitter: -8 },
  { id: "projects", side: -1, row: 2, line: 7, tilt: -2.5, jitter: 6 },
  { id: "eye", side: 1, row: 2, line: 8, tilt: 4, jitter: -16 },
  { id: "skills", side: -1, row: 3, line: 9, tilt: 3, jitter: -6 },
  { id: "activity", side: 1, row: 3, line: 10, tilt: -5, jitter: 12 },
] as const;

export const clamp = (value: number) => Math.min(1, Math.max(0, value));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const progress = (t: number, start: number, end: number) => clamp((t - start) / (end - start));
export const easeIn = (x: number) => x * x * x;
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
export const easeExpo = (x: number) => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
export const back = (amount: number, x: number) => 1 + (amount + 1) * Math.pow(x - 1, 3) + amount * Math.pow(x - 1, 2);

export function introLines(name: string, role: string, company: string) {
  return [
    "⏺ I'll build your portfolio from your profile.",
    "⏺ Read(profile.md)",
    `  ⎿ ${name} · ${role} @ ${company}`,
    "⏺ Write(components/ui/bento-workspace.tsx · hero)",
    "⏺ Write(components/ui/work-log.tsx)",
    "⏺ Write(app/page.tsx · education)",
    "⏺ Write(app/page.tsx · contact)",
    "⏺ Write(components/ui/project-deck.tsx)",
    "⏺ Write(components/ui/tracking-eye.tsx)",
    "⏺ Write(app/page.tsx · skills)",
    "⏺ Write(components/ui/github-activity.tsx)",
    "⏺ Bash(npm run build)",
    "  ⎿ ✓ Compiled successfully",
    "⏺ Done. Your portfolio is ready.",
  ];
}
