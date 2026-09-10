import { createServerFn } from "@tanstack/react-start";
import { getMongooseConnection } from "@/lib/mongodb";
import { RecoveryModel } from "@/lib/models/Recovery";
import { recoveredProfiles } from "./recoveredProfiles";

async function ensureConnection() {
  await getMongooseConnection();
}

// Seed initial data from recoveredProfiles if collection is empty
async function seedIfNeeded() {
  const count = await RecoveryModel.countDocuments();
  if (count === 0 && recoveredProfiles.length > 0) {
    const docs = recoveredProfiles.map((p, i) => ({
      name: p.name || "",
      role: p.role || "",
      username: p.username,
      platform: p.platform,
      followers: p.followers,
      verified: p.verified,
      avatar: p.avatar,
      recoveryType: p.recoveryType,
      recoveryDate: p.recoveryDate,
      popupId: p.popupId,
      enabled: true,
      order: i,
    }));
    await RecoveryModel.insertMany(docs);
  }
}

export const getRecoveriesFn = createServerFn({ method: "GET" as const }).handler(
  async () => {
    try {
      await ensureConnection();
      await seedIfNeeded();
      const recoveries = await RecoveryModel.find().sort({ order: 1, createdAt: 1 }).lean();
      return { ok: true, recoveries: JSON.parse(JSON.stringify(recoveries)), error: "" };
    } catch (err) {
      console.error("Failed to fetch recoveries:", err);
      return { ok: false, recoveries: [], error: "Failed to fetch recoveries" };
    }
  },
);

export const getPublicRecoveriesFn = createServerFn({ method: "GET" as const }).handler(
  async () => {
    try {
      await ensureConnection();
      await seedIfNeeded();
      const recoveries = await RecoveryModel.find({ enabled: true }).sort({ order: 1, createdAt: 1 }).lean();
      return { ok: true, recoveries: JSON.parse(JSON.stringify(recoveries)), error: "" };
    } catch (err) {
      console.error("Failed to fetch public recoveries:", err);
      return { ok: false, recoveries: [], error: "Failed to fetch recoveries" };
    }
  },
);

export const saveRecoveryFn = createServerFn({ method: "POST" as const })
  .validator((data: {
    _id?: string;
    name: string;
    role: string;
    username: string;
    platform: string;
    followers: string;
    verified: boolean;
    avatar: string;
    recoveryType: string;
    recoveryDate: string;
    popupId?: string;
    enabled: boolean;
    order: number;
  }) => data)
  .handler(async ({ data }) => {
    try {
      await ensureConnection();
      if (data._id) {
        const { _id, ...updateData } = data;
        const updated = await RecoveryModel.findByIdAndUpdate(_id, updateData, { new: true }).lean();
        return { ok: true, recovery: JSON.parse(JSON.stringify(updated)), error: "" };
      } else {
        const maxOrder = await RecoveryModel.countDocuments();
        const created = await RecoveryModel.create({ ...data, order: maxOrder });
        return { ok: true, recovery: JSON.parse(JSON.stringify(created)), error: "" };
      }
    } catch (err) {
      console.error("Failed to save recovery:", err);
      return { ok: false, recovery: null, error: "Failed to save recovery" };
    }
  });

export const deleteRecoveryFn = createServerFn({ method: "POST" as const })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      await ensureConnection();
      await RecoveryModel.findByIdAndDelete(data.id);
      return { ok: true, error: "" };
    } catch (err) {
      console.error("Failed to delete recovery:", err);
      return { ok: false, error: "Failed to delete recovery" };
    }
  });

export const toggleRecoveryFn = createServerFn({ method: "POST" as const })
  .validator((data: { id: string; enabled: boolean }) => data)
  .handler(async ({ data }) => {
    try {
      await ensureConnection();
      await RecoveryModel.findByIdAndUpdate(data.id, { enabled: data.enabled });
      return { ok: true, error: "" };
    } catch (err) {
      console.error("Failed to toggle recovery:", err);
      return { ok: false, error: "Failed to toggle recovery" };
    }
  });

export const reorderRecoveriesFn = createServerFn({ method: "POST" as const })
  .validator((data: { ids: string[] }) => data)
  .handler(async ({ data }) => {
    try {
      await ensureConnection();
      for (let i = 0; i < data.ids.length; i++) {
        await RecoveryModel.findByIdAndUpdate(data.ids[i], { order: i });
      }
      return { ok: true, error: "" };
    } catch (err) {
      console.error("Failed to reorder recoveries:", err);
      return { ok: false, error: "Failed to reorder recoveries" };
    }
  });
