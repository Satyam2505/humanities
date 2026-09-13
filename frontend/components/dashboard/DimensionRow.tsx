import type { Dimension } from "@/lib/types";
import { LEVEL_LABEL, LEVEL_INTENSITY } from "@/lib/level";
import { Pill } from "@/components/ui/Pill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EvidenceBlock } from "@/components/dashboard/EvidenceBlock";

interface DimensionRowProps {
  dimension: Dimension;
}

/**
 * Secondary signals. Kept as native <details> so disclosure works without JS
 * and stays keyboard accessible.
 */
export function DimensionRow({ dimension }: DimensionRowProps) {
  const intensity = LEVEL_INTENSITY[dimension.level];

  return (
    <details className="group rounded-md border border-border bg-surface transition-colors hover:border-border-strong">
      <summary className="flex cursor-pointer list-none flex-col gap-2.5 rounded-md p-4 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ground">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-fluid-base font-semibold leading-snug text-ink">
              {dimension.name}
            </h3>
            <p className="mt-0.5 text-fluid-sm text-ink-soft">{dimension.sub}</p>
          </div>
          <Pill intensity={intensity} className="shrink-0">
            {LEVEL_LABEL[dimension.level]}
          </Pill>
        </div>

        <div className="flex items-center gap-3">
          <ProgressBar
            className="flex-1"
            value={dimension.score}
            intensity={intensity}
            label={`${dimension.name} exposure score`}
          />
          <span className="font-mono text-fluid-sm tabular-nums text-ink-soft">
            {dimension.score}
          </span>
          <span className="text-fluid-xs font-medium text-muted transition-colors group-open:text-accent">
            {"Evidence"}
          </span>
        </div>
      </summary>

      <div className="border-t border-border p-4">
        <EvidenceBlock evidence={dimension.evidence} note={dimension.note} />
      </div>
    </details>
  );
}
