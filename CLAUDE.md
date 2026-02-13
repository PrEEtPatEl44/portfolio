# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

Package manager: **npm**

## Architecture

Personal portfolio site built with **Next.js 16** (App Router), **React 19**, **TypeScript**, and **Tailwind CSS 4**.

### Key Directories

- `app/` — Next.js App Router: single-page site with root layout and one page
- `components/ui/` — Reusable UI components (shadcn/ui + custom)
- `data/data.ts` — **All site content lives here** (hero, work, education, projects, skills). Content is fully decoupled from UI — update this file to change any text/data
- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
- `public/audio/` — Lo-fi music tracks for the ambient player

### Component Patterns

- **Server Components by default**, `"use client"` only for interactive components (AccentPicker, MusicPlayer, GitHubActivity, TextFlip, GlitchText, FadeIn)
- **shadcn/ui** (New York style) with CVA for variant-based components. Config in `components.json`
- **Framer Motion** for scroll-triggered animations via the `FadeIn` wrapper
- Path alias: `@/*` maps to project root

### Theme System

- Dark mode only (HTML root has `className="dark"`)
- **OKLCH color space** for the dynamic accent color system
- CSS custom property `--brand` is changed at runtime by AccentPicker (4 presets: red, orange, purple, lime)
- Theme variables defined in `app/globals.css` under `:root` and `.dark`

### Visual Style

Retro/terminal aesthetic using Space Mono font, CRT scanline overlay, glitch text effects, grid background pattern, and blinking cursor — all defined in `app/globals.css`.

### Fonts

Four Google Fonts loaded via `next/font` in `layout.tsx`: Geist Sans, Geist Mono, Space Mono (primary UI font), Inter. Applied via CSS variables (`--font-space-mono`, etc.) and inline `font-[family-name:var(...)]` syntax.

## External APIs

- GitHub contributions calendar fetches from `github-contributions-api.jogruber.de` (no auth required, username: `PrEEtPatEl44`)

## Deployment

Deployed on **Vercel**. No environment variables needed.
