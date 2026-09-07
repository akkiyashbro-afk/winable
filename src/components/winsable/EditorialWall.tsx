import { useMemo, useState, useCallback } from "react";
import { useSiteData, type Talent } from "./useSiteData";

const defaultTalents: Talent[] = [
  {
    id: "t1",
    name: "Harsh Babbar",
    slug: "harsh-babbar",
    mainImage: "",
    profileImage: "",
    category: "Content Creator",
    bio: "Digital content creator and social media strategist with a passion for storytelling.",
    totalReach: "2.5M+",
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
    category: "Lifestyle Creator",
    bio: "Lifestyle and fashion content creator with an eye for aesthetics.",
    totalReach: "1.8M+",
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
    category: "Entertainment Creator",
    bio: "Entertainment and comedy content creator with millions of followers.",
    totalReach: "5M+",
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
    category: "Tech Creator",
    bio: "Technology reviewer and digital product analyst.",
    totalReach: "1.2M+",
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
    category: "Travel Creator",
    bio: "Travel storyteller capturing moments from around the world.",
    totalReach: "900K+",
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
    category: "Fitness Creator",
    bio: "Fitness coach and wellness advocate inspiring healthy lifestyles.",
    totalReach: "3M+",
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
    category: "Gaming Creator",
    bio: "Gaming content creator and esports enthusiast.",
    totalReach: "2.1M+",
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
    category: "Fashion Creator",
    bio: "Fashion and beauty curator with a distinctive editorial style.",
    totalReach: "1.5M+",
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

const INITIAL_COUNT = 8;
const LOAD_MORE_COUNT = 4;

function TalentCard({
  talent,
  rotation,
  gradient,
  index,
  isNew,
}: {
  talent: Talent;
  rotation: number;
  gradient: string;
  index: number;
  isNew?: boolean;
}) {
  const initials = talent.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <a
      href={`/recovery/${talent.slug}`}
      className={`editorial-card group relative overflow-hidden rounded-xl border border-white/[0.08] bg-surface/80 backdrop-blur-sm wall-card ${isNew ? "wall-card-new" : ""}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        animationDelay: isNew ? `${(index % LOAD_MORE_COUNT) * 80}ms` : `${index * 60}ms`,
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
          <h3 className="display text-xl leading-tight text-foreground transition-colors duration-300 group-hover:text-gold md:text-2xl">
            {talent.name}
          </h3>

          <p className="mt-1.5 text-[0.7rem] font-semibold tracking-[0.14em] text-gold/80 uppercase">
            {talent.totalReach} reach
          </p>

          <p className="mt-2 max-h-0 overflow-hidden text-[0.75rem] leading-relaxed text-white/60 transition-all duration-500 ease-out group-hover:max-h-20">
            {talent.bio}
          </p>

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
              View Case →
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

function LoadMoreCard({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="editorial-card group relative overflow-hidden rounded-xl border border-gold/20 bg-surface/80 backdrop-blur-sm wall-card wall-card-load-more"
      style={{ aspectRatio: "3/4" }}
    >
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        {loading ? (
          <span className="size-6 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        ) : (
          <>
            <span className="grid size-14 place-items-center rounded-full border border-gold/20 bg-gold/[0.08] transition-all duration-300 group-hover:scale-110 group-hover:bg-gold/[0.15]">
              <svg viewBox="0 0 24 24" className="size-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <span className="mt-4 text-sm font-medium text-white/50 transition-colors group-hover:text-gold">
              Load More
            </span>
          </>
        )}
      </div>
    </button>
  );
}

export function EditorialWall() {
  const siteData = useSiteData();
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [loading, setLoading] = useState(false);
  const [newBatchStart, setNewBatchStart] = useState(-1);

  const allTalents = useMemo(() => {
    return (siteData?.talents || defaultTalents)
      .filter((t) => t.active !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [siteData]);

  const visibleTalents = useMemo(() => allTalents.slice(0, visibleCount), [allTalents, visibleCount]);
  const hasMore = visibleCount < allTalents.length;

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    const prevCount = visibleCount;
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + LOAD_MORE_COUNT, allTalents.length));
      setNewBatchStart(prevCount);
      setLoading(false);
      setTimeout(() => setNewBatchStart(-1), 800);
    }, 400);
  }, [loading, hasMore, visibleCount, allTalents.length]);

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

      {/* Card grid with edge masking */}
      <div className="wall-grid-container relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        {/* Left edge mask */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-30"
          style={{
            width: "8%",
            minWidth: "40px",
            background: "linear-gradient(to right, oklch(0.13 0.005 260 / 0.5) 0%, oklch(0.13 0.005 260 / 0.2) 40%, transparent 100%)",
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
          }}
        />

        {/* Right edge mask */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-30"
          style={{
            width: "8%",
            minWidth: "40px",
            background: "linear-gradient(to left, oklch(0.13 0.005 260 / 0.5) 0%, oklch(0.13 0.005 260 / 0.2) 40%, transparent 100%)",
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
          }}
        />

        {/* Responsive grid */}
        <div className="wall-grid">
          {visibleTalents.map((talent, i) => (
            <TalentCard
              key={talent.id}
              talent={talent}
              rotation={rotations[i % rotations.length] ?? 0}
              gradient={gradients[i % gradients.length] ?? gradients[0]!}
              index={i}
              isNew={newBatchStart >= 0 && i >= newBatchStart}
            />
          ))}

          {/* Load More card */}
          {hasMore && (
            <LoadMoreCard onClick={loadMore} loading={loading} />
          )}
        </div>
      </div>

      <p className="relative z-20 mt-10 text-center text-xs text-white/25">
        Recovery cases managed through the WinsAble admin panel.
      </p>
    </section>
  );
}
