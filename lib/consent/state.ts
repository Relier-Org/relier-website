// Estado del consentimiento de cookies. Única fuente de verdad para el banner,
// los tags de analytics y la atribución de los forms: nada que escriba cookies o
// storage no esencial corre sin pasar por acá.
//
// Modelo opt-out global desde el 23-oct-2026 (OK de Relier; antes, opt-in desde
// el 21-oct): sin una elección guardada, analytics y marketing están activos y
// el banner es un aviso con la opción de desactivarlos. Excepción: con Global
// Privacy Control en el navegador, marketing arranca apagado (CCPA/CPRA).
//
// Se guarda en una cookie propia de primera parte (no localStorage) para que el
// script inline del layout pueda leerla antes de hidratar si algún día hace
// falta, y para que caduque sola.

export type ConsentCategory = "analytics" | "marketing";

export type ConsentChoice = Record<ConsentCategory, boolean>;

export type ConsentRecord = ConsentChoice & {
  /** Versión de la política aceptada. Si cambia, la elección anterior deja de valer. */
  version: number;
  /** ISO 8601 de cuándo se decidió. */
  at: string;
};

export const CONSENT_COOKIE = "relier_consent";

/**
 * Subirlo cuando cambien las categorías o los proveedores de la Cookie Policy:
 * los consentimientos anteriores dejan de valer y el banner vuelve a salir.
 *
 * No se subió al pasar a opt-out (23-oct-2026) a propósito: quien había
 * rechazado con el modelo anterior conserva su rechazo.
 */
export const CONSENT_VERSION = 1;

/** 180 días: dentro del máximo de 24 meses de la AEPD y del criterio de 6 meses de la CNIL. */
export const CONSENT_MAX_AGE_DAYS = 180;

export const CONSENT_EVENT = "relier:consent";

function parse(raw: string | undefined): ConsentRecord | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentRecord>;
    if (data.version !== CONSENT_VERSION) return null;
    return {
      analytics: data.analytics === true,
      marketing: data.marketing === true,
      version: data.version,
      at: typeof data.at === "string" ? data.at : "",
    };
  } catch {
    return null;
  }
}

/** Decisión vigente, o null si el visitante todavía no eligió (o eligió con otra versión). */
export function readConsent(): ConsentRecord | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  return parse(match?.slice(CONSENT_COOKIE.length + 1));
}

/** Señal Global Privacy Control del navegador (opt-out de venta/uso compartido). */
function hasGpc(): boolean {
  return (
    typeof navigator !== "undefined" &&
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true
  );
}

/** Lo que rige sin elección guardada: todo activo, salvo marketing con GPC. */
export function defaultConsent(): ConsentChoice {
  return { analytics: true, marketing: !hasGpc() };
}

/** Elección vigente si la hay; si no, el default del modelo opt-out. */
export function effectiveConsent(): ConsentChoice {
  const record = readConsent();
  return record
    ? { analytics: record.analytics, marketing: record.marketing }
    : defaultConsent();
}

export function hasConsent(category: ConsentCategory): boolean {
  return effectiveConsent()[category];
}

export function writeConsent(choice: ConsentChoice): ConsentRecord {
  const record: ConsentRecord = {
    analytics: choice.analytics,
    marketing: choice.marketing,
    version: CONSENT_VERSION,
    at: new Date().toISOString(),
  };
  const value = encodeURIComponent(JSON.stringify(record));
  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent<ConsentRecord>(CONSENT_EVENT, { detail: record }));
  return record;
}

/** Se suscribe a cambios de consentimiento en esta pestaña. Devuelve el unsubscribe. */
export function onConsentChange(cb: (record: ConsentRecord) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<ConsentRecord>).detail);
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

/** Evento para reabrir el panel de preferencias (link "Cookie settings" del footer). */
export const OPEN_PREFERENCES_EVENT = "relier:consent-open";

export function openConsentPreferences() {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
