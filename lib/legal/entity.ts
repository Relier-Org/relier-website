// Datos de la entidad para las páginas legales, confirmados por el cliente el
// 22-oct-2026. Lo que sea `null` no aplica y su bloque no se publica. Mientras
// `LEGAL_REVIEWED` sea false las páginas quedan en noindex y fuera del sitemap.
//
// TODO(cliente): pasar LEGAL_REVIEWED a true cuando el abogado del cliente
// (revisión confirmada el 22-oct-2026) apruebe los textos de los tres idiomas.

export const LEGAL_REVIEWED = false;

/** Fecha de vigencia de los textos (ISO). Cambiarla cada vez que se edite una política. */
export const LEGAL_LAST_UPDATED = "2026-10-22";

export const LEGAL_ENTITY = {
  /** Nombre comercial. */
  tradeName: "Relier",
  /** Razón social de la entidad de EE.UU. que opera relier.com. */
  legalName: "Marpa Limo, LLC" as string | null,
  /** Tipo y estado de constitución. El texto publicado vive en `legal.terms.sections.about.p3`. */
  incorporation: "a New York limited liability company" as string | null,
  /** Domicilio legal. Si es el mismo que la oficina pública, se reutiliza. */
  registeredAddress: "240 Kent Ave, Floor B3, Brooklyn, NY 11249, United States" as string | null,
  /** Oficina pública confirmada (cliente, 23-sep-2026). */
  officeAddress: "240 Kent Ave, Brooklyn, NY 11249, United States",
  /** Casilla general confirmada. */
  contactEmail: "info@relier.com",
  /** Casilla para pedidos de privacidad (confirmada: la general). */
  privacyEmail: "info@relier.com" as string | null,
  phone: "+1 (844) 735-4371",
  /** Ley aplicable y fuero de los Terms. El texto publicado vive en `legal.terms.sections.law.p1`. */
  governingLaw: "New York State law; courts of Kings County, NY" as string | null,
  /** Representante en la UE (art. 27 RGPD). El cliente confirmó que no tiene. */
  euRepresentative: null as string | null,
} as const;

/** Entidad española, publicada en el aviso legal de relier.es (21-oct-2026). */
export const EU_AFFILIATE = {
  legalName: "MARPA BARCELONA, S.L.",
  taxId: "B70937370",
  website: "https://relier.es",
} as const;

export const privacyContact = () =>
  LEGAL_ENTITY.privacyEmail ?? LEGAL_ENTITY.contactEmail;
