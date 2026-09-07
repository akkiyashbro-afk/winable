import { useEffect, useState } from "react";
import { ArrowUpRight } from "./Bits";

function prefersReduced() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Premium branded loading screen — logo pop + shutter open. */
export function IntroCurtain() {
  const [state, setState] = useState<"pop" | "shutter" | "done">("pop");

  useEffect(() => {
    if (prefersReduced()) {
      setState("done");
      return;
    }
    if (sessionStorage.getItem("winsable-intro") === "1") {
      setState("done");
      return;
    }
    sessionStorage.setItem("winsable-intro", "1");

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    const pin = () => window.scrollTo(0, 0);
    pin();
    window.addEventListener("scroll", pin);

    document.documentElement.style.overflow = "hidden";

    const t1 = window.setTimeout(() => setState("shutter"), 900);
    const t2 = window.setTimeout(() => {
      window.removeEventListener("scroll", pin);
      window.scrollTo(0, 0);
      document.documentElement.style.overflow = "";
      setState("done");
    }, 1600);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("scroll", pin);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (state === "done") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90]"
    >
      {/* Top shutter */}
      <div
        className={`absolute inset-x-0 top-0 bg-background transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          state === "shutter" ? "-translate-y-full" : "translate-y-0"
        }`}
        style={{ height: "50%" }}
      />

      {/* Bottom shutter */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-background transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          state === "shutter" ? "translate-y-full" : "translate-y-0"
        }`}
        style={{ height: "50%" }}
      />

      {/* Logo centered */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out ${
          state === "pop"
            ? "scale-100 opacity-100"
            : "scale-110 opacity-0"
        }`}
      >
        <img
          src="/logo-full.jpg"
          alt="WinsAble"
          className="h-24 w-auto object-contain"
          width={240}
          height={80}
        />
      </div>
    </div>
  );
}

/** Sticky CTA dock that surfaces after the hero. */
export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setShow(y > window.innerHeight * 0.9 && y < max - 320);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-5 z-[65] flex justify-center px-4 transition-all duration-500 ease-out ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
        <a
          href="#case-form"
          className="group inline-flex items-center gap-3 rounded-full border border-gold/20 bg-background/90 px-5 py-3 text-foreground shadow-[0_18px_40px_-24px_oklch(0.75_0.12_75/0.3)] backdrop-blur-xl transition-all duration-300 hover:border-gold/40 hover:bg-gold/10"
        >
        <span className="size-1.5 animate-pulse rounded-full bg-gold" />
        <span className="text-sm font-medium">Start a Case</span>
        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </div>
  );
}
