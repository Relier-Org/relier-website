// Carga de tags condicionada al consentimiento (opt-in global, oct-2026).
//
// Nada de esto corre en el server ni en el HTML inicial: los tags se inyectan
// desde ConsentTags, en el navegador, recién cuando la categoría está concedida.
// Por eso no hay <Script> de next ni <noscript>: sin JS no hay forma de pedir
// consentimiento, así que sin JS no se carga nada.
//
// Google Consent Mode v2: el `consent default` se empuja al dataLayer antes del
// primer tag, con los valores ya elegidos (no hace falta `wait_for_update`
// porque nunca cargamos antes de que el visitante decida).

import type { ConsentChoice } from "@/lib/consent/state";
import { REVOCABLE_COOKIE_PREFIXES } from "@/lib/legal/cookies";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

function gtag(): Gtag {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    // gtag.js y GTM sólo reconocen comandos empujados como `arguments`, no como
    // arrays: por eso la función clásica y no un arrow con rest.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  return window.gtag;
}

function consentState(choice: ConsentChoice) {
  const ads = choice.marketing ? "granted" : "denied";
  return {
    analytics_storage: choice.analytics ? "granted" : "denied",
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  };
}

let defaultSent = false;

/**
 * Primera llamada: `consent default`. Las siguientes (el visitante cambió de
 * opinión sin recargar): `consent update`. Siempre antes de cargar un tag.
 */
export function pushConsent(choice: ConsentChoice) {
  gtag()("consent", defaultSent ? "update" : "default", consentState(choice));
  defaultSent = true;
}

function injectScript(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

/**
 * GA4 via gtag.js.
 *
 * Wired directly rather than through GTM because neither of the client's
 * containers actually carries a GA4 tag — measured by loading each container in
 * isolation and watching what hit the wire. On WordPress, GA4 `G-CV2QZ9VV0M`
 * arrives through Google Site Kit's own `GT-NB9VDKSH` tag, which we have no
 * equivalent of here.
 *
 * If the performance team later adds a GA4 tag to GTM-KCLH74B7, drop
 * `NEXT_PUBLIC_GA4_ID` and this stops loading — no code change needed.
 * Leaving both on would double-count every pageview.
 *
 * The first id owns the gtag.js load; the rest are extra destinations.
 * send_page_view stays on: `config` fires the first pageview, and GA4 enhanced
 * measurement covers client-side navigations from there (see Analytics.tsx).
 */
export function loadGA4(ids: readonly string[]) {
  if (ids.length === 0) return;
  const g = gtag();
  g("js", new Date());
  for (const id of ids) {
    g("config", id, { cookie_flags: "SameSite=None;Secure" });
  }
  injectScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids[0])}`);
}

/**
 * Google Tag Manager container.
 *
 * One container is all we install. Everything else the performance team runs —
 * Meta pixel `4423881761234988`, Google Ads `AW-17772455341` — is configured
 * *inside* the container and resolves at runtime. Hardcoding a gtag or fbq
 * snippet on top would double-count every pageview and every conversion.
 *
 * Es el snippet oficial sin la IIFE: mismo push de `gtm.start` y mismo src.
 * El <noscript> con el iframe ns.html se sacó a propósito (oct-2026): sin JS no
 * se puede pedir consentimiento.
 */
export function loadGTM(id: string) {
  if (!id) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  injectScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`);
}

/**
 * Borra las cookies de una categoría retirada. GA4 y el linker de Ads las fijan
 * en el dominio "registrable" (`.relier.com`), y algunas quedan host-only, así
 * que se expira cada nombre en el host y en cada dominio padre (sin llegar al
 * TLD), siempre con path `/`.
 */
export function clearCategoryCookies(category: keyof typeof REVOCABLE_COOKIE_PREFIXES) {
  const prefixes = REVOCABLE_COOKIE_PREFIXES[category];
  const names = document.cookie
    .split("; ")
    .map((c) => c.split("=")[0])
    .filter((name) => name && prefixes.some((p) => name.startsWith(p)));
  if (names.length === 0) return;

  const labels = window.location.hostname.split(".");
  const domains: (string | null)[] = [null];
  for (let i = 0; i <= labels.length - 2; i++) {
    domains.push(`.${labels.slice(i).join(".")}`);
  }

  const expired = "Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=/";
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; ${expired}${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}

