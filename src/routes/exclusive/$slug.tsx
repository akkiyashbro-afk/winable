import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useSiteData, type Talent } from "@/components/winsable/useSiteData";
import { Nav } from "@/components/winsable/Nav";
import { Footer } from "@/components/winsable/Sections";

const fallbackTalents: Talent[] = [
  {
    id: "t1",
    name: "Harsh Babbar",
    slug: "harsh-babbar",
    mainImage: "",
    profileImage: "",
    category: "Content Creator",
    bio: "Digital content creator and social media strategist with a passion for storytelling. Known for authentic content that resonates with millions across platforms.",
    totalReach: "2.5M+",
    socials: { instagram: "https://instagram.com/harshbabbar", youtube: "https://youtube.com/@harshbabbar" },
    clients: [
      { id: "c1", name: "Brand Alpha", logo: "", order: 0 },
      { id: "c2", name: "Tech Corp", logo: "", order: 1 },
    ],
    campaigns: [
      { id: "cp1", title: "Summer Launch 2026", brand: "Brand Alpha", image: "", description: "A comprehensive summer campaign reaching 2M+ audiences.", link: "#", order: 0 },
    ],
    socialPosts: [
      { id: "sp1", platform: "Instagram", url: "#", thumbnail: "", title: "Latest campaign reel", metrics: "150K views", order: 0 },
    ],
    contact: { whatsapp: "+91 98765 43210", email: "harsh@winsable.com", ctaText: "Get in touch for collaborations" },
    active: true,
    featured: true,
    order: 0,
  },
];

export const Route = createFileRoute("/exclusive/$slug")({
  component: TalentProfile,
});

function TalentProfile() {
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
            Talent profile not found.
          </h1>
          <Link
            to="/"
            hash="reviews"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-6 py-3 text-sm font-semibold text-gold transition-all hover:bg-gold/20"
          >
            ← Back to Talent Wall
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
        {/* Hero Header */}
        <section className="relative overflow-hidden border-b border-white/[0.06] py-16 md:py-24">
          {/* Ambient glow */}
          <span className="glow-purple absolute top-0 left-1/2 h-[30rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-20" />

          <div className="shell relative z-10">
            <Link
              to="/"
              hash="reviews"
              className="mb-8 inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-gold"
            >
              ← Back to Talent Wall
            </Link>

            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Profile image */}
              <div className="lg:col-span-4">
                <div className="relative mx-auto max-w-xs lg:mx-0">
                  {talent.profileImage ? (
                    <img
                      src={talent.profileImage}
                      alt={talent.name}
                      className="aspect-[3/4] w-full rounded-2xl object-cover border border-white/[0.08]"
                    />
                  ) : (
                    <div className="editorial-card aspect-[3/4] w-full rounded-2xl border border-white/[0.08] bg-gradient-to-br from-amber-900/40 via-yellow-900/20 to-stone-900/60 flex flex-col items-center justify-center p-8">
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
              </div>

              {/* Info */}
              <div className="lg:col-span-8">
                <span className="eyebrow">{talent.category}</span>
                <h1 className="display mt-4 text-[clamp(2.5rem,6vw,5rem)] leading-[0.95]">
                  {talent.name}
                </h1>
                <p className="mt-4 text-lg text-white/50">{talent.bio}</p>

                {/* Reach */}
                <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-gold/20 bg-gold/[0.06] px-5 py-2.5">
                  <span className="text-xs font-semibold tracking-[0.16em] text-white/40 uppercase">
                    Total Reach
                  </span>
                  <span className="text-lg font-bold text-gold">{talent.totalReach}</span>
                </div>

                {/* Social links */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {talent.socials.instagram && (
                    <a
                      href={talent.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/60 transition-all hover:border-gold/30 hover:text-gold"
                    >
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                      Instagram
                    </a>
                  )}
                  {talent.socials.youtube && (
                    <a
                      href={talent.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/60 transition-all hover:border-gold/30 hover:text-gold"
                    >
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
                        <path d="M10.5 9.5v5l4.2-2.5-4.2-2.5Z" fill="currentColor" stroke="none" />
                      </svg>
                      YouTube
                    </a>
                  )}
                  {talent.socials.tiktok && (
                    <a
                      href={talent.socials.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/60 transition-all hover:border-gold/30 hover:text-gold"
                    >
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M13.6 3v9.6a3 3 0 1 1-2.4-2.9" />
                        <path d="M13.6 4.6c.5 2 2 3.4 4.2 3.6" />
                      </svg>
                      TikTok
                    </a>
                  )}
                  {talent.socials.facebook && (
                    <a
                      href={talent.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/60 transition-all hover:border-gold/30 hover:text-gold"
                    >
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14.5 8.5h2.2V5.4h-2.4c-2.2 0-3.6 1.4-3.6 3.7v1.6H8.4v3.1h2.3V21h3.2v-7.2h2.4l.4-3.1h-2.8V9.5c0-.7.3-1 1.2-1Z" />
                      </svg>
                      Facebook
                    </a>
                  )}
                  {talent.socials.x && (
                    <a
                      href={talent.socials.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/60 transition-all hover:border-gold/30 hover:text-gold"
                    >
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 4l7.2 8.4L4.5 20" />
                        <path d="M20 4l-7 8.4L19.5 20" />
                      </svg>
                      X
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clients */}
        {talent.clients.length > 0 && (
          <section className="border-b border-white/[0.06] bg-surface/20 py-16 md:py-20">
            <div className="shell">
              <p className="eyebrow">Clients</p>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {talent.clients
                  .sort((a, b) => a.order - b.order)
                  .map((client) => (
                    <div
                      key={client.id}
                      className="editorial-card flex items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center"
                    >
                      {client.logo ? (
                        <img src={client.logo} alt={client.name} className="max-h-12 object-contain" />
                      ) : (
                        <span className="text-sm font-medium text-white/60">{client.name}</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Campaigns */}
        {talent.campaigns.length > 0 && (
          <section className="border-b border-white/[0.06] py-16 md:py-20">
            <div className="shell">
              <p className="eyebrow">Brand Partnerships & Campaigns</p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {talent.campaigns
                  .sort((a, b) => a.order - b.order)
                  .map((campaign) => (
                    <div
                      key={campaign.id}
                      className="editorial-card group overflow-hidden rounded-xl border border-white/[0.06] bg-surface/50"
                    >
                      {campaign.image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={campaign.image}
                            alt={campaign.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <span className="text-[0.65rem] font-semibold tracking-[0.16em] text-gold uppercase">
                          {campaign.brand}
                        </span>
                        <h3 className="display mt-2 text-xl">{campaign.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/50">
                          {campaign.description}
                        </p>
                        {campaign.link && (
                          <a
                            href={campaign.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold/70 transition-colors hover:text-gold"
                          >
                            View Campaign →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Social Posts */}
        {talent.socialPosts.length > 0 && (
          <section className="border-b border-white/[0.06] bg-surface/20 py-16 md:py-20">
            <div className="shell">
              <p className="eyebrow">Content Showcase</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {talent.socialPosts
                  .sort((a, b) => a.order - b.order)
                  .map((post) => (
                    <a
                      key={post.id}
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-card group overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-30px_oklch(0.75_0.12_75/0.2)]"
                    >
                      {post.thumbnail && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2">
                          <span className="text-[0.6rem] font-semibold tracking-[0.16em] text-white/40 uppercase">
                            {post.platform}
                          </span>
                          {post.metrics && (
                            <>
                              <span className="text-white/20">·</span>
                              <span className="text-[0.6rem] text-gold/60">{post.metrics}</span>
                            </>
                          )}
                        </div>
                        <p className="mt-2 text-sm font-medium text-foreground">{post.title}</p>
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact */}
        <section className="py-16 md:py-20">
          <div className="shell">
            <div className="mx-auto max-w-lg text-center">
              <p className="eyebrow">Contact</p>
              <h2 className="display mt-6 text-[clamp(2rem,4vw,3rem)]">
                Get in Touch
              </h2>
              {talent.contact.ctaText && (
                <p className="mt-4 text-white/50">{talent.contact.ctaText}</p>
              )}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {talent.contact.whatsapp && (
                  <a
                    href={`https://wa.me/${talent.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-5 py-3 text-sm font-medium text-green-400 transition-all hover:bg-green-500/20"
                  >
                    WhatsApp
                  </a>
                )}
                {talent.contact.phone && (
                  <a
                    href={`tel:${talent.contact.phone}`}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/60 transition-all hover:text-gold"
                  >
                    {talent.contact.phone}
                  </a>
                )}
                {talent.contact.email && (
                  <a
                    href={`mailto:${talent.contact.email}`}
                    className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-3 text-sm font-semibold text-gold transition-all hover:bg-gold/20"
                  >
                    {talent.contact.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
