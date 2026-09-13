import type { Dimension } from "@/lib/types";
import { LEVEL_LABEL, LEVEL_INTENSITY } from "@/lib/level";
import { Pill } from "@/components/ui/Pill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EvidenceBlock } from "@/components/dashboard/EvidenceBlock";

interface DimensionFeatureProps {
  dimension: Dimension;
}

/**
 * The strongest signal in a tier. Its evidence is shown inline rather than
 * behind a disclosure, because the evidence is the part worth reading.
 */
export function DimensionFeature({ dimension }: DimensionFeatureProps) {
  const intensity = LEVEL_INTENSITY[dimension.level];

  return (
    <article className="rounded-lg border border-border bg-surface p-block">
      <div className="grid gap-block lg:grid-cols-[minmax(0,7fr)_minmax(0,9fr)] lg:items-start">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="font-display text-fluid-xl font-semibold leading-tight text-ink">
              {dimension.name}
            </h3>
            <Pill intensity={intensity}>{LEVEL_LABEL[dimension.level]}</Pill>
          </div>
          <p className="mt-1.5 text-fluid-sm text-ink-soft">{dimension.sub}</p>

          <div className="mt-5 flex items-baseline gap-2">
            <span className="font-display text-fluid-2xl font-semibold tabular-nums leading-none text-ink">
              {dimension.score}
            </span>
            <span className="text-fluid-xs text-muted">of 100</span>
          </div>
          <ProgressBar
            thick
            className="mt-2.5"
            value={dimension.score}
            intensity={intensity}
            label={`${dimension.name} exposure score`}
          />
        </div>

        <div className="lg:border-l lg:border-border lg:pl-block">
          <EvidenceBlock evidence={dimension.evidence} note={dimension.note} />
        </div>
      </div>
    </article>
  );
}
