import { CONSENT_COOKIE, CONSENT_VERSION } from "@/lib/consent/state";

// Lectura server-side de la cookie de consentimiento (`lib/consent/state.ts`
// solo la lee desde `document.cookie`). El cliente ya no adjunta atribución sin
// consentimiento `marketing`; esto es la segunda barrera: aunque llegue, el
// endpoint la descarta si la cookie de la request la rechaza.
//
// Opt-out (23-oct-2026): sin elección vigente cuenta como concedido. GPC no
// llega acá; lo filtra el cliente, que con GPC no adjunta atribución.
// Mismo formato que `writeConsent`: encodeURIComponent(JSON.stringify(record)).

export function hasMarketingConsent(cookieHeader: string | null): boolean {
  if (!cookieHeader) return true;
  const prefix = `${CONSENT_COOKIE}=`;
  const raw = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(prefix))
    ?.slice(prefix.length);
  if (!raw) return true;
  try {
    const data = JSON.parse(decodeURIComponent(raw)) as {
      version?: unknown;
      marketing?: unknown;
    };
    // Elección de otra versión: ya no vale, rige el default.
    if (data.version !== CONSENT_VERSION) return true;
    return data.marketing === true;
  } catch {
    return true;
  }
}
