"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/contact/attribution";
import { onConsentChange } from "@/lib/consent/state";

/**
 * Guarda la entrada de la sesión (UTM, gclid, referrer) apenas carga cualquier
 * página, así un lead que llega por campaña al home y escribe después desde
 * otra página conserva su atribución. No renderiza nada.
 *
 * La atribución es categoría `marketing`: sin ese consentimiento no se guarda
 * nada. Si se concede después, se captura en ese momento (la URL de entrada ya
 * no está, pero el referrer y los parámetros de la página actual sí).
 *
 * Se llama siempre, sin chequear el consentimiento acá: `captureAttribution`
 * decide sola, y sin consentimiento borra lo que haya quedado guardado de antes
 * de una revocación.
 */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
    return onConsentChange(() => captureAttribution());
  }, []);
  return null;
}
