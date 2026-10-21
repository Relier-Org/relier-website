import Image from "next/image";
import type { ComponentType, ReactNode } from "react";
import Reveal from "@/components/effects/Reveal";
import type { IconProps } from "@/components/icons/types";
import { project } from "@/lib/coverage/data";
import NameMarquee from "./NameMarquee";
import CardCarousel from "./CardCarousel";
import { cn } from "@/lib/utils/cn";
import styles from "./Landing.module.css";

/**
 * Secciones de las landings B2B de SEO (oct-2026: events, corporate,
 * affiliates, travel advisors). El contenido es el del equipo de SEO; la forma
 * es la del sitio: mismos tokens, misma escala de títulos, franjas crema y
 * oscuras alternadas, título a la izquierda y descripción a la derecha.
 */

export type Tone = "dark" | "light";
export type Item = { title: string; body: string };
type Icon = ComponentType<IconProps>;

export function Band({
  tone = "dark",
  id,
  children,
}: {
  tone?: Tone;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(styles.band, tone === "light" ? styles.light : styles.dark)}
    >
      <div className="container">{children}</div>
    </section>
  );
}

export function Head({
  eyebrow,
  title,
  lead,
  center = false,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Centrado, para las secciones con carrusel (Nico, 18-oct-2026). */
  center?: boolean;
}) {
  return (
    <Reveal className={cn(styles.head, !lead && styles.headSolo, center && styles.headCenter)}>
      <div className={styles.headText}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.title}>{title}</h2>
      </div>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </Reveal>
  );
}

/**
 * Franja bajo el hero: los cuatro puntos fuertes como columnas con ícono y
 * filetes, en el mismo idioma que "Reasons to choose Relier" pero chico
 * (Nico, 18-oct-2026: antes eran mayúsculas espaciadas y quedaba comprimido).
 */
export function Highlights({
  items,
  icons,
}: {
  items: string[];
  icons: Icon[];
}) {
  return (
    <section className={styles.highlights}>
      <div className="container">
        <ul className={styles.hlList}>
          {items.map((it, i) => {
            const Glyph = icons[i % icons.length];
            return (
              <Reveal
                as="li"
                key={it}
                className={styles.hlItem}
                delay={Math.min(i * 0.06, 0.24)}
              >
                <Glyph className={styles.hlIcon} aria-hidden="true" />
                <span>{it}</span>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function Cards({
  items,
  columns = 3,
  numbered = false,
}: {
  items: Item[];
  columns?: 3 | 4 | 5;
  numbered?: boolean;
}) {
  return (
    <ul className={cn(styles.cards, styles[`cols${columns}`])}>
      {items.map((it, i) => (
        <Reveal
          as="li"
          key={it.title}
          className={styles.card}
          delay={Math.min(i * 0.06, 0.24)}
        >
          {numbered ? (
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
          ) : null}
          <h3 className={styles.cardTitle}>{it.title}</h3>
          <p className={styles.cardBody}>{it.body}</p>
        </Reveal>
      ))}
    </ul>
  );
}

/** Pasos 01–03 en fila, separados por un filete arriba. */
export function Steps({ items, note }: { items: Item[]; note?: string }) {
  return (
    <>
      <ol className={styles.steps}>
        {items.map((it, i) => (
          <Reveal
            as="li"
            key={it.title}
            className={styles.step}
            delay={i * 0.08}
          >
            <span className={styles.stepNum}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className={styles.cardTitle}>{it.title}</h3>
            <p className={styles.cardBody}>{it.body}</p>
          </Reveal>
        ))}
      </ol>
      {note ? <p className={styles.note}>{note}</p> : null}
    </>
  );
}

export function Badges({ items }: { items: string[] }) {
  return (
    <ul className={styles.badges}>
      {items.map((b) => (
        <li key={b}>{b}</li>
      ))}
    </ul>
  );
}

/** Experiencia con artistas: marquee tipográfico con todos los nombres. */
export function NameList({
  names,
  more,
  label,
  note,
  link,
}: {
  names: string[];
  more: string[];
  /** Nombre accesible de la lista completa (el marquee es decorativo). */
  label: string;
  note: string;
  link?: ReactNode;
}) {
  return (
    <div className={styles.names}>
      <NameMarquee names={[...names, ...more]} label={label} />
      <p className={styles.note}>{note}</p>
      {link ? <div className={styles.linkRow}>{link}</div> : null}
    </div>
  );
}

/**
 * Cards con foto, como las de Services del home: foto a sangre, scrim al tono
 * del canvas y el filo de luz champagne arriba. Para la primera grilla de
 * servicios de cada landing.
 */
export function PhotoCards({
  items,
  images,
}: {
  items: Item[];
  /** Una foto por ítem, en el mismo orden del JSON. Con `position` se elige
      el encuadre cuando el sujeto no está centrado en la foto. */
  images: (string | { src: string; position: string })[];
}) {
  return (
    <ul
      className={cn(
        styles.photoCards,
        styles[`photo${Math.min(items.length, 4)}`],
      )}
    >
      {items.map((it, i) => {
        const img = images[i % images.length];
        const { src, position } =
          typeof img === "string" ? { src: img, position: undefined } : img;
        return (
          <Reveal
            as="li"
            key={it.title}
            className={styles.photoCard}
            delay={Math.min(i * 0.06, 0.24)}
          >
            <div className={styles.photoImg}>
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={position ? { objectPosition: position } : undefined}
              />
            </div>
            <div className={styles.photoContent}>
              <h3 className={styles.cardTitle}>{it.title}</h3>
              <p className={styles.photoBody}>{it.body}</p>
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}

/**
 * Columnas con ícono separadas por filetes, como "Reasons to choose Relier"
 * del home (tres ítems; con cuatro van cards como las de /fleet). Sin cajas: alterna con las grillas de cards de las franjas
 * oscuras para que la página no sea una sucesión de cards iguales.
 */
export function IconColumns({
  items,
  icons,
  carouselLabel,
}: {
  items: Item[];
  icons: Icon[];
  /** Nombre accesible del carrusel (cuatro ítems o más): el título de la sección. */
  carouselLabel?: string;
}) {
  // Cuatro ítems: cards simples con el degradé de estudio de /fleet de fondo,
  // en un carrusel infinito con flechas (Nico, 18-oct-2026).
  if (items.length >= 4) {
    return (
      <CardCarousel label={carouselLabel ?? items.map((it) => it.title).join(", ")}>
        {items.map((it, i) => {
          const Glyph = icons[i % icons.length];
          return (
            <article key={it.title} className={styles.iconCard}>
              <Glyph className={styles.iconCardIcon} aria-hidden="true" />
              <h3 className={styles.cardTitle}>{it.title}</h3>
              <p className={styles.cardBody}>{it.body}</p>
            </article>
          );
        })}
      </CardCarousel>
    );
  }

  return (
    <ul className={styles.iconCols}>
      {items.map((it, i) => {
        const Glyph = icons[i % icons.length];
        return (
          <Reveal
            as="li"
            key={it.title}
            className={styles.iconCol}
            delay={Math.min(i * 0.06, 0.24)}
          >
            <Glyph className={styles.colIcon} aria-hidden="true" />
            <h3 className={styles.cardTitle}>{it.title}</h3>
            <p className={styles.cardBody}>{it.body}</p>
          </Reveal>
        );
      })}
    </ul>
  );
}

/**
 * Foto de un lado y el contenido del otro, como los bloques de las páginas de
 * servicio (ServiceBody). Los ítems van como lista con filetes, sin cards.
 */
export function Split({
  image,
  imageAlt = "",
  reverse = false,
  eyebrow,
  title,
  lead,
  items,
  footer,
}: {
  image: string;
  imageAlt?: string;
  reverse?: boolean;
  eyebrow: string;
  title: string;
  lead?: string;
  items: Item[];
  footer?: ReactNode;
}) {
  return (
    <div className={cn(styles.split, reverse && styles.splitReverse)}>
      <Reveal className={styles.splitMedia}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={styles.splitImg}
        />
      </Reveal>
      <Reveal className={styles.splitText}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.title}>{title}</h2>
        {lead ? <p className={styles.splitLead}>{lead}</p> : null}
        <ul className={styles.splitList}>
          {items.map((it) => (
            <li key={it.title}>
              <h3 className={styles.splitItemTitle}>{it.title}</h3>
              <p className={styles.cardBody}>{it.body}</p>
            </li>
          ))}
        </ul>
        {footer ? <div className={styles.linkRow}>{footer}</div> : null}
      </Reveal>
    </div>
  );
}

// Los dos hubs de Relier, con las mismas coordenadas que el mapa del home.
const HUBS = [
  { lat: 40.71, lon: -74.01 },
  { lat: 41.39, lon: 2.17 },
];

/**
 * Cobertura: el texto y los alcances a la izquierda, el mapa de puntos del
 * home a la derecha con los dos hubs (Nueva York y Barcelona) encendidos.
 */
export function CoverageBand({
  eyebrow,
  title,
  lead,
  badges,
  hubLabels,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  badges: string[];
  hubLabels: [string, string];
}) {
  return (
    <section className={cn(styles.band, styles.dark, styles.coverage)}>
      <div className={cn("container", styles.coverageGrid)}>
        <Reveal className={styles.coverageText}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.title}>{title}</h2>
          {lead ? <p className={styles.splitLead}>{lead}</p> : null}
          <Badges items={badges} />
        </Reveal>
        <Reveal className={styles.coverageMap}>
          <div className={styles.mapArt} aria-hidden="true">
            <span className={styles.mapLand} />
            <span className={styles.mapDots} />
            {HUBS.map((h, i) => {
              const { x, y } = project(h.lat, h.lon);
              return (
                <span
                  key={h.lat}
                  className={cn(styles.hub, i === 0 && styles.hubWest)}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <span className={styles.hubDot} />
                  {hubLabels[i]}
                </span>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export type TourVehicle = { name: string; pax: string; image: string };
export type Venue = { venue: string; event: string };

/**
 * "Event & Touring Experts" (Andy, checklist de cierre oct-2026): la flota
 * grande de giras sobre el degradé de estudio de /fleet y las operaciones de
 * Nueva York que el sitio ya respalda. Sólo datos confirmados: la lista de
 * venues se completa cuando el cliente pase la suya.
 */
export function TouringBand({
  eyebrow,
  title,
  lead,
  vehicles,
  venuesTitle,
  venues,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  vehicles: TourVehicle[];
  venuesTitle: string;
  venues: Venue[];
}) {
  return (
    <section className={cn(styles.band, styles.dark, styles.touring)}>
      <div className="container">
        <Head eyebrow={eyebrow} title={title} lead={lead} />
        <ul className={styles.tourFleet}>
          {vehicles.map((v, i) => (
            <Reveal as="li" key={v.name} className={styles.tourCard} delay={Math.min(i * 0.06, 0.24)}>
              <div className={styles.tourPhoto}>
                <Image src={v.image} alt="" fill sizes="(max-width: 720px) 100vw, 33vw" />
              </div>
              <div className={styles.tourInfo}>
                <h3 className={styles.cardTitle}>{v.name}</h3>
                <p className={styles.tourPax}>{v.pax}</p>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal className={styles.venues}>
          <h3 className={styles.venuesTitle}>{venuesTitle}</h3>
          <ul className={styles.venueList}>
            {venues.map((v) => (
              <li key={v.venue}>
                <span className={styles.venueName}>{v.venue}</span>
                <span className={styles.venueEvent}>{v.event}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
