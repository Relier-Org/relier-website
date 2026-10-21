import { NextResponse } from "next/server";
import { normalizeContact, validateContact } from "@/lib/contact/schema";
import {
  contactHtml,
  contactSubject,
  contactText,
} from "@/lib/email/contactTemplate";
import { EmailError, sendEmail } from "@/lib/email/resend";
import { hasMarketingConsent } from "@/lib/contact/serverConsent";
import type { ContactSegment } from "@/lib/contact/schema";

// Destinatario por landing de For Business (lista oficial de departamentos del
// cliente; Travel Advisors a sales@, confirmado por Andrés el 17-oct-2026).
// Cada uno se puede pisar con CONTACT_TO_EMAIL_<SEGMENTO> (p. ej.
// CONTACT_TO_EMAIL_EVENTS). Sin segmento manda CONTACT_TO_EMAIL, como siempre.
const SEGMENT_TO: Record<ContactSegment, { env: string; fallback: string }> = {
  events: { env: "CONTACT_TO_EMAIL_EVENTS", fallback: "events@relier.com" },
  corporate: { env: "CONTACT_TO_EMAIL_CORPORATE", fallback: "reservations@relier.com" },
  affiliates: { env: "CONTACT_TO_EMAIL_AFFILIATES", fallback: "info@relier.com" },
  travelAdvisors: { env: "CONTACT_TO_EMAIL_TRAVEL_ADVISORS", fallback: "sales@relier.com" },
};

function recipients(segment?: ContactSegment) {
  if (!segment) return undefined;
  const { env, fallback } = SEGMENT_TO[segment];
  const list = (process.env[env] ?? fallback)
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  return list.length ? list : [fallback];
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Best-effort throttle. It lives in module memory, so it is per serverless
// instance, not global — enough to stop a single abusive client, not a
// distributed flood. Upgrade to Upstash/KV only if that ever becomes a problem.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

// El sitio está detrás de Cloudflare: `cf-connecting-ip` lo pone Cloudflare y
// es lo más confiable. En `x-forwarded-for` el PRIMER valor lo puede falsear el
// cliente; el último lo agregó el proxy más cercano.
function clientIp(req: Request) {
  const cf = req.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  const forwarded = req.headers
    .get("x-forwarded-for")
    ?.split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);
  if (forwarded?.length) return forwarded[forwarded.length - 1];
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

// Un envío legítimo pesa ~5 KB como mucho (mensaje de 4000 caracteres).
const MAX_BODY_BYTES = 16 * 1024;

/** Body como texto, cortado en MAX_BODY_BYTES; null si se pasa del límite. */
async function readBody(req: Request): Promise<string | null> {
  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return null;
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(
    (at) => now - at < RATE_LIMIT_WINDOW_MS
  );
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing unbounded on a long-lived instance.
  if (hits.size > 500) {
    for (const [key, timestamps] of hits) {
      if (timestamps.every((at) => now - at >= RATE_LIMIT_WINDOW_MS)) {
        hits.delete(key);
      }
    }
  }
  return false;
}

export async function POST(req: Request) {
  const rawBody = await readBody(req);
  if (rawBody === null) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // La atribución de campaña solo se conserva si la cookie de consentimiento
  // de esta request incluye `marketing` (no se confía en lo que mande el cliente).
  const payload = normalizeContact(body, {
    allowAttribution: hasMarketingConsent(req.headers.get("cookie")),
  });

  // Honeypot: answer 200 so the bot believes it succeeded and moves on.
  if (payload.referral) {
    return NextResponse.json({ ok: true });
  }

  const fields = validateContact(payload);
  if (Object.keys(fields).length > 0) {
    return NextResponse.json({ error: "validation", fields }, { status: 400 });
  }

  if (isRateLimited(clientIp(req))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  // Registro del consentimiento: hora del servidor, no la del cliente.
  const record = { consentAt: new Date().toISOString() };

  try {
    const result = await sendEmail({
      to: recipients(payload.segment),
      subject: contactSubject(payload),
      html: contactHtml(payload, record),
      text: contactText(payload, record),
      // Replying from Gmail goes straight to the customer.
      replyTo: payload.email,
    });
    return NextResponse.json({ ok: true, delivered: result.delivered });
  } catch (error) {
    const status = error instanceof EmailError ? error.status : 500;
    // Sin el payload ni el objeto de error completo: el mensaje de Resend puede
    // citar direcciones (reply_to). Solo tipo, status y mensaje sin emails.
    const reason =
      error instanceof Error
        ? error.message.replace(/[^\s@<>"']+@[^\s@<>"']+/g, "[email]").slice(0, 200)
        : "unknown";
    // eslint-disable-next-line no-console
    console.error("[api/contact] send failed", { status, reason });
    return NextResponse.json(
      { error: "email_failed" },
      { status: status === 503 ? 503 : 502 }
    );
  }
}
