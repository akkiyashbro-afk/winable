import { useMemo, useState, useEffect } from "react";
import {
  recoveredProfiles as fallbackProfiles,
  type RecoveredProfile,
} from "./recoveredProfiles";
import { getPublicRecoveriesFn } from "./recoveries";

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
  profile,
  rotation,
  gradient,
}: {
  profile: RecoveredProfile;
  rotation: number;
  gradient: string;
}) {
  const displayName = profile.name || profile.username;

  return (
    <div
      className="corner-marks editorial-card group relative shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-surface/80 backdrop-blur-sm"
      style={{
        transform: `rotate(${rotation}deg)`,
        width: "clamp(220px, 22vw, 300px)",
      }}
    >
      <div className={`aspect-[3/4] relative flex flex-col justify-end`}>
        {/* Full-card profile image */}
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={displayName}
            className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Category badge */}
        <span className="absolute top-4 right-4 z-20 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.12em] text-white/70 uppercase backdrop-blur-sm">
          {profile.platform}
        </span>

        {/* Content overlay */}
        <div className="relative z-10 p-5">
          {/* Name */}
          <h3 className="display text-xl leading-tight text-white transition-colors duration-300 group-hover:text-gold md:text-2xl">
            {displayName}
          </h3>

          {/* Followers */}
          <p className="mt-1.5 text-[0.7rem] font-semibold tracking-[0.14em] text-gold/80 uppercase">
            {profile.followers} followers
          </p>

          {/* Recovery type — visible on hover */}
          <p className="mt-2 max-h-0 overflow-hidden text-[0.75rem] leading-relaxed text-white/60 transition-all duration-500 ease-out group-hover:max-h-20">
            {profile.recoveryType}
          </p>

          {/* Social icon */}
          <div className="mt-3 flex items-center gap-2 border-t border-white/[0.08] pt-3">
            <svg viewBox="0 0 24 24" className="size-3.5 text-white/40 transition-colors group-hover:text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            <span className="ml-auto text-[0.6rem] font-medium text-white/30 transition-colors group-hover:text-gold/60">
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditorialWall() {
  const [dbProfiles, setDbProfiles] = useState<RecoveredProfile[]>([]);

  useEffect(() => {
    getPublicRecoveriesFn()
      .then((result) => {
        if (result.ok && result.recoveries.length > 0) {
          setDbProfiles(
            result.recoveries.map((r: any) => ({
              id: r._id || r.username,
              name: r.name,
              role: r.role,
              username: r.username,
              platform: r.platform,
              followers: r.followers,
              verified: r.verified,
              avatar: r.avatar,
              recoveryType: r.recoveryType,
              recoveryDate: r.recoveryDate,
              popupId: r.popupId,
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  const profiles = useMemo(() => {
    const data = dbProfiles.length > 0 ? dbProfiles : fallbackProfiles;
    if (data.length === 0) return [];
    const minCards = Math.ceil(2400 / (data.length * 250)) * 2;
    const repeats = Math.max(6, minCards);
    const result: RecoveredProfile[] = [];
    for (let i = 0; i < repeats; i++) result.push(...data);
    return result;
  }, [dbProfiles]);

  const topRow = profiles.filter((_, i) => i % 2 === 0);
  const bottomRow = profiles.filter((_, i) => i % 2 === 1);

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
            {topRow.map((profile, i) => (
              <TalentCard
                key={`${profile.id}-top-${i}`}
                profile={profile}
                rotation={rotations[i % rotations.length] ?? 0}
                gradient={gradients[i % gradients.length] ?? gradients[0]!}
              />
            ))}
          </div>
        </div>

        {/* Bottom row - moves right */}
        <div className="editorial-row editorial-row-right">
          <div className="editorial-track editorial-track-right">
            {bottomRow.map((profile, i) => (
              <TalentCard
                key={`${profile.id}-bottom-${i}`}
                profile={profile}
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
