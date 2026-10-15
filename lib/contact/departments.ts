/**
 * Contactos oficiales por departamento (doc del cliente, 23-sep-2026). Sólo
 * EE.UU. por ahora: España (info@relier.es) queda afuera hasta tener el número
 * real. Las labels viven en `pages.contact.info.departments.<id>`.
 */
export type Department = {
  id: "reservations" | "events" | "affiliates";
  email: string;
  phone: { display: string; tel: string };
  whatsapp?: { display: string; number: string };
};

export const DEPARTMENTS: Department[] = [
  {
    id: "reservations",
    email: "reservations@relier.com",
    phone: { display: "+1 (347) 544-9511", tel: "+13475449511" },
    whatsapp: { display: "+1 (917) 275-0000", number: "19172750000" },
  },
  {
    id: "events",
    email: "events@relier.com",
    phone: { display: "+1 (585) 505-6115", tel: "+15855056115" },
  },
  {
    id: "affiliates",
    email: "info@relier.com",
    phone: { display: "+1 (844) 735-4371", tel: "+18447354371" },
    whatsapp: { display: "+1 (347) 855-0000", number: "13478550000" },
  },
];
