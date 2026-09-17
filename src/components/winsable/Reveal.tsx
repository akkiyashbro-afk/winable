import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  variant = "default",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
  variant?: "default" | "left" | "right" | "scale" | "clip" | "rotate";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const hasRevealed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            hasRevealed.current = true;
          } else if (hasRevealed.current) {
            setShown(false);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variantClass =
    variant === "left"
      ? "reveal-left"
      : variant === "right"
        ? "reveal-right"
        : variant === "scale"
          ? "reveal-scale"
          : variant === "clip"
            ? "reveal-clip"
            : variant === "rotate"
              ? "reveal-rotate"
              : "reveal";

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-shown={shown}
      data-revealed={hasRevealed.current || undefined}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${variantClass} ${className}`}
    >
      {children}
    </Tag>
  );
}
