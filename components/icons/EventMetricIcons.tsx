import type { IconProps } from "./types";

/* Íconos de las cifras del evento destacado (Figma de rediseño, oct-2026).
   Dibujados en la línea de Untitled UI, como los de SegmentIcons: el MCP de
   Figma estaba sin cupo y no se pudieron bajar los originales de la page Icons. */

function Base({ size = 16, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function BallIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7.5L16.3 10.6L14.7 15.6H9.3L7.7 10.6L12 7.5Z" />
      <path d="M12 7.5V2M16.3 10.6L21.5 9M14.7 15.6L17.5 20M9.3 15.6L6.5 20M7.7 10.6L2.5 9" />
    </Base>
  );
}

export function FlagIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3C20 3 19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3V15ZM4 15V22" />
    </Base>
  );
}
