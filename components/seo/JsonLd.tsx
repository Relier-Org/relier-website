import { ORIGIN } from "@/lib/i18n/seo";

// El WordPress traía un Organization inservible: el `name` era el title
// completo con keyword stuffing ("New York Logistics & Transportation. New York
// Concierge | Relier"), con entidades HTML sin decodificar, y la `description`
// repetía ese mismo string. No se portó — esto está escrito de cero.
//
// Todos los datos salen del repo (Footer.tsx y el embed de Google Maps). Nada
// inventado: sin `sameAs` porque no hay URLs de perfiles sociales en el código
// (los links del footer son share intents), y sin `aggregateRating` porque no
// hay una fuente real de reviews.
//
// TODO: cuando el cliente confirme la dirección de Barcelona (ver Footer.tsx),
// agregarla como segundo nodo `LimousineService` con su propio @id.

const BUSINESS_ID = `${ORIGIN}/#business`;
const WEBSITE_ID = `${ORIGIN}/#website`;

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      // Subtipo de LocalBusiness: más preciso que Organization pelado y es el
      // que Google entiende para servicios de chofer.
      "@type": "LimousineService",
      "@id": BUSINESS_ID,
      name: "Relier",
      alternateName: "Relier Worldwide Chauffeured Services",
      description:
        "Personal mobility concierge. Chauffeured ground transportation across the Americas, Europe, and the Middle East.",
      url: ORIGIN,
      telephone: "+1-844-735-4371",
      email: "info@relier.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "240 Kent Ave, 3rd Floor B14",
        addressLocality: "Brooklyn",
        addressRegion: "NY",
        postalCode: "11249",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 40.7170066,
        longitude: -73.9682732,
      },
      areaServed: [
        { "@type": "Place", name: "Americas" },
        { "@type": "Place", name: "Europe" },
        { "@type": "Place", name: "Middle East" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: ORIGIN,
      name: "Relier",
      publisher: { "@id": BUSINESS_ID },
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // El objeto es literal y no toma input del usuario, así que no hay
      // superficie de inyección acá.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
