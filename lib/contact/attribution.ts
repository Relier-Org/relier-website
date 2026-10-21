import { hasConsent } from "@/lib/consent/state";
import {
  ATTRIBUTION_PARAMS,
  minimizePath,
  minimizeReferrer,
  type ContactAttribution,
} from "./schema";

// Atribución de campaña para los formularios (checklist de cierre, oct-2026:
// "atribución de campaña conservada"). Se guarda la PRIMERA entrada de la
// sesión, que es la que trae los UTM: si el visitante navega antes de escribir,
// los parámetros ya no están en la URL del formulario.
//
// Es almacenamiento con fin de marketing: solo se guarda y se envía con
// consentimiento `marketing` (opt-in de cookies, oct-2026). Esta comprobación
// es propia, aunque quien llame ya la haya hecho. Minimización: landingPage
// conserva solo utm_* / gclid y referrer queda en el origin.

const KEY = "relier:attribution";

function read(): ContactAttribution | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ContactAttribution) : null;
  } catch {
    return null;
  }
}

function clear() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Storage bloqueado: no hay nada que borrar.
  }
}

/**
 * Guarda la entrada de la sesión si todavía no hay una. Idempotente. Sin
 * consentimiento `marketing` no escribe y borra lo que hubiera (consentimiento
 * retirado a mitad de sesión).
 */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  if (!hasConsent("marketing")) {
    clear();
    return;
  }
  if (read()) return;
  const url = new URL(window.location.href);
  const data: ContactAttribution = {
    landingPage: minimizePath(url.pathname + url.search),
  };
  for (const [param, key] of ATTRIBUTION_PARAMS) {
    const v = url.searchParams.get(param);
    if (v) data[key] = v;
  }
  // Sólo referrers externos: el interno no dice de dónde vino la visita.
  const referrer = document.referrer ? minimizeReferrer(document.referrer) : "";
  if (referrer && referrer !== window.location.origin) {
    data.referrer = referrer;
  }
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Modo privado / storage bloqueado: se manda sin atribución guardada.
  }
}

/**
 * Atribución para adjuntar al envío. Siempre lleva `page` (página del sitio
 * desde la que se envía: dato operativo, no tracking, sin query). La de la
 * sesión solo con consentimiento `marketing`.
 */
export function currentAttribution(): ContactAttribution {
  const page = window.location.pathname;
  if (!hasConsent("marketing")) {
    clear();
    return { page };
  }
  captureAttribution();
  return { ...(read() ?? {}), page };
}
