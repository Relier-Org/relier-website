import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./Input.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(styles.input, invalid && styles.invalid, className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
});

export default Input;
