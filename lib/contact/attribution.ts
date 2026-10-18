import type { ContactAttribution } from "./schema";

// Atribución de campaña para los formularios (checklist de cierre, oct-2026:
// "atribución de campaña conservada"). Se guarda la PRIMERA entrada de la
// sesión, que es la que trae los UTM: si el visitante navega antes de escribir,
// los parámetros ya no están en la URL del formulario.

const KEY = "relier:attribution";

const PARAMS: [string, keyof ContactAttribution][] = [
  ["utm_source", "utmSource"],
  ["utm_medium", "utmMedium"],
  ["utm_campaign", "utmCampaign"],
  ["utm_term", "utmTerm"],
  ["utm_content", "utmContent"],
  ["gclid", "gclid"],
];

function read(): ContactAttribution | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ContactAttribution) : null;
  } catch {
    return null;
  }
}

/** Guarda la entrada de la sesión si todavía no hay una. Idempotente. */
export function captureAttribution() {
  if (typeof window === "undefined" || read()) return;
  const url = new URL(window.location.href);
  const data: ContactAttribution = {
    landingPage: url.pathname + url.search,
  };
  for (const [param, key] of PARAMS) {
    const v = url.searchParams.get(param);
    if (v) data[key] = v;
  }
  // Sólo referrers externos: el interno no dice de dónde vino la visita.
  if (document.referrer && !document.referrer.startsWith(window.location.origin)) {
    data.referrer = document.referrer;
  }
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Modo privado / storage bloqueado: se manda sin atribución guardada.
  }
}

/** Atribución para adjuntar al envío: la de la sesión + la página actual. */
export function currentAttribution(): ContactAttribution {
  captureAttribution();
  return { ...(read() ?? {}), page: window.location.pathname };
}
