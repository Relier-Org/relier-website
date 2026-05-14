import type { IconProps } from "./types";

export default function SealStar({ size = 32, ...rest }: IconProps) {
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
      <circle cx="16" cy="16" r="10.5" strokeWidth={0.6} />
      <path d="M16 9 L17.8 13.6 L22.6 14 L18.9 17.1 L20.1 21.8 L16 19.2 L11.9 21.8 L13.1 17.1 L9.4 14 L14.2 13.6 Z" />
    </svg>
  );
}
