import type { ContactFieldErrors, ContactPayload } from "./schema";

export type ContactFailureReason =
  | "validation"
  | "rate_limited"
  | "email_failed"
  | "network";

export class ContactApiError extends Error {
  status: number;
  reason: ContactFailureReason;
  fields?: ContactFieldErrors;

  constructor(
    message: string,
    status: number,
    reason: ContactFailureReason,
    fields?: ContactFieldErrors
  ) {
    super(message);
    this.name = "ContactApiError";
    this.status = status;
    this.reason = reason;
    this.fields = fields;
  }
}

export async function sendContactMessage(
  payload: ContactPayload
): Promise<void> {
  let res: Response;
  try {
    // Trailing slash required: next.config.ts sets trailingSlash: true, so
    // /api/contact 308s to /api/contact/ (same as lib/booking/api.ts).
    res = await fetch("/api/contact/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ContactApiError("Network error", 0, "network");
  }

  if (res.ok) return;

  const body = (await res.json().catch(() => ({}))) as {
    error?: string;
    fields?: ContactFieldErrors;
  };

  if (res.status === 429) {
    throw new ContactApiError("Too many requests", 429, "rate_limited");
  }
  if (body.error === "validation") {
    throw new ContactApiError("Validation failed", res.status, "validation", body.fields);
  }
  throw new ContactApiError(
    body.error ?? "Message could not be sent",
    res.status,
    "email_failed"
  );
}
