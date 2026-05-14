import type { IconProps } from "./types";

export default function SealRays({ size = 32, ...rest }: IconProps) {
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
      <circle cx="16" cy="16" r="3.6" />
      <path d="M16 7 L16 9.4" />
      <path d="M16 22.6 L16 25" />
      <path d="M7 16 L9.4 16" />
      <path d="M22.6 16 L25 16" />
      <path d="M9.6 9.6 L11.3 11.3" />
      <path d="M20.7 20.7 L22.4 22.4" />
      <path d="M22.4 9.6 L20.7 11.3" />
      <path d="M11.3 20.7 L9.6 22.4" />
    </svg>
  );
}
