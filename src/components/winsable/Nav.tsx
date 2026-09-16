import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, LogoMark } from "./Bits";

const links = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#process" },
  { label: "Platforms", href: "#coverage" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "#about" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
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

  // Close on Escape + outside click
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const glassActive = scrolled || open;

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <header
        ref={headerRef}
        className={`fixed top-3 inset-x-0 mx-auto z-50 w-[min(96%,1200px)] transition-all duration-500 ${
          open ? "lg:z-50 z-[60]" : "z-50"
        }`}
        style={{
          animation: "nav-enter 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both",
        }}
      >
        <div
          className={`flex items-center justify-between h-14 px-4 sm:px-6 rounded-full transition-all duration-500 ${
            glassActive
              ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]"
              : "bg-transparent border border-transparent"
          }`}
        >
          {/* Logo */}
          <a href="#top" className="group flex items-center gap-2.5">
            <LogoMark className="h-7 w-7 rounded-sm object-cover" />
            <span className="font-display text-[15px] font-bold tracking-[0.02em] uppercase text-white/90 transition-colors group-hover:text-white">
              WinsAble
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={active === l.href ? "true" : undefined}
                className={`relative text-[12px] uppercase tracking-[0.22em] font-medium transition-colors duration-300 ${
                  active === l.href
                    ? "text-white"
                    : "text-white/50 hover:text-white"
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
            {/* CTA */}
            <a
              href="#case-form"
              className="group relative hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.1] hover:border-white/40 hover:bg-white/[0.06] transition-all overflow-hidden"
              style={{ boxShadow: "0 0 24px -8px rgba(255,255,255,0.15)" }}
            >
              <span className="relative text-[13px] font-medium text-white">
                Start a Case
              </span>
              <ArrowUpRight className="relative h-3.5 w-3.5 text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Hamburger */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.12] hover:border-white/40 hover:bg-white/[0.08] active:scale-95 transition-all text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <span className="relative block h-4 w-4">
                <span
                  className={`absolute left-0 h-px w-4 bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open ? "top-2 rotate-45" : "top-0.5 rotate-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-4 bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open ? "top-2 -rotate-45" : "top-[9px] rotate-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        <div
          className={`lg:hidden absolute left-0 right-0 mt-3 origin-top rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/[0.1] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.95)] p-3 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-[0.98] -translate-y-3 pointer-events-none"
          }`}
        >
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[13px] uppercase tracking-[0.2em] font-medium text-white/75 hover:text-white hover:bg-white/[0.06] transition-colors"
                style={{
                  transitionDelay: open ? `${i * 40 + 50}ms` : "0ms",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(-8px)",
                  transition: "opacity 0.3s ease, transform 0.3s ease, color 0.2s ease, background-color 0.2s ease",
                }}
              >
                {l.label}
                <ArrowUpRight className="h-4 w-4 text-white/40" />
              </a>
            ))}
          </nav>

          <a
            href="#case-form"
            onClick={() => setOpen(false)}
            className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white/[0.07] border border-white/[0.15] hover:border-white/40 hover:bg-white/[0.1] active:scale-[0.98] px-4 py-3.5 text-[14px] font-medium text-white transition-all"
          >
            Start a Case
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </header>
    </>
  );
}
