// Made by akki_idle
import { useEffect, useRef } from "react";

/**
 * Scroll-linked word reveal: words brighten one by one as the block
 * travels through the viewport. Uses direct DOM manipulation to avoid
 * React re-renders on scroll — each span's opacity is set imperatively.
 */
export function ScrollText({
  text,
  className = "",
  dim = 0.18,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  dim?: number;
  as?: "p" | "h2" | "h3";
}) {
  const containerRef = useRef<HTMLElement | null>(null);
  const spansRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = text.split(" ");

    // If reduced motion, show everything at full opacity
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spansRef.current.forEach((span) => {
        if (span) span.style.opacity = "1";
      });
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const start = window.innerHeight * 0.9;
      const end = window.innerHeight * 0.3;
      const p = Math.min(1, Math.max(0, (start - r.top) / Math.max(start - end + r.height * 0.6, 1)));

      for (let i = 0; i < words.length; i++) {
        const span = spansRef.current[i];
        if (!span) continue;
        const at = i / words.length;
        const lit = Math.min(1, Math.max(0, (p - at) * words.length * 0.8 + 0.15));
        span.style.opacity = String(dim + (1 - dim) * lit);
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [text, dim]);

  const words = text.split(" ");

  return (
    <Tag ref={containerRef as never} className={className}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          ref={(el) => { spansRef.current[i] = el as HTMLSpanElement; }}
          className="will-change-[opacity]"
          style={{ opacity: dim }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
