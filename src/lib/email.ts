import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function getConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    receiver: process.env.CASE_RECEIVER_EMAIL,
    from: process.env.FROM_EMAIL || "WinsAble <onboarding@resend.dev>",
  };
}

interface CaseEmailPayload {
  caseId: string;
  submittedAt: string;
  fullName: string;
  email: string;
  platform: string;
  caseType: string;
  username: string;
  followers: string;
  alreadySubmittedAppeal: string;
  canStillLogin: string;
  description: string;
  attachmentNames: string[];
}

interface EmailOutcomes {
  internal: boolean;
  confirmation: boolean;
  skipped: boolean;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function internalCaseEmail(payload: CaseEmailPayload) {
  const attachmentList = payload.attachmentNames.length
    ? payload.attachmentNames.map((a) => `<li>${escapeHtml(a)}</li>`).join("")
    : "<li>None</li>";

  return {
    subject: `New WinsAble Case — ${payload.caseId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:system-ui,-apple-system,sans-serif;background:#0d0d0d;color:#f5f5f5;padding:40px 20px;">
        <div style="max-width:600px;margin:0 auto;">
          <h1 style="color:#d4a843;font-size:24px;margin-bottom:8px;">New Case Received</h1>
          <p style="color:#999;font-size:14px;margin-top:0;">${payload.caseId}</p>
          
          <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:24px;margin:24px 0;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px;width:120px;">Name</td>
                <td style="padding:8px 0;color:#f5f5f5;font-size:14px;">${escapeHtml(payload.fullName)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px;">Email</td>
                <td style="padding:8px 0;color:#f5f5f5;font-size:14px;">${escapeHtml(payload.email)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px;">Platform</td>
                <td style="padding:8px 0;color:#f5f5f5;font-size:14px;">${escapeHtml(payload.platform)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px;">Case Type</td>
                <td style="padding:8px 0;color:#f5f5f5;font-size:14px;">${escapeHtml(payload.caseType)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px;">Username</td>
                <td style="padding:8px 0;color:#f5f5f5;font-size:14px;">${escapeHtml(payload.username || "N/A")}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px;">Followers</td>
                <td style="padding:8px 0;color:#f5f5f5;font-size:14px;">${escapeHtml(payload.followers || "N/A")}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px;">Appeal Submitted?</td>
                <td style="padding:8px 0;color:#f5f5f5;font-size:14px;">${escapeHtml(payload.alreadySubmittedAppeal || "N/A")}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px;">Can Still Login?</td>
                <td style="padding:8px 0;color:#f5f5f5;font-size:14px;">${escapeHtml(payload.canStillLogin || "N/A")}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px;vertical-align:top;">Description</td>
                <td style="padding:8px 0;color:#f5f5f5;font-size:14px;">${escapeHtml(payload.description)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px;">Attachments</td>
                <td style="padding:8px 0;color:#f5f5f5;font-size:14px;"><ul style="margin:0;padding-left:16px;">${attachmentList}</ul></td>
              </tr>
            </table>
          </div>
          
          <p style="color:#666;font-size:12px;">Submitted at ${payload.submittedAt}</p>
        </div>
      </body>
      </html>
    `,
  };
}

function confirmationEmail(payload: CaseEmailPayload) {
  return {
    subject: `WinsAble Case Received — ${payload.caseId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:system-ui,-apple-system,sans-serif;background:#0d0d0d;color:#f5f5f5;padding:40px 20px;">
        <div style="max-width:600px;margin:0 auto;">
          <h1 style="color:#d4a843;font-size:24px;">Case Received</h1>
          
          <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
            <p style="color:#888;font-size:13px;margin:0 0 8px;">Your Case Reference</p>
            <p style="color:#d4a843;font-size:28px;font-weight:bold;margin:0;letter-spacing:2px;">${payload.caseId}</p>
          </div>
          
          <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:24px;margin:24px 0;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px;width:120px;">Platform</td>
                <td style="padding:8px 0;color:#f5f5f5;font-size:14px;">${escapeHtml(payload.platform)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px;">Case Type</td>
                <td style="padding:8px 0;color:#f5f5f5;font-size:14px;">${escapeHtml(payload.caseType)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;font-size:13px;">Submitted</td>
                <td style="padding:8px 0;color:#f5f5f5;font-size:14px;">${payload.submittedAt}</td>
              </tr>
            </table>
          </div>
          
          <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:24px;margin:24px 0;">
            <h3 style="color:#f5f5f5;font-size:16px;margin:0 0 12px;">What Happens Next</h3>
            <ol style="color:#999;font-size:14px;line-height:1.8;padding-left:20px;margin:0;">
              <li>We review your case details and supporting information.</li>
              <li>We prepare a clear summary of your situation.</li>
              <li>We guide you on the best next steps for your platform.</li>
            </ol>
          </div>
          
          <div style="background:#1a1a0a;border:1px solid #333;border-radius:12px;padding:24px;margin:24px 0;">
            <h3 style="color:#d4a843;font-size:14px;margin:0 0 8px;">Security Notice</h3>
            <p style="color:#888;font-size:13px;margin:0;">WinsAble will never ask for your password, OTP, or 2FA codes.</p>
          </div>
          
          <p style="color:#666;font-size:12px;">Keep this email for your records. Your case reference is <strong>${payload.caseId}</strong>.</p>
        </div>
      </body>
      </html>
    `,
  };
}

export async function sendCaseEmails(payload: CaseEmailPayload): Promise<EmailOutcomes> {
  const { apiKey, receiver, from } = getConfig();

  if (!apiKey || !receiver) {
    console.warn("Resend not configured — skipping emails");
    return { internal: false, confirmation: false, skipped: true };
  }

  const internal = internalCaseEmail(payload);
  const confirmation = confirmationEmail(payload);

  try {
    await resend.emails.send({
      from,
      to: [receiver],
      subject: internal.subject,
      html: internal.html,
      replyTo: payload.email,
    });

    await resend.emails.send({
      from,
      to: [payload.email],
      subject: confirmation.subject,
      html: confirmation.html,
    });

    return { internal: true, confirmation: true, skipped: false };
  } catch (error) {
    console.error("Failed to send case emails:", error);
    return { internal: false, confirmation: false, skipped: false };
  }
}
