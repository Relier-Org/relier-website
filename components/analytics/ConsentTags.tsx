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
    apply(initial);

    return onConsentChange((record) => {
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
  }, [gtmId, ga4Ids]);

  return null;
}
