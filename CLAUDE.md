# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (Next.js on localhost:3000)
- `npm run build` — production build
- `npm run lint` — run ESLint

No test framework is configured.

## Architecture

Next.js 16 App Router personal portfolio site. Dark-only theme with a retro CRT/terminal aesthetic.

### Key structure

- `app/page.tsx` — single-page portfolio with sections: Hero, Work, Education, Projects, Blog, Skills, Activity (GitHub heatmap)
- `app/blogs/` — blog listing page and `[slug]/page.tsx` dynamic route
- `data/data.ts` — all portfolio content (hero info, work experience, education, projects, blog posts with inline markdown content). Blog posts are stored as string content in this file, not as separate markdown files.
- `components/ui/` — shadcn/ui primitives (button, badge, dialog) plus custom components
- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)

### Theming and styling

- Tailwind CSS v4 with shadcn/ui (new-york style). CSS variables defined in `app/globals.css`.
- `--brand` CSS variable controls the accent color site-wide (default: orange oklch). The `AccentPicker` component lets users switch it at runtime.
- Custom CSS utilities in globals.css: `.bg-grid-pattern`, `.text-outline`, `.crt` (scanline overlay + flicker), `.glitch-text` (animated text distortion).
- Font: Space Mono (`font-space-mono`) is the primary display font used throughout.
- `html` element has `className="dark"` hardcoded — dark mode only.

### Custom components

- `AccentPicker` — fixed top-left color picker that sets `--brand` CSS variable
- `MusicPlayer` — fixed top-right ambient audio player using Radix Dialog, plays from `/public/audio/`
- `GlitchText`, `TextFlip`, `FadeIn` — animation components using framer-motion
- `GitHubActivity` — client component using `react-activity-calendar`

### Conventions

- All UI components are in `components/ui/` with kebab-case filenames
- Client components use `"use client"` directive; pages are server components by default
- Icons from `lucide-react` exclusively
- Path aliases: `@/components`, `@/lib`, `@/data`
