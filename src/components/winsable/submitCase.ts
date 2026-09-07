import { createServerFn } from "@tanstack/react-start";
import { sendCaseEmails } from "@/lib/email";
import { generateCaseId } from "@/lib/validation";

const caseFormValidator = (input: {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  platform: string;
  otherPlatform: string;
  caseType: string;
  username: string;
  profileUrl: string;
  incidentDate: string;
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
    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "UTC",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const platform =
      data.platform === "Other" && data.otherPlatform
        ? `Other — ${data.otherPlatform}`
        : data.platform;

    const outcome = await sendCaseEmails({
      caseId,
      submittedAt,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || "",
      country: data.country || "",
      platform,
      caseType: data.caseType,
      username: data.username || "",
      profileUrl: data.profileUrl || "",
      incidentDate: data.incidentDate || "",
      description: data.description,
      attachmentNames: [],
    });

    return {
      ok: true,
      caseId,
      emailsSent: !outcome.skipped,
      error: "",
    };
  });
