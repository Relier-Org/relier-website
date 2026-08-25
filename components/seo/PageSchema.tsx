import { graph, type SchemaNode } from "@/lib/seo/schema";

/**
 * Segundo bloque de JSON-LD, con los nodos específicos de la página (Service,
 * CollectionPage, BlogPosting, BreadcrumbList…). El primero lo emite
 * `JsonLd` desde el layout y lleva la entidad de negocio + el WebSite; los
 * nodos de acá los referencian por @id en lugar de repetirlos.
 */
export default function PageSchema({ nodes }: { nodes: SchemaNode[] }) {
  return (
    <script
      type="application/ld+json"
      // El grafo se arma con datos del repo y las traducciones, no con input
      // del usuario, así que no hay superficie de inyección acá.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph(nodes)) }}
    />
  );
}
