import type { IconProps } from "./types";

export default function TrophyIcon({ size = 24, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      aria-hidden="true"
      {...rest}
    >
      <path d="M7 4 L9 11 L12 8 L15 11 L17 4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="15" r="5" />
      <text
        x="12"
        y="17.5"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="5"
        fontStyle="italic"
        fill="currentColor"
        stroke="none"
      >
        26
      </text>
    </svg>
  );
}
