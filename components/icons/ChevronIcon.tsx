import type { IconProps } from "./types";

interface ChevronIconProps extends IconProps {
  direction?: "left" | "right" | "up" | "down";
}

const rotations: Record<NonNullable<ChevronIconProps["direction"]>, number> = {
  right: 0,
  left: 180,
  down: 90,
  up: -90,
};

export default function ChevronIcon({
  size = 14,
  direction = "right",
  style,
  ...rest
}: ChevronIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      style={{ transform: `rotate(${rotations[direction]}deg)`, ...style }}
      aria-hidden="true"
      {...rest}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
