import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import Reveal from "@/components/effects/Reveal";
import styles from "./ServiceBody.module.css";

export type ServiceBlock = {
  title?: string;
  paragraphs: string[];
  image?: string;
  imageAlt?: string;
};

interface ServiceBodyProps {
  blocks: ServiceBlock[];
}

export default function ServiceBody({ blocks }: ServiceBodyProps) {
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
                        Image to come
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
