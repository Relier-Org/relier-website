import {
  cloneElement,
  isValidElement,
  type AriaAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./Field.module.css";

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

type ControlProps = Pick<AriaAttributes, "aria-describedby" | "aria-required">;

export default function Field({
  label,
  htmlFor,
  required,
  error,
  className,
  children,
}: FieldProps) {
  const errorId = `${htmlFor}-error`;

  // El control (Input/Textarea) recibe la relación con su error y el
  // "required" que el `*` visual (aria-hidden) no anuncia. cloneElement solo
  // sobre un único hijo elemento: cualquier otra cosa se renderiza tal cual.
  let control = children;
  if (isValidElement<ControlProps>(children)) {
    const own = children.props["aria-describedby"];
    const describedBy = error
      ? [own, errorId].filter(Boolean).join(" ")
      : own;
    control = cloneElement(children as ReactElement<ControlProps>, {
      "aria-describedby": describedBy || undefined,
      "aria-required": children.props["aria-required"] ?? (required || undefined),
    });
  }

  return (
    <div className={cn(styles.field, error && styles.hasError, className)}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {control}
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
