import {
  useCallback,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

/** Cursor-following spotlight for cards. Spread on the element. */
export function useSpotlight() {
  const [style, setStyle] = useState<CSSProperties>({
    "--mx": "50%",
    "--my": "0%",
  } as CSSProperties);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setStyle({
      "--mx": `${((e.clientX - r.left) / r.width) * 100}%`,
      "--my": `${((e.clientY - r.top) / r.height) * 100}%`,
    } as CSSProperties);
  }, []);

  return { style, onPointerMove };
}
