// Made by akki_idle
import { z } from "zod";

const platformCaseTypes: Record<string, string[]> = {
  Instagram: [
    "Disabled / Suspended Account",
    "Hacked / Compromised Account",
    "Impersonation",
    "Copyright / Content Issue",
    "Other / Not Listed?",
  ],
  WhatsApp: [
    "Banned / Suspended",
    "Hacked / Compromised Account",
    "Access Issue",
    "Privacy / Security Issue",
    "Other / Not Listed?",
  ],
  Facebook: [
    "Disabled / Suspended Account",
    "Hacked / Compromised Account",
    "Copyright / Content Issue",
    "Other / Not Listed?",
  ],
  TikTok: [
    "Disabled / Suspended Account",
    "Hacked / Compromised Account",
    "Community Guidelines Issue",
    "Copyright / Content Issue",
    "Other / Not Listed?",
  ],
  YouTube: [
    "Channel / Account Suspension",
    "Hacked / Compromised Account",
    "Community Guidelines Issue",
    "Copyright / Content Issue",
    "Other / Not Listed?",
  ],
  "X (Twitter)": [
    "Account Suspension",
    "Hacked / Compromised Account",
    "Impersonation",
    "Copyright / Content Issue",
    "Other / Not Listed?",
  ],
  LinkedIn: [
    "Account Restriction",
    "Hacked / Compromised Account",
    "Identity / Impersonation Issue",
    "Content / Copyright Issue",
    "Other / Not Listed?",
  ],
  Telegram: [
    "Account Restriction",
    "Hacked / Compromised Account",
    "Spam / Abuse Restriction",
    "Impersonation",
    "Other / Not Listed?",
  ],
  Reddit: [
    "Account Suspension",
    "Hacked / Compromised Account",
    "Community Restriction",
    "Content / Copyright Issue",
    "Other / Not Listed?",
  ],
  Discord: [
    "Account Restriction",
    "Hacked / Compromised Account",
    "Server / Community Issue",
    "Content / Safety Issue",
    "Other / Not Listed?",
  ],
};

export { platformCaseTypes };

export const caseFormSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(120, "Name must be under 120 characters"),
    email: z.string().email("Please enter a valid email address"),
    platform: z.enum(
      [
        "Instagram",
        "WhatsApp",
        "Facebook",
        "TikTok",
        "YouTube",
        "X (Twitter)",
        "LinkedIn",
        "Telegram",
        "Reddit",
        "Discord",
        "Other / Anything",
      ],
      { required_error: "Please select a platform" },
    ),
    otherPlatform: z.string().optional(),
    caseType: z.string().optional(),
    username: z.string().optional(),
    followers: z.string().optional(),
    alreadySubmittedAppeal: z.enum(["yes", "no"]).optional(),
    canStillLogin: z.enum(["yes", "no"]).optional(),
    description: z
      .string()
      .min(20, "Please provide at least 20 characters describing your case")
      .max(2000, "Description must be under 2000 characters"),
  })
  .refine(
    (data) => {
      if (data.platform === "Other / Anything") return true;
      return !!data.caseType && data.caseType.length > 0;
    },
    { message: "Please select a case type", path: ["caseType"] },
  )
  .refine(
    (data) => {
      if (data.platform === "Other / Anything") {
        return !!data.otherPlatform && data.otherPlatform.length > 0;
      }
      return true;
    },
    { message: "Please specify the platform name", path: ["otherPlatform"] },
  );

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
