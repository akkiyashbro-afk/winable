import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
});

const STORAGE_KEY = "winsable-site-data";
const PASSWORD_KEY = "winsable-admin-auth";
const DEFAULT_PASSWORD = "winsable2026";

interface Review {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  order: number;
  featured: boolean;
  enabled: boolean;
}

interface Service {
  id: string;
  n: string;
  title: string;
  icon: string;
  body: string;
  tags: string[];
  enabled: boolean;
}

interface TalentClient {
  id: string;
  name: string;
  logo: string;
  order: number;
}

interface TalentCampaign {
  id: string;
  title: string;
  brand: string;
  image: string;
  description: string;
  link: string;
  order: number;
}

interface TalentSocialPost {
  id: string;
  platform: string;
  url: string;
  thumbnail: string;
  title: string;
  metrics: string;
  order: number;
}

interface Talent {
  id: string;
  name: string;
  slug: string;
  mainImage: string;
  profileImage: string;
  category: string;
  bio: string;
  totalReach: string;
  socials: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    facebook?: string;
    x?: string;
    other?: string;
  };
  clients: TalentClient[];
  campaigns: TalentCampaign[];
  socialPosts: TalentSocialPost[];
  contact: {
    whatsapp?: string;
    phone?: string;
    email?: string;
    ctaText?: string;
  };
  active: boolean;
  featured: boolean;
  order: number;
}

interface SiteData {
  reviews: Review[];
  services: Service[];
  talents: Talent[];
  content: Record<string, string>;
  settings: { adminPassword: string; siteName: string; tagline: string };
}

async function loadSiteData(): Promise<SiteData> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    parsed.reviews = (parsed.reviews || []).map((r: Review, i: number) => ({
      ...r,
      avatar: r.avatar || "",
      rating: r.rating || 5,
      order: r.order ?? i,
    }));
    parsed.talents = (parsed.talents || []).map((t: Talent, i: number) => ({
      ...t,
      mainImage: t.mainImage || "",
      profileImage: t.profileImage || "",
      bio: t.bio || "",
      totalReach: t.totalReach || "",
      socials: t.socials || {},
      clients: t.clients || [],
      campaigns: t.campaigns || [],
      socialPosts: t.socialPosts || [],
      contact: t.contact || {},
      active: t.active !== false,
      featured: t.featured || false,
      order: t.order ?? i,
    }));
    return parsed;
  }
  const res = await fetch("/site-data.json");
  const data = await res.json();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function saveSiteData(data: SiteData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [correctPassword, setCorrectPassword] = useState(DEFAULT_PASSWORD);

  useEffect(() => {
    loadSiteData().then((data) => {
      setCorrectPassword(data.settings.adminPassword || DEFAULT_PASSWORD);
      setLoading(false);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      sessionStorage.setItem(PASSWORD_KEY, "1");
      onLogin();
    } else {
      setError("Wrong password");
      setPassword("");
    }
  };

  if (loading) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img
            src="/logo-symbol.jpg"
            alt="WinsAble"
            className="mx-auto mb-4 h-16 w-16 rounded-lg"
          />
          <h1 className="display text-2xl">Admin Panel</h1>
          <p className="mt-2 text-sm text-white/40">Enter password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-foreground placeholder:text-white/30 focus:border-gold/50 focus:outline-none"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-gold py-3 font-semibold text-background transition-colors hover:bg-gold-dim"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-white/20">Default password: winsable2026</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [data, setData] = useState<SiteData | null>(null);
  const [tab, setTab] = useState<"reviews" | "services" | "talents" | "content">("reviews");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingTalent, setEditingTalent] = useState<Talent | null>(null);
  const [newTalent, setNewTalent] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saved, setSaved] = useState(false);
  const [newReview, setNewReview] = useState(false);
  const [newService, setNewService] = useState(false);

  useEffect(() => {
    loadSiteData().then(setData);
  }, []);

  const save = useCallback((newData: SiteData) => {
    setData(newData);
    saveSiteData(newData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(PASSWORD_KEY);
    window.location.reload();
  };

  const moveReview = (index: number, direction: "up" | "down") => {
    const reviews = [...data!.reviews];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= reviews.length) return;
    const a = reviews[index]!;
    const b = reviews[targetIndex]!;
    reviews[index] = b;
    reviews[targetIndex] = a;
    const reordered = reviews.map((r, i) => ({ ...r, order: i }));
    save({ ...data!, reviews: reordered });
  };

  if (!data)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="shell flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-symbol.jpg" alt="" className="h-8 w-8 rounded-sm" />
            <span className="display text-lg">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            {saved && <span className="text-sm text-gold">Saved!</span>}
            <a href="/" className="text-sm text-white/40 hover:text-foreground">
              View Site
            </a>
            <button onClick={handleLogout} className="text-sm text-white/40 hover:text-red-400">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/[0.06]">
        <div className="shell flex gap-1 py-2">
          {(["reviews", "services", "talents", "content"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setEditingReview(null);
                setEditingService(null);
                setEditingTalent(null);
                setNewTalent(false);
                setEditingKey(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-gold/10 text-gold" : "text-white/40 hover:text-white/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="shell py-8">
        {/* ---- REVIEWS TAB ---- */}
        {tab === "reviews" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="display text-2xl">Reviews ({data.reviews.length})</h2>
              <button
                onClick={() => {
                  setNewReview(true);
                  setEditingReview({
                    id: `r${Date.now()}`,
                    quote: "",
                    name: "",
                    role: "",
                    avatar: "",
                    rating: 5,
                    order: data.reviews.length,
                    featured: false,
                    enabled: true,
                  });
                }}
                className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background hover:bg-gold-dim"
              >
                + Add Review
              </button>
            </div>

            {/* Edit form */}
            {editingReview && (newReview || editingReview) && (
              <div className="mb-8 rounded-xl border border-gold/20 bg-surface p-6">
                <h3 className="mb-4 text-sm font-semibold text-gold">
                  {newReview ? "New Review" : "Edit Review"}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Name</label>
                    <input
                      value={editingReview.name}
                      onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Role</label>
                    <input
                      value={editingReview.role}
                      onChange={(e) => setEditingReview({ ...editingReview, role: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="mb-1 block text-xs text-white/40">Photo URL (optional)</label>
                  <input
                    value={editingReview.avatar || ""}
                    onChange={(e) => setEditingReview({ ...editingReview, avatar: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                  />
                  {editingReview.avatar && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={editingReview.avatar}
                        alt="Preview"
                        className="size-8 rounded-full object-cover"
                      />
                      <span className="text-xs text-white/30">Preview</span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label className="mb-1 block text-xs text-white/40">Quote</label>
                  <textarea
                    value={editingReview.quote}
                    onChange={(e) => setEditingReview({ ...editingReview, quote: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <div className="mt-4">
                  <label className="mb-1 block text-xs text-white/40">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditingReview({ ...editingReview, rating: star })}
                        className="text-gold"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className={`size-5 fill-current ${star <= editingReview.rating ? "opacity-100" : "opacity-20"}`}
                        >
                          <path d="M10 1.6l2.5 5.3 5.6.8-4 4 1 5.7L10 14.7 4.9 17.4l1-5.7-4-4 5.6-.8z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingReview.featured}
                      onChange={(e) =>
                        setEditingReview({ ...editingReview, featured: e.target.checked })
                      }
                      className="accent-gold"
                    />
                    Featured (larger card)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingReview.enabled}
                      onChange={(e) =>
                        setEditingReview({ ...editingReview, enabled: e.target.checked })
                      }
                      className="accent-gold"
                    />
                    Enabled
                  </label>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      const reviews = newReview
                        ? [...data.reviews, editingReview!]
                        : data.reviews.map((r) =>
                            r.id === editingReview!.id ? editingReview! : r,
                          );
                      save({ ...data, reviews });
                      setEditingReview(null);
                      setNewReview(false);
                    }}
                    className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background hover:bg-gold-dim"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingReview(null);
                      setNewReview(false);
                    }}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Reviews list */}
            <div className="space-y-2">
              {data.reviews.map((r, index) => (
                <div
                  key={r.id}
                  className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
                    r.enabled
                      ? "border-white/[0.06] bg-surface/50"
                      : "border-white/[0.03] bg-surface/20 opacity-50"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveReview(index, "up")}
                      disabled={index === 0}
                      className="rounded px-1 py-0.5 text-xs text-white/30 hover:bg-white/5 hover:text-foreground disabled:opacity-20"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveReview(index, "down")}
                      disabled={index === data.reviews.length - 1}
                      className="rounded px-1 py-0.5 text-xs text-white/30 hover:bg-white/5 hover:text-foreground disabled:opacity-20"
                    >
                      ▼
                    </button>
                  </div>
                  {r.avatar ? (
                    <img
                      src={r.avatar}
                      alt={r.name}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="grid size-10 place-items-center rounded-full border border-gold/20 bg-gold/[0.06] text-xs font-bold text-gold">
                      {r.name.replace(/[^A-Z]/g, "").slice(0, 2)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{r.name}</span>
                      <span className="text-xs text-white/30">{r.role}</span>
                      <span className="text-gold text-xs">{"★".repeat(r.rating)}</span>
                      {r.featured && (
                        <span className="rounded bg-gold/10 px-1.5 py-0.5 text-[10px] text-gold">
                          FEATURED
                        </span>
                      )}
                      {!r.enabled && (
                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/30">
                          DISABLED
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-white/50 line-clamp-2">{r.quote}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingReview(r);
                        setNewReview(false);
                      }}
                      className="rounded px-2 py-1 text-xs text-white/40 hover:bg-white/5 hover:text-foreground"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        save({ ...data, reviews: data.reviews.filter((x) => x.id !== r.id) });
                      }}
                      className="rounded px-2 py-1 text-xs text-red-400/60 hover:bg-red-400/10 hover:text-red-400"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        save({
                          ...data,
                          reviews: data.reviews.map((x) =>
                            x.id === r.id ? { ...x, enabled: !x.enabled } : x,
                          ),
                        });
                      }}
                      className="rounded px-2 py-1 text-xs text-white/40 hover:bg-white/5 hover:text-foreground"
                    >
                      {r.enabled ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- SERVICES TAB ---- */}
        {tab === "services" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="display text-2xl">Services ({data.services.length})</h2>
              <button
                onClick={() => {
                  setNewService(true);
                  setEditingService({
                    id: `s${Date.now()}`,
                    n: String(data.services.length + 1).padStart(2, "0"),
                    title: "",
                    icon: "support",
                    body: "",
                    tags: [],
                    enabled: true,
                  });
                }}
                className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background hover:bg-gold-dim"
              >
                + Add Service
              </button>
            </div>

            {editingService && (newService || editingService) && (
              <div className="mb-8 rounded-xl border border-gold/20 bg-surface p-6">
                <h3 className="mb-4 text-sm font-semibold text-gold">
                  {newService ? "New Service" : "Edit Service"}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Title</label>
                    <input
                      value={editingService.title}
                      onChange={(e) =>
                        setEditingService({ ...editingService, title: e.target.value })
                      }
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Icon</label>
                    <select
                      value={editingService.icon}
                      onChange={(e) =>
                        setEditingService({ ...editingService, icon: e.target.value })
                      }
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    >
                      {[
                        "recovery",
                        "disabled",
                        "impersonation",
                        "copyright",
                        "hacked",
                        "support",
                      ].map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="mb-1 block text-xs text-white/40">Description</label>
                  <textarea
                    value={editingService.body}
                    onChange={(e) => setEditingService({ ...editingService, body: e.target.value })}
                    rows={2}
                    className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <div className="mt-4">
                  <label className="mb-1 block text-xs text-white/40">Tags (comma separated)</label>
                  <input
                    value={editingService.tags.join(", ")}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        tags: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingService.enabled}
                      onChange={(e) =>
                        setEditingService({ ...editingService, enabled: e.target.checked })
                      }
                      className="accent-gold"
                    />
                    Enabled
                  </label>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      const services = newService
                        ? [...data.services, editingService!]
                        : data.services.map((s) =>
                            s.id === editingService!.id ? editingService! : s,
                          );
                      save({ ...data, services });
                      setEditingService(null);
                      setNewService(false);
                    }}
                    className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background hover:bg-gold-dim"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingService(null);
                      setNewService(false);
                    }}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {data.services.map((s) => (
                <div
                  key={s.id}
                  className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
                    s.enabled
                      ? "border-white/[0.06] bg-surface/50"
                      : "border-white/[0.03] bg-surface/20 opacity-50"
                  }`}
                >
                  <span className="text-xs font-bold text-gold">{s.n}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{s.title}</div>
                    <p className="mt-1 text-sm text-white/50">{s.body}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingService(s);
                        setNewService(false);
                      }}
                      className="rounded px-2 py-1 text-xs text-white/40 hover:bg-white/5 hover:text-foreground"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        save({ ...data, services: data.services.filter((x) => x.id !== s.id) });
                      }}
                      className="rounded px-2 py-1 text-xs text-red-400/60 hover:bg-red-400/10 hover:text-red-400"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        save({
                          ...data,
                          services: data.services.map((x) =>
                            x.id === s.id ? { ...x, enabled: !x.enabled } : x,
                          ),
                        });
                      }}
                      className="rounded px-2 py-1 text-xs text-white/40 hover:bg-white/5 hover:text-foreground"
                    >
                      {s.enabled ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- TALENTS TAB ---- */}
        {tab === "talents" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="display text-2xl">Talents ({(data.talents || []).length})</h2>
              <button
                onClick={() => {
                  setNewTalent(true);
                  setEditingTalent({
                    id: `t${Date.now()}`,
                    name: "",
                    slug: "",
                    mainImage: "",
                    profileImage: "",
                    category: "",
                    bio: "",
                    totalReach: "",
                    socials: {},
                    clients: [],
                    campaigns: [],
                    socialPosts: [],
                    contact: {},
                    active: true,
                    featured: false,
                    order: (data.talents || []).length,
                  });
                }}
                className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background hover:bg-gold-dim"
              >
                + Add Talent
              </button>
            </div>

            {editingTalent && (newTalent || editingTalent) && (
              <div className="mb-8 rounded-xl border border-gold/20 bg-surface p-6">
                <h3 className="mb-4 text-sm font-semibold text-gold">
                  {newTalent ? "New Talent" : "Edit Talent"}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Name *</label>
                    <input
                      value={editingTalent.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, "");
                        setEditingTalent({ ...editingTalent, name, slug });
                      }}
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Slug</label>
                    <input
                      value={editingTalent.slug}
                      onChange={(e) => setEditingTalent({ ...editingTalent, slug: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Category</label>
                    <input
                      value={editingTalent.category}
                      onChange={(e) => setEditingTalent({ ...editingTalent, category: e.target.value })}
                      placeholder="e.g. Content Creator"
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Total Reach</label>
                    <input
                      value={editingTalent.totalReach}
                      onChange={(e) => setEditingTalent({ ...editingTalent, totalReach: e.target.value })}
                      placeholder="e.g. 2.5M+"
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="mb-1 block text-xs text-white/40">Bio</label>
                  <textarea
                    value={editingTalent.bio}
                    onChange={(e) => setEditingTalent({ ...editingTalent, bio: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Profile Image URL</label>
                    <input
                      value={editingTalent.profileImage}
                      onChange={(e) => setEditingTalent({ ...editingTalent, profileImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Main Image URL</label>
                    <input
                      value={editingTalent.mainImage}
                      onChange={(e) => setEditingTalent({ ...editingTalent, mainImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Socials */}
                <h4 className="mt-6 mb-3 text-xs font-semibold tracking-wider text-gold uppercase">Socials</h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(["instagram", "youtube", "tiktok", "facebook", "x", "other"] as const).map((platform) => (
                    <div key={platform}>
                      <label className="mb-1 block text-xs text-white/40 capitalize">{platform}</label>
                      <input
                        value={editingTalent.socials[platform] || ""}
                        onChange={(e) =>
                          setEditingTalent({
                            ...editingTalent,
                            socials: { ...editingTalent.socials, [platform]: e.target.value },
                          })
                        }
                        placeholder={`https://${platform}.com/...`}
                        className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Contact */}
                <h4 className="mt-6 mb-3 text-xs font-semibold tracking-wider text-gold uppercase">Contact</h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-xs text-white/40">WhatsApp</label>
                    <input
                      value={editingTalent.contact.whatsapp || ""}
                      onChange={(e) =>
                        setEditingTalent({
                          ...editingTalent,
                          contact: { ...editingTalent.contact, whatsapp: e.target.value },
                        })
                      }
                      placeholder="+91 98765 43210"
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Phone</label>
                    <input
                      value={editingTalent.contact.phone || ""}
                      onChange={(e) =>
                        setEditingTalent({
                          ...editingTalent,
                          contact: { ...editingTalent.contact, phone: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Email</label>
                    <input
                      value={editingTalent.contact.email || ""}
                      onChange={(e) =>
                        setEditingTalent({
                          ...editingTalent,
                          contact: { ...editingTalent.contact, email: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">CTA Text</label>
                    <input
                      value={editingTalent.contact.ctaText || ""}
                      onChange={(e) =>
                        setEditingTalent({
                          ...editingTalent,
                          contact: { ...editingTalent.contact, ctaText: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Display */}
                <div className="mt-6 flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingTalent.active}
                      onChange={(e) => setEditingTalent({ ...editingTalent, active: e.target.checked })}
                      className="accent-gold"
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingTalent.featured}
                      onChange={(e) => setEditingTalent({ ...editingTalent, featured: e.target.checked })}
                      className="accent-gold"
                    />
                    Featured
                  </label>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => {
                      const talents = newTalent
                        ? [...(data.talents || []), editingTalent!]
                        : (data.talents || []).map((t) =>
                            t.id === editingTalent!.id ? editingTalent! : t,
                          );
                      save({ ...data, talents });
                      setEditingTalent(null);
                      setNewTalent(false);
                    }}
                    className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-background hover:bg-gold-dim"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingTalent(null);
                      setNewTalent(false);
                    }}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {(data.talents || []).map((t, index) => (
                <div
                  key={t.id}
                  className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
                    t.active
                      ? "border-white/[0.06] bg-surface/50"
                      : "border-white/[0.03] bg-surface/20 opacity-50"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        const talents = [...(data.talents || [])];
                        const targetIndex = index - 1;
                        if (targetIndex < 0) return;
                        const a = talents[index]!;
                        const b = talents[targetIndex]!;
                        talents[index] = b;
                        talents[targetIndex] = a;
                        save({ ...data, talents: talents.map((t, i) => ({ ...t, order: i })) });
                      }}
                      disabled={index === 0}
                      className="rounded px-1 py-0.5 text-xs text-white/30 hover:bg-white/5 hover:text-foreground disabled:opacity-20"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => {
                        const talents = [...(data.talents || [])];
                        const targetIndex = index + 1;
                        if (targetIndex >= talents.length) return;
                        const a = talents[index]!;
                        const b = talents[targetIndex]!;
                        talents[index] = b;
                        talents[targetIndex] = a;
                        save({ ...data, talents: talents.map((t, i) => ({ ...t, order: i })) });
                      }}
                      disabled={index === (data.talents || []).length - 1}
                      className="rounded px-1 py-0.5 text-xs text-white/30 hover:bg-white/5 hover:text-foreground disabled:opacity-20"
                    >
                      ▼
                    </button>
                  </div>
                  <div className="grid size-10 place-items-center rounded-full border border-gold/20 bg-gold/[0.06] text-xs font-bold text-gold">
                    {t.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{t.name}</span>
                      <span className="text-xs text-white/30">/{t.slug}</span>
                      {t.category && (
                        <span className="rounded bg-gold/10 px-1.5 py-0.5 text-[10px] text-gold">
                          {t.category}
                        </span>
                      )}
                      {t.featured && (
                        <span className="rounded bg-gold/10 px-1.5 py-0.5 text-[10px] text-gold">
                          FEATURED
                        </span>
                      )}
                      {!t.active && (
                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/30">
                          INACTIVE
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-white/50 line-clamp-1">{t.bio}</p>
                    {t.totalReach && (
                      <p className="mt-1 text-xs text-gold/60">Reach: {t.totalReach}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <a
                      href={`/exclusive/${t.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded px-2 py-1 text-xs text-white/40 hover:bg-white/5 hover:text-foreground"
                    >
                      View
                    </a>
                    <button
                      onClick={() => {
                        setEditingTalent(t);
                        setNewTalent(false);
                      }}
                      className="rounded px-2 py-1 text-xs text-white/40 hover:bg-white/5 hover:text-foreground"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        save({ ...data, talents: (data.talents || []).filter((x) => x.id !== t.id) });
                      }}
                      className="rounded px-2 py-1 text-xs text-red-400/60 hover:bg-red-400/10 hover:text-red-400"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        save({
                          ...data,
                          talents: (data.talents || []).map((x) =>
                            x.id === t.id ? { ...x, active: !x.active } : x,
                          ),
                        });
                      }}
                      className="rounded px-2 py-1 text-xs text-white/40 hover:bg-white/5 hover:text-foreground"
                    >
                      {t.active ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- CONTENT TAB ---- */}
        {tab === "content" && (
          <div>
            <h2 className="mb-6 display text-2xl">Site Content</h2>
            <div className="space-y-4">
              {Object.entries(data.content).map(([key, value]) => (
                <div key={key} className="rounded-xl border border-white/[0.06] bg-surface/50 p-4">
                  <label className="mb-2 block text-xs font-semibold tracking-wider text-gold uppercase">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  {editingKey === key ? (
                    <div className="flex gap-2">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={2}
                        className="flex-1 rounded-lg border border-gold/30 bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                        autoFocus
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => {
                            save({ ...data, content: { ...data.content, [key]: editValue } });
                            setEditingKey(null);
                          }}
                          className="rounded bg-gold px-3 py-1 text-xs font-semibold text-background hover:bg-gold-dim"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingKey(null)}
                          className="rounded border border-white/10 px-3 py-1 text-xs text-white/40 hover:text-foreground"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer rounded-lg bg-background/50 px-3 py-2 text-sm text-white/60 hover:bg-background/80"
                      onClick={() => {
                        setEditingKey(key);
                        setEditValue(value);
                      }}
                    >
                      {value}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Settings */}
            <h2 className="mb-6 mt-12 display text-2xl">Settings</h2>
            <div className="rounded-xl border border-white/[0.06] bg-surface/50 p-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-white/40">Admin Password</label>
                <input
                  type="password"
                  value={data.settings.adminPassword}
                  onChange={(e) =>
                    save({ ...data, settings: { ...data.settings, adminPassword: e.target.value } })
                  }
                  className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/40">Site Name</label>
                <input
                  value={data.settings.siteName}
                  onChange={(e) =>
                    save({ ...data, settings: { ...data.settings, siteName: e.target.value } })
                  }
                  className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/40">Tagline</label>
                <input
                  value={data.settings.tagline}
                  onChange={(e) =>
                    save({ ...data, settings: { ...data.settings, tagline: e.target.value } })
                  }
                  className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:border-gold/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Export / Reset */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "site-data.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 hover:text-foreground"
              >
                Export JSON
              </button>
              <button
                onClick={() => {
                  if (confirm("Reset all data to defaults? This cannot be undone.")) {
                    localStorage.removeItem(STORAGE_KEY);
                    window.location.reload();
                  }
                }}
                className="rounded-lg border border-red-400/20 px-4 py-2 text-sm text-red-400/60 hover:bg-red-400/10 hover:text-red-400"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(PASSWORD_KEY) === "1");

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <AdminDashboard />;
}
