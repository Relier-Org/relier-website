import type { IconProps } from "./types";

/** Two-up grid — the card layout. */
export function GridViewIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
      {...rest}
    >
      <rect x="1.5" y="1.5" width="5.5" height="5.5" />
      <rect x="9" y="1.5" width="5.5" height="5.5" />
      <rect x="1.5" y="9" width="5.5" height="5.5" />
      <rect x="9" y="9" width="5.5" height="5.5" />
    </svg>
  );
}

/** Stacked rows — the horizontal layout. */
export function RowsViewIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
      {...rest}
    >
      <rect x="1.5" y="2" width="13" height="4.5" />
      <rect x="1.5" y="9.5" width="13" height="4.5" />
    </svg>
  );
}
