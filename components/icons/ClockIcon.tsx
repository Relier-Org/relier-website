import type { IconProps } from "./types";

export default function ClockIcon({ size = 32, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <circle cx="16" cy="16" r="13" />
      <polyline points="16 8 16 16 22 19" />
    </svg>
  );
}
