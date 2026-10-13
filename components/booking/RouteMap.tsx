"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import * as maplibregl from "maplibre-gl";
import type { Map as MapLibreMap, LngLatBoundsLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  MAP_STYLE_URL,
  fetchRoute,
  formatDistance,
  splitDuration,
  type PlaceFeature,
  type RouteSummary,
} from "@/lib/booking/mapConfig";
import styles from "./RouteMap.module.css";

type RouteMapProps = {
  pickup: PlaceFeature;
  dropoff: PlaceFeature;
};

const ROUTE_SOURCE = "route-source";
const ROUTE_LAYER = "route-layer";
const ROUTE_LAYER_GLOW = "route-layer-glow";

function makeMarkerEl(variant: "pickup" | "dropoff") {
  const el = document.createElement("div");
  el.className = `${styles.marker} ${variant === "pickup" ? styles.markerPickup : styles.markerDropoff}`;
  el.innerHTML = `<span class="${styles.markerDot}"></span><span class="${styles.markerRing}"></span>`;
  return el;
}

export default function RouteMap({ pickup, dropoff }: RouteMapProps) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [route, setRoute] = useState<RouteSummary | null>(null);
  const [error, setError] = useState(false);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE_URL,
      center: pickup.coords,
      zoom: 10,
      attributionControl: { compact: true },
      cooperativeGestures: false,
    });
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right"
    );
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update markers + route when pickup/dropoff change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let cancelled = false;
    const controller = new AbortController();

    // markers
    markersRef.current.forEach((m) => m.remove());
    const pickupMarker = new maplibregl.Marker({ element: makeMarkerEl("pickup") })
      .setLngLat(pickup.coords)
      .addTo(map);
    const dropMarker = new maplibregl.Marker({ element: makeMarkerEl("dropoff") })
      .setLngLat(dropoff.coords)
      .addTo(map);
    markersRef.current = [pickupMarker, dropMarker];

    async function loadRoute() {
      try {
        setError(false);
        const r = await fetchRoute(pickup.coords, dropoff.coords, controller.signal);
        if (cancelled) return;
        setRoute(r);

        const renderRoute = () => {
          if (cancelled || !mapRef.current) return;
          const m = mapRef.current;

          if (m.getLayer(ROUTE_LAYER)) m.removeLayer(ROUTE_LAYER);
          if (m.getLayer(ROUTE_LAYER_GLOW)) m.removeLayer(ROUTE_LAYER_GLOW);
          if (m.getSource(ROUTE_SOURCE)) m.removeSource(ROUTE_SOURCE);

          m.addSource(ROUTE_SOURCE, {
            type: "geojson",
            data: { type: "Feature", geometry: r.geometry, properties: {} },
          });
          m.addLayer({
            id: ROUTE_LAYER_GLOW,
            type: "line",
            source: ROUTE_SOURCE,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#C9A961",
              "line-width": 10,
              "line-opacity": 0.18,
              "line-blur": 6,
            },
          });
          m.addLayer({
            id: ROUTE_LAYER,
            type: "line",
            source: ROUTE_SOURCE,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#C9A961",
              "line-width": 3,
            },
          });

          const coords = r.geometry.coordinates;
          const bounds = coords.reduce(
            (b, c) => b.extend(c as [number, number]),
            new maplibregl.LngLatBounds(
              coords[0] as [number, number],
              coords[0] as [number, number]
            )
          ) as unknown as LngLatBoundsLike;
          m.fitBounds(bounds, { padding: 60, duration: 800, maxZoom: 14 });
        };

        const m = mapRef.current;
        if (!m) return;
        if (m.isStyleLoaded()) renderRoute();
        else m.once("load", renderRoute);
      } catch (err) {
        if (cancelled || (err as Error).name === "AbortError") return;
        setError(true);
      }
    }

    loadRoute();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [pickup, dropoff]);

  function durationLabel(seconds: number) {
    const { hours, minutes } = splitDuration(seconds);
    if (!hours) return t("routeMap.durationMinutes", { minutes });
    if (!minutes) return t("routeMap.durationHours", { hours });
    return t("routeMap.durationHoursMinutes", { hours, minutes });
  }

  return (
    <div className={styles.shell}>
      <div ref={containerRef} className={styles.map} aria-label={t("routeMap.mapLabel")} />
      <div className={styles.meta}>
        {error ? (
          <span className={styles.error}>{t("routeMap.error")}</span>
        ) : route ? (
          <>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>{t("routeMap.duration")}</span>
              <span className={styles.metaValue}>
                ~{durationLabel(route.durationSeconds)}
              </span>
            </span>
            <span className={styles.metaDivider} aria-hidden="true" />
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>{t("routeMap.distance")}</span>
              <span className={styles.metaValue}>
                {formatDistance(route.distanceMeters, locale)}
              </span>
            </span>
          </>
        ) : (
          <span className={styles.loading}>{t("routeMap.calculating")}</span>
        )}
      </div>
    </div>
  );
}
