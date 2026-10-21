// Datos de la entidad para las páginas legales. Todo lo que sea `null` está
// pendiente de confirmar por el cliente: las páginas muestran un texto neutro
// en su lugar y, mientras `LEGAL_REVIEWED` sea false, quedan en noindex y fuera
// del sitemap.
//
// TODO(cliente): completar los null y pasar LEGAL_REVIEWED a true cuando un
// abogado haya revisado los textos de los tres idiomas.

export const LEGAL_REVIEWED = false;

/** Fecha de vigencia de los textos (ISO). Cambiarla cada vez que se edite una política. */
export const LEGAL_LAST_UPDATED = "2026-10-21";

export const LEGAL_ENTITY = {
  /** Nombre comercial: lo único confirmado hoy. */
  tradeName: "Relier",
  /** Razón social de la entidad de EE.UU. que opera relier.com. */
  legalName: null as string | null,
  /** Tipo y estado de constitución (p. ej. "a New York limited liability company"). */
  incorporation: null as string | null,
  /** Domicilio legal. Si es el mismo que la oficina pública, se reutiliza. */
  registeredAddress: null as string | null,
  /** Oficina pública confirmada (cliente, 23-sep-2026). */
  officeAddress: "240 Kent Ave, Brooklyn, NY 11249, United States",
  /** Casilla general confirmada. */
  contactEmail: "info@relier.com",
  /** Casilla para pedidos de privacidad. Hasta que exista, se usa la general. */
  privacyEmail: null as string | null,
  phone: "+1 (844) 735-4371",
  /** Ley aplicable y fuero de los Terms. */
  governingLaw: null as string | null,
  /** Representante en la UE (art. 27 RGPD) si la entidad de EE.UU. no tiene establecimiento en la UE. */
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
