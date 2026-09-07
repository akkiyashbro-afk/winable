import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useSiteData, type Talent } from "@/components/winsable/useSiteData";
import { Nav } from "@/components/winsable/Nav";
import { Footer } from "@/components/winsable/Sections";
import { Reveal } from "@/components/winsable/Reveal";
import { Magnetic } from "@/components/winsable/Fx";

const fallbackTalents: Talent[] = [
  {
    id: "t1",
    name: "Harsh Babbar",
    slug: "harsh-babbar",
    mainImage: "",
    profileImage: "",
    category: "Instagram",
    bio: "Digital content creator and social media strategist with a passion for storytelling. Known for authentic content that resonates with millions across platforms.",
    totalReach: "2.5M+",
    username: "@harshbabbar",
    followers: "2.5M",
    verified: true,
    recoveryType: "Account Takeover",
    recoveryDate: "Jun 3, 2026",
    review: {
      quote: "They didn't just recover my account — they restored a decade of brand equity. Calm, forensic, relentless.",
      rating: 5,
    },
    socials: { instagram: "https://instagram.com/harshbabbar", youtube: "https://youtube.com/@harshbabbar" },
    clients: [],
    campaigns: [],
    socialPosts: [],
    contact: { whatsapp: "+91 98765 43210", email: "harsh@winsable.com", ctaText: "Need account recovery assistance?" },
    active: true,
    featured: true,
    order: 0,
  },
];

export const Route = createFileRoute("/recovery/$slug")({
  component: RecoveryProfile,
});

function RecoveryProfile() {
  const { slug } = Route.useParams();
  const siteData = useSiteData();

  const talent = useMemo(() => {
    const all = siteData?.talents || fallbackTalents;
    return all.find((t) => t.slug === slug) || null;
  }, [siteData, slug]);

  if (!talent) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main className="shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
          <p className="eyebrow">Not Found</p>
          <h1 className="display mt-6 text-[clamp(2rem,5vw,4rem)]">
            Recovery case not found.
          </h1>
          <Link
            to="/"
            hash="reviews"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-6 py-3 text-sm font-semibold text-gold transition-all hover:bg-gold/20"
          >
            ← Back to Recovery Cases
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const initials = talent.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        {/* ===== HERO / CASE HEADER ===== */}
        <section className="relative overflow-hidden border-b border-white/[0.06] py-16 md:py-24">
          {/* Ambient glow */}
          <span className="glow-purple absolute top-0 left-1/2 h-[30rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-20" />
          <span className="glow-gold absolute top-1/3 right-[-10rem] h-[20rem] w-[20rem] opacity-10" />

          <div className="shell relative z-10">
            {/* Back link */}
            <Reveal>
              <Link
                to="/"
                hash="reviews"
                className="mb-10 inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-gold"
              >
                ← Back to Recovery Cases
              </Link>
            </Reveal>

            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Profile Image */}
              <div className="lg:col-span-4">
                <Reveal variant="scale" delay={100}>
                  <div className="relative mx-auto max-w-xs lg:mx-0">
                    {talent.profileImage ? (
                      <img
                        src={talent.profileImage}
                        alt={talent.name}
                        className="aspect-[3/4] w-full rounded-2xl object-cover border border-white/[0.08]"
                      />
                    ) : (
                      <div className="aspect-[3/4] w-full rounded-2xl border border-white/[0.08] bg-gradient-to-br from-amber-900/40 via-yellow-900/20 to-stone-900/60 flex flex-col items-center justify-center p-8">
                        <span className="grid size-24 place-items-center rounded-full border-2 border-gold/30 bg-gold/[0.1] text-3xl font-bold tracking-wider text-gold">
                          {initials}
                        </span>
                        <span className="mt-6 text-sm text-white/40">{talent.category}</span>
                      </div>
                    )}
                    {/* Corner marks */}
                    <span className="absolute -top-2 -left-2 h-6 w-6 border-t-2 border-l-2 border-gold/30" />
                    <span className="absolute -top-2 -right-2 h-6 w-6 border-t-2 border-r-2 border-gold/30" />
                    <span className="absolute -bottom-2 -left-2 h-6 w-6 border-b-2 border-l-2 border-gold/30" />
                    <span className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-gold/30" />
                  </div>
                </Reveal>
              </div>

              {/* Case Info */}
              <div className="lg:col-span-8">
                <Reveal delay={50}>
                  <span className="eyebrow">Recovery Case</span>
                </Reveal>
                <Reveal delay={120}>
                  <h1 className="display mt-4 text-[clamp(2.5rem,6vw,5rem)] leading-[0.95]">
                    {talent.name}
                  </h1>
                </Reveal>
                {talent.username && (
                  <Reveal delay={180}>
                    <p className="mt-3 text-lg text-gold/70 font-mono">{talent.username}</p>
                  </Reveal>
                )}
                <Reveal delay={220}>
                  <p className="mt-4 text-lg text-white/50">{talent.bio}</p>
                </Reveal>

                {/* Metadata pills */}
                <Reveal delay={280}>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.06] px-4 py-2">
                      <span className="text-xs font-semibold tracking-[0.12em] text-white/40 uppercase">Platform</span>
                      <span className="text-sm font-bold text-gold">{talent.category}</span>
                    </div>
                    {talent.recoveryType && (
                      <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.06] px-4 py-2">
                        <span className="text-xs font-semibold tracking-[0.12em] text-white/40 uppercase">Recovery</span>
                        <span className="text-sm font-bold text-gold">{talent.recoveryType}</span>
                      </div>
                    )}
                    {talent.followers && (
                      <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.06] px-4 py-2">
                        <span className="text-xs font-semibold tracking-[0.12em] text-white/40 uppercase">Reach</span>
                        <span className="text-sm font-bold text-gold">{talent.followers}</span>
                      </div>
                    )}
                    {talent.verified && (
                      <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">
                        <svg viewBox="0 0 24 24" className="size-4 text-green-400" fill="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-bold text-green-400">Verified Recovery</span>
                      </div>
                    )}
                  </div>
                </Reveal>

                {/* Recovery status */}
                {talent.recoveryDate && (
                  <Reveal delay={340}>
                    <div className="mt-6 inline-flex items-center gap-3 rounded-xl glass px-5 py-3">
                      <span className="size-2 rounded-full bg-gold animate-pulse" />
                      <span className="text-sm text-white/60">Recovery Completed</span>
                      <span className="text-sm font-semibold text-gold">{talent.recoveryDate}</span>
                    </div>
                  </Reveal>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== RECOVERY DETAILS ===== */}
        <section className="shell py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal variant="left" className="lg:col-span-5">
              <p className="eyebrow">Recovery Details</p>
              <h2 className="display mt-6 text-[clamp(2rem,4vw,3rem)]">
                Case <span className="italic text-gold">Information.</span>
              </h2>
              <p className="mt-4 text-sm text-white/40">
                A summary of the recovery case and its key details.
              </p>
            </Reveal>

            <Reveal variant="right" delay={100} className="lg:col-span-6 lg:col-start-7">
              <div className="space-y-0 divide-y divide-white/[0.06]">
                {talent.category && (
                  <div className="flex items-center justify-between py-5">
                    <span className="text-sm text-white/40">Platform</span>
                    <span className="text-sm font-semibold text-foreground">{talent.category}</span>
                  </div>
                )}
                {talent.username && (
                  <div className="flex items-center justify-between py-5">
                    <span className="text-sm text-white/40">Username</span>
                    <span className="text-sm font-semibold text-foreground font-mono">{talent.username}</span>
                  </div>
                )}
                {talent.followers && (
                  <div className="flex items-center justify-between py-5">
                    <span className="text-sm text-white/40">Followers / Reach</span>
                    <span className="text-sm font-semibold text-foreground">{talent.followers}</span>
                  </div>
                )}
                {talent.recoveryType && (
                  <div className="flex items-center justify-between py-5">
                    <span className="text-sm text-white/40">Recovery Type</span>
                    <span className="text-sm font-semibold text-foreground">{talent.recoveryType}</span>
                  </div>
                )}
                {talent.recoveryDate && (
                  <div className="flex items-center justify-between py-5">
                    <span className="text-sm text-white/40">Recovery Date</span>
                    <span className="text-sm font-semibold text-foreground">{talent.recoveryDate}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-5">
                  <span className="text-sm text-white/40">Status</span>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
                    <span className="size-1.5 rounded-full bg-gold" />
                    Recovery Completed
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== CLIENT REVIEW ===== */}
        {talent.review && (
          <section className="border-y border-white/[0.06] bg-surface/30 py-16 md:py-24">
            <div className="shell">
              <Reveal>
                <p className="eyebrow">Client Review</p>
              </Reveal>
              <Reveal delay={80}>
                <blockquote className="mt-8 max-w-3xl">
                  <p className="display text-[clamp(1.6rem,3.5vw,2.8rem)] leading-[1.15] text-foreground">
                    &ldquo;{talent.review.quote}&rdquo;
                  </p>
                </blockquote>
              </Reveal>
              <Reveal delay={160}>
                <div className="mt-8 flex items-center gap-4">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        viewBox="0 0 20 20"
                        className={`size-5 ${i < talent.review!.rating ? "text-gold" : "text-white/10"}`}
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground">{talent.name}</span>
                    <span className="mx-2 text-white/20">·</span>
                    <span className="text-sm text-white/40">{talent.category}</span>
                    {talent.recoveryDate && (
                      <>
                        <span className="mx-2 text-white/20">·</span>
                        <span className="text-sm text-white/40">{talent.recoveryDate}</span>
                      </>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* ===== SOCIAL PROFILE ===== */}
        {Object.values(talent.socials).some(Boolean) && (
          <section className="shell py-16 md:py-20">
            <Reveal>
              <p className="eyebrow">Social Profile</p>
              <h2 className="display mt-6 text-[clamp(2rem,4vw,3rem)]">
                Connect <span className="italic text-gold">Directly.</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-8 flex flex-wrap gap-3">
                {talent.socials.instagram && (
                  <a
                    href={talent.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl glass px-6 py-4 text-white/60 transition-all duration-300 hover:border-gold/30 hover:text-gold"
                  >
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                    <span className="text-sm font-medium">Instagram</span>
                    <svg viewBox="0 0 24 24" className="size-4 ml-auto transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
                {talent.socials.youtube && (
                  <a
                    href={talent.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl glass px-6 py-4 text-white/60 transition-all duration-300 hover:border-gold/30 hover:text-gold"
                  >
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
                      <path d="M10.5 9.5v5l4.2-2.5-4.2-2.5Z" fill="currentColor" stroke="none" />
                    </svg>
                    <span className="text-sm font-medium">YouTube</span>
                    <svg viewBox="0 0 24 24" className="size-4 ml-auto transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
                {talent.socials.tiktok && (
                  <a
                    href={talent.socials.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl glass px-6 py-4 text-white/60 transition-all duration-300 hover:border-gold/30 hover:text-gold"
                  >
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M13.6 3v9.6a3 3 0 1 1-2.4-2.9" />
                      <path d="M13.6 4.6c.5 2 2 3.4 4.2 3.6" />
                    </svg>
                    <span className="text-sm font-medium">TikTok</span>
                    <svg viewBox="0 0 24 24" className="size-4 ml-auto transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
                {talent.socials.facebook && (
                  <a
                    href={talent.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl glass px-6 py-4 text-white/60 transition-all duration-300 hover:border-gold/30 hover:text-gold"
                  >
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14.5 8.5h2.2V5.4h-2.4c-2.2 0-3.6 1.4-3.6 3.7v1.6H8.4v3.1h2.3V21h3.2v-7.2h2.4l.4-3.1h-2.8V9.5c0-.7.3-1 1.2-1Z" />
                    </svg>
                    <span className="text-sm font-medium">Facebook</span>
                    <svg viewBox="0 0 24 24" className="size-4 ml-auto transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
                {talent.socials.x && (
                  <a
                    href={talent.socials.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl glass px-6 py-4 text-white/60 transition-all duration-300 hover:border-gold/30 hover:text-gold"
                  >
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4l7.2 8.4L4.5 20" />
                      <path d="M20 4l-7 8.4L19.5 20" />
                    </svg>
                    <span className="text-sm font-medium">X</span>
                    <svg viewBox="0 0 24 24" className="size-4 ml-auto transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
            </Reveal>
          </section>
        )}

        {/* ===== FINAL CTA ===== */}
        <section className="relative overflow-hidden border-t border-white/[0.06] py-24 md:py-32">
          <span className="glow-gold top-1/2 left-1/2 h-[25rem] w-[25rem] -translate-x-1/2 -translate-y-1/2 opacity-20" />
          <div className="shell relative text-center">
            <Reveal>
              <p className="eyebrow">Start here</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display mx-auto mt-8 max-w-3xl text-[clamp(2rem,5vw,3.5rem)]">
                Start Your Recovery{" "}
                <span className="italic text-gold">Case.</span>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mx-auto mt-6 max-w-md text-white/50">
                Need similar help? Start with a clear case and a structured process.
              </p>
            </Reveal>
            <Reveal delay={220} variant="scale">
              <div className="relative mt-10 flex justify-center">
                <Magnetic strength={0.28}>
                  <a
                    href="/#case-form"
                    className="inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-background transition-colors hover:bg-gold-dim"
                  >
                    Start a Case
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
