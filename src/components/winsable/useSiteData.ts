import { useState, useEffect } from "react";

const STORAGE_KEY = "winsable-site-data";

export interface Review {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  order: number;
  featured: boolean;
  enabled: boolean;
}

export interface Service {
  id: string;
  n: string;
  title: string;
  icon: string;
  body: string;
  tags: string[];
  enabled: boolean;
}

export interface TalentClient {
  id: string;
  name: string;
  logo: string;
  order: number;
}

export interface TalentCampaign {
  id: string;
  title: string;
  brand: string;
  image: string;
  description: string;
  link: string;
  order: number;
}

export interface TalentSocialPost {
  id: string;
  platform: string;
  url: string;
  thumbnail: string;
  title: string;
  metrics: string;
  order: number;
}

export interface Talent {
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

export interface SiteData {
  reviews: Review[];
  services: Service[];
  talents: Talent[];
  content: Record<string, string>;
  settings: { adminPassword: string; siteName: string; tagline: string };
}

let cachedData: SiteData | null = null;

function mergeWithDefaults(raw: SiteData): SiteData {
  const reviews = raw.reviews.map((r, i) => ({
    ...r,
    avatar: r.avatar || "",
    rating: r.rating || 5,
    order: r.order ?? i,
  }));
  reviews.sort((a, b) => a.order - b.order);

  const talents = (raw.talents || []).map((t, i) => ({
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
  talents.sort((a, b) => a.order - b.order);

  return { ...raw, reviews, talents };
}

export function useSiteData() {
  const [data, setData] = useState<SiteData | null>(cachedData);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        cachedData = mergeWithDefaults(parsed);
        setData(cachedData);
      } catch {
        loadDefaults();
      }
    } else {
      loadDefaults();
    }
  }, []);

  function loadDefaults() {
    fetch("/site-data.json")
      .then((r) => r.json())
      .then((d) => {
        cachedData = mergeWithDefaults(d);
        setData(cachedData);
      });
  }

  return data;
}
