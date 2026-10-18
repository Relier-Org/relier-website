"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/contact/attribution";

/**
 * Guarda la entrada de la sesión (UTM, gclid, referrer) apenas carga cualquier
 * página, así un lead que llega por campaña al home y escribe después desde
 * otra página conserva su atribución. No renderiza nada.
 */
export default function AttributionCapture() {
  useEffect(() => captureAttribution(), []);
  return null;
}
