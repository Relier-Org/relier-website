import type { ComponentType } from "react";
import { cn } from "@/lib/utils/cn";
import SealStar from "@/components/icons/SealStar";
import SealWreath from "@/components/icons/SealWreath";
import SealRays from "@/components/icons/SealRays";
import SealCompass from "@/components/icons/SealCompass";
import type { IconProps } from "@/components/icons/types";
import styles from "./TrustBar.module.css";

// TODO: client (Micaela) to deliver official partner logos (Virtuoso, NLA,
// Brooklyn Chamber, NYC Concierge). Swap each Seal* component for the real
// SVG / Image when assets land.
const BADGES: { name: string; sub: string; Seal: ComponentType<IconProps> }[] = [
  { name: "Virtuoso", sub: "Preferred", Seal: SealStar },
  { name: "NLA", sub: "Member", Seal: SealWreath },
  { name: "Brooklyn", sub: "Chamber", Seal: SealRays },
  { name: "NYC", sub: "Concierge Assoc.", Seal: SealCompass },
];

export default function TrustBar() {
  return (
    <section className={styles.trust}>
      <div className={cn("container", styles.inner)}>
        <span className={styles.label}>In service of</span>
        {BADGES.map(({ name, sub, Seal }) => (
          <a key={name} href="#" className={styles.badge}>
            <Seal className={styles.seal} size={28} />
            <span className={styles.meta}>
              <span className={styles.name}>{name}</span>
              <span className={styles.sub}>{sub}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
