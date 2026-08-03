"use client";

import dynamic from "next/dynamic";

/**
 * The Canvas touches `window` on mount, so it can't be server-rendered.
 * `ssr: false` is only permitted inside a Client Component, which is why this
 * thin wrapper exists.
 */
const PortfolioScene = dynamic(() => import("./portfolio-scene"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-0 bg-[#04050c]" aria-hidden="true" />,
});

export function SceneMount() {
  return <PortfolioScene />;
}
