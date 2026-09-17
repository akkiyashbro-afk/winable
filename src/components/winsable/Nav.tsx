import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "./Bits";

type MenuPhase = "closed" | "entering" | "open" | "exiting";

const links = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#process" },
  { label: "Platforms", href: "#coverage" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "#about" },
];

const EASE = "cubic-bezier(0.22,1,0.36,1)";
const ENTER_MS = 450;
const EXIT_MS = 500;
const ENTER_STAGGER = [120, 180, 240, 300, 360];
const EXIT_STAGGER = [240, 180, 120, 60, 0];

export function Nav() {
  const [phase, setPhase] = useState<MenuPhase>("closed");
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const openIntent = useRef(false);

  const isMenuOpen = phase === "open";
  const isEntering = phase === "entering";
  const isExiting = phase === "exiting";
  const isActive = isMenuOpen || isEntering;
  const isMounted = phase !== "closed";

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    if (phase !== "entering") return;
    void document.body.offsetHeight;
    requestAnimationFrame(() => {
      if (openIntent.current) setPhase("open");
    });
  }, [phase]);

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
    const obs = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top) setActive(`#${top.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6, 1] },
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMounted]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const openMenu = useCallback(() => {
    clearTimers();
    openIntent.current = true;
    setPhase("entering");
  }, [clearTimers]);

  const closeMenu = useCallback(() => {
    clearTimers();
    openIntent.current = false;
    if (phase === "closed" || phase === "exiting") return;
    setPhase("exiting");
    later(() => setPhase("closed"), EXIT_MS + 100);
  }, [clearTimers, later, phase]);

  const toggleMenu = useCallback(() => {
    if (isActive) closeMenu();
    else openMenu();
  }, [isActive, openMenu, closeMenu]);

  const handleLink = useCallback(
    (href: string) => {
      closeMenu();
      later(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }, EXIT_MS + 50);
    },
    [closeMenu, later],
  );

  const handleCase = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleLink("#case-form");
    },
    [handleLink],
  );

  const navTransition = (enterDelay: number, exitDelay: number) => {
    if (isEntering) return "none";
    const d = isExiting ? exitDelay : enterDelay;
    return `opacity ${ENTER_MS}ms ${EASE} ${d}ms, transform ${ENTER_MS}ms ${EASE} ${d}ms`;
  };

  const navTransform = (enterY: number, exitY: number) => {
    if (isEntering) return `translateY(${enterY}px)`;
    if (isExiting) return `translateY(${exitY}px)`;
    return "translateY(0)";
  };

  const navOpacity = () => {
    if (isEntering) return 0;
    if (isExiting) return 0;
    return 1;
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 transition-all duration-500 ${
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

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Primary"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={active === l.href ? "true" : undefined}
                className={`relative text-sm transition-all duration-300 ${
                  active === l.href
                    ? "text-gold -translate-y-px"
                    : "text-white/50 hover:text-white/80 hover:-translate-y-px"
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
              aria-label={isActive ? "Close menu" : "Open menu"}
              aria-expanded={isActive}
              onClick={toggleMenu}
              className="relative flex items-center gap-2.5 rounded-full border border-white/10 px-3 py-2.5 lg:hidden"
              style={{ minWidth: "44px", minHeight: "44px" }}
            >
              <span className="relative block h-[14px] w-[18px]">
                <span
                  className={`absolute left-0 h-[1.5px] w-full rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive ? "top-[6px] rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-[6px] h-[1.5px] w-full rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? "scale-x-0 opacity-0"
                      : "scale-x-100 opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-full rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive ? "top-[6px] -rotate-45" : "top-[12px]"
                  }`}
                />
              </span>
              <span className="text-[10px] font-semibold tracking-[0.2em] text-white/50 uppercase">
                Menu
              </span>
            </button>
          </div>
        </div>
      </header>

      {isMounted && (
        <div
          className="fixed inset-0 z-[100]"
          role="dialog"
          aria-label="Mobile navigation"
          style={{
            pointerEvents: isExiting ? "none" : "auto",
          }}
        >
          <div
            className="absolute inset-0 bg-black/90"
            style={{
              opacity: isEntering ? 0 : isExiting ? 0 : 1,
              transition: isEntering
                ? "none"
                : `opacity ${EXIT_MS}ms ${EASE}`,
            }}
            onClick={closeMenu}
          />

          <nav
            aria-label="Mobile"
            className="absolute inset-x-0 bottom-0 top-14 overflow-y-auto bg-background"
            style={{
              opacity: isEntering ? 0 : isExiting ? 0 : 1,
              transform: isEntering
                ? "translateY(8px)"
                : isExiting
                  ? "translateY(-6px)"
                  : "translateY(0)",
              transition: isEntering
                ? "none"
                : `opacity ${ENTER_MS}ms ${EASE}, transform ${ENTER_MS}ms ${EASE}`,
              backgroundImage:
                "linear-gradient(oklch(0.13 0.005 260 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.13 0.005 260 / 0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          >
            <div className="px-5 py-6 sm:px-8 sm:py-8">
              <div
                className="flex items-center justify-between border-b border-white/[0.06] pb-5"
                style={{
                  opacity: isEntering ? 0 : isExiting ? 0 : 1,
                  transform: isEntering
                    ? "translateY(-10px)"
                    : isExiting
                      ? "translateY(-10px)"
                      : "translateY(0)",
                  transition: isEntering
                    ? "none"
                    : `opacity 350ms ${EASE} 80ms, transform 350ms ${EASE} 80ms`,
                }}
              >
                <span className="font-display text-lg tracking-tight text-white/60">
                  WinsAble™ Media •
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={closeMenu}
                  className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-white/40 uppercase transition-colors duration-300 hover:text-white"
                  style={{
                    minWidth: "44px",
                    minHeight: "44px",
                    opacity: isEntering ? 0 : isExiting ? 0 : 1,
                    transform:
                      isEntering || isExiting ? "scale(0.85)" : "scale(1)",
                    transition: isEntering
                      ? "none"
                      : `opacity 300ms ${EASE} 60ms, transform 300ms ${EASE} 60ms`,
                  }}
                >
                  Close
                  <span className="grid size-7 place-items-center rounded-full border border-white/10 transition-colors duration-300 hover:border-white/25">
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

              <ol className="mt-4 flex flex-col">
                {links.map((l, i) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLink(l.href);
                      }}
                      className="flex items-baseline gap-5 border-b border-white/[0.04] py-5 sm:py-6"
                      style={{
                        minHeight: "56px",
                        opacity: navOpacity(),
                        transform: navTransform(20, -10),
                        transition: navTransition(
                          ENTER_STAGGER[i] ?? 0,
                          EXIT_STAGGER[i] ?? 0,
                        ),
                      }}
                    >
                      <span className="text-[11px] font-bold tracking-[0.2em] text-white/25 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="display text-[clamp(1.5rem,5vw,2.2rem)] leading-none text-foreground/80">
                        {l.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>

              <div
                className="mt-8"
                style={{
                  opacity: isEntering ? 0 : isExiting ? 0 : 1,
                  transform: isEntering
                    ? "translateY(15px)"
                    : isExiting
                      ? "translateY(-8px)"
                      : "translateY(0)",
                  transition: isEntering
                    ? "none"
                    : `opacity ${ENTER_MS}ms ${EASE} 420ms, transform ${ENTER_MS}ms ${EASE} 420ms`,
                }}
              >
                <a
                  href="#case-form"
                  onClick={handleCase}
                  className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-3 text-sm font-semibold text-gold transition-all duration-300 hover:bg-gold/20"
                >
                  Start a Case <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
