import { cn } from "@/lib/cn";
import { INTENSITY_FILL, type Intensity } from "@/lib/level";

interface ProgressBarProps {
  value: number;
  intensity: Intensity;
  label: string;
  className?: string;
  thick?: boolean;
}

export function ProgressBar({
  value,
  intensity,
  label,
  className,
  thick = false,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-level-track",
        thick ? "h-2" : "h-1.5",
        className
      )}
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${clamped}%`, backgroundColor: INTENSITY_FILL[intensity] }}
      />
    </div>
  );
}
