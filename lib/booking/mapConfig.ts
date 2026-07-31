// Central config for map / geocoding / routing providers.
// MVP uses free providers (no API key, no CC). Swap to Mapbox/Google when client approves.

export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/dark";

export const GEOCODING_URL = "https://photon.komoot.io/api/";

export const REVERSE_GEOCODING_URL = "https://photon.komoot.io/reverse";

// OSRM public demo — fine for client demo, not for production scale.
// Format: /route/v1/{profile}/{lon1},{lat1};{lon2},{lat2}
export const DIRECTIONS_URL = "https://router.project-osrm.org/route/v1/driving";

export type PlaceFeature = {
  id: string;
  name: string;
  fullName: string;
  coords: [number, number]; // [lon, lat]
};

export type RouteSummary = {
  geometry: GeoJSON.LineString;
  distanceMeters: number;
  durationSeconds: number;
};

// Photon only accepts these; anything else 400s. "default" returns native names.
const PHOTON_LANGS = new Set(["de", "en", "fr", "it"]);

function photonLang(locale?: string): string {
  const base = locale?.split("-")[0].toLowerCase();
  return base && PHOTON_LANGS.has(base) ? base : "default";
}

export type SearchPlacesOptions = {
  locale?: string;
  /** Localized label used when a result carries no usable name. */
  unknownLabel?: string;
};

export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
  options?: SearchPlacesOptions
): Promise<PlaceFeature[]> {
  if (!query.trim()) return [];
  const url = new URL(GEOCODING_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "5");
  url.searchParams.set("lang", photonLang(options?.locale));

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = (await res.json()) as {
    features: Array<{
      properties: {
        osm_id: number;
        name?: string;
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        postcode?: string;
        housenumber?: string;
      };
      geometry: { coordinates: [number, number] };
    }>;
  };

  return data.features.map((f, i) => {
    const p = f.properties;
    const primary =
      [p.housenumber, p.street].filter(Boolean).join(" ") || p.name || "";
    const secondary = [p.city, p.state, p.country].filter(Boolean).join(", ");
    const name = primary || secondary || options?.unknownLabel || "Unknown";
    const fullName = [primary, secondary].filter(Boolean).join(", ");
    return {
      id: `${p.osm_id ?? i}`,
      name,
      fullName: fullName || name,
      coords: f.geometry.coordinates,
    };
  });
}

export async function fetchRoute(
  from: [number, number],
  to: [number, number],
  signal?: AbortSignal
): Promise<RouteSummary> {
  const coords = `${from[0]},${from[1]};${to[0]},${to[1]}`;
  const url = `${DIRECTIONS_URL}/${coords}?overview=full&geometries=geojson`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Routing failed: ${res.status}`);
  const data = (await res.json()) as {
    routes: Array<{
      geometry: GeoJSON.LineString;
      distance: number;
      duration: number;
    }>;
  };
  const route = data.routes[0];
  if (!route) throw new Error("No route found");
  return {
    geometry: route.geometry,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
  };
}

// Distances stay in miles (US-operated service); only the number formatting
// follows the locale — es/pt render "12,4 mi".
export function formatDistance(meters: number, locale = "en"): string {
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "mile",
    unitDisplay: "short",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(meters / 1609.34);
}

/** Raw parts; the localized string is assembled from booking messages. */
export function splitDuration(seconds: number): { hours: number; minutes: number } {
  const mins = Math.round(seconds / 60);
  return { hours: Math.floor(mins / 60), minutes: mins % 60 };
}
