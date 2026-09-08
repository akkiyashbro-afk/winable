import { useMemo } from "react";
import { useSiteData, type Talent } from "./useSiteData";

const defaultTalents: Talent[] = [
  {
    id: "t1",
    name: "Harsh Babbar",
    slug: "harsh-babbar",
    mainImage: "",
    profileImage: "",
    category: "Instagram",
    bio: "Digital content creator and social media strategist with a passion for storytelling.",
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
    socials: { instagram: "#", youtube: "#" },
    clients: [],
    campaigns: [],
    socialPosts: [],
    contact: {},
    active: true,
    featured: true,
    order: 0,
  },
  {
    id: "t2",
    name: "Reema Ghai",
    slug: "reema-ghai",
    mainImage: "",
    profileImage: "",
    category: "Instagram",
    bio: "Lifestyle and fashion content creator with an eye for aesthetics.",
    totalReach: "1.8M+",
    username: "@reemaghai",
    followers: "1.8M",
    verified: true,
    recoveryType: "Impersonation",
    recoveryDate: "May 28, 2026",
    review: {
      quote: "I had lost hope after 3 weeks of automated support. WinsAble had me back online in under a week.",
      rating: 5,
    },
    socials: { instagram: "#" },
    clients: [],
    campaigns: [],
    socialPosts: [],
    contact: {},
    active: true,
    featured: true,
    order: 1,
  },
  {
    id: "t3",
    name: "Lakshay Chaudhary",
    slug: "lakshay-chaudhary",
    mainImage: "",
    profileImage: "",
    category: "YouTube",
    bio: "Entertainment and comedy content creator with millions of followers.",
    totalReach: "5M+",
    username: "@lakshaychaudhary",
    followers: "5M",
    verified: true,
    recoveryType: "Account Takeover",
    recoveryDate: "May 15, 2026",
    review: {
      quote: "Discreet, encrypted, human. My clients never even knew there was an incident.",
      rating: 5,
    },
    socials: { instagram: "#", youtube: "#", tiktok: "#" },
    clients: [],
    campaigns: [],
    socialPosts: [],
    contact: {},
    active: true,
    featured: true,
    order: 2,
  },
  {
    id: "t4",
    name: "Anubhav Golia",
    slug: "anubhav-golia",
    mainImage: "",
    profileImage: "",
    category: "YouTube",
    bio: "Technology reviewer and digital product analyst.",
    totalReach: "1.2M+",
    username: "@anubhavgolia",
    followers: "1.2M",
    verified: false,
    recoveryType: "Disabled Account",
    recoveryDate: "Jun 8, 2026",
    review: {
      quote: "Precision engineering behind every step. This is what digital recovery should look like in 2026.",
      rating: 5,
    },
    socials: { instagram: "#", youtube: "#" },
    clients: [],
    campaigns: [],
    socialPosts: [],
    contact: {},
    active: true,
    featured: false,
    order: 3,
  },
  {
    id: "t5",
    name: "Anushka Tripathi",
    slug: "anushka-tripathi",
    mainImage: "",
    profileImage: "",
    category: "Instagram",
    bio: "Travel storyteller capturing moments from around the world.",
    totalReach: "900K+",
    username: "@anushkatripathi",
    followers: "900K",
    verified: false,
    recoveryType: "Account Recovery",
    recoveryDate: "Jun 12, 2026",
    review: {
      quote: "48 hours from panic to peace. I've never seen a team move with such clarity.",
      rating: 5,
    },
    socials: { instagram: "#" },
    clients: [],
    campaigns: [],
    socialPosts: [],
    contact: {},
    active: true,
    featured: false,
    order: 4,
  },
  {
    id: "t6",
    name: "Hemant Yadav",
    slug: "hemant-yadav",
    mainImage: "",
    profileImage: "",
    category: "TikTok",
    bio: "Fitness coach and wellness advocate inspiring healthy lifestyles.",
    totalReach: "3M+",
    username: "@hemantyadav",
    followers: "3M",
    verified: true,
    recoveryType: "Impersonation",
    recoveryDate: "May 20, 2026",
    socials: { instagram: "#", youtube: "#", tiktok: "#" },
    clients: [],
    campaigns: [],
    socialPosts: [],
    contact: {},
    active: true,
    featured: true,
    order: 5,
  },
  {
    id: "t7",
    name: "Naveen Yadav",
    slug: "naveen-yadav",
    mainImage: "",
    profileImage: "",
    category: "YouTube",
    bio: "Gaming content creator and esports enthusiast.",
    totalReach: "2.1M+",
    username: "@naveenyadav",
    followers: "2.1M",
    verified: false,
    recoveryType: "Account Takeover",
    recoveryDate: "Apr 30, 2026",
    socials: { instagram: "#", youtube: "#" },
    clients: [],
    campaigns: [],
    socialPosts: [],
    contact: {},
    active: true,
    featured: false,
    order: 6,
  },
  {
    id: "t8",
    name: "Bhavika Sanadhya",
    slug: "bhavika-sanadhya",
    mainImage: "",
    profileImage: "",
    category: "Instagram",
    bio: "Fashion and beauty curator with a distinctive editorial style.",
    totalReach: "1.5M+",
    username: "@bhavikasanadhya",
    followers: "1.5M",
    verified: true,
    recoveryType: "Impersonation",
    recoveryDate: "Jun 18, 2026",
    socials: { instagram: "#" },
    clients: [],
    campaigns: [],
    socialPosts: [],
    contact: {},
    active: true,
    featured: false,
    order: 7,
  },
];

const gradients = [
  "from-amber-900/40 via-yellow-900/20 to-stone-900/60",
  "from-amber-800/30 via-orange-900/20 to-stone-900/50",
  "from-yellow-900/30 via-amber-900/30 to-stone-900/60",
  "from-orange-900/30 via-amber-800/20 to-stone-900/50",
  "from-amber-900/50 via-yellow-800/20 to-stone-900/60",
  "from-stone-900/60 via-amber-900/20 to-yellow-900/30",
  "from-amber-800/40 via-orange-900/20 to-stone-900/50",
  "from-yellow-900/40 via-amber-900/30 to-stone-900/60",
];

const rotations = [-4, -2.5, -1, 0.5, 2, 3.5, -3, 1.5, -1.8, 3, -0.5, 2.8, -3.5, 1, -2, 4];

function TalentCard({
  talent,
  rotation,
  gradient,
}: {
  talent: Talent;
  rotation: number;
  gradient: string;
}) {
  const initials = talent.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="editorial-card group relative shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-surface/80 backdrop-blur-sm"
      style={{
        transform: `rotate(${rotation}deg)`,
        width: "clamp(220px, 22vw, 300px)",
      }}
    >
      <div
        className={`aspect-[3/4] bg-gradient-to-br ${gradient} relative flex flex-col justify-end p-5`}
      >
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 40%, oklch(0.75 0.12 75 / 0.5) 0%, transparent 50%),
                                radial-gradient(circle at 70% 60%, oklch(0.55 0.15 280 / 0.3) 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Profile image or initials */}
        {talent.profileImage ? (
          <img
            src={talent.profileImage}
            alt={talent.name}
            className="absolute top-5 left-5 size-12 rounded-full border-2 border-gold/30 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <span className="absolute top-5 left-5 grid size-12 place-items-center rounded-full border-2 border-gold/30 bg-gold/[0.1] text-sm font-bold tracking-wider text-gold transition-all duration-500 group-hover:bg-gold/20 group-hover:scale-110">
            {initials}
          </span>
        )}

        {/* Category badge */}
        <span className="absolute top-5 right-5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.12em] text-white/60 uppercase backdrop-blur-sm">
          {talent.category}
        </span>

        {/* Content overlay */}
        <div className="relative z-10">
          {/* Name — large editorial style */}
          <h3 className="display text-xl leading-tight text-foreground transition-colors duration-300 group-hover:text-gold md:text-2xl">
            {talent.name}
          </h3>

          {/* Reach */}
          <p className="mt-1.5 text-[0.7rem] font-semibold tracking-[0.14em] text-gold/80 uppercase">
            {talent.totalReach} reach
          </p>

          {/* Bio — visible on hover */}
          <p className="mt-2 max-h-0 overflow-hidden text-[0.75rem] leading-relaxed text-white/60 transition-all duration-500 ease-out group-hover:max-h-20">
            {talent.bio}
          </p>

          {/* Social icons */}
          <div className="mt-3 flex items-center gap-2 border-t border-white/[0.08] pt-3">
            {talent.socials.instagram && (
              <svg viewBox="0 0 24 24" className="size-3.5 text-white/40 transition-colors group-hover:text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            )}
            {talent.socials.youtube && (
              <svg viewBox="0 0 24 24" className="size-3.5 text-white/40 transition-colors group-hover:text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
                <path d="M10.5 9.5v5l4.2-2.5-4.2-2.5Z" fill="currentColor" stroke="none" />
              </svg>
            )}
            {talent.socials.tiktok && (
              <svg viewBox="0 0 24 24" className="size-3.5 text-white/40 transition-colors group-hover:text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13.6 3v9.6a3 3 0 1 1-2.4-2.9" />
                <path d="M13.6 4.6c.5 2 2 3.4 4.2 3.6" />
              </svg>
            )}
            <span className="ml-auto text-[0.6rem] font-medium text-white/30 transition-colors group-hover:text-gold/60">
            </span>
          </div>
          </div>
        </div>
      </div>
  );
}

export function EditorialWall() {
  const siteData = useSiteData();
  const talents = useMemo(() => {
    const data = (siteData?.talents || defaultTalents)
      .filter((t) => t.active !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    if (data.length === 0) return [];
    const minCards = Math.ceil(2400 / (data.length * 250)) * 2;
    const repeats = Math.max(6, minCards);
    const result: typeof data = [];
    for (let i = 0; i < repeats; i++) result.push(...data);
    return result;
  }, [siteData]);

  const topRow = talents.filter((_, i) => i % 2 === 0);
  const bottomRow = talents.filter((_, i) => i % 2 === 1);

  return (
    <section
      id="reviews"
      className="relative overflow-hidden border-t border-white/[0.06] py-16 md:py-24"
    >
      {/* Ambient purple glow */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <span className="glow-purple absolute top-1/2 left-1/2 h-[50rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 opacity-25" />
        <span className="glow-purple absolute top-1/3 left-1/3 h-[25rem] w-[35rem] -translate-x-1/2 opacity-15" />
        <span className="glow-purple absolute bottom-1/3 right-1/3 h-[25rem] w-[35rem] opacity-15" />
      </div>

      {/* Center heading */}
      <div className="relative z-20 mb-12 text-center md:mb-16">
        <span className="eyebrow">Recovery Cases</span>
        <h2 className="display mx-auto mt-5 max-w-2xl text-[clamp(2.2rem,5vw,4rem)] leading-[1.02]">
          Recent
          <br />
          <span className="italic text-gold">Recoveries.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm text-white/40">
          Creators and public figures who trust WinsAble for social media
          account recovery and digital identity protection.
        </p>
      </div>

      {/* Card wall with edge masking */}
      <div className="editorial-wall-container relative z-10">
        {/* Left edge mask — progressive blur + fade */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-30"
          style={{
            width: "10%",
            minWidth: "50px",
            background:
              "linear-gradient(to right, oklch(0.13 0.005 260 / 0.5) 0%, oklch(0.13 0.005 260 / 0.25) 40%, transparent 100%)",
            backdropFilter: "blur(3px) saturate(0.8)",
            WebkitBackdropFilter: "blur(3px) saturate(0.8)",
          }}
        />

        {/* Right edge mask — progressive blur + fade */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-30"
          style={{
            width: "10%",
            minWidth: "50px",
            background:
              "linear-gradient(to left, oklch(0.13 0.005 260 / 0.5) 0%, oklch(0.13 0.005 260 / 0.25) 40%, transparent 100%)",
            backdropFilter: "blur(3px) saturate(0.8)",
            WebkitBackdropFilter: "blur(3px) saturate(0.8)",
          }}
        />

        {/* Top row - moves left */}
        <div className="editorial-row editorial-row-left mb-4 md:mb-6">
          <div className="editorial-track editorial-track-left">
            {topRow.map((talent, i) => (
              <TalentCard
                key={`${talent.id}-top-${i}`}
                talent={talent}
                rotation={rotations[i % rotations.length] ?? 0}
                gradient={gradients[i % gradients.length] ?? gradients[0]!}
              />
            ))}
          </div>
        </div>

        {/* Bottom row - moves right */}
        <div className="editorial-row editorial-row-right">
          <div className="editorial-track editorial-track-right">
            {bottomRow.map((talent, i) => (
              <TalentCard
                key={`${talent.id}-bottom-${i}`}
                talent={talent}
                rotation={rotations[(i + 5) % rotations.length] ?? 0}
                gradient={gradients[(i + 3) % gradients.length] ?? gradients[0]!}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="relative z-20 mt-10 text-center text-xs text-white/25">
        Recovery cases managed through the WinsAble admin panel.
      </p>
    </section>
  );
}
