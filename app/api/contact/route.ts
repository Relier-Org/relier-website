import { NextResponse } from "next/server";
import { normalizeContact, validateContact } from "@/lib/contact/schema";
import {
  contactHtml,
  contactSubject,
  contactText,
} from "@/lib/email/contactTemplate";
import { EmailError, sendEmail } from "@/lib/email/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Best-effort throttle. It lives in module memory, so it is per serverless
// instance, not global — enough to stop a single abusive client, not a
// distributed flood. Upgrade to Upstash/KV only if that ever becomes a problem.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
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
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const payload = normalizeContact(body);

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

  try {
    const result = await sendEmail({
      subject: contactSubject(payload),
      html: contactHtml(payload),
      text: contactText(payload),
      // Replying from Gmail goes straight to the customer.
      replyTo: payload.email,
    });
    return NextResponse.json({ ok: true, delivered: result.delivered });
  } catch (error) {
    const status = error instanceof EmailError ? error.status : 500;
    // eslint-disable-next-line no-console
    console.error("[api/contact] send failed", error);
    return NextResponse.json(
      { error: "email_failed" },
      { status: status === 503 ? 503 : 502 }
    );
  }
}
