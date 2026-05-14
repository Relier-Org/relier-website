import type { IconProps } from "./types";

export default function SealWreath({ size = 32, ...rest }: IconProps) {
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
      <path d="M10 9 C 6.5 13, 6.5 19, 10 23" />
      <path d="M22 9 C 25.5 13, 25.5 19, 22 23" />
      <path d="M9 12 L11 13" />
      <path d="M8 16 L10.4 16" />
      <path d="M9 20 L11 19" />
      <path d="M23 12 L21 13" />
      <path d="M24 16 L21.6 16" />
      <path d="M23 20 L21 19" />
      <circle cx="16" cy="16" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
