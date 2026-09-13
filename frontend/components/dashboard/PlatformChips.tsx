import { Chip } from "@/components/ui/Chip";
import type { Platform } from "@/lib/types";

interface PlatformChipsProps {
  platforms: Platform[];
}

export function PlatformChips({ platforms }: PlatformChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => (
        <Chip key={platform.id} label={platform.label} active={platform.status === "active"} />
      ))}
    </div>
  );
}
