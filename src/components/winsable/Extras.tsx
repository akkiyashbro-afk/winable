import { Reveal } from "./Reveal";
import { PlatformMark } from "./Bits";

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
  { name: "Instagram" },
  { name: "Facebook" },
  { name: "TikTok" },
  { name: "YouTube" },
  { name: "X" },
  { name: "LinkedIn" },
];

/** Clean editorial index of platforms — no accordion expansion. */
export function Coverage() {
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
          {rows.map((row, i) => (
            <Reveal as="li" key={row.name} delay={i * 60} variant="right">
              <div className="group relative border-b border-white/[0.06] transition-all duration-500 hover:bg-white/[0.02]">
                <div className="flex items-center gap-4 px-3 py-6 md:px-6 md:py-8 transition-transform duration-500 group-hover:translate-x-1">
                  <span className="text-[11px] font-semibold tracking-[0.28em] tabular-nums text-white/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex items-center gap-3 font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-none text-foreground/70 transition-colors duration-300 group-hover:text-foreground">
                    <PlatformMark name={row.name} className="size-6 shrink-0 opacity-70" />
                    {row.name}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
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
