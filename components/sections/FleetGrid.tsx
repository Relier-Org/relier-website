import Image from "next/image";
import Reveal from "@/components/effects/Reveal";
import styles from "./FleetGrid.module.css";

export type FleetVehicle = {
  tier: string;
  name: string;
  label?: string;
  year?: string;
  image?: string;
  passengers: string | number;
  bags?: number;
};

interface FleetGridProps {
  title: string;
  vehicles: FleetVehicle[];
  id?: string;
}

export default function FleetGrid({ title, vehicles, id }: FleetGridProps) {
  return (
    <section className={styles.section} id={id}>
      <div className="container">
        <Reveal>
          <header className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
          </header>
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
                      alt={v.name}
                      fill
                      sizes="(max-width: 720px) 90vw, (max-width: 1024px) 46vw, 320px"
                      className={styles.photoImg}
                    />
                  ) : (
                    <div className={styles.photoPlaceholder}>
                      <span className={styles.placeholderText}>
                        Photo coming soon
                      </span>
                    </div>
                  )}
                  {v.label && (
                    <span className={styles.photoLabel}>{v.label}</span>
                  )}
                  <div className={styles.glow} aria-hidden="true" />
                </div>

                <div className={styles.cardContent}>
                  <p className={styles.tier}>{v.tier}</p>
                  <h3>{v.name}</h3>
                  <p className={styles.spec}>
                    <span>{v.passengers} passengers</span>
                    {v.bags !== undefined && (
                      <>
                        <span>·</span>
                        <span>{v.bags} bags</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
