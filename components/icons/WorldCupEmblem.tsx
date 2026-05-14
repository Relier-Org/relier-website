import type { IconProps } from "./types";

export default function WorldCupEmblem({ size = 64, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 88"
      fill="none"
      aria-hidden="true"
      {...rest}
    >
      <defs>
        <linearGradient id="wcEmblemGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D8BC78" />
          <stop offset="100%" stopColor="#8A6F33" />
        </linearGradient>
      </defs>
      {/* Trophy body */}
      <path
        d="M18 8 L46 8 L44 30 C 44 40, 38 46, 32 46 C 26 46, 20 40, 20 30 Z"
        stroke="url(#wcEmblemGold)"
        strokeWidth={1.4}
        fill="none"
      />
      {/* Handles */}
      <path
        d="M18 12 C 10 14, 8 22, 14 28 L 18 28"
        stroke="url(#wcEmblemGold)"
        strokeWidth={1.2}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M46 12 C 54 14, 56 22, 50 28 L 46 28"
        stroke="url(#wcEmblemGold)"
        strokeWidth={1.2}
        fill="none"
        strokeLinecap="round"
      />
      {/* Stem + base */}
      <line x1="32" y1="46" x2="32" y2="60" stroke="url(#wcEmblemGold)" strokeWidth={1.4} />
      <rect
        x="22"
        y="60"
        width="20"
        height="3"
        stroke="url(#wcEmblemGold)"
        strokeWidth={1.2}
        fill="none"
      />
      <rect
        x="18"
        y="63"
        width="28"
        height="6"
        stroke="url(#wcEmblemGold)"
        strokeWidth={1.4}
        fill="none"
      />
      {/* "26" mark */}
      <text
        x="32"
        y="84"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="10"
        fontStyle="italic"
        fill="#C9A961"
      >
        26
      </text>
    </svg>
  );
}
