import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowUpRight, CtaLink, PlatformMark, ServiceIcon, LogoMark, LogoFull } from "./Bits";
import { Reveal } from "./Reveal";
import { ScrollText } from "./ScrollText";
import { Magnetic, Scramble, Seal, Spotlight, Parallax } from "./Fx";
import { useSpotlight } from "./useSpotlight";
import { Counter } from "./Counter";
import { useSiteData, type Review as ReviewType, type Service as ServiceType } from "./useSiteData";

/* ---------------------------------- HERO --------------------------------- */

const heroCards = [
  { label: "ACCOUNT RECOVERY", stage: "Problem", rot: "-3deg", x: "-1rem", y: "0rem", z: 5 },
  { label: "DISABLED ACCOUNT", stage: "Review", rot: "-1deg", x: "0.75rem", y: "6.7rem", z: 4 },
  { label: "IMPERSONATION", stage: "Review", rot: "1deg", x: "2.5rem", y: "13.4rem", z: 3 },
  { label: "COPYRIGHT", stage: "Prepare", rot: "3deg", x: "4.25rem", y: "20.1rem", z: 2 },
  { label: "PLATFORM SUPPORT", stage: "Submit", rot: "5deg", x: "6rem", y: "26.8rem", z: 1 },
];

const flow = ["Problem", "Review", "Prepare", "Submit"];

const headline: { text: string; mark?: boolean; br?: boolean }[] = [
  { text: "When" },
  { text: "a" },
  { text: "Platform", br: true },
  { text: "Says" },
  { text: "No," },
  { text: "Knowing", mark: true, br: true },
  { text: "What" },
  { text: "to" },
  { text: "Do" },
  { text: "Next", mark: true, br: true },
  { text: "Matters." },
];

const rotating = [
  "account recovery",
  "disabled accounts",
  "impersonation",
  "copyright",
  "platform support",
];

export function Hero() {
  const [ready, setReady] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(0);
  const [word, setWord] = useState(0);
  const stackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = window.setInterval(() => setActive((v) => (v + 1) % heroCards.length), 2200);
    const b = window.setInterval(() => setWord((v) => (v + 1) % rotating.length), 2400);
    return () => {
      window.clearInterval(a);
      window.clearInterval(b);
    };
  }, []);

  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      setTilt({
        x: ((e.clientX - (r.left + r.width / 2)) / r.width) * 2,
        y: ((e.clientY - (r.top + r.height / 2)) / r.height) * 2,
      });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section id="top" className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28">
      {/* Ambient glow */}
      <span className="glow-gold -top-40 -left-32 h-[30rem] w-[30rem] opacity-30" />
      <span className="glow-gold top-24 right-[-10rem] h-[24rem] w-[24rem] opacity-20" />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Reveal variant="left">
              <span className="inline-flex items-center gap-3 rounded-full border border-gold/20 bg-gold/[0.06] px-2 py-1.5 pr-4">
                <span className="rounded-full bg-gold px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.12em] text-background">
                  2026
                </span>
                <span className="text-xs font-medium tracking-[0.06em] text-white/50">
                  Real Cases. Clearer Support.
                </span>
              </span>
            </Reveal>

            <h1 className="display mt-8 text-[clamp(2.9rem,8.4vw,6.6rem)]" data-shown={ready}>
              {headline.map((w, i) => (
                <Fragment key={`${w.text}-${i}`}>
                  <span className="word-rise mr-[0.22em]">
                    <span
                      style={{ transitionDelay: `${120 + i * 70}ms` }}
                      className={w.mark ? "mark-highlight italic" : ""}
                    >
                      {w.text}
                    </span>
                  </span>
                  {w.br && <br />}
                </Fragment>
              ))}
            </h1>

            <Reveal delay={200}>
              <p className="mt-9 max-w-lg text-lg leading-relaxed text-white/50">
                WinsAble helps people organize their situation, prepare clear support requests, and
                navigate legitimate account recovery, appeal, impersonation, and copyright-related
                cases.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <p className="mt-6 flex items-center gap-2 text-sm font-medium tracking-[0.04em] text-white/40">
                <span className="inline-block size-1.5 rounded-full bg-gold" aria-hidden="true" />
                Assisting with
                <span className="relative inline-grid h-5 overflow-hidden align-middle">
                  {rotating.map((r, i) => (
                    <span
                      key={r}
                      className="col-start-1 row-start-1 block whitespace-nowrap text-foreground transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        transform: `translateY(${(i - word) * 100}%)`,
                        opacity: i === word ? 1 : 0,
                      }}
                    >
                      {r}
                    </span>
                  ))}
                </span>
              </p>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <CtaLink href="#start">Start Your Case</CtaLink>
                <CtaLink href="#services" variant="outline">
                  Explore Services
                </CtaLink>
              </div>
            </Reveal>

            <Reveal delay={380}>
              <p className="mt-8 max-w-md text-xs text-white/30">
                Independent assistance · No passwords required · No guaranteed outcomes
              </p>
            </Reveal>

            <Reveal delay={420}>
              <ol className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.06] pt-6">
                {flow.map((f, i) => (
                  <li key={f} className="flex items-center gap-5">
                    <span className="flex items-baseline gap-2">
                      <span className="text-[0.65rem] font-bold tracking-[0.16em] text-gold">
                        0{i + 1}
                      </span>
                      <span className="text-sm font-medium text-white/70">{f}</span>
                    </span>
                    {i < flow.length - 1 && (
                      <span
                        className="line-draw h-px w-6 bg-white/10 sm:w-10"
                        style={{ animationDelay: `${700 + i * 180}ms` }}
                      />
                    )}
                  </li>
                ))}
              </ol>
            </Reveal>

            <div className="mt-12 flex items-center gap-3 text-[10px] font-semibold tracking-[0.28em] text-white/25 uppercase">
              <span className="scroll-cue relative block h-8 w-px bg-white/10" aria-hidden="true" />
              Scroll
            </div>
          </div>

          {/* Fanned case-card composition */}
          <div className="lg:col-span-5">
            <div
              ref={stackRef}
              className="group relative h-[38rem] sm:h-[39rem]"
              style={{ perspective: "1200px" }}
            >
              {heroCards.map((c, i) => {
                const depth = (heroCards.length - i) / heroCards.length;
                return (
                  <div
                    key={c.label}
                    className="absolute top-0 left-0 w-[76%] max-w-[17.5rem] rounded-xl glass p-5 transition-[transform,opacity,box-shadow,border-color] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:z-10 sm:w-[72%]"
                    style={{
                      zIndex: c.z,
                      opacity: ready ? 1 : 0,
                      transitionDelay: `${240 + i * 110}ms`,
                      borderColor: active === i ? "var(--gold)" : undefined,
                      boxShadow:
                        active === i
                          ? "0 28px 60px -30px oklch(0.75 0.12 75 / 0.3), 0 0 0 1px oklch(0.75 0.12 75 / 0.2)"
                          : undefined,
                      transform: ready
                        ? `translate(calc(${c.x} + ${tilt.x * depth * 14}px), calc(${c.y} + ${tilt.y * depth * 10}px)) rotate(${c.rot}) scale(${active === i ? 1.035 : 1})`
                        : `translate(${c.x}, calc(${c.y} + 2.5rem)) rotate(0deg) scale(0.96)`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[0.65rem] font-bold tracking-[0.16em] text-white/40">
                        CASE {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.12em] transition-colors duration-500 ${
                          active === i
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-white/10 text-white/40"
                        }`}
                      >
                        {c.stage.toUpperCase()}
                      </span>
                    </div>
                    <p className="display mt-6 text-xl leading-tight sm:text-2xl">{c.label}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                      <span className="flex gap-1.5" aria-hidden="true">
                        {[0, 1, 2, 3].map((d) => (
                          <span
                            key={d}
                            className={`h-1 w-6 rounded-full transition-colors duration-700 ${d <= i % 4 ? "bg-gold" : "bg-white/10"}`}
                            style={{ transitionDelay: `${600 + d * 120}ms` }}
                          />
                        ))}
                      </span>
                      <ArrowUpRight className="size-3.5 text-white/30" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- TRUST BAR ---------------------------- */

const trustItems = [
  {
    icon: "independent",
    title: "Independent Service",
    body: "We are not affiliated with any platform.",
  },
  { icon: "secure", title: "Secure Submission", body: "Your data is encrypted and never shared." },
  {
    icon: "no-password",
    title: "No Password Required",
    body: "We never ask for your password or OTP.",
  },
  {
    icon: "case-ref",
    title: "Clear Case Reference",
    body: "You'll receive a unique case ID to track progress.",
  },
  {
    icon: "professional",
    title: "Professional Assistance",
    body: "Guidance for legitimate support requests.",
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-white/[0.06] bg-surface/50 py-12">
      <div className="shell">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {trustItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 60} variant="scale">
              <div className="flex flex-col items-start gap-3">
                <span className="flex size-10 items-center justify-center rounded-full border border-gold/20 bg-gold/[0.06]">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5 text-gold"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/40">{item.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- PLATFORM STRIP ---------------------------- */

const platforms = ["Instagram", "Facebook", "TikTok", "YouTube", "X"];

export function PlatformStrip() {
  const row = [...platforms, ...platforms, ...platforms, ...platforms];
  return (
    <section className="border-y border-white/[0.06] bg-surface/30 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <span className="eyebrow shrink-0 pl-6 md:pl-12 xl:pl-22">Platforms we work with</span>
        <div
          className="relative min-w-0 flex-1 overflow-hidden sm:ml-6"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 2rem, black 88%, transparent)",
          }}
        >
          <div className="marquee-track gap-12">
            {[0, 1].map((dup) => (
              <div
                key={dup}
                className="flex shrink-0 items-center gap-12 pr-12"
                aria-hidden={dup === 1}
              >
                {row.map((p, i) => (
                  <span
                    key={`${dup}-${p}-${i}`}
                    className="flex items-center gap-2.5 whitespace-nowrap text-white/30 transition-colors duration-300 hover:text-gold"
                  >
                    <PlatformMark name={p} className="size-5" />
                    <span className="text-lg font-medium">{p}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- SERVICES ------------------------------- */

const defaultServices: (ServiceType & { span: string })[] = [
  {
    id: "s1",
    n: "01",
    title: "Account Recovery",
    icon: "recovery",
    body: "Assistance with account access issues and recovery request preparation.",
    tags: ["Ownership evidence", "Login history", "Recovery form"],
    enabled: true,
    span: "lg:col-span-4",
  },
  {
    id: "s2",
    n: "02",
    title: "Disabled Account",
    icon: "disabled",
    body: "Help organizing information for legitimate appeals when an account is disabled.",
    tags: ["Appeal draft", "Policy context"],
    enabled: true,
    span: "lg:col-span-4",
  },
  {
    id: "s3",
    n: "03",
    title: "Impersonation Reports",
    icon: "impersonation",
    body: "Assistance preparing a legitimate impersonation report and organizing evidence.",
    tags: ["Identity proof", "Report pack"],
    enabled: true,
    span: "lg:col-span-4",
  },
  {
    id: "s4",
    n: "04",
    title: "Copyright Assistance",
    icon: "copyright",
    body: "Help with copyright-related complaints and platform submissions.",
    tags: ["Original files", "Rights summary"],
    enabled: true,
    span: "lg:col-span-4",
  },
  {
    id: "s5",
    n: "05",
    title: "Hacked Account",
    icon: "hacked",
    body: "Assistance with account compromise support requests. Never ask for your password, OTP or 2FA code.",
    tags: ["Security review", "Recovery plan"],
    enabled: true,
    span: "lg:col-span-4",
  },
  {
    id: "s6",
    n: "06",
    title: "Platform Support",
    icon: "support",
    body: "General assistance with preparing support requests for various platform issues.",
    tags: ["Right channel", "Clear summary"],
    enabled: true,
    span: "lg:col-span-4",
  },
];

export function Services() {
  const siteData = useSiteData();
  const services = (siteData?.services || defaultServices)
    .filter((s) => s.enabled !== false)
    .map((s, i) => ({ ...s, span: "lg:col-span-4" }));

  return (
    <section id="services" className="shell py-24 md:py-36">
      <div className="grid gap-8 border-b border-white/[0.06] pb-12 lg:grid-cols-12">
        <Reveal variant="left" className="lg:col-span-6">
          <p className="eyebrow">Our Services</p>
          <h2 className="display mt-6 text-[clamp(2.4rem,5.4vw,4.5rem)]">
            Support for the Cases That Are{" "}
            <span className="relative inline-block">
              <span className="relative z-10 italic text-gold">Hard to Navigate Alone.</span>
            </span>
          </h2>
        </Reveal>
        <Reveal delay={100} variant="right" className="lg:col-span-5 lg:col-start-8 lg:self-end">
          <p className="text-base leading-relaxed text-white/50">
            {siteData?.content?.servicesSubtext ||
              "WinsAble provides assistance in preparing and submitting legitimate support requests across major social media platforms."}
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {services.map((s, i) => (
          <Reveal
            key={s.id}
            delay={i * 80}
            variant={i % 2 === 0 ? "left" : "right"}
            className={s.span}
          >
            <ServiceCard s={s} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ s }: { s: ServiceType & { span: string } }) {
  const spot = useSpotlight();

  return (
    <article
      onPointerMove={spot.onPointerMove}
      style={spot.style}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl glass p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_34px_70px_-42px_oklch(0.75_0.12_75/0.25)]"
    >
      <Spotlight />
      {/* Gold top line sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-out group-hover:scale-x-100"
      />
      <span
        aria-hidden="true"
        className="display pointer-events-none absolute -right-2 -bottom-6 text-[9rem] leading-none text-white/[0.03] transition-all duration-700 group-hover:-translate-y-1 group-hover:text-gold/[0.08]"
      >
        {s.n}
      </span>
      <div className="relative z-10 flex items-start justify-between gap-6">
        <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-gold">
          {s.n}
          <span className="h-px w-6 bg-gold/40 transition-all duration-500 group-hover:w-12" />
        </span>
        <span className="flex size-10 items-center justify-center rounded-full border border-white/10 transition-all duration-500 group-hover:rotate-12 group-hover:border-gold/30 group-hover:bg-gold/10">
          <ServiceIcon
            name={s.icon}
            className="size-5 shrink-0 text-white/30 transition-all duration-500 group-hover:-rotate-6 group-hover:text-gold"
          />
        </span>
      </div>
      <div className="relative z-10 mt-14">
        <h3 className="display text-2xl md:text-3xl">{s.title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-white/50">{s.body}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {s.tags.map((t) => (
            <li
              key={t}
              className="rounded-full border border-white/10 px-3 py-1 text-[0.68rem] font-medium tracking-[0.08em] text-white/40 uppercase transition-colors duration-500 group-hover:border-gold/20 group-hover:text-white/60"
            >
              {t}
            </li>
          ))}
        </ul>
        <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold/70 transition-colors group-hover:text-gold">
          <span className="link-underline">Learn More</span>
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </article>
  );
}

/* ------------------------------- TEXT BAND -------------------------------- */

const bandWords = ["Organize the facts", "Prepare the request", "Submit properly", "Stay informed"];

export function TextBand() {
  const row = [...bandWords, ...bandWords, ...bandWords];
  return (
    <section
      aria-hidden="true"
      className="grain overflow-hidden border-y border-white/[0.06] bg-background py-7"
    >
      <div className="band-marquee">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center">
            {row.map((w, i) => (
              <span
                key={`${dup}-${w}-${i}`}
                className="display flex items-center gap-8 px-8 text-3xl whitespace-nowrap text-foreground/80 md:text-5xl"
              >
                {w}
                <span className="text-gold">✳</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ HOW IT WORKS ----------------------------- */

const steps = [
  { n: "01", title: "Tell Us What Happened", body: "Share the details of your situation." },
  {
    n: "02",
    title: "We Organize the Details",
    body: "Our team reviews and organizes your information.",
  },
  {
    n: "03",
    title: "Prepare the Request",
    body: "We prepare the appropriate support or appeal request.",
  },
  {
    n: "04",
    title: "Submit to the Platform",
    body: "We submit through the relevant official channel.",
  },
  { n: "05", title: "Receive Your Case ID", body: "Track your case using your unique reference." },
];

export function Process() {
  return (
    <section id="process" className="border-b border-white/[0.06] bg-surface/30 py-24 md:py-36">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal variant="left" className="lg:col-span-7">
            <p className="eyebrow">How It Works</p>
            <h2 className="display mt-6 max-w-3xl text-[clamp(2.4rem,5.4vw,4.5rem)]">
              From Confusion to a <span className="italic text-gold">Clear Case.</span>
            </h2>
          </Reveal>
        </div>

        <div className="relative mt-16">
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 hidden h-px w-full bg-white/[0.06] lg:block"
          />
          <ol className="grid gap-px lg:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 100} variant="scale" className="group relative">
                <div className="h-full border-b border-white/[0.06] pt-8 pb-10 lg:border-b-0 lg:border-r lg:pr-6 lg:last:border-r-0">
                  <span
                    aria-hidden="true"
                    className="absolute -top-[5px] left-0 hidden size-[9px] rounded-full border border-white/20 bg-background transition-colors duration-300 group-hover:border-gold group-hover:bg-gold lg:block"
                  />
                  <span className="text-xs font-semibold tracking-[0.18em] text-gold">{s.n}</span>
                  <h3 className="display mt-6 text-2xl leading-tight">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/40">{s.body}</p>
                  <span className="mt-6 block h-px w-full bg-white/[0.06]">
                    <span className="block h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
                  </span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- FEATURED CASE ----------------------------- */

export function FeaturedScenario() {
  return (
    <section className="shell py-24 md:py-36">
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal variant="left" className="lg:col-span-4">
          <p className="eyebrow">Case Review</p>
          <h2 className="display mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)]">
            Your Case. Clearly Organized.
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-white/40">
            An animated mock case dashboard. This is a visual representation of how your case is
            structured.
          </p>

          <div className="mt-10 rounded-xl glass p-5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-gold animate-pulse" />
              <span className="text-[0.65rem] font-bold tracking-[0.16em] text-gold">
                CASE DASHBOARD
              </span>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">CASE ID</span>
                <span className="font-mono text-gold">WA-2026-8F42K7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">STATUS</span>
                <span className="text-foreground">Received</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">PLATFORM</span>
                <span className="text-foreground">Instagram</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">CASE TYPE</span>
                <span className="text-foreground">Account Recovery</span>
              </div>
            </div>
            <div className="mt-5 border-t border-white/[0.06] pt-4 text-xs text-white/30">
              Illustrative example only
            </div>
          </div>
        </Reveal>

        <div className="grid gap-4 lg:col-span-8 sm:grid-cols-3">
          {[
            {
              k: "Situation",
              v: "A creator can no longer log in. Recovery emails are not arriving and the account shows a restriction notice.",
            },
            {
              k: "What WinsAble does",
              v: "We collect ownership details, previous login context and the exact notice text, then prepare the matching request.",
            },
            {
              k: "Next step",
              v: "The request is submitted through the platform's official channel and you receive a case reference to follow.",
            },
          ].map((c, i) => (
            <Reveal
              key={c.k}
              delay={i * 90}
              variant={i === 0 ? "left" : i === 2 ? "right" : "scale"}
            >
              <div className="group flex h-full flex-col rounded-xl glass p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_34px_70px_-42px_oklch(0.75_0.12_75/0.25)]">
                <span className="eyebrow">{c.k}</span>
                <span className="mt-4 block h-px w-10 bg-gold transition-all duration-500 group-hover:w-20" />
                <p className="mt-6 text-base leading-relaxed text-white/60">{c.v}</p>
                <span className="mt-auto pt-8 text-xs text-white/30">
                  {String(i + 1).padStart(2, "0")} / 03
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- BRAND PHILOSOPHY --------------------------- */

const principles = [
  "Organize the facts.",
  "Prepare the request.",
  "Make the process easier to understand.",
  "The platform makes the final decision.",
];

export function Philosophy() {
  return (
    <section className="grain relative overflow-hidden border-t border-white/[0.06] bg-background py-28 md:py-44">
      <span className="glow-gold -bottom-32 left-1/3 h-[24rem] w-[24rem] opacity-20" />
      <div className="shell relative z-1">
        <Reveal>
          <p className="eyebrow">Our Position</p>
          <h2 className="display mt-10 text-[clamp(3rem,11vw,9rem)] leading-[0.9]">
            Clarity before{" "}
            <span className="italic text-gold">
              <Scramble text="claims." />
            </span>
          </h2>
        </Reveal>
        <div className="mt-20 grid gap-14 lg:grid-cols-12">
          <Reveal delay={100} variant="left" className="lg:col-span-5">
            <ScrollText
              className="text-lg leading-relaxed text-foreground"
              dim={0.22}
              text="People dealing with difficult account situations deserve clear information rather than exaggerated promises."
            />
          </Reveal>
          <ol className="lg:col-span-6 lg:col-start-7">
            {principles.map((p, i) => (
              <Reveal as="li" key={p} delay={i * 90} variant="right">
                <div className="group flex items-baseline gap-6 border-t border-white/[0.08] py-6 transition-colors duration-300 hover:border-gold">
                  <span className="text-xs font-semibold tracking-[0.18em] text-white/30 transition-colors duration-300 group-hover:text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="display text-2xl md:text-3xl">{p}</span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- ABOUT -------------------------------- */

export function About() {
  return (
    <section id="about" className="shell py-24 md:py-36">
      <div className="grid gap-14 lg:grid-cols-12">
        <Reveal variant="left" className="lg:col-span-6">
          <p className="eyebrow">About</p>
          <ScrollText
            as="h2"
            className="display mt-8 text-[clamp(2.3rem,5.2vw,4.4rem)]"
            dim={0.14}
            text="Digital problems are confusing enough. The process shouldn't be."
          />
        </Reveal>
        <Reveal delay={120} variant="right" className="lg:col-span-5 lg:col-start-8 lg:self-end">
          <div className="space-y-6 text-base leading-relaxed text-white/50">
            <p>
              WinsAble is an independent service for people facing difficult situations on digital
              platforms — recovery, disablements, impersonation, copyright and support requests.
            </p>
            <p>
              We don't promise outcomes. We organize what happened, prepare the appropriate request,
              submit it through the relevant channel and keep you informed with a case reference.
            </p>
            <p className="text-foreground">A small team. A clear method. Nothing exaggerated.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------- FAQ --------------------------------- */

const faqs = [
  {
    q: "Can you guarantee my account comes back?",
    a: "No. The platform makes every final decision. What we can do is make sure your request is complete, accurate and sent through the right channel.",
  },
  {
    q: "Which situations do you work on?",
    a: "Account recovery, disabled accounts, impersonation, copyright assistance, hacked/compromised accounts and general platform support requests.",
  },
  {
    q: "What do you need from me to start?",
    a: "Your description of what happened, any notice text you received, and details that show the account belongs to you.",
  },
  {
    q: "How do I follow my case?",
    a: "Once the request is submitted you receive a case reference (WA-2026-XXXXXX), so you always know which stage your case is at.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-y border-white/[0.06] bg-surface/30 py-24 md:py-32">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <Reveal variant="left" className="lg:col-span-4">
          <p className="eyebrow">Questions</p>
          <h2 className="display mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)]">Straight answers.</h2>
        </Reveal>
        <div className="lg:col-span-7 lg:col-start-6">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 70} variant="right">
                <div className="border-t border-white/[0.06] last:border-b">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                  >
                    <span className="display text-xl leading-snug md:text-2xl">{f.q}</span>
                    <span
                      className={`mt-1 grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 border-gold bg-gold text-background"
                          : "border-white/10 text-white/40"
                      }`}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
                        <path
                          d="M8 3v10M3 8h10"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ maxHeight: isOpen ? "16rem" : "0px", opacity: isOpen ? 1 : 0 }}
                  >
                    <p className="max-w-xl pb-7 text-base leading-relaxed text-white/50">{f.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- FINAL CTA ------------------------------- */

export function FinalCta() {
  return (
    <section id="start" className="relative overflow-hidden py-28 md:py-40">
      <span className="glow-gold top-1/2 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 opacity-25" />
      <div className="shell relative text-center">
        <Reveal variant="scale">
          <p className="eyebrow">Start here</p>
          <h2 className="display mx-auto mt-8 max-w-4xl text-[clamp(2.7rem,9vw,7rem)]">
            Make your next step{" "}
            <span className="mark-highlight italic">
              <Scramble text="clear." />
            </span>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-8 max-w-md text-lg text-white/50">
            Start with a clear case and a structured process.
          </p>
        </Reveal>
        <Reveal delay={160} variant="scale">
          <div className="relative mt-12 flex justify-center">
            <Seal className="absolute top-1/2 right-4 size-24 -translate-y-1/2 text-white/10 md:right-24 md:size-28" />
            <Magnetic strength={0.28}>
              <CtaLink
                href="#case-form"
                variant="solid"
                className="px-8 py-4 text-base"
              >
                Start a Case
              </CtaLink>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------- FOOTER -------------------------------- */

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="shell py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <LogoMark className="h-10 w-10 rounded-sm object-cover" />
              <span className="display text-2xl tracking-tight">WINSABLE</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
              Professional assistance for social media account recovery, appeals, impersonation,
              copyright-related complaints and platform support requests.
            </p>
          </div>
          <nav className="md:col-span-4 md:col-start-7" aria-label="Footer">
            <p className="eyebrow">Navigate</p>
            <ul className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {[
                ["Services", "#services"],
                ["How It Works", "#process"],
                ["About", "#about"],
                ["FAQ", "#faq"],
                ["Contact", "mailto:hello@winsable.com"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="link-underline text-white/40 transition-colors hover:text-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-2">
            <p className="eyebrow">Social</p>
            <a
              href="https://instagram.com"
              className="group mt-5 inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-gold"
            >
              Instagram
              <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-white/30">
          <span>© {new Date().getFullYear()} WinsAble. All rights reserved.</span>
          <span className="hidden sm:inline">Final decisions rest with the platform.</span>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 uppercase tracking-[0.2em] transition-colors hover:text-gold"
          >
            Back to top
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
