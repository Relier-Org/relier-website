import { CONSENT_COOKIE, CONSENT_VERSION } from "@/lib/consent/state";

// Lectura server-side de la cookie de consentimiento (`lib/consent/state.ts`
// solo la lee desde `document.cookie`). El cliente ya no adjunta atribución sin
// consentimiento `marketing`; esto es la segunda barrera: aunque llegue, el
// endpoint la descarta si la cookie de la request no lo respalda.
// Mismo formato que `writeConsent`: encodeURIComponent(JSON.stringify(record)).

export function hasMarketingConsent(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  const prefix = `${CONSENT_COOKIE}=`;
  const raw = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(prefix))
    ?.slice(prefix.length);
  if (!raw) return false;
  try {
    const data = JSON.parse(decodeURIComponent(raw)) as {
      version?: unknown;
      marketing?: unknown;
    };
    return data.version === CONSENT_VERSION && data.marketing === true;
  } catch {
    return false;
  }
}
