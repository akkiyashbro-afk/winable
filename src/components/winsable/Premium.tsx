import { useEffect, useState } from "react";

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

