import Button from "@/components/ui/Button";
import Reveal from "@/components/effects/Reveal";
import { cn } from "@/lib/utils/cn";
import styles from "./CTABand.module.css";

export default function CTABand() {
  return (
    <section className={styles.band} id="reserve">
      <Reveal className={cn("container", styles.inner)}>
        <h2 className={styles.h2}>
          Tell us where.
          <br />
          <em>We&rsquo;ll handle the rest.</em>
        </h2>
        <p className={styles.lead}>
          Reservations confirmed within fifteen minutes, day or night. Our
          concierge desk is available around the clock, in any time zone.
        </p>
        <div className={styles.actions}>
          <Button href="#booking" withArrow>
            Online reservation
          </Button>
          <a href="#" className={styles.textLink}>
            Speak with a concierge
          </a>
        </div>
      </Reveal>
    </section>
  );
}
