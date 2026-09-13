import type { Evidence } from "@/lib/types";

interface EvidenceBlockProps {
  evidence: Evidence;
  note?: string | null;
}

export function EvidenceBlock({ evidence, note }: EvidenceBlockProps) {
  const hasMatch = evidence.confidence !== null;

  return (
    <div className="space-y-3">
      <figure className="space-y-2">
        <blockquote className="border-l-2 border-border-strong pl-4 font-display text-fluid-lg leading-snug text-ink">
          {hasMatch ? `“${evidence.quote}”` : evidence.quote}
        </blockquote>
        <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1 pl-4 text-fluid-sm text-ink-soft">
          <span>{evidence.source}</span>
          {hasMatch && (
            <span className="font-mono text-fluid-xs tabular-nums text-muted">
              {evidence.confidence}% match confidence
            </span>
          )}
        </figcaption>
      </figure>

      {note && (
        <p className="rounded-sm border-l-2 border-accent bg-accent-soft px-3 py-2.5 text-fluid-sm leading-relaxed text-ink-soft">
          <span className="font-semibold text-ink">Note. </span>
          {note}
        </p>
      )}
    </div>
  );
}
