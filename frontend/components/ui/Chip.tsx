import { cn } from "@/lib/cn";

interface ChipProps {
  label: string;
  active: boolean;
}

export function Chip({ label, active }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-fluid-sm font-medium",
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-transparent text-muted"
      )}
    >
      {label}
      {!active && <span className="text-fluid-xs font-normal">not connected</span>}
    </span>
  );
}
