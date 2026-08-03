import * as THREE from "three";

/**
 * The site's `--brand` token is authored in OKLCH, which `THREE.Color.setStyle`
 * can't parse. Paint it to a 1x1 canvas and read the rasterized RGB back —
 * the browser does the conversion for us.
 */
export function cssColorToThree(css: string, fallback = "#ffb257"): THREE.Color {
  const value = css.trim();
  if (!value) return new THREE.Color(fallback);

  if (typeof document !== "undefined") {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        // A failed parse leaves fillStyle at its default, so seed it with a
        // sentinel and treat "unchanged" as unsupported.
        ctx.fillStyle = "#000000";
        ctx.fillStyle = value;
        if (ctx.fillStyle !== "#000000") {
          ctx.fillRect(0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          return new THREE.Color(r / 255, g / 255, b / 255);
        }
      }
    } catch {
      // fall through
    }
  }
  return new THREE.Color(fallback);
}

/** Soft radial sprite used as the point texture for glowing nodes. */
export function makeGlowTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.65)");
  g.addColorStop(0.55, "rgba(255,255,255,0.18)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
