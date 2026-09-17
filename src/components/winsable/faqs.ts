import { createServerFn } from "@tanstack/react-start";
import { getMongooseConnection } from "@/lib/mongodb";
import { FaqModel } from "@/lib/models/Faq";

const DEFAULT_FAQS = [
  {
    q: "Can you guarantee my account comes back?",
    a: "No. The platform makes every final decision. What we can do is make sure your request is complete, accurate and sent through the right channel.",
  },
  {
    q: "Which situations do you work on?",
    a: "Account recovery, disabled accounts, impersonation, copyright assistance, hacked/compromised accounts, and general platform support requests.",
  },
  {
    q: "What do you need from me to start?",
    a: "Your description of what happened, any notice text you received, and details that show the account belongs to you. We never ask for your password, OTP or 2FA code.",
  },
  {
    q: "How do I follow my case?",
    a: "Once the request is submitted you receive a case reference (WA-2026-XXXXXX), so you always know which stage your case is at.",
  },
  {
    q: "How long does recovery take?",
    a: "Every case is different. Some resolve in 48 hours, others take longer depending on the platform's response time. We keep you updated throughout.",
  },
  {
    q: "Do you need my password?",
    a: "Never. We operate without requiring passwords, OTPs or 2FA codes. Our process is based on ownership evidence and platform-native recovery channels.",
  },
  {
    q: "What platforms do you support?",
    a: "Instagram, Facebook, TikTok, YouTube, X (Twitter), LinkedIn, and other major social media platforms. If your platform is not listed, get in touch \u2014 we may still be able to help.",
  },
  {
    q: "Is my information safe?",
    a: "Yes. Your case details are handled with strict confidentiality. We use encrypted submission channels and never share your information with third parties.",
  },
];

async function ensureConnection() {
  await getMongooseConnection();
}

async function seedIfNeeded() {
  const count = await FaqModel.countDocuments();
  if (count > 0) return;
  for (let i = 0; i < DEFAULT_FAQS.length; i++) {
    const f = DEFAULT_FAQS[i]!;
    await FaqModel.create({
      id: `faq-${String(i + 1).padStart(3, "0")}`,
      q: f.q,
      a: f.a,
      enabled: true,
      order: i,
    });
  }
}

export const getFaqsFn = createServerFn({ method: "GET" as const }).handler(
  async () => {
    try {
      await ensureConnection();
      await seedIfNeeded();
      const faqs = await FaqModel.find().sort({ order: 1, createdAt: 1 }).lean();
      return { ok: true, faqs: JSON.parse(JSON.stringify(faqs)), error: "" };
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch FAQs";
      console.error("Failed to fetch FAQs:", msg);
      return { ok: false, faqs: [], error: msg };
    }
  },
);

export const getPublicFaqsFn = createServerFn({ method: "GET" as const }).handler(
  async () => {
    try {
      await ensureConnection();
      await seedIfNeeded();
      const faqs = await FaqModel.find({ enabled: true }).sort({ order: 1, createdAt: 1 }).lean();
      return { ok: true, faqs: JSON.parse(JSON.stringify(faqs)), error: "" };
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch public FAQs";
      console.error("Failed to fetch public FAQs:", msg);
      return { ok: false, faqs: [], error: msg };
    }
  },
);

export const saveFaqFn = createServerFn({ method: "POST" as const })
  .validator((data: {
    _id?: string;
    id: string;
    q: string;
    a: string;
    enabled: boolean;
    order: number;
  }) => data)
  .handler(async ({ data }) => {
    try {
      await ensureConnection();
      if (data._id) {
        const { _id, ...updateData } = data;
        const updated = await FaqModel.findByIdAndUpdate(_id, updateData, { new: true }).lean();
        return { ok: true, faq: JSON.parse(JSON.stringify(updated)), error: "" };
      } else {
        const maxOrderDoc = await FaqModel.findOne().sort({ order: -1 }).select("order").lean();
        const maxOrder = maxOrderDoc ? (maxOrderDoc.order ?? 0) + 1 : 0;
        const created = await FaqModel.create({ ...data, order: maxOrder });
        return { ok: true, faq: JSON.parse(JSON.stringify(created)), error: "" };
      }
    } catch (err) {
      console.error("Failed to save FAQ:", err);
      return { ok: false, faq: null, error: "Failed to save FAQ" };
    }
  });

export const deleteFaqFn = createServerFn({ method: "POST" as const })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      await ensureConnection();
      await FaqModel.findByIdAndDelete(data.id);
      return { ok: true, error: "" };
    } catch (err) {
      console.error("Failed to delete FAQ:", err);
      return { ok: false, error: "Failed to delete FAQ" };
    }
  });

export const toggleFaqFn = createServerFn({ method: "POST" as const })
  .validator((data: { id: string; enabled: boolean }) => data)
  .handler(async ({ data }) => {
    try {
      await ensureConnection();
      await FaqModel.findByIdAndUpdate(data.id, { enabled: data.enabled });
      return { ok: true, error: "" };
    } catch (err) {
      console.error("Failed to toggle FAQ:", err);
      return { ok: false, error: "Failed to toggle FAQ" };
    }
  });

export const reorderFaqsFn = createServerFn({ method: "POST" as const })
  .validator((data: { ids: string[] }) => data)
  .handler(async ({ data }) => {
    try {
      await ensureConnection();
      for (let i = 0; i < data.ids.length; i++) {
        await FaqModel.findByIdAndUpdate(data.ids[i], { order: i });
      }
      return { ok: true, error: "" };
    } catch (err) {
      console.error("Failed to reorder FAQs:", err);
      return { ok: false, error: "Failed to reorder FAQs" };
    }
  });
