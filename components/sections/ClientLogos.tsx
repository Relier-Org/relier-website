import Reveal from "@/components/effects/Reveal";
import styles from "./ClientLogos.module.css";

// New section (brief §7) — social proof, logos FIRST, then the reviews/
// testimonials below it on the page.
//
// PLACEHOLDER: Andres confirms which company logos go here. These are neutral
// wordmark slots so the section reads correctly for the owners' review; swap
// each entry for a real logo SVG (drop into /public/images/clients/) when the
// list is confirmed. Layout already handles 4–8 logos.
const CLIENTS = [
  "Meridian",
  "Northwind",
  "Atelier No.9",
  "Vantage",
  "Lumen",
  "Kestrel Group",
];

export default function ClientLogos() {
  return (
    <section className={styles.clients} id="clients">
      <div className="container">
        <Reveal>
          <p className={styles.label}>Trusted by teams that travel</p>
        </Reveal>
        <Reveal className={styles.row}>
          {CLIENTS.map((name) => (
            <span key={name} className={styles.logo}>
              {name}
            </span>
          ))}
        </Reveal>
        <p className={styles.note}>Selected partners — full roster confirmed soon.</p>
      </div>
    </section>
  );
}
