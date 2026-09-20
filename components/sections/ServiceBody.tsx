import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import Reveal from "@/components/effects/Reveal";
import TextCTA from "@/components/ui/TextCTA";
import styles from "./ServiceBody.module.css";

export type ServiceBlock = {
  title?: string;
  paragraphs: string[];
  image?: string;
  imageAlt?: string;
  /**
   * Links contextuales del plan de internal linking (roadmap SEO sep-2026):
   * anchors descriptivos hacia páginas relacionadas, dentro del body y no
   * sólo en la navegación.
   */
  links?: { href: string; label: string }[];
};

interface ServiceBodyProps {
  blocks: ServiceBlock[];
}

export default function ServiceBody({ blocks }: ServiceBodyProps) {
  const t = useTranslations("services.body");

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.list}>
          {blocks.map((block, i) => {
            const reversed = i % 2 === 1;
            return (
              <Reveal
                key={i}
                as="article"
                className={cn(styles.row, reversed && styles.reversed)}
                delay={0}
              >
                <div className={styles.text}>
                  {block.title && (
                    <h2 className={styles.heading}>{block.title}</h2>
                  )}
                  <div className={styles.copy}>
                    {block.paragraphs.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                  {block.links?.length ? (
                    <ul className={styles.links}>
                      {block.links.map((l) => (
                        <li key={l.href}>
                          <TextCTA href={l.href}>{l.label}</TextCTA>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className={styles.mediaWrap}>
                  {block.image ? (
                    <Image
                      src={block.image}
                      alt={block.imageAlt ?? ""}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className={styles.media}
                    />
                  ) : (
                    <div className={styles.placeholder}>
                      <span className={styles.placeholderText}>
                        {t("imagePlaceholder")}
                      </span>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
