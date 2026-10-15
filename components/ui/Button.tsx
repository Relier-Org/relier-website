import { Link } from "@/i18n/navigation";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./Button.module.css";

/** primary = relleno champagne (acción principal), secondary = outline (acción
 *  de apoyo), quiet = outline plateado para acciones utilitarias (Log in del
 *  nav). El terciario es `TextCTA`. Jerarquía del Figma de oct-2026. */
type Variant = "primary" | "secondary" | "quiet";
/** sm = pill compacta del nav. */
type Size = "md" | "sm";

interface CommonProps {
  variant?: Variant;
  /** light = sobre las franjas crema: el champagne 500 no llega a AA ahí. */
  tone?: "dark" | "light";
  size?: Size;
  withArrow?: boolean;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
    href?: undefined;
    type?: "button" | "submit" | "reset";
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button(props: ButtonProps) {
  const { variant = "primary", tone = "dark", size = "md", withArrow = false, children, className, ...rest } = props;

  const classes = cn(
    styles.btn,
    variant === "primary" && styles.primary,
    variant === "secondary" && styles.secondary,
    variant === "quiet" && styles.quiet,
    tone === "light" && styles.onLight,
    size === "sm" && styles.sm,
    withArrow && styles.withArrow,
    className
  );

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as ButtonAsLink;
    const isExternal = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    if (isExternal || href.startsWith("#")) {
      return (
        <a href={href} className={classes} {...anchorRest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
