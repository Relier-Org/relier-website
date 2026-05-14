import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./SectionHead.module.css";

interface SectionHeadProps {
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
}

export default function SectionHead({ title, lead, className }: SectionHeadProps) {
  return (
    <header className={cn(styles.head, className)}>
      <h2 className={styles.title}>{title}</h2>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </header>
  );
}
