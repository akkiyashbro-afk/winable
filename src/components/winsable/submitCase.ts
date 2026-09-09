import { createServerFn } from "@tanstack/react-start";
import { sendCaseEmails } from "@/lib/email";
import { generateCaseId } from "@/lib/validation";
import { getMongooseConnection } from "@/lib/mongodb";
import { CaseModel } from "@/lib/models/Case";

const caseFormValidator = (input: {
  fullName: string;
  email: string;
  platform: string;
  otherPlatform: string;
  caseType: string;
  username: string;
  followers: string;
  alreadySubmittedAppeal: string;
  canStillLogin: string;
  description: string;
}) => input;

export const submitCaseFn = createServerFn({ method: "POST" as const })
  .validator(caseFormValidator)
  .handler(async ({ data }) => {
    if (!data.fullName || !data.email || !data.platform || !data.caseType || !data.description) {
      return { ok: false, error: "Missing required fields", caseId: "" };
    }

    if (data.description.length < 20) {
      return { ok: false, error: "Description must be at least 20 characters", caseId: "" };
    }

    const caseId = generateCaseId();
    const submittedAt = new Date();

    const platform =
      data.platform === "Other" && data.otherPlatform
        ? `Other — ${data.otherPlatform}`
        : data.platform;

    // 1. Save to MongoDB
    let mongoSaved = false;
    try {
      await getMongooseConnection();
      await CaseModel.create({
        caseId,
        fullName: data.fullName,
        email: data.email,
        platform,
        otherPlatform: data.otherPlatform || undefined,
        caseType: data.caseType,
        username: data.username || undefined,
        followers: data.followers || undefined,
        alreadySubmittedAppeal: data.alreadySubmittedAppeal || undefined,
        canStillLogin: data.canStillLogin || undefined,
        description: data.description,
        attachmentNames: [],
        status: "new",
        submittedAt,
      });
      mongoSaved = true;
    } catch (err) {
      console.error("MongoDB save failed:", err);
    }

    // 2. Send emails (independent — does not block MongoDB save)
    const submittedAtStr = submittedAt.toLocaleString("en-US", {
      timeZone: "UTC",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const outcome = await sendCaseEmails({
      caseId,
      submittedAt: submittedAtStr,
      fullName: data.fullName,
      email: data.email,
      platform,
      caseType: data.caseType,
      username: data.username || "",
      followers: data.followers || "",
      alreadySubmittedAppeal: data.alreadySubmittedAppeal || "",
      canStillLogin: data.canStillLogin || "",
      description: data.description,
      attachmentNames: [],
    });

    return {
      ok: true,
      caseId,
      emailsSent: !outcome.skipped,
      mongoSaved,
      error: "",
    };
  });
