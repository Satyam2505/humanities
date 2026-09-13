import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Intensity } from "@/lib/level";

/**
 * Only intensity 3 gets the solid treatment, so the notable signals are the
 * ones that carry weight on the page.
 */
const INTENSITY_CLASSES: Record<Intensity, string> = {
  1: "bg-[var(--level-1-bg)] text-[var(--level-1-fg)]",
  2: "bg-[var(--level-2-bg)] text-[var(--level-2-fg)]",
  3: "bg-[var(--level-3-bg)] text-[var(--level-3-fg)]",
};

interface PillProps {
  intensity: Intensity;
  children: ReactNode;
  className?: string;
}

export function Pill({ intensity, children, className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-sm px-2.5 py-1 text-fluid-xs font-semibold",
        INTENSITY_CLASSES[intensity],
        className
      )}
    >
      {children}
    </span>
  );
}
