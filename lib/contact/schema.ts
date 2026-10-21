// Shared between the client form (ContactSplit) and the API route so both sides
// validate with exactly the same rules. Errors travel as codes, never as prose,
// so the UI can render them in the active locale.

export type ContactValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  /**
   * Consentimiento informado a la Privacy Policy (oct-2026). Obligatorio y
   * estrictamente `true`: el servidor no acepta "true", 1 ni nada parecido.
   */
  privacyConsent: boolean;
};

/** Campos de texto del formulario (todo menos la casilla de consentimiento). */
export type ContactTextField = Exclude<keyof ContactValues, "privacyConsent">;

/**
 * Landing de For Business desde la que llega el formulario (oct-2026). Decide
 * el destinatario y va en el asunto para identificar la sección en el CRM.
 * Sin segmento = formulario general de /contact.
 */
export const CONTACT_SEGMENTS = [
  "events",
  "corporate",
  "affiliates",
  "travelAdvisors",
] as const;
export type ContactSegment = (typeof CONTACT_SEGMENTS)[number];

/** Atribución de campaña: primera visita de la sesión (UTM, gclid, entrada). */
export type ContactAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  landingPage?: string;
  referrer?: string;
  /** Página desde la que se envió el formulario. */
  page?: string;
};

export type ContactPayload = ContactValues & {
  segment?: ContactSegment;
  /** Opcional en los formularios B2B. */
  company?: string;
  attribution?: ContactAttribution;
  /** Active locale, so the concierge team knows which language to reply in. */
  locale?: string;
  /**
   * Honeypot. Real users never see it; bots fill everything they find.
   * Named `referral` on purpose: no browser maps it to an autofill category,
   * so Chrome can't silently poison a legitimate submission the way it would
   * with `company` / `organization`.
   */
  referral?: string;
};

export type ContactErrorCode = "required" | "email" | "tooLong" | "consent";
export type ContactFieldErrors = Partial<
  Record<keyof ContactValues, ContactErrorCode>
>;

export const CONTACT_LIMITS: Record<ContactTextField, number> = {
  firstName: 80,
  lastName: 80,
  email: 160,
  phone: 40,
  message: 4000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const INITIAL_CONTACT_VALUES: ContactValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
  privacyConsent: false,
};

export function validateContact(values: ContactValues): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  const firstName = values.firstName.trim();
  if (!firstName) errors.firstName = "required";
  else if (firstName.length > CONTACT_LIMITS.firstName)
    errors.firstName = "tooLong";

  const lastName = values.lastName.trim();
  if (!lastName) errors.lastName = "required";
  else if (lastName.length > CONTACT_LIMITS.lastName)
    errors.lastName = "tooLong";

  const email = values.email.trim();
  if (!email) errors.email = "required";
  else if (email.length > CONTACT_LIMITS.email) errors.email = "tooLong";
  else if (!EMAIL_RE.test(email)) errors.email = "email";

  const phone = values.phone.trim();
  if (phone.length > CONTACT_LIMITS.phone) errors.phone = "tooLong";

  const message = values.message.trim();
  if (!message) errors.message = "required";
  else if (message.length > CONTACT_LIMITS.message) errors.message = "tooLong";

  if (values.privacyConsent !== true) errors.privacyConsent = "consent";

  return errors;
}

const ATTRIBUTION_KEYS = [
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmTerm",
  "utmContent",
  "gclid",
  "landingPage",
  "referrer",
  "page",
] as const satisfies readonly (keyof ContactAttribution)[];

/** Únicos parámetros de URL que la atribución conserva (el resto puede traer datos personales). */
export const ATTRIBUTION_PARAMS: readonly [string, keyof ContactAttribution][] = [
  ["utm_source", "utmSource"],
  ["utm_medium", "utmMedium"],
  ["utm_campaign", "utmCampaign"],
  ["utm_term", "utmTerm"],
  ["utm_content", "utmContent"],
  ["gclid", "gclid"],
];

const ALLOWED_QUERY = new Set(ATTRIBUTION_PARAMS.map(([param]) => param));
const LOCALES = ["en", "es", "pt"];

/**
 * Path + solo los parámetros utm_* / gclid conocidos. Acepta un path relativo
 * ("/es/events?utm_source=x&email=...") o una URL absoluta; devuelve "" si no
 * se puede leer.
 */
export function minimizePath(value: string): string {
  try {
    const url = new URL(value, "https://relier.invalid");
    const kept = new URLSearchParams();
    for (const [k, v] of url.searchParams) {
      if (ALLOWED_QUERY.has(k)) kept.append(k, v);
    }
    const query = kept.toString();
    return url.pathname + (query ? `?${query}` : "");
  } catch {
    return "";
  }
}

/** Referrer reducido a origin: el path y la query pueden traer datos personales. */
export function minimizeReferrer(value: string): string {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.origin : "";
  } catch {
    return "";
  }
}

/** Una línea: sin saltos ni caracteres de control (evita inyectar líneas en asunto/texto del mail). */
function oneLine(value: string) {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, " ").replace(/ {2,}/g, " ").trim();
}

/**
 * Trims every field and drops anything the client shouldn't be trusted with.
 * `allowAttribution` = el visitante tiene consentimiento `marketing` (lo decide
 * el servidor leyendo la cookie, no el cliente). Sin él solo viaja `page`.
 */
export function normalizeContact(
  input: unknown,
  { allowAttribution = true }: { allowAttribution?: boolean } = {}
): ContactPayload {
  const raw = (input ?? {}) as Record<string, unknown>;
  const str = (key: string) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
  const line = (key: string) => oneLine(str(key));

  const seg = str("segment");
  const rawAttr = (raw.attribution ?? {}) as Record<string, unknown>;
  const attr: ContactAttribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    if (!allowAttribution && key !== "page") continue;
    const v = rawAttr[key];
    if (typeof v !== "string" || !v.trim()) continue;
    let clean = oneLine(v).slice(0, 300);
    if (key === "page") clean = minimizePath(clean).split("?")[0];
    else if (key === "landingPage") clean = minimizePath(clean);
    else if (key === "referrer") clean = minimizeReferrer(clean);
    if (clean) attr[key] = clean;
  }
  const locale = str("locale");

  return {
    segment: (CONTACT_SEGMENTS as readonly string[]).includes(seg)
      ? (seg as ContactSegment)
      : undefined,
    company: line("company").slice(0, 120) || undefined,
    attribution: Object.keys(attr).length ? attr : undefined,
    firstName: line("firstName"),
    lastName: line("lastName"),
    email: line("email"),
    phone: line("phone"),
    message: str("message"),
    privacyConsent: raw.privacyConsent === true,
    locale: LOCALES.includes(locale) ? locale : undefined,
    referral: str("referral") || undefined,
  };
}
