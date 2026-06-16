import type { SVGProps } from "react";

const COMMON: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

export function PassengerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...COMMON} {...props}>
      <circle cx="12" cy="7.5" r="3.2" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

export function LuggageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...COMMON} {...props}>
      <rect x="5.5" y="7.5" width="13" height="12" rx="2" />
      <path d="M9.5 7.5V5.5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v2" />
      <path d="M9.5 11v5M14.5 11v5" />
    </svg>
  );
}

export function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...COMMON} {...props}>
      <path d="M9 5v14M15 5v14" />
    </svg>
  );
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...COMMON} fill="currentColor" stroke="none" {...props}>
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  );
}
