import type { ReactNode } from "react";
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

export default function Field({
  label,
  htmlFor,
  required,
  error,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn(styles.field, error && styles.hasError, className)}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
