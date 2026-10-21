"use client";

import { useEffect } from "react";
import {
  onConsentChange,
  readConsent,
  type ConsentCategory,
  type ConsentChoice,
} from "@/lib/consent/state";
import { clearCategoryCookies, loadGA4, loadGTM, pushConsent } from "./tags";

const CATEGORIES: ConsentCategory[] = ["analytics", "marketing"];

/**
 * Inyecta GA4 (analytics) y GTM (marketing: Ads + Meta) sólo con la categoría
 * concedida. No renderiza nada: todo pasa después de montar, así el HTML
 * estático de las páginas no cambia ni lee la cookie en el server.
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

    const initial = readConsent();
    // Higiene: cookies de una categoría no concedida (consentimiento vencido,
    // versión nueva de la política, rechazo previo) no tienen por qué seguir.
    for (const c of CATEGORIES) {
      if (!initial?.[c]) clearCategoryCookies(c);
    }
    if (initial) apply(initial);

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
