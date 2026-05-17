import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./Textarea.module.css";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, rows = 5, ...rest },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(styles.textarea, invalid && styles.invalid, className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
});

export default Textarea;
