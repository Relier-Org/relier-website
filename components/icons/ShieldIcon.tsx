import type { IconProps } from "./types";

export default function ShieldIcon({ size = 32, ...rest }: IconProps) {
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
      <path d="M16 3 L5 7 V15 C 5 22, 9 28, 16 30 C 23 28, 27 22, 27 15 V7 Z" />
      <path d="M11 16 L14 19 L21 12" />
    </svg>
  );
}
