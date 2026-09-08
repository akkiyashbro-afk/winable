import { z } from "zod";

export const caseFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name must be under 120 characters"),
  email: z.string().email("Please enter a valid email address"),
  platform: z.enum(
    ["Instagram", "WhatsApp", "Facebook", "TikTok", "YouTube", "X (Twitter)", "Telegram", "Reddit", "Discord", "Other"],
    { required_error: "Please select a platform" },
  ),
  otherPlatform: z.string().optional(),
  caseType: z.enum(
    [
      "Disabled / Suspended Account",
      "Hacked / Compromised Account",
      "Impersonation",
      "Copyright / Content Issue",
      "Other / Not Listed?",
    ],
    { required_error: "Please select a case type" },
  ),
  username: z.string().optional(),
  followers: z.string().optional(),
  alreadySubmittedAppeal: z.enum(["yes", "no"]).optional(),
  canStillLogin: z.enum(["yes", "no"]).optional(),
  description: z
    .string()
    .min(20, "Please provide at least 20 characters describing your case")
    .max(2000, "Description must be under 2000 characters"),
});

export type CaseFormInput = z.infer<typeof caseFormSchema>;

export function generateCaseId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `WA-${year}-${code}`;
}
