// Global coverage dataset (cliente 08-jul: "+500 cities" list). Grouped by
// continent → country → city, with lat/lon so map pins are placed from real
// coordinates via the CoverageMap projection (x = (lon+180)/360, y = (83-lat)/141).
//
// `hub` = the two operating homes (NY + Barcelona), rendered larger + pulsing.
// `important` = curated marquee cities shown in the collapsed list; the rest
// appear under "View all destinations".

export interface City {
  name: string;
  lat: number;
  lon: number;
  hub?: boolean;
  important?: boolean;
}

export interface Country {
  country: string;
  cities: City[];
}

export interface Region {
  label: string;
  countries: Country[];
}

export const COVERAGE: Region[] = [
  {
    label: "Europe",
    countries: [
      {
        country: "Spain",
        cities: [
          { name: "Madrid", lat: 40.42, lon: -3.7, important: true },
          { name: "Barcelona", lat: 41.39, lon: 2.17, hub: true, important: true },
          { name: "Valencia", lat: 39.47, lon: -0.38 },
          { name: "Girona", lat: 41.98, lon: 2.82 },
          { name: "Málaga", lat: 36.72, lon: -4.42 },
          { name: "Marbella", lat: 36.51, lon: -4.89 },
          { name: "Granada", lat: 37.18, lon: -3.6 },
          { name: "Sevilla", lat: 37.39, lon: -5.98 },
          { name: "Bilbao", lat: 43.26, lon: -2.93 },
          { name: "Vitoria", lat: 42.85, lon: -2.67 },
          { name: "San Sebastián", lat: 43.32, lon: -1.98 },
          { name: "Zaragoza", lat: 41.65, lon: -0.89 },
          { name: "León", lat: 42.6, lon: -5.57 },
          { name: "Asturias", lat: 43.36, lon: -5.84 },
          { name: "Santiago de Compostela", lat: 42.88, lon: -8.54 },
          { name: "A Coruña", lat: 43.36, lon: -8.41 },
          { name: "Ibiza", lat: 38.91, lon: 1.43 },
          { name: "Mallorca", lat: 39.57, lon: 2.65 },
          { name: "Menorca", lat: 39.95, lon: 4.11 },
          { name: "Tenerife", lat: 28.29, lon: -16.63 },
          { name: "Gran Canaria", lat: 28.1, lon: -15.41 },
          { name: "La Palma", lat: 28.68, lon: -17.76 },
        ],
      },
      {
        country: "Portugal",
        cities: [
          { name: "Lisbon", lat: 38.72, lon: -9.14 },
          { name: "Porto", lat: 41.15, lon: -8.61 },
        ],
      },
      {
        country: "France",
        cities: [
          { name: "Paris", lat: 48.86, lon: 2.35, important: true },
          { name: "Lyon", lat: 45.76, lon: 4.84 },
          { name: "Bordeaux", lat: 44.84, lon: -0.58 },
          { name: "Nice", lat: 43.7, lon: 7.27 },
          { name: "Cannes", lat: 43.55, lon: 7.02 },
          { name: "Saint-Tropez", lat: 43.27, lon: 6.64 },
          { name: "Monaco", lat: 43.74, lon: 7.42, important: true },
          { name: "French Alps", lat: 45.92, lon: 6.87 },
        ],
      },
      {
        country: "Italy",
        cities: [
          { name: "Rome", lat: 41.9, lon: 12.5, important: true },
          { name: "Milan", lat: 45.46, lon: 9.19, important: true },
          { name: "Venice", lat: 45.44, lon: 12.32 },
          { name: "Florence", lat: 43.77, lon: 11.26 },
          { name: "Bologna", lat: 44.49, lon: 11.34 },
          { name: "Genoa", lat: 44.41, lon: 8.93 },
          { name: "Naples", lat: 40.85, lon: 14.27 },
          { name: "Sicily", lat: 38.12, lon: 13.36 },
          { name: "Sardinia", lat: 39.22, lon: 9.12 },
          { name: "Lake Como", lat: 45.99, lon: 9.26 },
        ],
      },
      {
        country: "United Kingdom",
        cities: [
          { name: "London", lat: 51.51, lon: -0.13, important: true },
          { name: "Edinburgh", lat: 55.95, lon: -3.19 },
          { name: "Glasgow", lat: 55.86, lon: -4.25 },
          { name: "Manchester", lat: 53.48, lon: -2.24 },
          { name: "Liverpool", lat: 53.41, lon: -2.99 },
          { name: "Birmingham", lat: 52.49, lon: -1.89 },
        ],
      },
      {
        country: "Ireland",
        cities: [{ name: "Dublin", lat: 53.35, lon: -6.26 }],
      },
      {
        country: "Germany",
        cities: [
          { name: "Berlin", lat: 52.52, lon: 13.4 },
          { name: "Munich", lat: 48.14, lon: 11.58 },
          { name: "Frankfurt", lat: 50.11, lon: 8.68 },
          { name: "Hamburg", lat: 53.55, lon: 9.99 },
          { name: "Cologne", lat: 50.94, lon: 6.96 },
          { name: "Düsseldorf", lat: 51.23, lon: 6.78 },
          { name: "Dresden", lat: 51.05, lon: 13.74 },
          { name: "Leipzig", lat: 51.34, lon: 12.37 },
          { name: "Stuttgart", lat: 48.78, lon: 9.18 },
        ],
      },
      {
        country: "Netherlands",
        cities: [
          { name: "Amsterdam", lat: 52.37, lon: 4.9 },
          { name: "Rotterdam", lat: 51.92, lon: 4.48 },
        ],
      },
      {
        country: "Belgium",
        cities: [
          { name: "Brussels", lat: 50.85, lon: 4.35 },
          { name: "Antwerp", lat: 51.22, lon: 4.4 },
          { name: "Bruges", lat: 51.21, lon: 3.22 },
          { name: "Ghent", lat: 51.05, lon: 3.72 },
        ],
      },
      {
        country: "Switzerland",
        cities: [
          { name: "Zurich", lat: 47.38, lon: 8.54, important: true },
          { name: "Geneva", lat: 46.2, lon: 6.14 },
          { name: "Basel", lat: 47.56, lon: 7.59 },
          { name: "Lausanne", lat: 46.52, lon: 6.63 },
          { name: "Montreux", lat: 46.43, lon: 6.91 },
          { name: "Bern", lat: 46.95, lon: 7.45 },
          { name: "Lugano", lat: 46.0, lon: 8.95 },
        ],
      },
      {
        country: "Austria",
        cities: [
          { name: "Vienna", lat: 48.21, lon: 16.37 },
          { name: "Salzburg", lat: 47.81, lon: 13.05 },
          { name: "Innsbruck", lat: 47.27, lon: 11.39 },
        ],
      },
      {
        country: "Czech Republic",
        cities: [{ name: "Prague", lat: 50.08, lon: 14.44 }],
      },
      {
        country: "Hungary",
        cities: [{ name: "Budapest", lat: 47.5, lon: 19.04 }],
      },
      {
        country: "Poland",
        cities: [
          { name: "Warsaw", lat: 52.23, lon: 21.01 },
          { name: "Krakow", lat: 50.06, lon: 19.94 },
          { name: "Gdansk", lat: 54.35, lon: 18.65 },
        ],
      },
      {
        country: "Denmark",
        cities: [{ name: "Copenhagen", lat: 55.68, lon: 12.57 }],
      },
      {
        country: "Sweden",
        cities: [{ name: "Stockholm", lat: 59.33, lon: 18.07 }],
      },
      {
        country: "Norway",
        cities: [
          { name: "Oslo", lat: 59.91, lon: 10.75 },
          { name: "Tromsø", lat: 69.65, lon: 18.96 },
        ],
      },
      {
        country: "Finland",
        cities: [{ name: "Helsinki", lat: 60.17, lon: 24.94 }],
      },
      {
        country: "Greece",
        cities: [
          { name: "Athens", lat: 37.98, lon: 23.73 },
          { name: "Mykonos", lat: 37.45, lon: 25.33 },
          { name: "Paros", lat: 37.08, lon: 25.15 },
          { name: "Santorini", lat: 36.39, lon: 25.46 },
        ],
      },
      {
        country: "Croatia",
        cities: [
          { name: "Split", lat: 43.51, lon: 16.44 },
          { name: "Dubrovnik", lat: 42.65, lon: 18.09 },
        ],
      },
      {
        country: "Malta",
        cities: [{ name: "Valletta", lat: 35.9, lon: 14.51 }],
      },
      {
        country: "Türkiye",
        cities: [{ name: "Istanbul", lat: 41.01, lon: 28.98, important: true }],
      },
      {
        country: "Albania",
        cities: [{ name: "Tirana", lat: 41.33, lon: 19.82 }],
      },
    ],
  },
  {
    label: "North America",
    countries: [
      {
        country: "United States",
        cities: [
          { name: "New York City", lat: 40.71, lon: -74.01, hub: true, important: true },
          { name: "Washington DC", lat: 38.91, lon: -77.04 },
          { name: "Boston", lat: 42.36, lon: -71.06 },
          { name: "Philadelphia", lat: 39.95, lon: -75.17 },
          { name: "Baltimore", lat: 39.29, lon: -76.61 },
          { name: "Miami", lat: 25.76, lon: -80.19, important: true },
          { name: "Fort Lauderdale", lat: 26.12, lon: -80.14 },
          { name: "Boca Raton", lat: 26.36, lon: -80.08 },
          { name: "Orlando", lat: 28.54, lon: -81.38 },
          { name: "Tampa", lat: 27.95, lon: -82.46 },
          { name: "Jacksonville", lat: 30.33, lon: -81.66 },
          { name: "Atlanta", lat: 33.75, lon: -84.39 },
          { name: "Charlotte", lat: 35.23, lon: -80.84 },
          { name: "Charleston", lat: 32.78, lon: -79.93 },
          { name: "Nashville", lat: 36.16, lon: -86.78 },
          { name: "New Orleans", lat: 29.95, lon: -90.07 },
          { name: "Chicago", lat: 41.88, lon: -87.63, important: true },
          { name: "Detroit", lat: 42.33, lon: -83.05 },
          { name: "Cleveland", lat: 41.5, lon: -81.69 },
          { name: "Columbus", lat: 39.96, lon: -83.0 },
          { name: "Cincinnati", lat: 39.1, lon: -84.51 },
          { name: "Indianapolis", lat: 39.77, lon: -86.16 },
          { name: "Minneapolis", lat: 44.98, lon: -93.27 },
          { name: "Kansas City", lat: 39.1, lon: -94.58 },
          { name: "St. Louis", lat: 38.63, lon: -90.2 },
          { name: "Dallas", lat: 32.78, lon: -96.8 },
          { name: "Fort Worth", lat: 32.76, lon: -97.33 },
          { name: "Houston", lat: 29.76, lon: -95.37 },
          { name: "Austin", lat: 30.27, lon: -97.74 },
          { name: "San Antonio", lat: 29.42, lon: -98.49 },
          { name: "El Paso", lat: 31.76, lon: -106.49 },
          { name: "Denver", lat: 39.74, lon: -104.99 },
          { name: "Aspen", lat: 39.19, lon: -106.82 },
          { name: "Phoenix", lat: 33.45, lon: -112.07 },
          { name: "Las Vegas", lat: 36.17, lon: -115.14, important: true },
          { name: "Los Angeles", lat: 34.05, lon: -118.24, important: true },
          { name: "Orange County", lat: 33.72, lon: -117.83 },
          { name: "San Diego", lat: 32.72, lon: -117.16 },
          { name: "San Francisco", lat: 37.77, lon: -122.42, important: true },
          { name: "Silicon Valley", lat: 37.39, lon: -122.08 },
          { name: "San Jose", lat: 37.34, lon: -121.89 },
          { name: "Sacramento", lat: 38.58, lon: -121.49 },
          { name: "Portland", lat: 45.52, lon: -122.68 },
          { name: "Seattle", lat: 47.61, lon: -122.33 },
          { name: "Anchorage", lat: 61.22, lon: -149.9 },
          { name: "Honolulu", lat: 21.31, lon: -157.86 },
          { name: "Maui", lat: 20.8, lon: -156.33 },
          { name: "Kauai", lat: 22.06, lon: -159.53 },
          { name: "Kona", lat: 19.64, lon: -155.99 },
        ],
      },
      {
        country: "Canada",
        cities: [
          { name: "Toronto", lat: 43.65, lon: -79.38, important: true },
          { name: "Ottawa", lat: 45.42, lon: -75.7 },
          { name: "Montreal", lat: 45.5, lon: -73.57 },
          { name: "Quebec City", lat: 46.81, lon: -71.21 },
          { name: "Calgary", lat: 51.05, lon: -114.07 },
          { name: "Vancouver", lat: 49.28, lon: -123.12 },
        ],
      },
      {
        country: "Mexico",
        cities: [
          { name: "Mexico City", lat: 19.43, lon: -99.13, important: true },
          { name: "Cancun", lat: 21.16, lon: -86.85 },
          { name: "Riviera Maya", lat: 20.63, lon: -87.07 },
          { name: "Tulum", lat: 20.21, lon: -87.47 },
          { name: "Playa del Carmen", lat: 20.63, lon: -87.08 },
          { name: "Puerto Vallarta", lat: 20.65, lon: -105.22 },
          { name: "Los Cabos", lat: 22.89, lon: -109.92 },
          { name: "Guadalajara", lat: 20.67, lon: -103.35 },
          { name: "Monterrey", lat: 25.69, lon: -100.32 },
        ],
      },
    ],
  },
  {
    label: "Latin America",
    countries: [
      {
        country: "Argentina",
        cities: [{ name: "Buenos Aires", lat: -34.6, lon: -58.38, important: true }],
      },
      {
        country: "Brazil",
        cities: [
          { name: "São Paulo", lat: -23.55, lon: -46.63, important: true },
          { name: "Rio de Janeiro", lat: -22.91, lon: -43.17, important: true },
          { name: "Brasília", lat: -15.79, lon: -47.88 },
          { name: "Salvador", lat: -12.97, lon: -38.51 },
        ],
      },
      {
        country: "Chile",
        cities: [{ name: "Santiago", lat: -33.45, lon: -70.67, important: true }],
      },
      {
        country: "Uruguay",
        cities: [
          { name: "Montevideo", lat: -34.9, lon: -56.16 },
          { name: "Punta del Este", lat: -34.95, lon: -54.95, important: true },
        ],
      },
      {
        country: "Peru",
        cities: [{ name: "Lima", lat: -12.05, lon: -77.04, important: true }],
      },
      {
        country: "Ecuador",
        cities: [{ name: "Quito", lat: -0.18, lon: -78.47 }],
      },
      {
        country: "Bolivia",
        cities: [{ name: "La Paz", lat: -16.5, lon: -68.15 }],
      },
    ],
  },
  {
    label: "Middle East",
    countries: [
      {
        country: "United Arab Emirates",
        cities: [
          { name: "Dubai", lat: 25.2, lon: 55.27, important: true },
          { name: "Abu Dhabi", lat: 24.45, lon: 54.38, important: true },
        ],
      },
      {
        country: "Qatar",
        cities: [{ name: "Doha", lat: 25.29, lon: 51.53, important: true }],
      },
      {
        country: "Saudi Arabia",
        cities: [
          { name: "Riyadh", lat: 24.71, lon: 46.68, important: true },
          { name: "Jeddah", lat: 21.49, lon: 39.19 },
        ],
      },
      {
        country: "Israel",
        cities: [{ name: "Tel Aviv", lat: 32.08, lon: 34.78, important: true }],
      },
    ],
  },
  {
    label: "Africa",
    countries: [
      {
        country: "Morocco",
        cities: [
          { name: "Casablanca", lat: 33.57, lon: -7.59, important: true },
          { name: "Marrakech", lat: 31.63, lon: -7.99, important: true },
          { name: "Rabat", lat: 34.02, lon: -6.83 },
          { name: "Tangier", lat: 35.76, lon: -5.83 },
        ],
      },
      {
        country: "Egypt",
        cities: [
          { name: "Cairo", lat: 30.04, lon: 31.24, important: true },
          { name: "Alexandria", lat: 31.2, lon: 29.92 },
          { name: "Sharm El Sheikh", lat: 27.92, lon: 34.33 },
        ],
      },
      {
        country: "Kenya",
        cities: [
          { name: "Nairobi", lat: -1.29, lon: 36.82 },
          { name: "Mombasa", lat: -4.04, lon: 39.67 },
        ],
      },
      {
        country: "Nigeria",
        cities: [{ name: "Lagos", lat: 6.52, lon: 3.38 }],
      },
      {
        country: "Angola",
        cities: [{ name: "Luanda", lat: -8.84, lon: 13.23 }],
      },
      {
        country: "Senegal",
        cities: [{ name: "Dakar", lat: 14.72, lon: -17.47 }],
      },
      {
        country: "Ethiopia",
        cities: [{ name: "Addis Ababa", lat: 9.03, lon: 38.74 }],
      },
      {
        country: "South Africa",
        cities: [
          { name: "Cape Town", lat: -33.92, lon: 18.42, important: true },
          { name: "Johannesburg", lat: -26.2, lon: 28.05, important: true },
        ],
      },
    ],
  },
  {
    label: "Asia",
    countries: [
      {
        country: "Japan",
        cities: [
          { name: "Tokyo", lat: 35.68, lon: 139.69, important: true },
          { name: "Osaka", lat: 34.69, lon: 135.5 },
          { name: "Kyoto", lat: 35.01, lon: 135.77 },
          { name: "Hiroshima", lat: 34.39, lon: 132.46 },
        ],
      },
      {
        country: "China",
        cities: [
          { name: "Beijing", lat: 39.9, lon: 116.41 },
          { name: "Shanghai", lat: 31.23, lon: 121.47, important: true },
          { name: "Hong Kong", lat: 22.32, lon: 114.17, important: true },
        ],
      },
      {
        country: "South Korea",
        cities: [{ name: "Seoul", lat: 37.57, lon: 126.98, important: true }],
      },
      {
        country: "Singapore",
        cities: [{ name: "Singapore", lat: 1.35, lon: 103.82, important: true }],
      },
      {
        country: "Thailand",
        cities: [{ name: "Bangkok", lat: 13.76, lon: 100.5, important: true }],
      },
      {
        country: "Vietnam",
        cities: [{ name: "Hanoi", lat: 21.03, lon: 105.85 }],
      },
      {
        country: "Malaysia",
        cities: [{ name: "Kuala Lumpur", lat: 3.14, lon: 101.69 }],
      },
      {
        country: "Taiwan",
        cities: [{ name: "Taipei", lat: 25.03, lon: 121.57 }],
      },
      {
        country: "Uzbekistan",
        cities: [{ name: "Tashkent", lat: 41.3, lon: 69.24 }],
      },
      {
        country: "India",
        cities: [
          { name: "Delhi", lat: 28.61, lon: 77.21 },
          { name: "Mumbai", lat: 19.08, lon: 72.88 },
        ],
      },
      {
        country: "Russia",
        cities: [
          { name: "Moscow", lat: 55.76, lon: 37.62 },
          { name: "Saint Petersburg", lat: 59.93, lon: 30.34 },
        ],
      },
    ],
  },
];

/** Every city, flattened — used for map pins. */
export const ALL_CITIES: City[] = COVERAGE.flatMap((r) =>
  r.countries.flatMap((c) => c.cities),
);

/** Curated marquee cities per region — the collapsed list. */
export const IMPORTANT_BY_REGION = COVERAGE.map((r) => ({
  label: r.label,
  cities: r.countries
    .flatMap((c) => c.cities)
    .filter((c) => c.important)
    .map((c) => c.name),
}));

// Projection calibrated by least-squares against the actual country geometry
// in /images/world-map.svg — it's a Web-Mercator map, shifted ~3% left of a
// naive 0-centered grid. Longitude is linear; latitude is Mercator.
// (Fit RMSE: lon 0.35%, lat 0.81% of the box — see git history for the solver.)
const LON_A = 0.27706;
const LON_B = 47.056;
const LAT_A = -25.0226;
const LAT_B = 70.211;

/** Round to 3 decimals so SSR and client serialize the same inline style
 *  (raw floats hydration-mismatch: 46.058583999999996% vs 46.0586%). */
const r3 = (n: number) => Math.round(n * 1000) / 1000;

/** Lat/lon (degrees) → percentage position over the world-map.svg box. */
export const project = (lat: number, lon: number) => ({
  x: r3(LON_A * lon + LON_B),
  y: r3(LAT_A * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) + LAT_B),
});
