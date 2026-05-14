import Image from "next/image";
import Reveal from "@/components/effects/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import ShieldIcon from "@/components/icons/ShieldIcon";
import ClockIcon from "@/components/icons/ClockIcon";
import CalendarCheckIcon from "@/components/icons/CalendarCheckIcon";
import { cn } from "@/lib/utils/cn";
import styles from "./Pillars.module.css";

export default function Pillars() {
  return (
    <section className={styles.pillars}>
      <div className="container">
        <Reveal>
          <SectionHead
            title={
              <>
                Reasons to
                <br />
                <span className="muted">choose Relier.</span>
              </>
            }
            lead="Three principles, held without exception. What we promise on the booking page is what arrives at the curb."
          />
        </Reveal>

        <Reveal className={styles.bento}>
          {/* 01 · Safe Travels · shield icon · with photo */}
          <article className={cn(styles.tile, styles.hero)}>
            <div className={styles.heroImage}>
              <Image
                src="https://relier.com/wp-content/uploads/2025/02/LUXURY-VEHICLE-TRF-scaled.jpeg"
                alt="Relier fleet"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className={styles.heroText}>
              <div className={styles.header}>
                <div className={cn(styles.icon, styles.heroIcon)}>
                  <ShieldIcon size="100%" />
                </div>
                <h3>Safe Travels</h3>
              </div>
              <p>
                Travel confidently knowing your safety is our #1 priority.
                Rigorous health and cleaning standards round out a best-in-class
                service.
              </p>
            </div>
          </article>

          {/* 02 · Private Travel Solutions · clock icon */}
          <article className={cn(styles.tile, styles.typo)}>
            <div className={styles.header}>
              <div className={styles.icon}>
                <ClockIcon size="100%" />
              </div>
              <h3>Private Travel Solutions</h3>
            </div>
            <p>
              Discover your one-stop travel shop: long-distance rides, one way
              or return, by the hour, airport transfers, and more.
            </p>
          </article>

          {/* 03 · Book Online · calendar-check icon */}
          <article className={cn(styles.tile, styles.typo)}>
            <div className={styles.header}>
              <div className={styles.icon}>
                <CalendarCheckIcon size="100%" />
              </div>
              <h3>Book Online</h3>
            </div>
            <p>
              No need to call or email for a quote. Enter your ride details, see
              the fixed price, and book. It&rsquo;s really that simple.
            </p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
