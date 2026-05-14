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

export async function searchPlaces(
  query: string,
  signal?: AbortSignal
): Promise<PlaceFeature[]> {
  if (!query.trim()) return [];
  const url = new URL(GEOCODING_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "5");
  url.searchParams.set("lang", "en");

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
    const name = primary || secondary || "Unknown";
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

export function formatDistance(meters: number): string {
  const miles = meters / 1609.34;
  return `${miles.toFixed(1)} mi`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
