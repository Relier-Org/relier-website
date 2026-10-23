"use client";

import { useEffect } from "react";
import {
  effectiveConsent,
  onConsentChange,
  type ConsentCategory,
  type ConsentChoice,
} from "@/lib/consent/state";
import { clearCategoryCookies, loadGA4, loadGTM, pushConsent } from "./tags";

const CATEGORIES: ConsentCategory[] = ["analytics", "marketing"];

/** Tope de espera desde que monta, por si el `load` se demora (iframe lento). */
const MAX_DEFER_MS = 4000;

/**
 * Corre `cb` después del `load` de la página y en un momento ocioso del hilo
 * principal, o a los MAX_DEFER_MS de montar, lo que pase primero (perf
 * oct-2026: GTM + gtag + Meta + Clarity eran las tareas largas de la carga y
 * entraban en la cadena del LCP). Los eventos publicados antes quedan en el
 * dataLayer y GTM/gtag los procesan al cargar: no se pierde ninguno.
 */
function afterLoadIdle(cb: () => void): () => void {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    cb();
  };
  const idle = () =>
    // Safari no tiene requestIdleCallback.
    typeof window.requestIdleCallback === "function"
      ? window.requestIdleCallback(run, { timeout: 1500 })
      : window.setTimeout(run, 1);
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
  const cap = window.setTimeout(run, MAX_DEFER_MS);
  return () => {
    done = true;
    window.removeEventListener("load", idle);
    window.clearTimeout(cap);
  };
}

/**
 * Inyecta GA4 (analytics) y GTM (marketing: Ads + Meta) según la categoría
 * vigente: la elegida o, sin elección, el default opt-out (todo activo salvo
 * marketing con GPC). No renderiza nada: todo pasa después de montar, así el
 * HTML estático de las páginas no cambia ni lee la cookie en el server.
 *
 * - Concedido en caliente: se carga lo que falta, sin recargar.
 * - Retirado algo ya cargado: `consent update` a denied, se borran sus cookies
 *   y se recarga, que es la única forma de descargar gtag.js / gtm.js.
 */
export default function ConsentTags({
  gtmId,
  ga4Ids,
}: {
  gtmId: string;
  ga4Ids: readonly string[];
}) {
  useEffect(() => {
    // Lo que está cargado en esta página. Sólo crece: retirar recarga.
    const loaded: ConsentChoice = { analytics: false, marketing: false };
    const available: ConsentChoice = {
      analytics: ga4Ids.length > 0,
      marketing: Boolean(gtmId),
    };

    const apply = (choice: ConsentChoice) => {
      const toLoad = CATEGORIES.filter(
        (c) => choice[c] && available[c] && !loaded[c]
      );
      if (toLoad.length === 0) return;
      pushConsent(choice);
      for (const c of toLoad) {
        loaded[c] = true;
        if (c === "analytics") loadGA4(ga4Ids);
        else loadGTM(gtmId);
      }
    };

    const initial = effectiveConsent();
    // Higiene: cookies de una categoría desactivada (rechazo previo, GPC) no
    // tienen por qué seguir.
    for (const c of CATEGORIES) {
      if (!initial[c]) clearCategoryCookies(c);
    }
    // La primera carga va diferida; se aplica lo vigente en ese momento, por si
    // el visitante eligió algo en el banner mientras tanto.
    const cancelDeferred = afterLoadIdle(() => apply(effectiveConsent()));

    const unsubscribe = onConsentChange((record) => {
      const revoked = CATEGORIES.some((c) => loaded[c] && !record[c]);
      if (revoked) pushConsent(record);
      for (const c of CATEGORIES) {
        if (!record[c]) clearCategoryCookies(c);
      }
      if (revoked) {
        window.location.reload();
        return;
      }
      apply(record);
    });
    return () => {
      cancelDeferred();
      unsubscribe();
    };
  }, [gtmId, ga4Ids]);

  return null;
}
