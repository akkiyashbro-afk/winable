import { useState } from "react";
import { Reveal } from "./Reveal";
import { ArrowUpRight, PlatformMark } from "./Bits";

/** Staggered word-by-word rise for large editorial headings. */
export function WordReveal({
  text,
  className = "",
  accentFrom,
}: {
  text: string;
  className?: string;
  accentFrom?: number;
}) {
  const words = text.split(" ");
  return (
    <Reveal as="span" className={`block ${className}`}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="word-rise mr-[0.28em]">
          <span
            style={{ transitionDelay: `${i * 70}ms` }}
            className={accentFrom !== undefined && i >= accentFrom ? "text-gold italic" : ""}
          >
            {word}
          </span>
        </span>
      ))}
    </Reveal>
  );
}

const rows = [
  {
    name: "Instagram",
    cases: "Recovery · Disabled · Impersonation",
    note: "Identity checks, appeal forms and impersonation reports.",
  },
  {
    name: "Facebook",
    cases: "Recovery · Disabled · Copyright",
    note: "Account review requests and rights-holder notices.",
  },
  {
    name: "TikTok",
    cases: "Recovery · Impersonation",
    note: "Appeals prepared against the stated policy reason.",
  },
  {
    name: "YouTube",
    cases: "Copyright · Platform Support",
    note: "Claim and counter-notice paperwork, organized properly.",
  },
  {
    name: "X",
    cases: "Recovery · Impersonation",
    note: "Support tickets written once, written clearly.",
  },
];

/** Hover-expanding editorial index of platforms. */
export function Coverage() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section id="coverage" className="border-y border-white/[0.06] bg-surface/20 py-24 md:py-36">
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal variant="left">
            <p className="eyebrow">Coverage</p>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-[0.95]">
              <WordReveal text="Where we" />
              <WordReveal text="work." accentFrom={0} />
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/40">
              Each platform has its own route, its own wording and its own evidence expectations. We
              follow the one that matches your case.
            </p>
          </Reveal>
        </div>

        <ul className="border-t border-white/[0.06]">
          {rows.map((row, i) => {
            const open = active === i;
            return (
              <li
                key={row.name}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group relative border-b border-white/[0.06]"
              >
                <div
                  className="absolute inset-0 origin-left bg-surface transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: open ? "scaleX(1)" : "scaleX(0)" }}
                  aria-hidden="true"
                />
                <button
                  type="button"
                  onClick={() => setActive(open ? null : i)}
                  className="relative grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-3 py-6 text-left md:px-6 md:py-8"
                >
                  <span
                    className={`text-[11px] font-semibold tracking-[0.28em] tabular-nums transition-colors duration-500 ${open ? "text-gold" : "text-white/30"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`flex items-center gap-3 font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-none transition-colors duration-500 ${open ? "text-foreground" : "text-foreground/70"}`}
                    >
                      <PlatformMark name={row.name} className="size-6 shrink-0 opacity-70" />
                      {row.name}
                    </span>
                    <span
                      className="block overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ maxHeight: open ? "5rem" : "0px", opacity: open ? 1 : 0 }}
                    >
                      <span className="mt-3 block text-sm text-white/50">{row.note}</span>
                      <span className="mt-1 block text-[11px] tracking-[0.22em] text-purple uppercase">
                        {row.cases}
                      </span>
                    </span>
                  </span>
                  <span
                    className={`text-lg leading-none transition-all duration-500 ${open ? "translate-x-0 text-purple rotate-45" : "-translate-x-2 text-white/30 opacity-0"}`}
                  >
                    +
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const doList = [
  "Organize what happened into a clear timeline.",
  "Prepare the request the platform actually asks for.",
  "Submit through the official channel for your case.",
  "Keep you updated with a case reference.",
];

const dontList = [
  "Promise that an account will come back.",
  "Contact platform staff privately or informally.",
  "Ask for your password or login codes.",
  "Exaggerate a situation to make a case look stronger.",
];

/** Do / don't split — sets expectations without inventing claims. */
export function Boundaries() {
  return (
    <section className="shell py-24 md:py-36">
      <Reveal>
        <p className="eyebrow">Boundaries</p>
      </Reveal>
      <h2 className="mt-6 max-w-3xl font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.95]">
        <WordReveal text="Honest about what" />
        <WordReveal text="we do not do." accentFrom={2} />
      </h2>

      <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.06] md:grid-cols-2">
        <div className="sheen glass p-8 md:p-10">
          <p className="eyebrow">We do</p>
          <ul className="mt-6 space-y-5">
            {doList.map((item, i) => (
              <Reveal
                as="li"
                key={item}
                delay={i * 70}
                variant="left"
                className="flex gap-4 text-[15px] leading-relaxed"
              >
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                {item}
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="grain bg-surface p-8 md:p-10">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-white/30 uppercase">
            We don't
          </p>
          <ul className="mt-6 space-y-5">
            {dontList.map((item, i) => (
              <Reveal
                as="li"
                key={item}
                delay={i * 70}
                variant="right"
                className="flex gap-4 text-[15px] leading-relaxed text-white/50"
              >
                <span className="mt-2 h-px w-4 shrink-0 bg-white/30" />
                {item}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
