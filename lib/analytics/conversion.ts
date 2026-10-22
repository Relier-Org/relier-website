// Conversión de los formularios de consulta (Notion de Andy, Daily 21-oct-2026:
// Flor necesita un identificador estable para medir el envío).
//
// Dos ganchos, para que Flor elija el trigger en GTM:
//  1. Evento `generate_lead` en el dataLayer (trigger "Custom Event"). Es el
//     recomendado: sólo dispara cuando /api/contact respondió OK.
//  2. El estado de éxito en el DOM: `#form-success-<form>` con la class
//     `relier-form-success` (trigger "Element Visibility").
//
// GA4 no está en el contenedor de GTM, se carga directo con gtag (ver
// lib/analytics/config.ts): por eso además del push para GTM va un
// `gtag("event")`, que sólo existe si el visitante aceptó analytics. GA4 no lee
// los push de objetos, así que no hay doble conteo.
//
// La reserva del iframe de Limo Anywhere no pasa por acá: su confirmación vive
// dentro del iframe y se mide con lo que configuró Andrew en GTM/GA4.

/** `contact` = /contact; el resto, el segmento de la landing de For Business. */
export type LeadForm = "contact" | "events" | "corporate" | "affiliates" | "travelAdvisors";

export const SUCCESS_CLASS = "relier-form-success";
export const successId = (form: LeadForm) => `form-success-${form}`;

export function trackLead(form: LeadForm, locale: string) {
  if (typeof window === "undefined") return;
  const params = { form_name: form, form_locale: locale };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "generate_lead", ...params });
  window.gtag?.("event", "generate_lead", params);
}
