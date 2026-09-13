import type { Tier } from "@/lib/types";
import { DimensionFeature } from "@/components/dashboard/DimensionFeature";
import { DimensionRow } from "@/components/dashboard/DimensionRow";

interface TierSectionProps {
  tier: Tier;
}

export function TierSection({ tier }: TierSectionProps) {
  // Ranked so the tier reads strongest-first, and the lead signal is promoted.
  const ranked = [...tier.dimensions].sort((a, b) => b.score - a.score);
  const [lead, ...rest] = ranked;

  return (
    <section aria-labelledby={`tier-${tier.id}`} className="space-y-block">
      <header className="max-w-[60ch]">
        <div className="flex items-center gap-2.5">
          <span
            className="h-3 w-3 shrink-0 rounded-sm"
            style={{ backgroundColor: tier.color }}
            aria-hidden="true"
          />
          <h2
            id={`tier-${tier.id}`}
            className="font-display text-fluid-xl font-semibold leading-tight text-ink"
          >
            {tier.title}
          </h2>
        </div>
        <p className="mt-1.5 text-fluid-base text-ink-soft">{tier.desc}</p>
      </header>

      <DimensionFeature dimension={lead} />

      {rest.length > 0 && (
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))]">
          {rest.map((dimension) => (
            <DimensionRow key={dimension.code} dimension={dimension} />
          ))}
        </div>
      )}
    </section>
  );
}
