// Thin wrapper over the Resend REST API. Deliberately no SDK: one POST is all
// we need, and it keeps package.json free of a dependency we'd have to track.
// Docs: https://resend.com/docs/api-reference/emails/send-email
//
// Env vars (see .env.example and docs/email-resend.md):
//   RESEND_API_KEY     re_... — the only secret. Without it we run in dry mode.
//   CONTACT_FROM_EMAIL "Relier Website <info@relier.com>"
//   CONTACT_TO_EMAIL   info@relier.com (comma-separated for several recipients)
//   EMAIL_DRY_RUN      "true" forces dry mode even with a key present.

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const TIMEOUT_MS = 10_000;

const DEFAULT_FROM = "Relier Website <info@relier.com>";
const DEFAULT_TO = "info@relier.com";

export class EmailError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "EmailError";
    this.status = status;
  }
}

export type EmailConfig = {
  apiKey: string;
  from: string;
  to: string[];
  dryRun: boolean;
};

export function emailConfig(): EmailConfig {
  const apiKey = (process.env.RESEND_API_KEY ?? "").trim();
  const to = (process.env.CONTACT_TO_EMAIL ?? DEFAULT_TO)
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  return {
    apiKey,
    from: (process.env.CONTACT_FROM_EMAIL ?? DEFAULT_FROM).trim(),
    to: to.length > 0 ? to : [DEFAULT_TO],
    dryRun: !apiKey || process.env.EMAIL_DRY_RUN === "true",
  };
}

export type SendEmailInput = {
  to?: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendEmailResult = {
  /** Resend message id, or null when the send was a dry run. */
  id: string | null;
  delivered: boolean;
};

export async function sendEmail(
  input: SendEmailInput
): Promise<SendEmailResult> {
  const config = emailConfig();
  const to = input.to ?? config.to;

  if (config.dryRun) {
    // No key yet (or explicitly muted): never pretend in production, where a
    // swallowed message is a lost lead. Locally, log it so the whole flow is
    // testable end-to-end before the key exists.
    if (process.env.NODE_ENV === "production" && !config.apiKey) {
      throw new EmailError("RESEND_API_KEY is not configured", 503);
    }
    // eslint-disable-next-line no-console
    console.log("[email:dry-run]", {
      from: config.from,
      to,
      replyTo: input.replyTo,
      subject: input.subject,
      text: input.text,
    });
    return { id: null, delivered: false };
  }

  let res: Response;
  try {
    res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "network error";
    throw new EmailError(`Resend request failed: ${reason}`, 502);
  }

  const body = (await res.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
    name?: string;
  };

  if (!res.ok) {
    throw new EmailError(
      body.message ?? body.name ?? `Resend responded ${res.status}`,
      res.status
    );
  }

  return { id: body.id ?? null, delivered: true };
}
