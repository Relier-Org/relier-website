import type { ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Reveal from "@/components/effects/Reveal";
import { PassengerIcon, LuggageIcon } from "@/components/icons/FleetIcons";
import styles from "./FleetGrid.module.css";

export type FleetVehicle = {
  tier: string;
  name: string;
  label?: string;
  year?: string;
  image?: string;
  passengers: string | number;
  bags?: number;
  /** Named model → the card shows the "or similar" qualifier. */
  orSimilar?: boolean;
};

interface FleetGridProps {
  title: string;
  vehicles: FleetVehicle[];
  lead?: string;
  id?: string;
  /** Link al pie de la grilla (p. ej. "Explore the full fleet" en Airports). */
  footer?: ReactNode;
}

export default function FleetGrid({ title, vehicles, lead, id, footer }: FleetGridProps) {
  const t = useTranslations("fleet");
  const tc = useTranslations("common");
  return (
    <section className={styles.section} id={id}>
      <div className="container">
        {/* Figma oct-2026: título a la izquierda, lead a la derecha. */}
        <Reveal className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {lead && <p className={styles.lead}>{lead}</p>}
        </Reveal>

        <div className={styles.grid} data-count={vehicles.length}>
          {vehicles.map((v, i) => (
            <Reveal
              key={v.name}
              as="article"
              className={styles.card}
              delay={i * 0.05}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardPhoto}>
                  {v.image ? (
                    <Image
                      src={v.image}
                      alt=""
                      fill
                      sizes="(max-width: 720px) 90vw, (max-width: 1024px) 46vw, 320px"
                      className={styles.photoImg}
                    />
                  ) : (
                    <div className={styles.photoPlaceholder}>
                      <span className={styles.placeholderText}>
                        {t("grid.photoComingSoon")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Un solo label de clase, en el bloque de info (Figma oct-2026).
                    Los vehículos grandes no lo llevan: el nombre ya es la clase. */}
                <div className={styles.cardContent}>
                  {v.label && <p className={styles.tier}>{v.label}</p>}
                  <h3>
                    {v.name}
                    {v.orSimilar && (
                      <span className={styles.orSimilar}>
                        {tc("orSimilar")}
                      </span>
                    )}
                  </h3>
                  <div className={styles.specs}>
                    <span className={styles.spec}>
                      <PassengerIcon className={styles.specIcon} />
                      <span className={styles.specValue}>{v.passengers}</span>
                      <span className={styles.specUnit}>{tc("pax")}</span>
                    </span>
                    {v.bags !== undefined && (
                      <span className={styles.spec}>
                        <span className={styles.specDivider} aria-hidden="true" />
                        <LuggageIcon className={styles.specIcon} />
                        <span className={styles.specValue}>{v.bags}</span>
                        <span className={styles.specUnit}>{tc("bags")}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </section>
  );
}
