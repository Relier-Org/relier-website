import { cn } from "@/lib/utils/cn";
import styles from "./TrustBar.module.css";

// TODO: client (Micaela) to deliver NYC Concierge Association logo in high res
const BADGES = [
  { name: "Virtuoso", sub: "Preferred" },
  { name: "NLA", sub: "Member" },
  { name: "Brooklyn", sub: "Chamber" },
  { name: "NYC", sub: "Concierge Assoc." },
];

export default function TrustBar() {
  return (
    <section className={styles.trust}>
      <div className={cn("container", styles.inner)}>
        <span className={styles.label}>In service of</span>
        {BADGES.map((b) => (
          <a key={b.name} href="#" className={styles.badge}>
            <span className={styles.name}>{b.name}</span>
            <span className={styles.sub}>{b.sub}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
