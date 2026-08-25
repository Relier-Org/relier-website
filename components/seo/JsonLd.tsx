import { businessNode, graph, websiteNode } from "@/lib/seo/schema";

// El WordPress traía un Organization inservible: el `name` era el title
// completo con keyword stuffing ("New York Logistics & Transportation. New York
// Concierge | Relier"), con entidades HTML sin decodificar, y la `description`
// repetía ese mismo string. No se portó — esto está escrito de cero.
//
// Este bloque va en el layout y por lo tanto en todas las páginas: es la
// entidad estable del sitio (Organization + WebSite, lo que el schema map pide
// para la Home). Los nodos por página los emite `PageSchema` y referencian
// estos por @id. Los nodos viven en lib/seo/schema.ts para que ambos los
// compartan.

const SITE_GRAPH = graph([businessNode, websiteNode]);

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // El objeto es literal y no toma input del usuario, así que no hay
      // superficie de inyección acá.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_GRAPH) }}
    />
  );
}
