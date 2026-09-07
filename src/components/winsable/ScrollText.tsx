import { useEffect, useRef, useState } from "react";

/**
 * Scroll-linked word reveal: words brighten one by one as the block
 * travels through the viewport. Pure CSS opacity, one rAF-throttled listener.
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
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const start = window.innerHeight * 0.9;
      const end = window.innerHeight * 0.3;
      const p = (start - r.top) / Math.max(start - end + r.height * 0.6, 1);
      setProgress(Math.min(1, Math.max(0, p)));
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
  }, []);

  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={className}>
      {words.map((w, i) => {
        const at = i / words.length;
        const lit = Math.min(1, Math.max(0, (progress - at) * words.length * 0.8 + 0.15));
        return (
          <span
            key={`${w}-${i}`}
            className="transition-opacity duration-300 ease-out"
            style={{ opacity: dim + (1 - dim) * lit }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </Tag>
  );
}
