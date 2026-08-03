"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { useBrandColor } from "@/lib/use-brand-color";
import { Canvas } from "@react-three/fiber";
import { TunnelField } from "./tunnel-field";

/**
 * Fixed full-viewport WebGL layer. Content is normal DOM on top of it, so the
 * 3D frames the work rather than replacing it.
 */
export default function PortfolioScene() {
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const brand = useBrandColor();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const small = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? window.scrollY / max : 0;
    };
    const onMove = (e: MouseEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, small ? 1.25 : 1.75]}
        gl={{ antialias: !small, powerPreference: "high-performance" }}
        camera={{ fov: 68, near: 0.1, far: 260, position: [0, 0, 0] }}
        frameloop={reduced ? "demand" : "always"}
      >
        <color attach="background" args={["#04050c"]} />
        <fog attach="fog" args={["#04050c", 18, 150]} />
        <TunnelField
          brand={brand}
          rings={small ? 60 : 96}
          perRing={small ? 9 : 13}
          progress={progress}
          pointer={pointer}
          reduced={reduced}
          offsetX={small ? 2.5 : 7}
        />
      </Canvas>
    </div>
  );
}
