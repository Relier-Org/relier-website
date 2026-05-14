import type { IconProps } from "./types";

export default function CalendarCheckIcon({ size = 32, ...rest }: IconProps) {
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
      <rect x="4" y="7" width="24" height="22" rx="1.5" />
      <line x1="4" y1="13" x2="28" y2="13" />
      <line x1="11" y1="3" x2="11" y2="10" />
      <line x1="21" y1="3" x2="21" y2="10" />
      <polyline points="11 20 15 24 22 17" />
    </svg>
  );
}
