interface RecommendationBannerProps {
  text: string;
}

/**
 * The closing panel. Deliberately quiet: a muted slate fill rather than a
 * saturated gradient, so it reads as a calm suggestion instead of shouting
 * over the evidence above it. The accent edge is what marks it as the one
 * actionable block on the page.
 */
export function RecommendationBanner({ text }: RecommendationBannerProps) {
  return (
    <section
      aria-labelledby="recommendation-heading"
      className="rounded-lg border-l-4 border-accent bg-[var(--panel)] p-block text-[var(--panel-fg)]"
    >
      <div className="grid gap-block lg:grid-cols-[minmax(0,4fr)_minmax(0,9fr)] lg:items-start">
        <h2
          id="recommendation-heading"
          className="font-display text-fluid-xl font-semibold leading-tight"
        >
          Worth trying
        </h2>
        <p className="max-w-[68ch] text-fluid-base leading-relaxed opacity-90">{text}</p>
      </div>
    </section>
  );
}
