// Made by akki_idle
import { useEffect, useRef } from "react";

/**
 * Extremely subtle cursor-following ambient glow — desktop only.
 * Small, soft, low-opacity purple/indigo glow that slowly follows the cursor.
 * Disabled on touch devices and respects prefers-reduced-motion.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = glowRef.current;
    if (!el) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let frame = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = "1";
      }
    };

    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };

    const update = () => {
      frame = 0;
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      el.style.transform = `translate3d(${cx - 150}px, ${cy - 150}px, 0)`;
    };

    const loop = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", loop, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", loop);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-0 hidden size-[300px] rounded-full opacity-0 transition-opacity duration-700 lg:block"
      style={{
        background:
          "radial-gradient(circle at center, oklch(0.45 0.12 280 / 0.06), oklch(0.35 0.08 280 / 0.02) 50%, transparent 70%)",
        filter: "blur(60px)",
        willChange: "transform",
      }}
    />
  );
}
