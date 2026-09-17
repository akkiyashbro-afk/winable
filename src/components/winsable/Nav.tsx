import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "./Bits";

const links = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#process" },
  { label: "Platforms", href: "#coverage" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "#about" },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const duration = reducedMotion ? "duration-0" : "duration-500";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6, 1] },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-all ${duration} ${
        scrolled
          ? "border-b border-white/[0.08] bg-black/60 backdrop-blur-2xl backdrop-saturate-150"
          : "border-transparent bg-black/20 backdrop-blur-md"
      }`}
    >
      <div className="shell flex h-14 items-center justify-between gap-6 lg:h-20">
        <a href="#top" className="flex items-center gap-3">
          <img
            src="/navbar.png"
            alt="WinsAble"
            className="h-8 w-auto object-contain lg:h-10"
          />
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={active === l.href ? "true" : undefined}
              className={`relative text-sm transition-colors duration-300 ${
                active === l.href ? "text-gold" : "text-white/50 hover:text-white/80"
              }`}
            >
              {l.label}
              <span
                aria-hidden="true"
                className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-500 ease-out ${
                  active === l.href ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#case-form"
            className="group hidden items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-2.5 text-sm font-semibold text-gold transition-all duration-300 hover:border-gold/60 hover:bg-gold/20 hover:shadow-[0_0_24px_oklch(0.55_0.22_295/0.2)] sm:inline-flex"
          >
            Start a Case
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="group relative flex items-center gap-2.5 rounded-full border border-white/10 pr-3.5 pl-3 py-2 lg:hidden"
          >
            <span className="relative block h-[11px] w-[15px]">
              <span
                className={`absolute left-0 h-px w-full bg-foreground transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "top-[5px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[5px] h-px w-full bg-foreground transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-full bg-foreground transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "top-[5px] -rotate-45" : "top-[10px]"
                }`}
              />
            </span>
            <span className="text-[9px] font-semibold tracking-[0.2em] text-white/40 uppercase transition-colors duration-300 group-hover:text-white/60">
              Menu
            </span>
          </button>
        </div>
      </div>

      {/* ── Full-screen mobile menu overlay ── */}
      <div
        className={`fixed inset-0 top-14 z-40 lg:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity ${duration} ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <nav
          aria-label="Mobile"
          className={`relative h-full overflow-y-auto bg-background transition-all ${duration} ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4"
          }`}
          style={{
            backgroundImage: open
              ? "linear-gradient(oklch(0.13 0.005 260 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.13 0.005 260 / 0.5) 1px, transparent 1px)"
              : "none",
            backgroundSize: open ? "60px 60px" : "0 0",
          }}
        >
          <div className="shell flex flex-col py-6 sm:py-8">
            {/* Top row — branding + close */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-5">
              <span className="font-display text-lg tracking-tight text-white/60">
                WinsAble
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-white/40 uppercase transition-colors duration-300 hover:text-foreground"
              >
                Close
                <span className="grid size-7 place-items-center rounded-full border border-white/10 transition-colors duration-300 group-hover:border-white/25">
                  <svg viewBox="0 0 16 16" className="size-3" fill="none">
                    <path
                      d="M4 4l8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </div>

            {/* Navigation items — numbered editorial rows */}
            <ol className="mt-2 flex flex-col">
              {links.map((l, i) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`group flex items-baseline gap-5 border-b border-white/[0.04] py-5 sm:py-6 transition-all ${duration} ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      open
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                  >
                    <span className="text-[11px] font-bold tracking-[0.2em] text-white/25 tabular-nums transition-colors duration-300 group-hover:text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="display text-[clamp(1.6rem,5vw,2.4rem)] leading-none text-foreground/70 transition-colors duration-300 group-hover:text-foreground">
                      {l.label}
                    </span>
                  </a>
                </li>
              ))}
            </ol>

            {/* Bottom CTA */}
            <div
              className={`mt-8 transition-all ${duration} ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: open ? `${120 + links.length * 60}ms` : "0ms" }}
            >
              <a
                href="#case-form"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-3 text-sm font-semibold text-gold transition-all duration-300 hover:bg-gold/20"
              >
                Start a Case <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
