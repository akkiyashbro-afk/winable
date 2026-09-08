import { useEffect, useState } from "react";
import { ArrowUpRight } from "./Bits";

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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.08] bg-black/60 backdrop-blur-2xl backdrop-saturate-150"
          : "border-transparent bg-black/20 backdrop-blur-md"
      }`}
    >
      <div className="shell flex h-20 items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-3">
          <img
            src="/navbar.png"
            alt="WinsAble"
            className="h-9 w-auto object-contain"
            width={160}
            height={36}
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
            className="group hidden items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-2.5 text-sm font-semibold text-gold transition-all duration-300 hover:border-gold/60 hover:bg-gold/20 hover:shadow-[0_0_24px_oklch(0.75_0.12_75/0.2)] sm:inline-flex"
          >
            Start a Case
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full border border-white/10 lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-px w-4 bg-foreground transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-px w-4 bg-foreground transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/[0.08] bg-black/70 backdrop-blur-2xl backdrop-saturate-150 lg:hidden">
          <nav className="shell flex flex-col py-4" aria-label="Mobile">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/[0.06] py-4 text-lg text-white/70 transition-colors hover:text-gold"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#case-form"
              onClick={() => setOpen(false)}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-3 text-sm font-semibold text-gold"
            >
              Start a Case <ArrowUpRight className="size-3.5" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
