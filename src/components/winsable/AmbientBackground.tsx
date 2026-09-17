import { useEffect, useRef } from "react";

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
 *
 * Uses direct DOM manipulation via refs to avoid React re-renders on scroll.
 */
export function AmbientBackground() {
  const primaryRef = useRef<HTMLDivElement | null>(null);
  const secondaryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced() || isMobile()) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;
      if (primaryRef.current) {
        primaryRef.current.style.transform = `translate3d(0, ${scrollY * 0.015}px, 0)`;
      }
      if (secondaryRef.current) {
        secondaryRef.current.style.transform = `translate3d(0, ${scrollY * 0.008}px, 0)`;
      }
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

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Primary — purple glow, upper area */}
      <div
        ref={primaryRef}
        className="ambient-glow ambient-glow-primary will-change-transform"
      />

      {/* Secondary — deep indigo glow, lower-right area */}
      <div
        ref={secondaryRef}
        className="ambient-glow ambient-glow-secondary will-change-transform"
      />
    </div>
  );
}
