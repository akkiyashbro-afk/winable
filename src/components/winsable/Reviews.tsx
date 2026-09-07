import { LogoMark } from "./Bits";
import { Reveal } from "./Reveal";
import { useSiteData, type Review } from "./useSiteData";

const defaultReviews: Review[] = [
  {
    id: "r1",
    quote:
      "The process was explained step by step, so I finally understood what was actually being submitted and why.",
    name: "A. M.",
    role: "Creator, Instagram case",
    avatar: "",
    rating: 5,
    order: 0,
    featured: true,
    enabled: true,
  },
  {
    id: "r2",
    quote:
      "No exaggerated promises. Just an organised summary of my situation and a clear next step.",
    name: "R. K.",
    role: "Small business owner",
    avatar: "",
    rating: 5,
    order: 1,
    featured: false,
    enabled: true,
  },
  {
    id: "r3",
    quote:
      "They kept everything documented and easy to follow, which made a stressful week much calmer.",
    name: "S. D.",
    role: "Photographer, copyright case",
    avatar: "",
    rating: 5,
    order: 2,
    featured: false,
    enabled: true,
  },
  {
    id: "r4",
    quote:
      "Straightforward communication and a proper case reference at the end. That was all I needed.",
    name: "T. N.",
    role: "YouTube channel owner",
    avatar: "",
    rating: 5,
    order: 3,
    featured: true,
    enabled: true,
  },
];

function Stars({ count = 5 }: { count?: number }) {
  return (
    <span className="flex gap-0.5 text-gold" aria-label={`${count} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`size-3.5 fill-current ${i < count ? "opacity-100" : "opacity-20"}`}
          aria-hidden="true"
        >
          <path d="M10 1.6l2.5 5.3 5.6.8-4 4 1 5.7L10 14.7 4.9 17.4l1-5.7-4-4 5.6-.8z" />
        </svg>
      ))}
    </span>
  );
}

function Avatar({ src, name }: { src?: string; name: string }) {
  const initials = name.replace(/[^A-Z]/g, "").slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="size-11 rounded-full object-cover border border-gold/20"
        loading="lazy"
      />
    );
  }

  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/20 bg-gold/[0.06] text-[0.8rem] font-bold tracking-[0.06em] text-gold">
      {initials}
    </span>
  );
}

export function Reviews() {
  const siteData = useSiteData();
  const reviews = (siteData?.reviews || defaultReviews)
    .filter((r) => r.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section
      id="reviews"
      className="relative overflow-hidden border-t border-white/[0.06] py-20 md:py-28"
    >
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal variant="left">
              <span className="eyebrow">Testimonials</span>
              <h2 className="display mt-5 text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.02]">
                Calm words from
                <br />
                <span className="italic text-gold">calmer cases.</span>
              </h2>
              <p className="mt-6 max-w-sm text-white/50">
                People come to WinsAble confused and stuck. What they take away is a clear,
                documented process — not a promise about the platform&apos;s decision.
              </p>
            </Reveal>

            <Reveal delay={140} variant="scale">
              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="h-56 rounded-xl glass overflow-hidden sm:h-64">
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface to-surface-elevated">
                    <LogoMark className="h-16 w-16 opacity-20" />
                  </div>
                </div>
                <div className="mt-8 h-56 rounded-xl glass overflow-hidden sm:h-64">
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface-elevated to-surface">
                    <LogoMark className="h-16 w-16 opacity-20" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {reviews.map((r, i) => (
                <Reveal key={r.id} delay={80 * i} variant={i % 2 === 0 ? "left" : "right"}>
                  <figure
                    className={`group flex h-full flex-col justify-between rounded-xl glass p-6 transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-40px_oklch(0.75_0.12_75/0.25)] ${
                      r.featured ? "sm:row-span-2" : ""
                    } ${i % 2 === 1 ? "sm:mt-8" : ""}`}
                  >
                    <div>
                      <Stars count={r.rating} />
                      <blockquote
                        className={`mt-5 leading-relaxed text-foreground ${r.featured ? "text-lg" : "text-[1.05rem]"}`}
                      >
                        &ldquo;{r.quote}&rdquo;
                      </blockquote>
                    </div>
                    <figcaption className="mt-7 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                      <Avatar src={r.avatar} name={r.name} />
                      <span className="leading-tight">
                        <span className="block text-sm font-semibold">{r.name}</span>
                        <span className="block text-xs text-white/40">{r.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>

            <Reveal delay={320}>
              <p className="mt-8 text-xs text-white/30">
                Reviews are shared with permission and shortened for clarity. WinsAble does not
                guarantee any platform outcome.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
