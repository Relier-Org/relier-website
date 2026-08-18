// Internal notification sent to info@relier.com when someone submits the
// /contact form. Table-based with inline styles: that is what survives Gmail,
// Outlook and Apple Mail. Brand accents only — legibility comes first, the
// concierge team reads these to reply, not to admire them.

import type { ContactPayload } from "@/lib/contact/schema";

const OBSIDIAN = "#0A0A0A";
const CHAMPAGNE = "#C9A961";

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fullName(payload: ContactPayload) {
  return [payload.firstName, payload.lastName].filter(Boolean).join(" ").trim();
}

export function contactSubject(payload: ContactPayload) {
  const name = fullName(payload) || "Website visitor";
  const locale = payload.locale && payload.locale !== "en" ? payload.locale : "";
  return locale
    ? `New website enquiry — ${name} (${locale.toUpperCase()})`
    : `New website enquiry — ${name}`;
}

export function contactText(payload: ContactPayload) {
  const lines = [
    "New enquiry from the relier.com contact form.",
    "",
    `Name:    ${fullName(payload) || "—"}`,
    `Email:   ${payload.email || "—"}`,
    `Phone:   ${payload.phone || "—"}`,
    `Language: ${LOCALE_LABELS[payload.locale ?? "en"] ?? payload.locale ?? "—"}`,
    "",
    "Message:",
    payload.message || "—",
    "",
    "Reply directly to this email to answer the sender.",
  ];
  return lines.join("\n");
}

function row(label: string, value: string, isLink?: "mailto" | "tel") {
  const safe = escapeHtml(value);
  const rendered = isLink
    ? `<a href="${isLink}:${safe}" style="color:${OBSIDIAN};text-decoration:none;border-bottom:1px solid ${CHAMPAGNE};">${safe}</a>`
    : safe;

  return `
        <tr>
          <td style="padding:0 0 4px;font:500 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:0.14em;text-transform:uppercase;color:#8A8A8A;">${escapeHtml(label)}</td>
        </tr>
        <tr>
          <td style="padding:0 0 22px;font:400 16px/1.5 Helvetica,Arial,sans-serif;color:${OBSIDIAN};">${rendered}</td>
        </tr>`;
}

export function contactHtml(payload: ContactPayload) {
  const name = fullName(payload) || "Website visitor";
  const language =
    LOCALE_LABELS[payload.locale ?? "en"] ?? payload.locale ?? "English";
  const message = escapeHtml(payload.message || "—").replace(/\n/g, "<br />");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(contactSubject(payload))}</title>
</head>
<body style="margin:0;padding:0;background:#F4F2EE;">
  <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(name)} — ${escapeHtml(payload.email)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F2EE;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid #E4E0D8;">
          <tr>
            <td style="background:${OBSIDIAN};padding:26px 32px;">
              <p style="margin:0;font:400 15px/1 Helvetica,Arial,sans-serif;letter-spacing:0.3em;text-transform:uppercase;color:#FFFFFF;">Relier</p>
              <p style="margin:8px 0 0;font:400 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:0.16em;text-transform:uppercase;color:${CHAMPAGNE};">New website enquiry</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row("Name", name)}
${row("Email", payload.email || "—", payload.email ? "mailto" : undefined)}
${row("Phone", payload.phone || "—", payload.phone ? "tel" : undefined)}
${row("Language", language)}
                <tr>
                  <td style="padding:0 0 4px;font:500 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:0.14em;text-transform:uppercase;color:#8A8A8A;">Message</td>
                </tr>
                <tr>
                  <td style="padding:0;font:400 16px/1.6 Helvetica,Arial,sans-serif;color:${OBSIDIAN};border-left:2px solid ${CHAMPAGNE};padding-left:16px;">${message}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 32px;">
              <p style="margin:0;font:400 13px/1.6 Helvetica,Arial,sans-serif;color:#6E6E6E;border-top:1px solid #E4E0D8;padding-top:18px;">
                Sent from the contact form at relier.com. Reply to this email to answer ${escapeHtml(name)} directly.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
