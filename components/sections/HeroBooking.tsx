import ReservationWidget from "@/components/ReservationWidget";
import styles from "./HeroBooking.module.css";

/**
 * The live Limo Anywhere reservation bar, overlapping the hero — the same embed
 * `/online-reservation` runs, so the home page books for real instead of
 * collecting leads nobody receives (the old mock BookingWidget).
 *
 * Keeps the `#booking` anchor: Fleet and the service closers link to it.
 */
export default function HeroBooking() {
  return (
    <div className={styles.wrap} id="booking">
      <div className="container">
        <ReservationWidget configId="13" />
      </div>
    </div>
  );
}
