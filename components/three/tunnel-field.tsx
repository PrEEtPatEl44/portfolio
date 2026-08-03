"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeGlowTexture } from "@/lib/three-utils";

const SPACING = 4; // distance between rings on Z
const RADIUS = 9; // tunnel radius

type Props = {
  brand: THREE.Color;
  rings: number;
  perRing: number;
  /** 0..1 scroll position, already smoothed by the parent. */
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
  reduced: boolean;
  /** Shifts the corridor axis sideways so it doesn't sit behind the headline. */
  offsetX: number;
};

/**
 * A lattice tunnel: rings of nodes around the Z axis, wired to their
 * neighbours and to the next ring. The camera flies down the middle, so the
 * corridor stays clear while structure streams past.
 */
export function TunnelField({
  brand,
  rings,
  perRing,
  progress,
  pointer,
  reduced,
  offsetX,
}: Props) {
  const depth = rings * SPACING;
  const glow = useMemo(() => makeGlowTexture(), []);
  const groupRef = useRef<THREE.Group>(null);

  // Node positions + per-node colour (cool struts, warm accent nodes)
  const { positions, colors, sizes, linePositions } = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    const siz: number[] = [];
    const cool = new THREE.Color("#5ce1ff");

    // deterministic jitter so SSR/CSR and reloads agree
    let seed = 1337;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    const ringPts: THREE.Vector3[][] = [];
    for (let r = 0; r < rings; r++) {
      const z = -r * SPACING;
      const twist = r * 0.06;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < perRing; i++) {
        const a = (i / perRing) * Math.PI * 2 + twist;
        const rad = RADIUS + (rnd() - 0.5) * 2.4;
        const v = new THREE.Vector3(
          Math.cos(a) * rad,
          Math.sin(a) * rad * 0.72,
          z + (rnd() - 0.5) * 1.2,
        );
        pts.push(v);
        pos.push(v.x, v.y, v.z);

        // every 4th node glows in the brand accent, rest are cool + dim
        const isAccent = (r + i) % 4 === 0;
        const c = isAccent ? brand : cool;
        const dim = isAccent ? 1 : 0.45;
        col.push(c.r * dim, c.g * dim, c.b * dim);
        siz.push(isAccent ? 2.6 : 1.4);
      }
      ringPts.push(pts);
    }

    // wire: around each ring, and forward to the next ring
    const lines: number[] = [];
    for (let r = 0; r < rings; r++) {
      const ring = ringPts[r];
      for (let i = 0; i < perRing; i++) {
        const a = ring[i];
        const b = ring[(i + 1) % perRing];
        lines.push(a.x, a.y, a.z, b.x, b.y, b.z);
        if (r < rings - 1) {
          const n = ringPts[r + 1][i];
          lines.push(a.x, a.y, a.z, n.x, n.y, n.z);
        }
      }
    }

    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
      sizes: new Float32Array(siz),
      linePositions: new Float32Array(lines),
    };
  }, [rings, perRing, brand]);

  useFrame((state, delta) => {
    const cam = state.camera;
    const p = progress.current ?? 0;
    const targetZ = -p * (depth - SPACING * 8);

    // ease toward the scroll target rather than snapping
    const k = reduced ? 1 : 1 - Math.pow(0.0015, delta);
    cam.position.z += (targetZ - cam.position.z) * k;

    if (!reduced) {
      const ptr = pointer.current ?? { x: 0, y: 0 };
      cam.position.x += (ptr.x * 2.2 - cam.position.x) * k;
      cam.position.y += (-ptr.y * 1.6 - cam.position.y) * k;
      cam.lookAt(ptr.x * 1.2, -ptr.y * 0.9, cam.position.z - 12);

      // slow breathing roll keeps the corridor alive while idle
      if (groupRef.current) {
        groupRef.current.rotation.z =
          Math.sin(state.clock.elapsedTime * 0.08) * 0.05;
      }
    } else {
      cam.lookAt(0, 0, cam.position.z - 12);
    }
  });

  return (
    <group ref={groupRef} position-x={offsetX}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={1.5}
          map={glow}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#4a6ea8"
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
