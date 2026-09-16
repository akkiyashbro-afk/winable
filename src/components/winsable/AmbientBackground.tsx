import { useEffect, useRef, useState } from "react";

function reduced() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function isMobile() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}

/**
 * Premium ambient background layer — sits behind all page content.
 * Two faint purple/indigo radial glows with slow CSS drift + subtle scroll parallax.
 * Barely noticeable, adds cinematic depth to the dark editorial design.
 */
export function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (reduced() || isMobile()) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      setScrollY(window.scrollY);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const parallaxPrimary = scrollY * 0.015;
  const parallaxSecondary = scrollY * 0.008;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Primary — purple glow, upper area */}
      <div
        className="ambient-glow ambient-glow-primary"
        style={{ transform: `translate3d(0, ${parallaxPrimary}px, 0)` }}
      />

      {/* Secondary — deep indigo glow, lower-right area */}
      <div
        className="ambient-glow ambient-glow-secondary"
        style={{ transform: `translate3d(0, ${parallaxSecondary}px, 0)` }}
      />
    </div>
  );
}
