import type { IconProps } from "./types";

export default function SealCompass({ size = 32, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <circle cx="16" cy="16" r="13" />
      <path d="M16 8 L18.4 16 L16 24 L13.6 16 Z" />
      <path d="M8 16 L16 13.6 L24 16 L16 18.4 Z" />
      <circle cx="16" cy="16" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
