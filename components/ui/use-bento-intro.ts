"use client";

import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { ARRANGE, DEAL, INTRO_END, LINE_TIMES, WORD_TIMES, back, clamp, easeExpo, easeIn, easeOut, introLines, lerp, progress } from "@/lib/bento-intro";

const SESSION_KEY = "portfolio:intro:landed:v2";
const ORANGE = "242,106,33";
const op = (element: HTMLElement | SVGElement, value: number) => { element.style.opacity = String(value); };
const clear = (element: HTMLElement | SVGElement) => {
  for (const property of ["transform", "opacity", "box-shadow", "z-index"]) element.style.removeProperty(property);
};

/** Owns one clock and one renderer. React only updates when playback starts or lands. */
export function useBentoIntro(rootRef: RefObject<HTMLElement | null>) {
  const [ready, setReady] = useState(false);
  const controls = useRef({ skip: () => {}, finish: () => {}, replay: () => {} });
  const skip = useCallback(() => controls.current.skip(), []);
  const finish = useCallback(() => controls.current.finish(), []);
  const replay = useCallback(() => controls.current.replay(), []);

  useLayoutEffect(() => {
    const root = rootRef.current!;
    if (!root) return;
    const get = <T extends HTMLElement | SVGElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
    const grid = get(".bento-grid");
    const terminal = get(".bento-editor");
    const session = get(".cc-scroll");
    const stage = get(".intro-card");
    const prompt = get(".intro-prompt");
    const highlight = get(".intro-highlight");
    const caret = get(".intro-caret");
    const enter = get(".intro-return");
    const words = [...root.querySelectorAll<HTMLElement>(".intro-word")];
    const lines = [...root.querySelectorAll<HTMLElement>("[data-intro-line]")];
    const building = get(".intro-building");
    const bar = get(".bento-bar");
    const message = get(".bento-message");
    const skipButton = get(".bento-startup-skip");
    const background = root.parentElement!.querySelector<HTMLElement>(".portfolio-grid-background")!;
    const waves = [...root.querySelectorAll<SVGSVGElement>(".intro-wave")].map((svg) => ({
      svg,
      band: svg.querySelector<SVGCircleElement>("[data-wave-band]")!,
      ring: svg.querySelector<SVGCircleElement>("[data-wave-ring]"),
    }));
    const cards = DEAL.map((deal, index) => ({
      ...deal, index, element: get(`[data-intro-tile="${deal.id}"]`),
      at: LINE_TIMES[deal.line] + 0.04,
      arrange: ARRANGE + 0.08 + index * 0.045,
    }));
    let t = 0, rate = 1, raf = 0, last = 0, landed = false, disposed = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(width < 900px), (height < 620px)");
    let dimensions: ReturnType<typeof measure>;

    // Remove only our transforms while reading layout, then restore the same timeline frame.
    // Font loading, element size changes and viewport changes all use this same FLIP measurement.
    function measure() {
      const moving = [terminal, stage, ...cards.map((card) => card.element), ...words, enter, ...lines];
      const transforms = moving.map((element) => element.style.transform);
      moving.forEach((element) => { element.style.transform = "none"; });
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const rect = terminal.getBoundingClientRect();
      const offset = { x: viewport.width / 2 - (rect.left + rect.width / 2), y: viewport.height / 2 - (rect.top + rect.height / 2) };
      const enterRect = enter.getBoundingClientRect();
      const boxes = words.map((word) => ({ x: word.offsetLeft, width: word.offsetWidth }));
      const sessionBox = session.getBoundingClientRect();
      const lineBoxes = lines.map((line) => {
        const bounds = line.getBoundingClientRect();
        return { left: bounds.left, top: bounds.top + session.scrollTop, height: bounds.height };
      });
      const slots = cards.map(({ element, side, row, jitter }) => {
        const slot = element.getBoundingClientRect();
        const scale = element.dataset.introTile === "education" || element.dataset.introTile === "contact" ? 0.9 : 0.7;
        // The table lives in the space beside the centred terminal, with four evenly spaced rows.
        const terminalEdge = viewport.width / 2 + side * rect.width / 2;
        const outerEdge = side < 0 ? 0 : viewport.width;
        const margin = Math.min(24, viewport.width * 0.02);
        const halfWidth = slot.width * scale / 2;
        const tableX = lerp(terminalEdge, outerEdge, 0.52) + jitter * Math.min(1, viewport.width / 1400);
        return {
          x: slot.left + slot.width / 2, y: slot.top + slot.height / 2, scale,
          tableX: Math.max(margin + halfWidth, Math.min(viewport.width - margin - halfWidth, tableX)),
          tableY: viewport.height * (0.21 + row * 0.19),
        };
      });
      const radius = Math.max(viewport.width, viewport.height) * 1.2;
      waves.forEach(({ svg, band, ring }) => {
        svg.setAttribute("viewBox", `0 0 ${viewport.width} ${viewport.height}`);
        band.setAttribute("r", String(radius));
        band.setAttribute("stroke-width", "160");
        ring?.setAttribute("r", String(radius));
      });
      moving.forEach((element, index) => { element.style.transform = transforms[index]; });
      return { viewport, offset, boxes, lineBoxes, sessionBox, slots, enter: { x: enterRect.left + enterRect.width / 2, y: enterRect.top + enterRect.height / 2 } };
    }

    function render(time: number) {
      const { viewport, offset, boxes, lineBoxes, slots } = dimensions;
      root.dataset.introPhase = time < 1.24 ? "prompt" : time < 1.92 ? "flip" : time < ARRANGE ? "deal" : time < INTRO_END ? "arrange" : "ready";
      op(background, easeOut(progress(time, 0, 0.45)));
      const entrance = easeOut(progress(time, 0.05, 0.4));
      const flipA = easeIn(progress(time, 1.24, 1.46));
      op(stage, entrance * (time < 1.46 ? 1 : 0));
      stage.style.transform = `translateY(${(1 - entrance) * 10}px) perspective(1200px) rotateY(${90 * flipA}deg) scale(${1 + 0.25 * flipA})`;
      const flare = progress(time, 1.2, 1.5);
      prompt.style.boxShadow = flare > 0 && flare < 1 ? `0 0 0 ${3 * (1 - flare)}px rgba(${ORANGE},${0.35 * (1 - flare)}), 0 0 ${28 * (1 - flare)}px rgba(${ORANGE},${0.5 * (1 - flare)})` : "none";
      const active = WORD_TIMES.reduce((result, at, i) => time >= at ? i : result, -1);
      words.forEach((word, index) => {
        const p = progress(time, WORD_TIMES[index], WORD_TIMES[index] + 0.22);
        op(word, clamp(p * 3));
        word.style.transform = `translateY(${(1 - easeOut(p)) * 5}px) scale(${0.55 + 0.45 * back(1.9, p)})`;
        // Overlay a dark copy using opacity: no animated color or layout properties.
        op(word.querySelector<HTMLElement>(".intro-word-ink")!, active === index ? 1 : 0);
      });
      if (active >= 0) {
        const to = boxes[active], from = active === 0 ? { x: to.x + to.width / 2, width: 0 } : boxes[active - 1];
        const p = easeExpo(progress(time, WORD_TIMES[active], WORD_TIMES[active] + 0.16));
        highlight.style.transform = `translateX(${lerp(from.x, to.x, p)}px) scaleX(${lerp(from.width, to.width, p)})`;
      }
      op(highlight, active >= 0 ? 1 : 0);
      caret.style.transform = `translateX(${active < 0 ? boxes[0].x + 2 : boxes[active].x + boxes[active].width + 2}px)`;
      op(caret, time < 1.2 && (active >= 0 || (time * 2.4) % 1 < 0.55) ? progress(time, 0.05, 0.2) : 0);
      const enterPulse = progress(time, 1.2, 1.42);
      enter.style.transform = `scale(${1 + Math.sin(enterPulse * Math.PI) * 0.45})`;
      op(enter.querySelector<HTMLElement>("span")!, time >= 1.2 ? 1 : 0);

      const flipB = progress(time, 1.46, 1.92);
      const arrange = back(1.15, progress(time, ARRANGE, ARRANGE + 0.72));
      let kick = 0, pulse = 0;
      cards.forEach((card) => {
        const p = progress(time, card.at, card.at + 0.2);
        const wave = Math.sin(p * Math.PI);
        kick += -card.side * 5 * wave;
        pulse += 0.014 * wave;
      });
      op(terminal, flipB > 0 ? 1 : 0);
      terminal.style.zIndex = "10";
      terminal.style.transform = `translate(${offset.x * (1 - arrange) + (narrow.matches ? 0 : kick)}px,${offset.y * (1 - arrange)}px) perspective(1400px) rotateY(${-90 * (1 - back(0.9, flipB))}deg) scale(${(1 + (narrow.matches ? 0 : pulse)) * lerp(0.8, 1, easeOut(flipB))})`;
      const lift = clamp(1 - arrange);
      terminal.style.boxShadow = lift > 0.01 ? `0 ${24 * lift}px ${60 * lift}px rgba(0,0,0,${0.7 * lift}), 0 0 0 1px rgba(${ORANGE},${0.5 * lift})` : "none";
      lines.forEach((line, index) => {
        const p = progress(time, LINE_TIMES[index], LINE_TIMES[index] + 0.14);
        op(line, p);
        line.style.transform = `translateX(${(1 - easeOut(p)) * -6}px)`;
        op(line.querySelector<HTMLElement>(".intro-line-flash")!, 0);
      });
      op(building, progress(time, 1.9, 2) * (1 - progress(time, 4.6, 4.7)) * (0.55 + 0.45 * (0.5 + 0.5 * Math.cos(time * 6))));
      op(message, progress(time, 5.2, 5.4));

      // Keep each new Write line visible at larger type sizes, even in the short desktop grid.
      const newest = LINE_TIMES.reduce((last, at, index) => time >= at ? index : last, -1);
      const lineBottom = newest >= 0 ? lineBoxes[newest].top + lineBoxes[newest].height : 0;
      session.scrollTop = Math.max(0, lineBottom + 24 - dimensions.sessionBox.bottom);

      cards.forEach((card, index) => {
        const { element, at, side, tilt } = card;
        const slot = slots[index];
        if (narrow.matches) {
          const p = progress(time, 1.96 + index * 0.09, 2.34 + index * 0.09);
          op(element, p);
          element.style.transform = `translateY(${16 * (1 - easeOut(p))}px)`;
          element.style.boxShadow = "none";
          return;
        }
        const flight = progress(time, at, at + 0.55);
        const travel = easeExpo(flight);
        const line = lineBoxes[card.line];
        const arc = Math.sin(Math.PI * clamp(flight * 1.15)) * 46;
        let x = lerp(line.left + offset.x + 200, slot.tableX, travel);
        let y = lerp(line.top - session.scrollTop + line.height / 2 + offset.y, slot.tableY, travel) - arc;
        let scale = lerp(0.06, slot.scale, back(1.9, flight));
        let rotation = lerp(-side * 28, tilt, easeOut(flight));
        const a = progress(time, card.arrange, card.arrange + 0.72);
        if (a > 0) {
          const snap = back(1.15, a);
          x = lerp(slot.tableX, slot.x, snap);
          y = lerp(slot.tableY, slot.y, snap);
          scale = lerp(slot.scale, 1, snap);
          rotation = lerp(tilt, 0, easeOut(a));
        }
        op(element, time < at ? 0 : clamp(flight * 8));
        element.style.transform = `translate(${x - slot.x}px,${y - slot.y}px) rotate(${rotation}deg) scale(${scale})`;
        element.style.zIndex = String(11 + index);
        const glow = 1 - progress(time, at + 0.25, at + 0.9), shadow = 1 - easeOut(a);
        element.style.boxShadow = time < at ? "none" : `0 ${22 * shadow}px ${50 * shadow}px rgba(0,0,0,${0.7 * shadow}), 0 0 0 ${1 + glow}px rgba(${ORANGE},${0.85 * glow}), 0 0 ${30 * glow}px rgba(${ORANGE},${0.35 * glow})`;
        const flash = progress(time, at, at + 0.05) * (1 - progress(time, at + 0.3, at + 0.8));
        op(lines[card.line].querySelector<HTMLElement>(".intro-line-flash")!, flash);
      });

      waves.forEach(({ svg, band, ring }, index) => {
        const start = index === 0 ? 1.2 : LINE_TIMES[12], duration = index === 0 ? 0.75 : 0.9;
        const p = progress(time, start, start + duration);
        const center = index === 0 ? dimensions.enter : { x: viewport.width / 2, y: viewport.height / 2 };
        const transform = `translate(${center.x}px,${center.y}px) scale(${easeOut(p)})`;
        band.style.transform = transform;
        if (ring) ring.style.transform = transform;
        op(svg, p > 0 && p < 1 ? 0.9 * (1 - progress(time, start + duration * 0.4, start + duration)) : 0);
      });
      const top = easeOut(progress(time, 5.1, 5.5));
      op(bar, top);
      bar.style.transform = `translateY(${(1 - top) * -100}%)`;
      op(skipButton, progress(time, 0.1, 0.4) * (1 - progress(time, ARRANGE, ARRANGE + 0.3)));
      skipButton.inert = time >= ARRANGE;
      skipButton.hidden = time >= ARRANGE + 0.3;
    }

    function clearLandedStyles() {
      [terminal, bar, message, background, stage, prompt, highlight, caret, enter, ...words,
        ...cards.map((card) => card.element), ...lines,
        ...waves.flatMap(({ band, ring }) => ring ? [band, ring] : [band]),
      ].forEach(clear);
      lines.forEach((line) => op(line.querySelector<HTMLElement>(".intro-line-flash")!, 0));
    }

    function land() {
      cancelAnimationFrame(raf);
      t = INTRO_END;
      landed = true;
      render(t);
      root.dataset.startup = "ready";
      grid.inert = false;
      clearLandedStyles();
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* Storage can be disabled. */ }
      setReady(true);
    }
    function tick(now: number) {
      t = Math.min(INTRO_END, t + Math.min(0.05, (now - last) / 1000) * rate);
      last = now;
      render(t);
      if (t < INTRO_END) raf = requestAnimationFrame(tick);
      else land();
    }
    function start() {
      cancelAnimationFrame(raf);
      if (motion.matches) { land(); return; }
      landed = false;
      setReady(false);
      root.dataset.startup = "intro";
      grid.inert = true;
      skipButton.hidden = false;
      skipButton.inert = false;
      window.scrollTo({ top: 0, behavior: "instant" });
      dimensions = measure();
      t = 0; rate = 1;
      render(t);
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
    const resize = () => {
      if (landed) return;
      dimensions = measure();
      render(t);
    };
    const onMotionChange = () => { if (motion.matches) land(); };
    const accelerate = () => { if (!landed) rate = 4; };
    const onKey = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (!landed) {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
          event.preventDefault(); event.stopImmediatePropagation(); return;
        }
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        if (event.key === "Escape") { event.preventDefault(); accelerate(); }
        // inert does not disable window listeners in the rail and command palette.
        if (event.key !== "Tab") { event.preventDefault(); event.stopImmediatePropagation(); }
      }
    };
    controls.current = { skip: accelerate, finish: land, replay: start };
    dimensions = measure();
    let seen = false;
    try { seen = sessionStorage.getItem(SESSION_KEY) === "1"; } catch { /* Play without persistence. */ }
    // Initial layout is already reserved by the grid. Commit before the first browser paint.
    if (seen || motion.matches || document.getElementById(window.location.hash.slice(1))?.closest("#workspace-files")) {
      render(INTRO_END);
      root.dataset.startup = "ready";
      grid.inert = false;
      clearLandedStyles();
      landed = true; t = INTRO_END;
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* Storage can be disabled. */ }
      queueMicrotask(() => { if (!disposed) setReady(true); });
    } else {
      render(0);
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
    const observer = new ResizeObserver(resize);
    [root, grid, terminal, ...cards.map((card) => card.element)].forEach((element) => observer.observe(element));
    document.fonts.ready.then(() => { if (!disposed) resize(); });
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", onKey, true);
    motion.addEventListener("change", onMotionChange);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey, true);
      motion.removeEventListener("change", onMotionChange);
      controls.current = { skip: () => {}, finish: () => {}, replay: () => {} };
    };
  }, [rootRef]);

  return { ready, skip, finish, replay };
}

// Re-export the transcript so the React tree and renderer always share exactly fourteen lines.
export { introLines };
