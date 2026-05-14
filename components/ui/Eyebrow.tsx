import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
}

export default function Eyebrow({ children, className, as: Tag = "p" }: EyebrowProps) {
  return <Tag className={cn("eyebrow", className)}>{children}</Tag>;
}
