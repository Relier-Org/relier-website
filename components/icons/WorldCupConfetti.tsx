import type { SVGProps } from "react";

const PALETTE = [
  "#C9A961",
  "#b22234",
  "#3c3b6e",
  "#006847",
  "#ce1126",
  "#d52b1e",
  "#f0e6d2",
];

const CONFETTI = [
  { x: 80, y: 60, w: 8, h: 3, r: 18, c: 0 },
  { x: 160, y: 110, w: 6, h: 6, r: 45, c: 1 },
  { x: 240, y: 40, w: 9, h: 3, r: -28, c: 2 },
  { x: 360, y: 90, w: 5, h: 5, r: 20, c: 3 },
  { x: 470, y: 50, w: 10, h: 3, r: 60, c: 4 },
  { x: 580, y: 100, w: 6, h: 4, r: -40, c: 5 },
  { x: 690, y: 70, w: 8, h: 3, r: 25, c: 6 },
  { x: 760, y: 130, w: 7, h: 4, r: -55, c: 0 },
  { x: 50, y: 220, w: 5, h: 5, r: 30, c: 1 },
  { x: 120, y: 280, w: 9, h: 3, r: -20, c: 3 },
  { x: 220, y: 240, w: 7, h: 4, r: 50, c: 2 },
  { x: 320, y: 200, w: 6, h: 6, r: 15, c: 5 },
  { x: 430, y: 270, w: 8, h: 3, r: -45, c: 0 },
  { x: 520, y: 220, w: 5, h: 5, r: 28, c: 4 },
  { x: 620, y: 280, w: 7, h: 3, r: -32, c: 6 },
  { x: 720, y: 240, w: 9, h: 4, r: 38, c: 1 },
  { x: 30, y: 360, w: 6, h: 4, r: -25, c: 2 },
  { x: 130, y: 410, w: 5, h: 5, r: 42, c: 0 },
  { x: 250, y: 380, w: 9, h: 3, r: -18, c: 3 },
  { x: 380, y: 430, w: 7, h: 4, r: 55, c: 5 },
  { x: 490, y: 390, w: 6, h: 6, r: 22, c: 4 },
  { x: 590, y: 440, w: 8, h: 3, r: -50, c: 6 },
  { x: 700, y: 400, w: 5, h: 5, r: 33, c: 0 },
  { x: 780, y: 360, w: 7, h: 4, r: -28, c: 2 },
  { x: 100, y: 520, w: 9, h: 3, r: 48, c: 1 },
  { x: 200, y: 560, w: 6, h: 6, r: -22, c: 3 },
  { x: 340, y: 540, w: 5, h: 5, r: 60, c: 5 },
  { x: 450, y: 510, w: 8, h: 3, r: -38, c: 4 },
  { x: 570, y: 560, w: 7, h: 4, r: 25, c: 0 },
  { x: 670, y: 530, w: 6, h: 6, r: -45, c: 6 },
  { x: 60, y: 460, w: 7, h: 3, r: 35, c: 2 },
  { x: 750, y: 480, w: 8, h: 3, r: -55, c: 1 },
];

export default function WorldCupConfetti({
  className,
  ...rest
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {CONFETTI.map((c, i) => (
        <rect
          key={i}
          x={c.x - c.w / 2}
          y={c.y - c.h / 2}
          width={c.w}
          height={c.h}
          fill={PALETTE[c.c]}
          transform={`rotate(${c.r} ${c.x} ${c.y})`}
        />
      ))}
    </svg>
  );
}
