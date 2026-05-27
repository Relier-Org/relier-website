import Reveal from "@/components/effects/Reveal";
import ShieldIcon from "@/components/icons/ShieldIcon";
import ClockIcon from "@/components/icons/ClockIcon";
import CalendarCheckIcon from "@/components/icons/CalendarCheckIcon";
import styles from "./Pillars.module.css";

const PILLARS = [
  {
    icon: ShieldIcon,
    title: "Safe Travels",
    body: "Travel confidently knowing your safety is our #1 priority. Rigorous health and cleaning standards round out a best-in-class service.",
  },
  {
    icon: ClockIcon,
    title: "Private Travel Solutions",
    body: "Discover your one-stop travel shop: long-distance rides, one way or return, by the hour, airport transfers, and more.",
  },
  {
    icon: CalendarCheckIcon,
    title: "Book Online",
    body: "No need to call or email for a quote. Enter your ride details, see the fixed price, and book. It’s really that simple.",
  },
];

export default function Pillars() {
  return (
    <section className={styles.pillars}>
      <div className="container">
        <Reveal className={styles.head}>
          <p className={styles.kicker}>Concierge on the Road</p>
          <h2 className={styles.title}>
            Reasons to <span className="muted">choose Relier.</span>
          </h2>
          <p className={styles.lead}>
            More than a ride — a concierge that travels with you. Three
            principles, held without exception: what we promise on the booking
            page is what arrives at the curb.
          </p>
        </Reveal>

        <Reveal className={styles.cols}>
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div key={title} className={styles.col}>
              <div className={styles.icon}>
                <Icon size="100%" />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
