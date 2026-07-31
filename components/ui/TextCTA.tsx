import { Link } from "@/i18n/navigation";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./TextCTA.module.css";

interface TextCTAProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}

export default function TextCTA({
  href,
  children,
  tone = "dark",
  className,
  ...rest
}: TextCTAProps) {
  const classes = cn(styles.cta, tone === "light" && styles.light, className);
  const isHash = href.startsWith("#") || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");

  const content = (
    <>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </>
  );

  if (isHash) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
