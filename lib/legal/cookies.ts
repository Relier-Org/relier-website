// Inventario de cookies y almacenamiento del sitio. Lo leen la Cookie Policy y
// el panel de preferencias, así la lista que ve el visitante es la misma que
// gobierna el banner. Relevado del código el 21-oct-2026; los nombres de los
// tags salen de lo que GA4, Google Ads y Meta documentan para sus snippets.
//
// Si se suma un proveedor: agregarlo acá, en la Cookie Policy de los tres
// idiomas, y subir CONSENT_VERSION en lib/consent/state.ts.

export type CookieCategory = "necessary" | "analytics" | "marketing";

export type CookieEntry = {
  name: string;
  provider: string;
  category: CookieCategory;
  /** Key de messages `legal.cookies.purpose.*`. */
  purposeKey: string;
  /** Key de messages `legal.cookies.duration.*`. */
  durationKey: string;
  /** cookie de primera parte, de tercera, o storage del navegador. */
  kind: "firstParty" | "thirdParty" | "sessionStorage";
};

export const COOKIES: CookieEntry[] = [
  {
    name: "relier_consent",
    provider: "Relier",
    category: "necessary",
    purposeKey: "consent",
    durationKey: "days180",
    kind: "firstParty",
  },
  {
    name: "NEXT_LOCALE",
    provider: "Relier",
    category: "necessary",
    purposeKey: "locale",
    durationKey: "session",
    kind: "firstParty",
  },
  {
    // El formulario de reservas embebido (iframe de Limo Anywhere / AddOns.LA).
    // Sus cookies las fija el proveedor; no controlamos nombres ni duración.
    name: "relier.addons.la, relier.mylimobiz.com",
    provider: "Limo Anywhere (AddOns.LA)",
    category: "necessary",
    purposeKey: "booking",
    durationKey: "provider",
    kind: "thirdParty",
  },
  {
    name: "_ga, _ga_*",
    provider: "Google Analytics 4",
    category: "analytics",
    purposeKey: "ga",
    durationKey: "months24",
    kind: "firstParty",
  },
  {
    name: "_gcl_au",
    provider: "Google Ads (Google Tag Manager)",
    category: "marketing",
    purposeKey: "ads",
    durationKey: "days90",
    kind: "firstParty",
  },
  {
    name: "_fbp, _fbc",
    provider: "Meta Pixel (Google Tag Manager)",
    category: "marketing",
    purposeKey: "meta",
    durationKey: "days90",
    kind: "firstParty",
  },
  {
    name: "relier:attribution",
    provider: "Relier",
    category: "marketing",
    purposeKey: "attribution",
    durationKey: "session",
    kind: "sessionStorage",
  },
];

/** Prefijos de cookies a borrar cuando se retira el consentimiento. */
export const REVOCABLE_COOKIE_PREFIXES: Record<"analytics" | "marketing", string[]> = {
  analytics: ["_ga"],
  marketing: ["_gcl", "_fbp", "_fbc"],
};
